import { notFound } from 'next/navigation'
import { getProfileWithAudioTracks } from '../../../lib/supabase/queries'
import { transformAudioArrayToSoundCloudTracks } from '../../../lib/utils/dataTransform'
import ProfileClient from './ProfileClient'

interface PageProps {
  params: Promise<{
    username: string
  }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  
  // デバッグ用: 一時的に簡単なページを表示
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LinkFlyer Next
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Profile: {username}
        </p>
        <p className="text-sm text-gray-500">
          Environment Variables Check:
        </p>
        <div className="bg-white p-4 rounded-lg shadow mt-4 text-left">
          <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
        </div>
      </div>
    </div>
  )
  
  // 元のコード（コメントアウト）
  /*
  // Supabaseからユーザーデータを取得
  const { profile, audioTracks, flyers } = await getProfileWithAudioTracks(username)
  
  // プロファイルが見つからない場合は404
  if (!profile) {
    notFound()
  }
  
  // オーディオトラックをSoundCloudプレイヤー用に変換
  const tracks = transformAudioArrayToSoundCloudTracks(audioTracks, profile)
  
  return <ProfileClient profile={profile} tracks={tracks} flyers={flyers} />
  */
}

// 動的レンダリングを強制（データが常に最新になるように）
export const dynamic = 'force-dynamic'