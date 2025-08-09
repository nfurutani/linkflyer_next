'use client'

import React from 'react'
import Link from 'next/link'
import SoundCloudPlayerV3SingleTwo from '../components/SoundCloudPlayerV3SingleTwo'

// 実際のSoundCloudトラックデータ（音声切り替えテスト用）
const sampleTracks = [
  {
    sc_title: "UGNG4.2",
    user_name: "Impropertouch",
    sc_img: "https://i1.sndcdn.com/artworks-M5uSWvVQOlPTTvhs-aFPbgA-t500x500.jpg",
    url: "https://soundcloud.com/user-773777360/ugng4-2",
    bio: "Electronic music exploration. Two Player architecture test track #1."
  },
  {
    sc_title: "BLUE FICTION /DECONSTRUCTION by IORI",
    user_name: "Iori",
    sc_img: "https://i1.sndcdn.com/artworks-4YCYH28DXVYwuhZZ-ttxyIg-t500x500.jpg",
    url: "https://soundcloud.com/iori927/deconstructionmaster",
    bio: "Experimental deconstruction of sound. Two Player architecture test track #2."
  },
  {
    sc_title: "UGNG2 by Improper Touch",
    user_name: "Impropertouch",
    sc_img: "https://i1.sndcdn.com/artworks-yzVPHFegVJUjy85R-ydfzNg-t500x500.jpg",
    url: "https://soundcloud.com/user-773777360/ugng2",
    bio: "Deep electronic journey. Two Player architecture test track #3."
  },
  {
    sc_title: "Carolina Soul: Afro-Soul-Funk Rarities 250725",
    user_name: "NTS Radio",
    sc_img: "https://i1.sndcdn.com/artworks-FdtpyOsG8kq9mCDz-asGpLw-t500x500.jpg",
    url: "https://soundcloud.com/user-643553014/carolina-soul-afro-soul-funk",
    bio: "Rare soul and funk selections. Two Player architecture test track #4."
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