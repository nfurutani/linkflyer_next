export interface SoundCloudMetadata {
  title: string
  artist: string
  imageUrl: string | null
  description: string | null
}

export interface SoundCloudApiResponse {
  success: boolean
  method: 'oembed' | 'html_scraping' | 'url_parsing'
  metadata: SoundCloudMetadata
  originalUrl: string
  warning?: string
}

// Validate SoundCloud URL format
export function isValidSoundCloudUrl(url: string): boolean {
  const soundcloudRegex = /^https:\/\/(www\.)?(soundcloud\.com|snd\.sc)\/.+/
  return soundcloudRegex.test(url)
}

// Normalize SoundCloud URL (remove query parameters, etc.)
export function normalizeSoundCloudUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`
  } catch {
    return url
  }
}

// Fetch SoundCloud track metadata via API route
export async function fetchSoundCloudMetadata(url: string): Promise<SoundCloudApiResponse> {
  if (!isValidSoundCloudUrl(url)) {
    throw new Error('Invalid SoundCloud URL')
  }

  const apiUrl = `/api/soundcloud?url=${encodeURIComponent(url)}`
  
  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Extract basic track info from SoundCloud URL as fallback
export function extractBasicInfoFromUrl(url: string): SoundCloudMetadata {
  const normalizedUrl = normalizeSoundCloudUrl(url)
  const urlParts = normalizedUrl.split('/')
  
  const trackSlug = urlParts[urlParts.length - 1] || 'unknown-track'
  const artistSlug = urlParts[urlParts.length - 2] || 'unknown-artist'
  
  return {
    title: trackSlug.replace(/-/g, ' '),
    artist: artistSlug.replace(/-/g, ' '),
    imageUrl: null,
    description: null,
  }
}

// Format track display name (Artist - Title)
export function formatTrackDisplayName(metadata: SoundCloudMetadata): string {
  if (metadata.artist && metadata.title) {
    return `${metadata.artist} - ${metadata.title}`
  }
  return metadata.title || 'Unknown Track'
}

// Check if two SoundCloud URLs are the same track (normalized comparison)
export function isSameSoundCloudTrack(url1: string, url2: string): boolean {
  const normalized1 = normalizeSoundCloudUrl(url1)
  const normalized2 = normalizeSoundCloudUrl(url2)
  return normalized1 === normalized2
}