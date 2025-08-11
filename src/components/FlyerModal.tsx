'use client'

import React from 'react'
import Image from 'next/image'
import { Flyer } from '../../types/database'

interface FlyerModalProps {
  flyer: Flyer
  isOpen: boolean
  onClose: () => void
}

export default function FlyerModal({ flyer, isOpen, onClose }: FlyerModalProps) {
  // ESCキーでモーダルを閉じる
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // スクロールを無効にする
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="relative w-full max-w-2xl max-h-full bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* 閉じるボタン - Audio local modalと同じデザイン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* スクロール可能なコンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {/* フライヤー画像 */}
          <div className="relative">
            <Image
              src={flyer.image_url}
              alt={flyer.title || 'Flyer'}
              width={800}
              height={1000}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          
          {/* フライヤー情報 */}
          {(flyer.title || flyer.description || flyer.event_date || flyer.venue_name || flyer.venue_address) && (
            <div className="p-6 bg-white pb-24">
            {flyer.title && (
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{flyer.title}</h2>
            )}
            
            {flyer.description && (
              <p className="text-gray-600 mb-4 leading-relaxed">{flyer.description}</p>
            )}
            
            <div className="space-y-2 text-sm text-gray-500">
              {flyer.event_date && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Date:</span>
                  <span>{new Date(flyer.event_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  })}</span>
                </div>
              )}
              
              {flyer.venue_name && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Venue:</span>
                  <span>{flyer.venue_name}</span>
                </div>
              )}
              
              {flyer.venue_address && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Address:</span>
                  <span>{flyer.venue_address}</span>
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}