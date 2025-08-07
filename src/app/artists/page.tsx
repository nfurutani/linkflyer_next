'use client'

import React from 'react'
import Link from 'next/link'
import SoundCloudPlayerV3SingleTwo from '../../components/SoundCloudPlayerV3SingleTwo'

// Artistsページ用のアーティスト情報
const featuredArtists = [
  {
    name: "Larry Levan",
    genre: "Garage House / Disco",
    location: "New York, USA",
    track: {
      sc_title: "Larry Levan - Paradise Garage 1979",
      user_name: "Mihai DL",
      sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEVDREM0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxhcnJ5IExldmFuPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhcmFnZSBMZWdlbmQ8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5ZQyAxOTc5PC90ZXh0Pjwvc3ZnPg==",
      url: "https://soundcloud.com/mihaidl/larry-levan-paradise-garage-1979",
      bio: "🎧 Featured Artist: The godfather of garage house from Paradise Garage.",
    },
    description: "Legendary DJ who shaped the sound of house music at Paradise Garage."
  },
  {
    name: "Daniel Wang",
    genre: "Deep House / Tech House",
    location: "Amsterdam, Netherlands",
    track: {
      sc_title: "Daniel Wang at Lente Kabinet Festival 2019",
      user_name: "DKMNTL",
      sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY2QjM1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRhbmllbCBXYW5nPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRlZXAgSG91c2U8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkFtc3RlcmRhbTwvdGV4dD48L3N2Zz4=",
      url: "https://soundcloud.com/dkmntl/daniel-wang-at-lente-kabinet-festival-2019",
      bio: "🎵 Artist Spotlight: Modern deep house innovator from Amsterdam's underground scene.",
      shop_link: "https://dkmntl.com"
    },
    description: "Contemporary deep house producer blending classic grooves with modern production."
  },
  {
    name: "Bobby Konders",
    genre: "NYC House / Underground",
    location: "Brooklyn, New York",
    track: {
      sc_title: "Bobby Konders Mix",
      user_name: "DJ M-TRAXXX",
      sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjOTZDRUI0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkJvYmJ5IEtvbmRlcnM8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5ZQyBIb3VzZTwvdGV4dD4KPHRleHQgeD0iMTUwIiB5PSIxNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+QnJvb2tseW48L3RleHQ+PC9zdmc+",
      url: "https://soundcloud.com/djmtraxxx/bobbykonders",
      bio: "🏙️ NYC Legend: Brooklyn's finest serving raw house music from the streets.",
    },
    description: "NYC house pioneer bringing the authentic underground sound from Brooklyn."
  }
]

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-green-600">
              LinkFlyer
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/discover" className="text-gray-500 hover:text-gray-900">
                Discover
              </Link>
              <Link href="/trending" className="text-gray-500 hover:text-gray-900">
                Trending
              </Link>
              <Link href="/artists" className="text-green-600 font-semibold border-b-2 border-green-600">
                Artists
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500">Artists</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* ヒーローセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Featured Artists
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the legendary DJs and producers who shaped the underground music scene.
          </p>
        </div>

        {/* アーティスト一覧 */}
        <div className="space-y-12">
          {featuredArtists.map((artist, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="lg:flex">
                {/* アーティスト情報 */}
                <div className="lg:w-1/3 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{artist.name}</h2>
                      <p className="text-sm text-gray-600">{artist.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {artist.genre}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{artist.description}</p>
                    
                    {/* 統計情報 */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{Math.floor(Math.random() * 500) + 100}</div>
                        <div className="text-xs text-gray-500">Tracks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 50) + 10}K</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* プレイヤー部分 */}
                <div className="lg:w-2/3 p-8">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">🎵 Featured Track</h3>
                    <p className="text-gray-600 text-sm">Listen to their signature sound</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <SoundCloudPlayerV3SingleTwo
                      sc_title={artist.track.sc_title}
                      user_name={artist.track.user_name}
                      sc_img={artist.track.sc_img}
                      url={artist.track.url}
                      bio={artist.track.bio}
                      shop_link={artist.track.shop_link}
                    />
                  </div>

                  {/* 追加情報 */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">🏆 Achievements</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Pioneer of {artist.genre.split('/')[0]}</li>
                        <li>• International recognition</li>
                        <li>• Influential underground figure</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📅 Era</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Active since {1970 + Math.floor(Math.random() * 30)}s</li>
                        <li>• Shaped modern {artist.genre.split('/')[1] || 'house'}</li>
                        <li>• Still performing today</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ナビゲーションテストセクション */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Navigation Continuity Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Play Artist Track</h4>
              <p className="text-sm text-gray-600">Start any featured track above</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Navigate Pages</h4>
              <p className="text-sm text-gray-600">Go to Discover or Trending</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Verify Playback</h4>
              <p className="text-sm text-gray-600">Music continues in mini player</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Test Global Modal</h4>
              <p className="text-sm text-gray-600">Click mini player for full modal</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✨ Cross-Page Test:</strong> 音楽再生中にページを移動し、Two Player Architectureが正常に動作することを確認してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}