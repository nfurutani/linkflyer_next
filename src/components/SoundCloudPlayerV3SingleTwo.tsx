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
    globalTogglePlay,
    globalSeekTo,
  } = useTwoPlayer()

  // ローカル状態
  const [showModal, setShowModal] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // seek実行後の短期間自動更新を抑制するためのref
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const playerRef = useRef<any>(null)
  const initClickedRef = useRef(false)

  // このトラックがグローバルに再生中かチェック
  const isGlobalTrack = globalCurrentTrack?.url === url
  
  // 表示用の状態（グローバル状態を優先）
  const displayIsPlaying = isGlobalTrack ? globalIsPlaying : isPlaying
  const displayIsLiked = isGlobalTrack ? globalIsLiked : isLiked
  const displayDuration = isGlobalTrack ? globalDuration : duration
  const displayCurrentTime = isDragging ? dragTime : (isGlobalTrack ? globalCurrentTime : currentTime)
  

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

    widget.bind(window.SC.Widget.Events.READY, () => {
      setIsReady(true)
      
      widget.getDuration((dur: number) => {
        setDuration(dur / 1000)
      })
    })

    widget.bind(window.SC.Widget.Events.PLAY, () => {
      setIsPlaying(true)
      setIsInitialized(true)
      markPlayerAsPlayed(url, trackInfo)
    })

    widget.bind(window.SC.Widget.Events.PAUSE, () => {
      setIsPlaying(false)
    })

    widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data: any) => {
      const currentSeconds = data.currentPosition / 1000
      if (isGlobalTrack) {
        return
      }
      
      // ドラッグ中およびseek直後の短い期間は自動更新をスキップ
      if (!isDragging && !seekTimeoutRef.current) {
        setCurrentTime(currentSeconds)
      } else {
      }
    })

    widget.bind(window.SC.Widget.Events.FINISH, () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })
  }, [url, markPlayerAsPlayed, setPlayerWidget, trackInfo, isGlobalTrack])

  const openModal = useCallback(() => {
    setShowModal(true)
    setLocalModalOpen(true)

    const { player, isNew } = getOrCreatePlayer(url)
    if (player) {
      playerRef.current = player
      
      if (isNew) {
        setIsInitialized(false)
        initClickedRef.current = false
        setCurrentTime(0)
        setDuration(0)
        if (window.SC) {
          setupWidget()
        } else {
          const script = document.createElement('script')
          script.src = 'https://w.soundcloud.com/player/api.js'
          script.onload = setupWidget
          document.head.appendChild(script)
        }
      } else {
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

  const closeModal = useCallback(() => {
    setShowModal(false)
    setLocalModalOpen(false)
    onModalClose(url)
  }, [url, onModalClose, setLocalModalOpen])

  // Safari対応の初期化関数
  const initializeAndPlay = useCallback(() => {
    if (!playerRef.current?.widget || !isReady || initClickedRef.current) return
    
    console.log('Initializing and playing...')
    initClickedRef.current = true
    
    // Safari対応: seekTo(0)を呼んでから再生
    playerRef.current.widget.seekTo(0)
    
    setTimeout(() => {
      playerRef.current.widget.play()
      
      // さらに少し待ってから状態をチェック
      setTimeout(() => {
        playerRef.current.widget.isPaused((paused: boolean) => {
          console.log('After init - isPaused:', paused)
          if (paused) {
            // まだ一時停止中なら、もう一度試す
            playerRef.current.widget.play()
          }
        })
      }, 300)
    }, 100)
  }, [isReady])

  const togglePlay = useCallback(() => {
    // グローバルトラックの場合はグローバル関数を使用
    if (isGlobalTrack) {
      globalTogglePlay()
      return
    }

    if (!playerRef.current?.widget || !isReady) return

    // 初回クリック時の特別処理
    if (!isInitialized && !initClickedRef.current) {
      initializeAndPlay()
      return
    }

    // 通常の再生/一時停止
    if (displayIsPlaying) {
      playerRef.current.widget.pause()
    } else {
      playerRef.current.widget.play()
    }
  }, [displayIsPlaying, isReady, isInitialized, initializeAndPlay, isGlobalTrack, globalTogglePlay])

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
        }
      }
    }
  }, [displayDuration, isReady, isGlobalTrack, globalSeekTo])

  const handleProgressBarMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isReady || displayDuration <= 0) return
    
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
      if (!isGlobalTrack) {
        if (seekTimeoutRef.current) {
          clearTimeout(seekTimeoutRef.current)
        }
        seekTimeoutRef.current = setTimeout(() => {
          seekTimeoutRef.current = null
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
      seekToPosition(touch.clientX, e.currentTarget, true)
    }
  }, [seekToPosition, isReady, displayDuration])

  const handleProgressBarTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !isReady) return
    
    e.preventDefault() // スクロール防止
    const touch = e.touches[0]
    if (touch) {
      seekToPosition(touch.clientX, e.currentTarget, true)
    }
  }, [seekToPosition, isDragging, isReady])

  const handleProgressBarTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    
    e.preventDefault() // スクロール防止
    
    const touch = e.changedTouches[0]
    if (touch) {
      seekToPosition(touch.clientX, e.currentTarget, false)
      if (!isGlobalTrack) {
        if (seekTimeoutRef.current) {
          clearTimeout(seekTimeoutRef.current)
        }
        seekTimeoutRef.current = setTimeout(() => {
          seekTimeoutRef.current = null
        }, 800) // 800ms間は自動更新を抑制
      }
    }
    
    setIsDragging(false)
  }, [isDragging, seekToPosition])

  // 定期的なposition更新（グローバルトラックの場合はスキップ）
  useEffect(() => {
    // グローバルトラックの場合はTwoPlayerProviderが管理するのでスキップ
    if (isGlobalTrack) {
      return
    }
    
    if (!isPlaying || !playerRef.current?.widget || isDragging) return


    const interval = setInterval(() => {
      if (playerRef.current?.widget) {
        playerRef.current.widget.getPosition((pos: number) => {
          if (!isDragging && !seekTimeoutRef.current) {
            const seconds = pos / 1000
            setCurrentTime(seconds)
          }
        })
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [isPlaying, isDragging, isGlobalTrack])

  // ローカルモーダルを閉じるイベントリスナー
  useEffect(() => {
    const handleCloseLocalModal = () => {
      if (showModal) {
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
        setIsReady(false)
        setIsPlaying(false)
        setCurrentTime(0)
        setIsInitialized(false)
        initClickedRef.current = false
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
        className="relative cursor-pointer"
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
          
          {/* 再生中のインディケータ */}
          {displayIsPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="flex items-end space-x-1">
                <div className="w-1 bg-white rounded-full sound-wave" style={{height: '20px', animationDelay: '0s'}}></div>
                <div className="w-1 bg-white rounded-full sound-wave" style={{height: '32px', animationDelay: '0.1s'}}></div>
                <div className="w-1 bg-white rounded-full sound-wave" style={{height: '16px', animationDelay: '0.2s'}}></div>
                <div className="w-1 bg-white rounded-full sound-wave" style={{height: '28px', animationDelay: '0.3s'}}></div>
                <div className="w-1 bg-white rounded-full sound-wave" style={{height: '24px', animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          
          <style jsx>{`
            .sound-wave {
              animation: soundWave 1s ease-in-out infinite alternate;
            }
            
            @keyframes soundWave {
              0% {
                transform: scaleY(1);
              }
              100% {
                transform: scaleY(0.3);
              }
            }
          `}</style>
        </div>
        
        <div className="mt-2">
          <h3 className="font-semibold text-sm line-clamp-1 text-gray-600">{sc_title}</h3>
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
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-white/20">
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
                      className="h-full rounded-full"
                      style={{ 
                        width: `${displayDuration > 0 ? (displayCurrentTime / displayDuration) * 100 : 0}%`,
                        background: 'linear-gradient(90deg, #ffc7b4 0%, #ff6b35 100%)',
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
                  <div 
                    role="button" 
                    tabIndex={0} 
                    className={`cursor-pointer p-1 ${displayIsLiked ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={toggleLike}
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

    </>
  )
}

export default SoundCloudPlayerV3SingleTwo