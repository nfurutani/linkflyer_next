'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import SoundCloudPlayerV3SingleTwo from '../../components/SoundCloudPlayerV3SingleTwo'
import FlyerModal from '../../components/FlyerModal'
import { SoundCloudTrack } from '../../../lib/utils/dataTransform'
import { Flyer, Social } from '../../../types/database'

// Define all social platforms (matching admin implementation)
const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', field: 'instagram_username', type: 'username', baseUrl: 'https://instagram.com/' },
  { id: 'threads', name: 'Threads', field: 'threads_username', type: 'username', baseUrl: 'https://threads.net/' },
  { id: 'tiktok', name: 'TikTok', field: 'tiktok_username', type: 'username', baseUrl: 'https://tiktok.com/' },
  { id: 'x', name: 'X', field: 'x_username', type: 'username', baseUrl: 'https://x.com/' },
  { id: 'facebook', name: 'Facebook', field: 'facebook_url', type: 'url', baseUrl: '' },
  { id: 'youtube', name: 'YouTube', field: 'youtube_url', type: 'url', baseUrl: '' },
  { id: 'discogs', name: 'Discogs', field: 'discogs_url', type: 'url', baseUrl: '' },
  { id: 'bandcamp', name: 'Bandcamp', field: 'bandcamp_url', type: 'url', baseUrl: '' },
  { id: 'soundcloud', name: 'SoundCloud', field: 'soundcloud_url', type: 'url', baseUrl: '' },
  { id: 'website', name: 'Website', field: 'website_url', type: 'url', baseUrl: '' },
  { id: 'email', name: 'Email', field: 'email_address', type: 'email', baseUrl: 'mailto:' },
]

interface ProfileClientProps {
  profile: {
    username: string
    display_name: string | null
    bio: string | null
    profile_image: string | null
    // Legacy social fields (for backward compatibility)
    instagram_username: string | null
    threads_username: string | null
    tiktok_username: string | null
    x_username: string | null
    facebook_url: string | null
    youtube_url: string | null
    discogs_url: string | null
    bandcamp_url: string | null
    soundcloud_url: string | null
    website_url: string | null
    email_address: string | null
    social_links_order: string | null
  }
  socialLinks: Social[]
  tracks: SoundCloudTrack[]
  flyers: Flyer[]
}

export default function ProfileClient({ profile, socialLinks, tracks, flyers }: ProfileClientProps) {
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
          <div className="mt-4 flex justify-center flex-wrap gap-4 max-w-xs mx-auto">
            {socialLinks
              .filter(social => social.active)
              .sort((a, b) => a.order_index - b.order_index)
              .map((social) => {
                const platform = socialPlatforms.find(p => p.id === social.platform)
                if (!platform) return null

                // Construct URL based on platform type
                let url = ''
                if (platform.type === 'username') {
                  // Remove @ if present and construct full URL
                  const username = social.value.replace('@', '')
                  url = platform.baseUrl + username
                } else if (platform.type === 'email') {
                  url = platform.baseUrl + social.value
                } else {
                  // URL type - use as is
                  url = social.value
                }

                return (
                  <a 
                    key={social.id}
                    href={url} 
                    target={platform.type === 'email' ? '_self' : '_blank'}
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                    title={`${platform.name}: ${platform.type === 'username' ? '@' + social.value.replace('@', '') : social.value}`}
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