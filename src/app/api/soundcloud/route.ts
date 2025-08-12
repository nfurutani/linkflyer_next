import { NextRequest, NextResponse } from 'next/server'

interface SoundCloudOEmbedResponse {
  version: number
  type: string
  provider_name: string
  provider_url: string
  height: number
  width: number
  title: string
  description: string
  thumbnail_url: string
  html: string
  author_name: string
  author_url: string
}

interface SoundCloudMetadata {
  title: string
  artist: string
  imageUrl: string | null
  description: string | null
}

// Validate SoundCloud URL format
function isValidSoundCloudUrl(url: string): boolean {
  const soundcloudRegex = /^https:\/\/(www\.)?(soundcloud\.com|snd\.sc)\/.+/
  return soundcloudRegex.test(url)
}

// Normalize SoundCloud URL (remove query parameters, etc.)
function normalizeSoundCloudUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`
  } catch {
    return url
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  if (!isValidSoundCloudUrl(url)) {
    return NextResponse.json(
      { error: 'Invalid SoundCloud URL' },
      { status: 400 }
    )
  }

  const normalizedUrl = normalizeSoundCloudUrl(url)

  try {
    // Method 1: Try SoundCloud oEmbed API (primary method)
    const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(normalizedUrl)}`
    
    const response = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkFlyer/1.0)',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (response.ok) {
      const data: SoundCloudOEmbedResponse = await response.json()
      
      const metadata: SoundCloudMetadata = {
        title: data.title || '',
        artist: data.author_name || '',
        imageUrl: data.thumbnail_url || null,
        description: data.description || null,
      }

      return NextResponse.json({
        success: true,
        method: 'oembed',
        metadata,
        originalUrl: normalizedUrl,
      })
    }

    // Method 2: Fallback - Try CORS proxy for HTML scraping
    console.warn('oEmbed failed, trying CORS proxy fallback')
    
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(normalizedUrl)}`
    const proxyResponse = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkFlyer/1.0)',
      },
      next: { revalidate: 1800 } // Cache for 30 minutes
    })

    if (proxyResponse.ok) {
      const html = await proxyResponse.text()
      
      // Extract metadata from HTML meta tags
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i)
      const artistMatch = html.match(/<meta property="soundcloud:created_by" content="([^"]+)"/i) ||
                         html.match(/<meta name="twitter:audio:artist_name" content="([^"]+)"/i)
      const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i)
      const descriptionMatch = html.match(/<meta property="og:description" content="([^"]+)"/i)

      if (titleMatch) {
        const metadata: SoundCloudMetadata = {
          title: titleMatch[1] || '',
          artist: artistMatch?.[1] || '',
          imageUrl: imageMatch?.[1] || null,
          description: descriptionMatch?.[1] || null,
        }

        return NextResponse.json({
          success: true,
          method: 'html_scraping',
          metadata,
          originalUrl: normalizedUrl,
        })
      }
    }

    // Method 3: Final fallback - Extract basic info from URL
    console.warn('All methods failed, using URL parsing fallback')
    
    const urlParts = normalizedUrl.split('/')
    const trackSlug = urlParts[urlParts.length - 1]
    const artistSlug = urlParts[urlParts.length - 2]
    
    const metadata: SoundCloudMetadata = {
      title: trackSlug?.replace(/-/g, ' ') || 'Unknown Track',
      artist: artistSlug?.replace(/-/g, ' ') || 'Unknown Artist',
      imageUrl: null,
      description: null,
    }

    return NextResponse.json({
      success: true,
      method: 'url_parsing',
      metadata,
      originalUrl: normalizedUrl,
      warning: 'Limited metadata available - could not fetch from SoundCloud'
    })

  } catch (error) {
    console.error('Error fetching SoundCloud metadata:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch track metadata',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}