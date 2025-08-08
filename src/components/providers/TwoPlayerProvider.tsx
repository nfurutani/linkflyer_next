'use client'

import React, { createContext, useContext, useRef, useCallback, ReactNode, useState, useEffect } from 'react'

// Types
interface PlayerData {
  iframe: HTMLIFrameElement
  widget: any | null
  hasPlayed: boolean
}

interface TrackInfo {
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

interface TwoPlayerContextType {
  // Two Player System
  getOrCreatePlayer: (url: string) => { player: PlayerData | null; isNew: boolean }
  setPlayerWidget: (url: string, widget: any) => void
  markPlayerAsPlayed: (url: string, trackInfo?: TrackInfo) => void
  onModalClose: (url: string) => void
  getPlayersStatus: () => Array<{ url: string; hasPlayed: boolean; hasWidget: boolean }>
  playersVersion: number
  
  // Global State
  globalCurrentTrack: TrackInfo | null
  globalMiniPlayerVisible: boolean
  globalModalVisible: boolean
  localModalOpen: boolean
  setLocalModalOpen: (isOpen: boolean) => void
  
  // Player State
  globalIsPlaying: boolean
  setGlobalIsPlaying: (playing: boolean) => void
  globalIsLiked: boolean
  setGlobalIsLiked: (liked: boolean) => void
  globalDuration: number
  setGlobalDuration: (duration: number) => void
  globalCurrentTime: number
  setGlobalCurrentTime: (time: number) => void
  
  // Global Control Functions
  globalTogglePlay: () => void
  globalToggleLike: () => void
  globalSeekTo: (time: number) => void
  showGlobalModal: () => void
  hideGlobalModal: () => void
  hideGlobalMiniPlayer: () => void
  getGlobalPlayer: () => PlayerData | null
}

const TwoPlayerContext = createContext<TwoPlayerContextType | undefined>(undefined)

interface TwoPlayerProviderProps {
  children: ReactNode
}

export const TwoPlayerProvider: React.FC<TwoPlayerProviderProps> = ({ children }) => {
  // React版の完全な実装
  const playersRef = useRef(new Map<string, PlayerData>())
  const [playersVersion, setPlayersVersion] = useState(0)

  // グローバル状態管理
  const [globalCurrentTrack, setGlobalCurrentTrack] = useState<TrackInfo | null>(null)
  const [globalMiniPlayerVisible, setGlobalMiniPlayerVisible] = useState(false)
  const [globalModalVisible, setGlobalModalVisible] = useState(false)
  const [localModalOpen, setLocalModalOpen] = useState(false)
  
  // プレイヤー状態をグローバル管理
  const [globalIsPlaying, setGlobalIsPlaying] = useState(false)
  const [globalIsLiked, setGlobalIsLiked] = useState(false)
  const [globalDuration, setGlobalDuration] = useState(0)
  const [globalCurrentTime, setGlobalCurrentTime] = useState(0)

  // プレイヤーを取得または作成
  const getOrCreatePlayer = useCallback((url: string) => {
    // 既存のプレイヤーがある場合は返す
    if (playersRef.current.has(url)) {
      const player = playersRef.current.get(url)
      return { player: player!, isNew: false }
    }

    // 最大2つまでしか作成しない（Two Player Architecture）
    if (playersRef.current.size >= 2) {
      console.warn('Maximum 2 players reached')
      return { player: null, isNew: false }
    }

    // 新しいプレイヤーを作成
    const iframe = document.createElement('iframe')
    iframe.title = "SoundCloud Player"
    iframe.width = "300"
    iframe.height = "300"
    iframe.style.position = 'absolute'
    iframe.style.visibility = 'hidden'
    iframe.style.pointerEvents = 'none'
    iframe.style.left = '-9999px'
    iframe.allow = 'autoplay'
    iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&show_artwork=false&visual=false&show_comments=false&show_user=false&show_reposts=false`

    const player: PlayerData = {
      iframe,
      widget: null,
      hasPlayed: false
    }

    // iframeをグローバルコンテナに追加（ページ遷移時も保持）
    const globalContainer = document.getElementById('global-player-container')
    if (globalContainer) {
      globalContainer.appendChild(iframe)
    }

    playersRef.current.set(url, player)
    setPlayersVersion(prev => prev + 1)
    return { player, isNew: true }
  }, [])

  // プレイヤーのwidgetを設定
  const setPlayerWidget = useCallback((url: string, widget: any) => {
    const player = playersRef.current.get(url)
    if (player) {
      player.widget = widget
      setPlayersVersion(prev => prev + 1)
    }
  }, [])

  // プレイヤーが再生されたことをマーク（他のプレイヤーを削除）
  const markPlayerAsPlayed = useCallback((url: string, trackInfo?: TrackInfo) => {
    const player = playersRef.current.get(url)
    if (player) {
      player.hasPlayed = true
      setPlayersVersion(prev => prev + 1)
      
      // グローバル状態を更新
      if (trackInfo) {
        // 新しいトラックに切り替わる時は状態をリセット
        if (!globalCurrentTrack || globalCurrentTrack.url !== url) {
          setGlobalIsLiked(false)
          setGlobalCurrentTime(0)
          setGlobalCurrentTrack({ ...trackInfo, url })
        }
        setGlobalMiniPlayerVisible(true)
      }
      
      // 他のプレイヤーを削除（遅延実行で安全に削除）
      const playersToDelete: string[] = []
      playersRef.current.forEach((_, otherUrl) => {
        if (otherUrl !== url) {
          playersToDelete.push(otherUrl)
        }
      })
      
      
      // 少し遅延してから削除（Widget APIの通信が完了してから）
      setTimeout(() => {
        playersToDelete.forEach(urlToDelete => {
          const playerToDelete = playersRef.current.get(urlToDelete)
          if (playerToDelete) {
            
            // widgetがあればunbindしてから削除
            if (playerToDelete.widget && window.SC) {
              try {
                playerToDelete.widget.unbind(window.SC.Widget.Events.READY)
                playerToDelete.widget.unbind(window.SC.Widget.Events.PLAY)
                playerToDelete.widget.unbind(window.SC.Widget.Events.PAUSE)
                playerToDelete.widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS)
                playerToDelete.widget.unbind(window.SC.Widget.Events.FINISH)
              } catch (e) {
                // Unbind error - ignore
              }
            }
            
            // iframeをDOMから削除
            if (playerToDelete.iframe && playerToDelete.iframe.parentNode) {
              playerToDelete.iframe.parentNode.removeChild(playerToDelete.iframe)
            }
            
            // プレイヤー削除イベントを発火
            const deleteEvent = new CustomEvent('playerDeleted', { 
              detail: { url: urlToDelete } 
            })
            window.dispatchEvent(deleteEvent)
            
            playersRef.current.delete(urlToDelete)
            setPlayersVersion(prev => prev + 1)
          }
        })
        
      }, 500)
    }
  }, [globalCurrentTrack])

  // モーダルを閉じるときの処理
  const onModalClose = useCallback((url: string) => {
    const player = playersRef.current.get(url)
    if (player && !player.hasPlayed) {
      // 再生されていない新しいプレイヤーを削除
      setTimeout(() => {
        if (player.widget && window.SC) {
          try {
            player.widget.unbind(window.SC.Widget.Events.READY)
            player.widget.unbind(window.SC.Widget.Events.PLAY)
            player.widget.unbind(window.SC.Widget.Events.PAUSE)
            player.widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS)
            player.widget.unbind(window.SC.Widget.Events.FINISH)
          } catch (e) {
            // unbindエラーを無視
          }
        }
        
        if (player.iframe && player.iframe.parentNode) {
          player.iframe.parentNode.removeChild(player.iframe)
        }
        playersRef.current.delete(url)
        setPlayersVersion(prev => prev + 1)
      }, 100)
    }
  }, [])

  // デバッグ用：現在のプレイヤー状況を取得
  const getPlayersStatus = useCallback(() => {
    const status: Array<{ url: string; hasPlayed: boolean; hasWidget: boolean }> = []
    playersRef.current.forEach((player, url) => {
      status.push({
        url,
        hasPlayed: player.hasPlayed,
        hasWidget: !!player.widget
      })
    })
    return status
  }, [])

  // グローバルモーダル制御
  const showGlobalModal = useCallback(() => {
    // ローカルモーダルが開いている場合は閉じる
    if (localModalOpen) {
      setLocalModalOpen(false)
      const closeLocalModalEvent = new CustomEvent('closeLocalModal')
      window.dispatchEvent(closeLocalModalEvent)
      console.log('Closing local modal to open global modal')
    }
    setGlobalModalVisible(true)
  }, [localModalOpen])

  const hideGlobalModal = useCallback(() => {
    setGlobalModalVisible(false)
  }, [])

  // グローバルプレイヤー操作
  const getGlobalPlayer = useCallback(() => {
    if (!globalCurrentTrack) return null
    return playersRef.current.get(globalCurrentTrack.url) || null
  }, [globalCurrentTrack])

  // グローバルmini player制御
  const hideGlobalMiniPlayer = useCallback(() => {
    const player = getGlobalPlayer()
    if (player?.widget) {
      player.widget.pause()
    }
    setGlobalIsPlaying(false)
    setGlobalMiniPlayerVisible(false)
    setGlobalCurrentTrack(null)
  }, [getGlobalPlayer])

  // グローバルプレイヤー制御
  const globalTogglePlay = useCallback(() => {
    const player = getGlobalPlayer()
    if (!player?.widget) return
    
    if (globalIsPlaying) {
      player.widget.pause()
    } else {
      player.widget.play()
    }
  }, [getGlobalPlayer, globalIsPlaying])

  const globalToggleLike = useCallback(() => {
    setGlobalIsLiked(prev => !prev)
  }, [])

  // seek実行後の短期間自動更新を抑制するためのref
  const globalSeekTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const globalSeekTo = useCallback((time: number) => {
    const player = getGlobalPlayer()
    if (!player?.widget) return
    
    
    // seek実行前に即座に状態を更新（位置戻りを防ぐ）
    setGlobalCurrentTime(time)
    
    // SoundCloud Widget APIに送信
    player.widget.seekTo(time * 1000)
    
    // seek実行後、短期間自動更新を抑制
    if (globalSeekTimeoutRef.current) {
      clearTimeout(globalSeekTimeoutRef.current)
    }
    globalSeekTimeoutRef.current = setTimeout(() => {
      globalSeekTimeoutRef.current = null
    }, 600) // グローバルは600ms
  }, [getGlobalPlayer])

  // グローバルプレイヤーのイベントを監視してグローバル状態を更新
  useEffect(() => {
    if (!globalCurrentTrack) return
    
    const player = playersRef.current.get(globalCurrentTrack.url)
    if (!player?.widget) return

    const widget = player.widget

    const handlePlay = () => {
      setGlobalIsPlaying(true)
    }

    const handlePause = () => {
      setGlobalIsPlaying(false)
    }

    const handlePlayProgress = (data: any) => {
      const currentSeconds = data.currentPosition / 1000
      // seek直後の短い期間は自動更新をスキップ
      if (!globalSeekTimeoutRef.current) {
        setGlobalCurrentTime(currentSeconds)
      } else {
      }
    }

    const handleFinish = () => {
      setGlobalIsPlaying(false)
      setGlobalCurrentTime(0)
    }

    // 既存のイベントを完全にクリーンアップしてから新しいものをバインド
    if (window.SC) {
      try {
        widget.unbind(window.SC.Widget.Events.PLAY)
        widget.unbind(window.SC.Widget.Events.PAUSE)
        widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS)
        widget.unbind(window.SC.Widget.Events.FINISH)
      } catch (e) {
        // unbindエラーを無視
      }

      // イベントをバインド
      widget.bind(window.SC.Widget.Events.PLAY, handlePlay)
      widget.bind(window.SC.Widget.Events.PAUSE, handlePause)
      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, handlePlayProgress)
      widget.bind(window.SC.Widget.Events.FINISH, handleFinish)

      // デュレーションを取得
      widget.getDuration((dur: number) => {
        setGlobalDuration(dur / 1000)
      })

      // 現在の再生状態を取得
      widget.isPaused((paused: boolean) => {
        setGlobalIsPlaying(!paused)
      })
    }

    // クリーンアップ
    return () => {
      if (window.SC) {
        try {
          widget.unbind(window.SC.Widget.Events.PLAY, handlePlay)
          widget.unbind(window.SC.Widget.Events.PAUSE, handlePause)
          widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS, handlePlayProgress)
          widget.unbind(window.SC.Widget.Events.FINISH, handleFinish)
        } catch (e) {
          // unbindエラーを無視
        }
      }
    }
  }, [globalCurrentTrack])

  const value: TwoPlayerContextType = {
    getOrCreatePlayer,
    setPlayerWidget,
    markPlayerAsPlayed,
    onModalClose,
    getPlayersStatus,
    playersVersion,
    
    // グローバル状態
    globalCurrentTrack,
    globalMiniPlayerVisible,
    globalModalVisible,
    showGlobalModal,
    hideGlobalModal,
    hideGlobalMiniPlayer,
    getGlobalPlayer,
    
    // グローバルプレイヤー状態
    globalIsPlaying,
    setGlobalIsPlaying,
    globalIsLiked,
    setGlobalIsLiked,
    globalDuration,
    setGlobalDuration,
    globalCurrentTime,
    setGlobalCurrentTime,
    
    // グローバルプレイヤー操作
    globalTogglePlay,
    globalToggleLike,
    globalSeekTo,
    
    // ローカルモーダル状態
    localModalOpen,
    setLocalModalOpen
  }

  return (
    <TwoPlayerContext.Provider value={value}>
      {children}
    </TwoPlayerContext.Provider>
  )
}

export const useTwoPlayer = (): TwoPlayerContextType => {
  const context = useContext(TwoPlayerContext)
  if (!context) {
    throw new Error('useTwoPlayer must be used within TwoPlayerProvider')
  }
  return context
}

// SoundCloud Widget API の型定義
declare global {
  interface Window {
    SC: {
      Widget: {
        (iframe: HTMLIFrameElement): any
        Events: {
          READY: string
          PLAY: string
          PAUSE: string
          PLAY_PROGRESS: string
          FINISH: string
        }
      }
    }
  }
}