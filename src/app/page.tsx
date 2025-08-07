'use client'

import React from 'react'
import Link from 'next/link'
import SoundCloudPlayerV3SingleTwo from '../components/SoundCloudPlayerV3SingleTwo'

// 実際のSoundCloudトラックデータ（音声切り替えテスト用）
const sampleTracks = [
  {
    sc_title: "Daniel Wang at Lente Kabinet Festival 2019",
    user_name: "DKMNTL",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY2QjM1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRhbmllbCBXYW5nPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxlbnRlIEthYmluZXQ8L3RleHQ+PC9zdmc+",
    url: "https://soundcloud.com/dkmntl/daniel-wang-at-lente-kabinet-festival-2019",
    bio: "Live set from Lente Kabinet Festival 2019. Two Player architecture test track #1.",
    shop_link: "https://dkmntl.com"
  },
  {
    sc_title: "Larry Levan - Paradise Garage 1979",
    user_name: "Mihai DL",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEVDREM0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxhcnJ5IExldmFuPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhcmFnZSBDbGFzc2ljPC90ZXh0Pjwvc3ZnPg==",
    url: "https://soundcloud.com/mihaidl/larry-levan-paradise-garage-1979",
    bio: "Classic garage house set from Paradise Garage. Two Player architecture test track #2."
  },
  {
    sc_title: "Nicky Siano Live at The Gallery II Opening 1974",
    user_name: "THUMP",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNDVCN0QxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5pY2t5IFNpYW5vPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkdhbGxlcnkgSUk8L3RleHQ+PC9zdmc+",
    url: "https://soundcloud.com/thump/nicky-siano-live-at-the-gallery-ii-opening-1974",
    bio: "Historic disco set from The Gallery II opening. Two Player architecture test track #3."
  },
  {
    sc_title: "Bobby Konders Mix",
    user_name: "DJ M-TRAXXX",
    sc_img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjOTZDRUI0Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkJvYmJ5IEtvbmRlcnM8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk55YyBIb3VzZTwvdGV4dD48L3N2Zz4=",
    url: "https://soundcloud.com/djmtraxxx/bobbykonders",
    bio: "NYC house classics mix. Two Player architecture test track #4."
  }
]

export default function HomePage() {
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
              <Link href="/discover" className="text-gray-500 hover:text-orange-600 font-medium">
                Discover
              </Link>
              <Link href="/trending" className="text-gray-500 hover:text-orange-600 font-medium">
                Trending
              </Link>
              <Link href="/artists" className="text-gray-500 hover:text-orange-600 font-medium">
                Artists
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Music
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore and listen to tracks from talented artists around the world with our Two Player architecture.
          </p>
        </div>

        {/* トラック一覧 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Tracks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleTracks.map((track, index) => (
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

        {/* 機能説明セクション */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Two Player Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Local Modal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• トラック固有のローカルモーダル</li>
                <li>• ドラッグ対応のプログレスバー</li>
                <li>• ローカルミニプレイヤー</li>
                <li>• アーティスト情報表示</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Global System</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• グローバルミニプレイヤー</li>
                <li>• フルスクリーングローバルモーダル</li>
                <li>• ページ間での再生継続</li>
                <li>• 最大2プレイヤー管理</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🎵 音声切り替えテスト:</strong> 4つの異なるDiscoハウス/クラシック楽曲でTwo Player Architectureの動作確認が可能です。
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>🌍 ページ遷移テスト:</strong> 音楽を再生中に <Link href="/discover" className="underline font-semibold">Discover</Link>, <Link href="/trending" className="underline font-semibold">Trending</Link>, <Link href="/artists" className="underline font-semibold">Artists</Link> ページに遷移して再生継続を確認できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}