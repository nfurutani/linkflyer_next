'use client'

import React from 'react'
import Link from 'next/link'
import SoundCloudPlayerV3SingleTwo from '../../components/SoundCloudPlayerV3SingleTwo'

// Discoverページ用のトラック（ジャンル: Deep House / Tech House）
const discoverTracks = [
  {
    sc_title: "Daniel Wang at Lente Kabinet Festival 2019",
    user_name: "DKMNTL",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY2QjM1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRhbmllbCBXYW5nPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxlbnRlIEthYmluZXQ8L3RleHQ+PC9zdmc+",
    url: "https://soundcloud.com/dkmntl/daniel-wang-at-lente-kabinet-festival-2019",
    bio: "Deep house vibes from Amsterdam's underground scene.",
    shop_link: "https://dkmntl.com"
  },
  {
    sc_title: "Larry Levan - Paradise Garage 1979",
    user_name: "Mihai DL",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEVDREM0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxhcnJ5IExldmFuPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhcmFnZSBDbGFzc2ljPC90ZXh0Pjwvc3ZnPg==",
    url: "https://soundcloud.com/mihaidl/larry-levan-paradise-garage-1979",
    bio: "Legendary garage house from the master himself."
  }
]

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-orange-600">
              LinkFlyer
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/discover" className="text-orange-600 font-semibold border-b-2 border-orange-600">
                Discover
              </Link>
              <Link href="/trending" className="text-gray-500 hover:text-gray-900">
                Trending
              </Link>
              <Link href="/artists" className="text-gray-500 hover:text-gray-900">
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
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-orange-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500">Discover</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* ヒーローセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎵 Discover Deep Sounds
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Underground gems and deep house classics from legendary DJs and producers.
          </p>
        </div>

        {/* トラック一覧 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deep House Essentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {discoverTracks.map((track, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <SoundCloudPlayerV3SingleTwo
                  sc_title={track.sc_title}
                  user_name={track.user_name}
                  sc_img={track.sc_img}
                  url={track.url}
                  bio={track.bio}
                  shop_link={track.shop_link}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 説明セクション */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🎧 Page Navigation Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Play Music</h4>
              <p className="text-gray-600">Start playing any track above</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Navigate Pages</h4>
              <p className="text-gray-600">Switch to Trending or Artists</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Verify Playback</h4>
              <p className="text-gray-600">Music should continue playing</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>🧪 Navigation Test:</strong> 音楽を再生してから他のページに遷移し、グローバルミニプレイヤーで再生が継続されることを確認してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}