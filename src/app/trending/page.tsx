'use client'

import React from 'react'
import Link from 'next/link'
import SoundCloudPlayerV3SingleTwo from '../../components/SoundCloudPlayerV3SingleTwo'

// Trendingページ用のトラック
const trendingTracks = [
  {
    sc_title: "Nicky Siano Live at The Gallery II Opening 1974",
    user_name: "THUMP",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNDVCN0QxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5pY2t5IFNpYW5vPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSUk8L3RleHQ+PC9zdmc+",
    url: "https://soundcloud.com/thump/nicky-siano-live-at-the-gallery-ii-opening-1974",
    bio: "🔥 Trending: Historic disco set from The Gallery II opening in 1974.",
    shop_link: "https://thump.vice.com"
  },
  {
    sc_title: "Bobby Konders Mix",
    user_name: "DJ M-TRAXXX",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjOTZDRUI0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkJvYmJ5IEtvbmRlcnM8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk55YyBIb3VzZTwvdGV4dD48L3N2Zz4=",
    url: "https://soundcloud.com/djmtraxxx/bobbykonders",
    bio: "🚀 Hot Mix: NYC house classics from the underground scene."
  },
  {
    sc_title: "Daniel Wang at Lente Kabinet Festival 2019",
    user_name: "DKMNTL",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY2QjM1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRhbmllbCBXYW5nPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxlbnRlIEthYmluZXQ8L3RleHQ+PC9zdmc+",
    url: "https://soundcloud.com/dkmntl/daniel-wang-at-lente-kabinet-festival-2019",
    bio: "📈 Rising: Amsterdam festival live recording gaining popularity.",
    shop_link: "https://dkmntl.com"
  }
]

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-purple-600">
              LinkFlyer
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/discover" className="text-gray-500 hover:text-gray-900">
                Discover
              </Link>
              <Link href="/trending" className="text-purple-600 font-semibold border-b-2 border-purple-600">
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
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500">Trending</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* ヒーローセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔥 Trending Now
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The hottest tracks gaining momentum in the underground scene right now.
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1.2K</div>
            <div className="text-gray-600">Plays Today</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">+45%</div>
            <div className="text-gray-600">Growth This Week</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">8</div>
            <div className="text-gray-600">New Hot Tracks</div>
          </div>
        </div>

        {/* トラック一覧 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🚀 Hot Tracks</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Updated 2 hours ago</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTracks.map((track, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 relative">
                {/* トレンドバッジ */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                  #{index + 1}
                </div>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Trending Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">📈 Why These Tracks?</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• High play-through rates (>80%)</li>
                <li>• Rapid social media shares</li>
                <li>• DJ playlist additions</li>
                <li>• Underground blog features</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">⏱️ Real-Time Data</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Live play count tracking</li>
                <li>• Geographic trend analysis</li>
                <li>• Cross-platform monitoring</li>
                <li>• Community engagement metrics</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>🌊 Page Navigation Test:</strong> 音楽を再生中にページ遷移してください。グローバルミニプレイヤーで再生が継続されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}