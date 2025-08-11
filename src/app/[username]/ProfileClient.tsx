'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SoundCloudPlayerV3SingleTwo from '../../components/SoundCloudPlayerV3SingleTwo'
import FlyerModal from '../../components/FlyerModal'
import { SoundCloudTrack } from '../../../lib/utils/dataTransform'
import { Flyer } from '../../../types/database'

// Define social platforms to display
const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', field: 'instagram_username', type: 'username' },
  { id: 'soundcloud', name: 'SoundCloud', field: 'soundcloud_url', type: 'url' },
  { id: 'bandcamp', name: 'Bandcamp', field: 'bandcamp_url', type: 'url' },
  { id: 'discogs', name: 'Discogs', field: 'discogs_url', type: 'url' },
]

interface ProfileClientProps {
  profile: {
    username: string
    display_name: string | null
    bio: string | null
    profile_image: string | null
    instagram_username: string | null
    soundcloud_url: string | null
    bandcamp_url: string | null
    discogs_url: string | null
  }
  tracks: SoundCloudTrack[]
  flyers: Flyer[]
}

export default function ProfileClient({ profile, tracks, flyers }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'audio' | 'flyers'>('audio')
  const [svgIcons, setSvgIcons] = useState<Record<string, string>>({})
  const [selectedFlyer, setSelectedFlyer] = useState<Flyer | null>(null)
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false)

  const handleFlyerClick = (flyer: Flyer) => {
    setSelectedFlyer(flyer)
    setIsFlyerModalOpen(true)
  }

  const handleCloseFlyerModal = () => {
    setIsFlyerModalOpen(false)
    setSelectedFlyer(null)
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
            {profile.profile_image ? (
              <Image
                src={profile.profile_image}
                alt={profile.username}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{profile.display_name || profile.username}</h1>
          {profile.bio && (
            <p className="mt-2 text-gray-600">{profile.bio}</p>
          )}
          
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
            <div className="grid grid-cols-2 gap-4 mb-20">
              {tracks.map((track, index) => (
                <SoundCloudPlayerV3SingleTwo
                  key={`player-grid-${index}`}
                  sc_title={track.sc_title}
                  user_name={track.user_name}
                  sc_img={track.sc_img}
                  url={track.url}
                  profile_img={track.profile_img}
                  bio={track.bio}
                  shop_link={track.shopLink}
                />
              ))}
            </div>
          </>
        ) : (
          /* Flyers Grid */
          <div className="grid grid-cols-2 gap-4 mb-20">
            {flyers.length > 0 ? (
              flyers.map((flyer, index) => (
                <div 
                  key={flyer.id} 
                  className="relative cursor-pointer"
                  onClick={() => handleFlyerClick(flyer)}
                >
                  <div className="relative">
                    <Image
                      src={flyer.image_url}
                      alt={flyer.title || `Flyer ${index + 1}`}
                      width={300}
                      height={400}
                      className="w-full aspect-[3/4] object-cover rounded-lg"
                    />
                    
                    {/* オーバーレイ情報 - 下部グラデーション */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/70 to-transparent rounded-b-lg p-3 flex flex-col justify-end">
                      {flyer.event_date && (
                        <p className="text-white text-xs font-medium mb-1">
                          {new Date(flyer.event_date).toLocaleDateString('ja-JP')}
                        </p>
                      )}
                      {flyer.venue_name && (
                        <p className="text-white text-xs opacity-90 line-clamp-1">
                          {flyer.venue_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <p>No flyers yet</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Flyer Modal - Audio modalとは独立して管理 */}
      {selectedFlyer && (
        <FlyerModal
          flyer={selectedFlyer}
          isOpen={isFlyerModalOpen}
          onClose={handleCloseFlyerModal}
        />
      )}
    </div>
  )
}