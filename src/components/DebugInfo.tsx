'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useTwoPlayer } from './providers/TwoPlayerProvider'
import { usePathname } from 'next/navigation'

const DebugInfo: React.FC = () => {
  const { 
    getPlayersStatus, 
    playersVersion,
    globalCurrentTrack,
    globalMiniPlayerVisible,
    globalModalVisible,
    globalIsPlaying,
    globalDuration,
    globalCurrentTime,
    localModalOpen
  } = useTwoPlayer()

  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true) // デフォルトで展開
  const [eventCount, setEventCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const players = getPlayersStatus()
  
  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date().toLocaleTimeString())
    
    // 時刻更新タイマー
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // イベント発生回数をカウント（デバッグ用）
  useEffect(() => {
    if (isClient) {
      setEventCount(prev => prev + 1)
    }
  }, [playersVersion, globalCurrentTrack, globalMiniPlayerVisible, globalModalVisible, globalIsPlaying, isClient])
  
  // ログのthrottling（1秒に1回まで）
  const lastLogTime = useRef(0)
  const now = Date.now()
  if (now - lastLogTime.current > 1000) {
    console.log('🔍 DebugInfo render - playersVersion:', playersVersion, 'players:', players.length, 'route:', pathname)
    console.log('🌐 Global state - track:', globalCurrentTrack?.sc_title, 'playing:', globalIsPlaying, 'time:', `${Math.floor(globalCurrentTime)}s/${Math.floor(globalDuration)}s`)
    console.log('🖼️ UI state - mini:', globalMiniPlayerVisible, 'modal:', globalModalVisible, 'local:', localModalOpen)
    lastLogTime.current = now
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '70px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#00ff00',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        zIndex: 9999,
        maxWidth: '320px',
        border: '1px solid #333',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* ヘッダー */}
      <div 
        style={{ 
          marginBottom: '8px', 
          color: '#ffff00',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>🔍 Debug Info - Next.js</span>
        <span style={{ fontSize: '10px', color: '#999' }}>
          ({eventCount}) {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* プレイヤー情報 */}
      <div>
        <span style={{ color: '#ff6600' }}>Players:</span> {players.length}/2 
        <span style={{ color: '#666', fontSize: '10px', marginLeft: '8px' }}>
          (v{playersVersion})
        </span>
      </div>

      {isExpanded && (
        <>
          {players.length === 0 ? (
            <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic', padding: '4px 8px' }}>
              No active players
            </div>
          ) : (
            players.map((p, i) => {
              const isGlobal = globalCurrentTrack?.url === p.url
              return (
                <div key={i} style={{ 
                  fontSize: '10px', 
                  marginTop: '6px', 
                  paddingLeft: '8px',
                  border: isGlobal ? '1px solid #ffaa00' : '1px solid #333',
                  borderRadius: '3px',
                  padding: '4px',
                  backgroundColor: isGlobal ? 'rgba(255, 170, 0, 0.1)' : 'transparent'
                }}>
                  <div style={{ color: isGlobal ? '#ffaa00' : '#66ccff' }}>
                    #{i+1} {isGlobal && '⭐'}: {p.url.includes('soundcloud.com') ? 
                      p.url.split('/').pop()?.slice(0, 20) + '...' : 
                      p.url.slice(-25)
                    }
                  </div>
                  <div style={{ marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: p.hasPlayed ? '#00ff00' : '#ff4444' }}>
                      🎵 {p.hasPlayed ? '✅' : '❌'}
                    </span>
                    <span style={{ color: p.hasWidget ? '#00ff00' : '#ff4444' }}>
                      🟡 {p.hasWidget ? '✅' : '❌'}
                    </span>
                    {isGlobal && (
                      <span style={{ color: globalIsPlaying ? '#00ff00' : '#ffaa00' }}>
                        {globalIsPlaying ? '▶️' : '⏸️'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* グローバル状態 */}
          <div style={{ 
            marginTop: '10px', 
            borderTop: '1px solid #444', 
            paddingTop: '6px' 
          }}>
            <div style={{ color: '#ffff00', fontSize: '11px', marginBottom: '4px' }}>
              🌐 Global State
            </div>
            
            <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ color: '#ff6600' }}>Track:</span>{' '}
                {globalCurrentTrack ? (
                  <span style={{ color: '#66ccff' }}>
                    {globalCurrentTrack.sc_title?.slice(0, 25)}...
                  </span>
                ) : (
                  <span style={{ color: '#666' }}>None</span>
                )}
              </div>
              
              <div style={{ marginBottom: '2px' }}>
                <span style={{ color: '#ff6600' }}>Artist:</span>{' '}
                {globalCurrentTrack?.user_name ? (
                  <span style={{ color: '#66ccff' }}>{globalCurrentTrack.user_name}</span>
                ) : (
                  <span style={{ color: '#666' }}>N/A</span>
                )}
              </div>

              {globalCurrentTrack && (
                <div style={{ marginBottom: '2px' }}>
                  <span style={{ color: '#ff6600' }}>Time:</span>{' '}
                  <span style={{ color: globalIsPlaying ? '#00ff00' : '#ffaa00' }}>
                    {formatTime(globalCurrentTime)} / {formatTime(globalDuration)}
                  </span>
                  {globalIsPlaying && <span style={{ color: '#00ff00', marginLeft: '4px' }}>▶️</span>}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', fontSize: '10px' }}>
                <div>
                  <span style={{ color: '#ff6600' }}>Mini:</span>{' '}
                  {globalMiniPlayerVisible ? 
                    <span style={{ color: '#00ff00' }}>✅ ON</span> : 
                    <span style={{ color: '#666' }}>❌ OFF</span>
                  }
                </div>
                <div>
                  <span style={{ color: '#ff6600' }}>Modal:</span>{' '}
                  {globalModalVisible ? 
                    <span style={{ color: '#00ff00' }}>✅ ON</span> : 
                    <span style={{ color: '#666' }}>❌ OFF</span>
                  }
                </div>
                <div>
                  <span style={{ color: '#ff6600' }}>Local:</span>{' '}
                  {localModalOpen ? 
                    <span style={{ color: '#ffaa00' }}>✅ ON</span> : 
                    <span style={{ color: '#666' }}>❌ OFF</span>
                  }
                </div>
                <div>
                  <span style={{ color: '#ff6600' }}>Status:</span>{' '}
                  <span style={{ color: globalIsPlaying ? '#00ff00' : '#ffaa00' }}>
                    {globalIsPlaying ? 'PLAY' : 'PAUSE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ページ情報 */}
          <div style={{ 
            marginTop: '8px', 
            borderTop: '1px solid #444', 
            paddingTop: '6px' 
          }}>
            <div style={{ color: '#ffff00', fontSize: '11px', marginBottom: '4px' }}>
              📱 Page Info
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
              <div>
                <span style={{ color: '#ff6600' }}>Route:</span>{' '}
                <span style={{ color: '#66ccff' }}>{pathname}</span>
              </div>
              <div>
                <span style={{ color: '#ff6600' }}>URL:</span>{' '}
                <span style={{ color: '#66ccff' }}>
                  {isClient ? window.location.hostname : 'Loading...'}
                </span>
              </div>
            </div>
          </div>

          {/* システム情報 */}
          <div style={{ 
            marginTop: '8px', 
            borderTop: '1px solid #444', 
            paddingTop: '6px' 
          }}>
            <div style={{ color: '#ffff00', fontSize: '11px', marginBottom: '4px' }}>
              ⚙️ System
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
              <div>Next.js 14 App Router</div>
              <div>Two Player Architecture v2</div>
              <div>SoundCloud Widget API</div>
              <div>React 18 + TypeScript</div>
              <div style={{ marginTop: '2px', color: '#666' }}>
                Updated: {isClient ? currentTime : 'Loading...'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DebugInfo