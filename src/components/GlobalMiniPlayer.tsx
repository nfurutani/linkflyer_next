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
    hideGlobalMiniPlayer,
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
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-[70]">
      <div className="px-4 py-3">
        {/* プログレスバー */}
        <div className="mb-3">
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-100"
              style={{ width: `${globalDuration > 0 ? (globalCurrentTime / globalDuration) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* トラック情報 */}
          <div 
            className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
            onClick={showGlobalModal}
          >
            <Image
              src={globalCurrentTrack.sc_img}
              alt={globalCurrentTrack.sc_title}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{globalCurrentTrack.sc_title}</p>
              <p className="text-gray-500 text-xs line-clamp-1">{globalCurrentTrack.user_name}</p>
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              {formatTime(globalCurrentTime)} / {formatTime(globalDuration)}
            </div>
          </div>

          {/* コントロールボタン */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={globalToggleLike}
              className={`p-2 rounded-full ${globalIsLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <svg className="w-5 h-5" fill={globalIsLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button
              onClick={globalTogglePlay}
              className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {globalIsPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button
              onClick={hideGlobalMiniPlayer}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalMiniPlayer