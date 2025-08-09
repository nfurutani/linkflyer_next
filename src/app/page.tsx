'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SoundCloudPlayerV3SingleTwo from '../components/SoundCloudPlayerV3SingleTwo'

// Define social platforms to display
const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', field: 'instagram_username', type: 'username' },
  { id: 'soundcloud', name: 'SoundCloud', field: 'soundcloud_url', type: 'url' },
  { id: 'bandcamp', name: 'Bandcamp', field: 'bandcamp_url', type: 'url' },
  { id: 'discogs', name: 'Discogs', field: 'discogs_url', type: 'url' },
]

// 実際のSoundCloudトラックデータ（音声切り替えテスト用）
const sampleTracks = [
  {
    sc_title: "UGNG4.2",
    user_name: "Impropertouch",
    sc_img: "https://i1.sndcdn.com/artworks-M5uSWvVQOlPTTvhs-aFPbgA-t500x500.jpg",
    url: "https://soundcloud.com/user-773777360/ugng4-2",
    bio: "Electronic music exploration. Two Player architecture test track #1."
  },
  {
    sc_title: "BLUE FICTION /DECONSTRUCTION by IORI",
    user_name: "Iori",
    sc_img: "https://i1.sndcdn.com/artworks-4YCYH28DXVYwuhZZ-ttxyIg-t500x500.jpg",
    url: "https://soundcloud.com/iori927/deconstructionmaster",
    bio: "Experimental deconstruction of sound. Two Player architecture test track #2."
  },
  {
    sc_title: "UGNG2 by Improper Touch",
    user_name: "Impropertouch",
    sc_img: "https://i1.sndcdn.com/artworks-yzVPHFegVJUjy85R-ydfzNg-t500x500.jpg",
    url: "https://soundcloud.com/user-773777360/ugng2",
    bio: "Deep electronic journey. Two Player architecture test track #3."
  },
  {
    sc_title: "Carolina Soul: Afro-Soul-Funk Rarities 250725",
    user_name: "NTS Radio",
    sc_img: "https://i1.sndcdn.com/artworks-FdtpyOsG8kq9mCDz-asGpLw-t500x500.jpg",
    url: "https://soundcloud.com/user-643553014/carolina-soul-afro-soul-funk",
    bio: "Rare soul and funk selections. Two Player architecture test track #4."
  }
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'audio' | 'flyers'>('audio')
  const [svgIcons, setSvgIcons] = useState<Record<string, string>>({})

  // User profile data
  const profile = {
    username: "Iori",
    bio: "Creating immersive soundscapes and memorable musical experiences.",
    profile_image: "/iori_asano-profile.jpg",
    instagram_username: "iori_asano",
    soundcloud_url: "https://soundcloud.com/iori927/",
    bandcamp_url: "https://ioriasano.bandcamp.com/",
    discogs_url: "https://www.discogs.com/artist/1625337-Iori/"
  }

  // Load SVG icons
  useEffect(() => {
    const loadSvgIcons = async () => {
      const icons: Record<string, string> = {}
      
      // Load all SVG icons
      for (const platform of socialPlatforms) {
        try {
          const response = await fetch(`/icons/${platform.id}.svg`)
          if (response.ok) {
            const svgText = await response.text()
            icons[platform.id] = svgText
          }
        } catch (error) {
          console.error(`Error loading ${platform.id} icon:`, error)
        }
      }
      
      setSvgIcons(icons)
    }

    loadSvgIcons()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
              src={profile.profile_image}
              alt={profile.username}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="mt-2 text-gray-600">{profile.bio}</p>
          
          {/* Social Icons */}
          <div className="mt-4 flex justify-center space-x-4">
            {socialPlatforms.map((platform) => {
              const value = profile[platform.field as keyof typeof profile] as string | null
              if (!value) return null

              // Construct URL based on platform type
              let url = ''
              if (platform.type === 'username') {
                if (platform.id === 'instagram') url = `https://instagram.com/${value}`
              } else {
                url = value
              }

              return (
                <a 
                  key={platform.id}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="sr-only">{platform.name}</span>
                  <div 
                    className="w-6 h-6"
                    dangerouslySetInnerHTML={{ __html: svgIcons[platform.id] || '' }}
                  />
                </a>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              activeTab === 'audio'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveTab('flyers')}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              activeTab === 'flyers'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Flyers
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'audio' ? (
          <>
            {/* Audio Tracks Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {sampleTracks.map((track, index) => (
                <SoundCloudPlayerV3SingleTwo
                  key={`player-grid-${index}`}
                  sc_title={track.sc_title}
                  user_name={profile.username}
                  sc_img={track.sc_img}
                  url={track.url}
                  profile_img={profile.profile_image}
                  bio={profile.bio}
                  shop_link={undefined}
                />
              ))}
            </div>
          </>
        ) : (
          /* Flyers Grid */
          <div className="text-center py-12 text-gray-500">
            <p>No flyers yet</p>
          </div>
        )}
      </div>
    </div>
  )
}