'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useTwoPlayer } from './providers/TwoPlayerProvider'

interface SoundCloudPlayerV3SingleTwoProps {
  sc_title: string
  user_name: string
  sc_img: string
  url: string
  title?: string
  image_url?: string
  profile_img?: string
  bio?: string
  shop_link?: string
}

const SoundCloudPlayerV3SingleTwo: React.FC<SoundCloudPlayerV3SingleTwoProps> = ({
  sc_title,
  user_name,
  sc_img,
  url,
  title,
  image_url,
  profile_img,
  bio,
  shop_link,
}) => {
  const {
    getOrCreatePlayer,
    setPlayerWidget,
    markPlayerAsPlayed,
    onModalClose,
    globalCurrentTrack,
    globalIsPlaying,
    globalIsLiked,
    globalDuration,
    globalCurrentTime,
    setLocalModalOpen,
    globalToggleLike,
    globalSeekTo,
  } = useTwoPlayer()

  // ローカル状態
  const [showModal, setShowModal] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)
  
  // seek実行後の短期間自動更新を抑制するためのref
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // デバッグ用のstate変化監視
  useEffect(() => {
    console.log(`🖱️ isDragging changed: ${isDragging}`)
  }, [isDragging])
  
  useEffect(() => {
    console.log(`🎯 dragTime changed: ${dragTime.toFixed(2)}s`)
  }, [dragTime])
  
  useEffect(() => {
    console.log(`⏰ currentTime changed: ${currentTime.toFixed(2)}s`)
  }, [currentTime])
  
  const playerRef = useRef<any>(null)

  // このトラックがグローバルに再生中かチェック
  const isGlobalTrack = globalCurrentTrack?.url === url
  
  // 表示用の状態（グローバル状態を優先）
  const displayIsPlaying = isGlobalTrack ? globalIsPlaying : isPlaying
  const displayIsLiked = isGlobalTrack ? globalIsLiked : isLiked
  const displayDuration = isGlobalTrack ? globalDuration : duration
  const displayCurrentTime = isDragging ? dragTime : (isGlobalTrack ? globalCurrentTime : currentTime)
  
  // displayCurrentTime計算をデバッグ
  useEffect(() => {
    const source = isDragging ? 'dragTime' : (isGlobalTrack ? 'globalCurrentTime' : 'currentTime')
    console.log(`📺 displayCurrentTime: ${displayCurrentTime.toFixed(2)}s (source: ${source}, isDragging=${isDragging}, isGlobal=${isGlobalTrack})`)
  }, [displayCurrentTime, isDragging, isGlobalTrack])

  const trackInfo = {
    sc_title,
    user_name,
    sc_img,
    url,
    title,
    image_url,
    profile_img,
    bio,
    shop_link,
  }

  // Widget のセットアップ
  const setupWidget = useCallback(() => {
    if (!playerRef.current?.iframe || !window.SC) return

    const widget = window.SC.Widget(playerRef.current.iframe)
    playerRef.current.widget = widget
    setPlayerWidget(url, widget)

    // イベントバインディング
    widget.bind(window.SC.Widget.Events.READY, () => {
      // Player ready
      setIsReady(true)
      
      widget.getDuration((dur: number) => {
        setDuration(dur / 1000)
      })
    })

    widget.bind(window.SC.Widget.Events.PLAY, () => {
      // Play event
      setIsPlaying(true)
      markPlayerAsPlayed(url, trackInfo)
      setShowMiniPlayer(true)
    })

    widget.bind(window.SC.Widget.Events.PAUSE, () => {
      // Pause event
      setIsPlaying(false)
    })

    widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data: any) => {
      const currentSeconds = data.currentPosition / 1000
      // グローバルトラックの場合はローカル更新をスキップ（グローバル状態が管理）
      if (isGlobalTrack) {
        console.log(`🚫 PLAY_PROGRESS: ${currentSeconds.toFixed(2)}s (スキップ - グローバルトラック)`)
        return
      }
      
      // ドラッグ中およびseek直後の短い期間は自動更新をスキップ
      if (!isDragging && !seekTimeoutRef.current) {
        console.log(`🎵 PLAY_PROGRESS: ${currentSeconds.toFixed(2)}s`)
        setCurrentTime(currentSeconds)
      } else {
        console.log(`🚫 PLAY_PROGRESS: ${currentSeconds.toFixed(2)}s (スキップ - ドラッグ=${isDragging}, seekTimeout=${!!seekTimeoutRef.current})`)
      }
    })

    widget.bind(window.SC.Widget.Events.FINISH, () => {
      // Finish event
      setIsPlaying(false)
      setCurrentTime(0)
    })
  }, [url, markPlayerAsPlayed, setPlayerWidget, trackInfo, isDragging])

  // モーダルを開く
  const openModal = useCallback(() => {
    // Opening modal
    setShowModal(true)
    setLocalModalOpen(true)

    const { player, isNew } = getOrCreatePlayer(url)
    if (player) {
      playerRef.current = player
      
      if (isNew) {
        // 新しいプレイヤーの場合、SoundCloud Widget APIの読み込みを待つ
        if (window.SC) {
          setupWidget()
        } else {
          // SoundCloud Widget APIを動的に読み込み
          const script = document.createElement('script')
          script.src = 'https://w.soundcloud.com/player/api.js'
          script.onload = setupWidget
          document.head.appendChild(script)
        }
      } else {
        // 既存のプレイヤーの場合、すでにセットアップ済み
        if (player.widget) {
          setIsReady(true)
          player.widget.getDuration((dur: number) => {
            setDuration(dur / 1000)
          })
          player.widget.isPaused((paused: boolean) => {
            setIsPlaying(!paused)
          })
          player.widget.getPosition((pos: number) => {
            setCurrentTime(pos / 1000)
          })
        }
      }
    }
  }, [url, getOrCreatePlayer, setupWidget, setLocalModalOpen])

  // モーダルを閉じる
  const closeModal = useCallback(() => {
    // Closing modal
    setShowModal(false)
    setLocalModalOpen(false)
    onModalClose(url)
  }, [url, onModalClose, setLocalModalOpen])

  // プレイ/ポーズトグル
  const togglePlay = useCallback(() => {
    if (!playerRef.current?.widget || !isReady) return

    if (displayIsPlaying) {
      playerRef.current.widget.pause()
    } else {
      playerRef.current.widget.play()
    }
  }, [displayIsPlaying, isReady])

  // いいねトグル - グローバル状態も更新
  const toggleLike = useCallback(() => {
    if (isGlobalTrack) {
      // グローバルトラックの場合はグローバル状態を更新
      globalToggleLike()
    } else {
      // ローカルトラックの場合はローカル状態を更新
      setIsLiked(prev => !prev)
    }
  }, [isGlobalTrack, globalToggleLike])

  // プログレスバーのシーク機能（React版準拠の安定性向上版）
  const seekToPosition = useCallback((clientX: number, progressBarElement: HTMLElement, updateOnly = false) => {
    const rect = progressBarElement.getBoundingClientRect()
    const clickX = clientX - rect.left
    const progressPercent = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = progressPercent * displayDuration

    if (updateOnly) {
      // ドラッグ中の視覚的フィードバック用のみ（seekTo実行なし）
      setDragTime(seekTime)
    } else {
      // 実際のシーク実行 - グローバルトラックかどうかで処理を分岐
      
      if (isGlobalTrack) {
        // グローバルトラックの場合はglobalSeekToを使用
        const clampedSeekTime = Math.max(0, Math.min(seekTime, displayDuration))
        // Global seek to position
        globalSeekTo(clampedSeekTime)
      } else {
        // ローカルトラックの場合はローカル処理
        if (playerRef.current?.widget && isReady && displayDuration > 0) {
          const clampedSeekTime = Math.max(0, Math.min(seekTime, displayDuration))
          // Local widget seek to position
          
          // seek実行前に即座にローカル状態を更新
          setCurrentTime(clampedSeekTime)
          setDragTime(clampedSeekTime)
          
          // SoundCloud Widget APIに送信
          playerRef.current.widget.seekTo(clampedSeekTime * 1000)
        } else {
          // Seek conditions not met
        }
      }
    }
  }, [displayDuration, isReady, isDragging])

  // プログレスバーのクリック/ドラッグ処理（修正版）
  const handleProgressBarMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isReady || displayDuration <= 0) return
    
    e.preventDefault()
    console.log(`🖱️ MouseDown: 開始`)
    const progressBar = e.currentTarget
    setIsDragging(true)
    
    // 初回クリックは視覚的フィードバックのみ
    seekToPosition(e.clientX, progressBar, true)

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      console.log(`🖱️ MouseMove`)
      seekToPosition(e.clientX, progressBar, true) // ドラッグ中は視覚的フィードバックのみ
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      console.log(`🖱️ MouseUp: 最終seek実行`)
      setIsDragging(false)
      
      // 最終的な位置でseek実行（updateOnly=false）
      seekToPosition(e.clientX, progressBar, false)
      
      // ローカルトラックの場合のみseek抑制を設定
      if (!isGlobalTrack) {
        if (seekTimeoutRef.current) {
          clearTimeout(seekTimeoutRef.current)
        }
        seekTimeoutRef.current = setTimeout(() => {
          seekTimeoutRef.current = null
          console.log(`⏰ seek抑制期間終了`)
        }, 800) // 800ms間は自動更新を抑制
      }
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [seekToPosition, isReady, displayDuration])

  // タッチ操作対応（React版の正確な実装）
  const handleProgressBarTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isReady || displayDuration <= 0) return
    
    e.preventDefault() // スクロール防止
    setIsDragging(true)
    const touch = e.touches[0]
    if (touch) {
      seekToPosition(touch.clientX, e.currentTarget, true) // updateOnly=true
    }
  }, [seekToPosition, isReady, displayDuration])

  const handleProgressBarTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !isReady) return
    
    e.preventDefault() // スクロール防止
    const touch = e.touches[0]
    if (touch) {
      seekToPosition(touch.clientX, e.currentTarget, true) // updateOnly=true
    }
  }, [seekToPosition, isDragging, isReady])

  const handleProgressBarTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    
    e.preventDefault() // スクロール防止
    console.log(`📱 TouchEnd: 最終seek実行`)
    
    // 最終的な位置でseek実行（updateOnly=false）
    const touch = e.changedTouches[0]
    if (touch) {
      seekToPosition(touch.clientX, e.currentTarget, false)
      
      // ローカルトラックの場合のみseek抑制を設定
      if (!isGlobalTrack) {
        if (seekTimeoutRef.current) {
          clearTimeout(seekTimeoutRef.current)
        }
        seekTimeoutRef.current = setTimeout(() => {
          seekTimeoutRef.current = null
          console.log(`⏰ seek抑制期間終了 (Touch)`)
        }, 800) // 800ms間は自動更新を抑制
      }
    }
    
    setIsDragging(false)
  }, [isDragging, seekToPosition])

  // 定期的なposition更新（グローバルトラックの場合はスキップ）
  useEffect(() => {
    // グローバルトラックの場合はTwoPlayerProviderが管理するのでスキップ
    if (isGlobalTrack) {
      console.log(`⏰ グローバルトラックのためposition pollingをスキップ`)
      return
    }
    
    if (!isPlaying || !playerRef.current?.widget || isDragging) return

    console.log(`⏰ Starting position polling (500ms) - isPlaying=${isPlaying}, isDragging=${isDragging}`)

    const interval = setInterval(() => {
      if (playerRef.current?.widget) {
        playerRef.current.widget.getPosition((pos: number) => {
          // ドラッグ中およびseek直後の短い期間は更新しない
          if (!isDragging && !seekTimeoutRef.current) {
            const seconds = pos / 1000
            console.log(`⏱️ getPosition: ${seconds.toFixed(2)}s`)
            setCurrentTime(seconds)
          } else {
            console.log(`⏱️ getPosition: スキップ (ドラッグ=${isDragging}, seekTimeout=${!!seekTimeoutRef.current})`)
          }
        })
      }
    }, 500) // React版と同じ500ms間隔

    return () => {
      console.log(`⏰ Stopping position polling`)
      clearInterval(interval)
    }
  }, [isPlaying, isDragging, isGlobalTrack])

  // ローカルモーダルを閉じるイベントリスナー
  useEffect(() => {
    const handleCloseLocalModal = () => {
      if (showModal) {
        console.log('Closing local modal due to global event')
        setShowModal(false)
      }
    }

    window.addEventListener('closeLocalModal', handleCloseLocalModal)
    return () => window.removeEventListener('closeLocalModal', handleCloseLocalModal)
  }, [showModal])

  // プレイヤー削除イベントリスナー
  useEffect(() => {
    const handlePlayerDeleted = (e: CustomEvent) => {
      if (e.detail.url === url) {
        console.log('Player deleted for:', url)
        setIsReady(false)
        setIsPlaying(false)
        setCurrentTime(0)
        setShowMiniPlayer(false)
        playerRef.current = null
      }
    }

    window.addEventListener('playerDeleted', handlePlayerDeleted as EventListener)
    return () => window.removeEventListener('playerDeleted', handlePlayerDeleted as EventListener)
  }, [url])

  // 時間をフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* メインプレイヤーボタン */}
      <div 
        className="relative cursor-pointer group"
        onClick={openModal}
      >
        <div className="relative">
          <Image
            src={sc_img}
            alt={sc_title}
            width={300}
            height={300}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <h3 className="font-semibold text-sm line-clamp-1">{sc_title}</h3>
          <p className="text-gray-600 text-xs line-clamp-1">{user_name}</p>
        </div>
      </div>

      {/* ローカルモーダル - GlobalModalと同じデザイン */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
              src={sc_img}
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
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* アーティスト情報 */}
              <div className="text-center mb-8">
                {profile_img && (
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
                    <Image
                      src={profile_img}
                      alt={user_name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-white mb-2">{user_name}</h2>
                {bio && <p className="text-white/80 text-lg">{bio}</p>}
              </div>

              {/* トラック情報 */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{sc_title}</h3>
                {title && <p className="text-white/70">{title}</p>}
              </div>

              {/* プレイヤーコントロール */}
              <div className="space-y-6">
                {/* プログレスバー */}
                <div className="space-y-2">
                  <div 
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
                        width: `${displayDuration > 0 ? (displayCurrentTime / displayDuration) * 100 : 0}%`,
                        transition: isDragging ? 'none' : 'width 0.1s ease'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{formatTime(displayCurrentTime)}</span>
                    <span>{formatTime(displayDuration)}</span>
                  </div>
                </div>

                {/* コントロールボタン */}
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={toggleLike}
                    className={`p-3 rounded-full transition-colors ${displayIsLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <svg className="w-8 h-8" fill={displayIsLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={togglePlay}
                    disabled={!isReady}
                    className="w-16 h-16 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
                  >
                    {displayIsPlaying ? (
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
                {shop_link && (
                  <div className="flex justify-center">
                    <a
                      href={shop_link}
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
      )}

      {/* ミニプレイヤー（ローカル表示用） */}
      {showMiniPlayer && !isGlobalTrack && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 flex items-center space-x-3 z-40">
          <Image
            src={sc_img}
            alt={sc_title}
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm line-clamp-1">{sc_title}</p>
            <p className="text-gray-500 text-xs line-clamp-1">{user_name}</p>
          </div>
          <button
            onClick={togglePlay}
            className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white"
          >
            {displayIsPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </>
  )
}

export default SoundCloudPlayerV3SingleTwo