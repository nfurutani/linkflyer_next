'use client'

import React from 'react'
import Image from 'next/image'
import { useTwoPlayer } from './providers/TwoPlayerProvider'

const GlobalMiniPlayer: React.FC = () => {
  const {
    globalCurrentTrack,
    globalMiniPlayerVisible,
    globalIsPlaying,
    globalIsLiked,
    globalDuration,
    globalCurrentTime,
    globalTogglePlay,
    globalToggleLike,
    showGlobalModal,
  } = useTwoPlayer()

  // グローバルMiniPlayerが表示されていない、またはトラックがない場合は何も表示しない
  if (!globalMiniPlayerVisible || !globalCurrentTrack) {
    return null
  }

  // 時間をフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="global-mini-player-fixed bg-white border-t border-gray-200" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)' }}>
      {/* Progress Bar at the top */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-200">
        <div 
          className="h-full transition-all duration-100"
          style={{ 
            width: `${globalDuration > 0 ? (globalCurrentTime / globalDuration) * 100 : 0}%`,
            background: 'linear-gradient(90deg, #ffc7b4 0%, #ff6b35 100%)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex items-center px-4 py-3 gap-3">
        {/* Track Link Area - クリックでモーダルを開く */}
        <div 
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={showGlobalModal}
        >
          {/* Artwork */}
          <div className="w-12 h-12 flex-shrink-0">
            <Image
              src={globalCurrentTrack.sc_img}
              alt={globalCurrentTrack.sc_title}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded"
            />
          </div>
          
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm line-clamp-1">{globalCurrentTrack.sc_title}</div>
            <div className="text-gray-500 text-xs line-clamp-1">{globalCurrentTrack.user_name}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <div 
            role="button" 
            tabIndex={0} 
            className={`cursor-pointer p-1 ${globalIsLiked ? 'text-red-500' : 'text-gray-600'}`}
            onClick={globalToggleLike}
          >
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10.763 6.335a4.25 4.25 0 0 0-6.01 6.01L12 19.593l6.54-6.54.708-.708a4.25 4.25 0 1 0-6.01-6.01l-.708.707a.75.75 0 0 1-1.06 0l-.707-.707Zm1.77 14.846a.75.75 0 0 1-1.063.003l-7.778-7.778a5.75 5.75 0 0 1 8.131-8.132l.177.177.177-.177a5.75 5.75 0 1 1 8.131 8.132l-7.775 7.775Z" 
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Play/Pause Button */}
          <button 
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
            type="button" 
            onClick={globalTogglePlay}
          >
            <span>
              {globalIsPlaying ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="m19.653 11.367-11-7A.75.75 0 0 0 7.5 5v14a.75.75 0 0 0 1.153.633l11-7a.75.75 0 0 0 0-1.266Z"/>
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GlobalMiniPlayer