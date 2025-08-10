'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useTwoPlayer } from './providers/TwoPlayerProvider'

const GlobalModal: React.FC = () => {
  const {
    globalCurrentTrack,
    globalModalVisible,
    globalIsPlaying,
    globalIsLiked,
    globalDuration,
    globalCurrentTime,
    globalTogglePlay,
    globalToggleLike,
    hideGlobalModal,
    globalSeekTo,
  } = useTwoPlayer()

  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // seek実行後の短期間自動更新を抑制するためのref
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null)


  const seekToPosition = useCallback((clientX: number, progressBarElement: HTMLElement, updateOnly = false) => {
    const rect = progressBarElement.getBoundingClientRect()
    const clickX = clientX - rect.left
    const progressPercent = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = progressPercent * globalDuration

    if (updateOnly) {
      setDragTime(seekTime)
    } else {
      const clampedSeekTime = Math.max(0, Math.min(seekTime, globalDuration))
      globalSeekTo(clampedSeekTime)
    }
  }, [globalDuration, globalSeekTo])

  const handleProgressBarMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (globalDuration <= 0) return
    
    e.preventDefault()
    const progressBar = e.currentTarget
    setIsDragging(true)
    
    seekToPosition(e.clientX, progressBar, true)

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      seekToPosition(e.clientX, progressBar, true)
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
      
      seekToPosition(e.clientX, progressBar, false)
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [seekToPosition, globalDuration])

  const handleProgressBarTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || globalDuration <= 0) return
    
    e.preventDefault()
    setIsDragging(true)
    const touch = e.touches[0]
    if (touch) {
      seekToPosition(touch.clientX, progressBarRef.current, true)
    }
  }, [seekToPosition, globalDuration])

  const handleProgressBarTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !progressBarRef.current) return
    
    e.preventDefault()
    const touch = e.touches[0]
    if (touch) {
      seekToPosition(touch.clientX, progressBarRef.current, true)
    }
  }, [seekToPosition, isDragging])

  const handleProgressBarTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !progressBarRef.current) return
    
    e.preventDefault()
    
    const touch = e.changedTouches[0]
    if (touch) {
      seekToPosition(touch.clientX, progressBarRef.current, false)
    }
    
    setIsDragging(false)
  }, [isDragging, seekToPosition])

  // 時間をフォーマット
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // モーダルが表示されていない、またはトラックがない場合は何も表示しない
  if (!globalModalVisible || !globalCurrentTrack) {
    return null
  }

  // 表示用の現在時刻（ドラッグ中はドラッグ時刻を使用）
  const displayCurrentTime = isDragging ? dragTime : globalCurrentTime

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src={globalCurrentTrack.sc_img}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
      </div>

      {/* モーダルコンテンツ */}
      <div className="relative w-full max-w-2xl p-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* クローズボタン */}
          <button
            onClick={hideGlobalModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* アーティスト情報 */}
          <div className="text-center mb-8">
            {globalCurrentTrack.profile_img && (
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={globalCurrentTrack.profile_img}
                  alt={globalCurrentTrack.user_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h2 className="text-3xl font-bold text-white mb-2">{globalCurrentTrack.user_name}</h2>
            {globalCurrentTrack.bio && <p className="text-white/80 text-lg">{globalCurrentTrack.bio}</p>}
          </div>

          {/* トラック情報 */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">{globalCurrentTrack.sc_title}</h3>
            {globalCurrentTrack.title && <p className="text-white/70">{globalCurrentTrack.title}</p>}
          </div>

          {/* プレイヤーコントロール */}
          <div className="space-y-6">
            {/* プログレスバー */}
            <div className="space-y-2">
              <div 
                ref={progressBarRef}
                className="w-full h-3 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
                style={{ touchAction: 'none' }}
                onMouseDown={handleProgressBarMouseDown}
                onTouchStart={handleProgressBarTouchStart}
                onTouchMove={handleProgressBarTouchMove}
                onTouchEnd={handleProgressBarTouchEnd}
              >
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                  style={{ 
                    width: `${globalDuration > 0 ? (displayCurrentTime / globalDuration) * 100 : 0}%`,
                    transition: isDragging ? 'none' : 'width 0.1s ease'
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>{formatTime(displayCurrentTime)}</span>
                <span>{formatTime(globalDuration)}</span>
              </div>
            </div>

            {/* コントロールボタン */}
            <div className="flex items-center justify-center space-x-6">
              <div 
                role="button" 
                tabIndex={0} 
                className={`cursor-pointer p-1 ${globalIsLiked ? 'text-red-500' : 'text-gray-400'}`}
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

              <button
                onClick={globalTogglePlay}
                className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
              >
                {globalIsPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <div className="w-14" />
            </div>

            {/* ショップリンク */}
            {globalCurrentTrack.shop_link && (
              <div className="flex justify-center">
                <a
                  href={globalCurrentTrack.shop_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Shop
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalModal