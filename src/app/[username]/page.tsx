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
  
  try {
    // Supabaseからユーザーデータを取得
    const { profile, audioTracks, flyers } = await getProfileWithAudioTracks(username)
    
    // デバッグ情報を表示
    if (!profile) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-4">Username: {username}</p>
            <p className="text-sm text-gray-500">
              環境変数確認:
            </p>
            <div className="bg-white p-4 rounded-lg shadow mt-4 text-left">
              <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </div>
        </div>
      )
    }
    
    // オーディオトラックをSoundCloudプレイヤー用に変換
    const tracks = transformAudioArrayToSoundCloudTracks(audioTracks, profile)
    
    return <ProfileClient profile={profile} tracks={tracks} flyers={flyers} />
    
  } catch (error) {
    // エラーが発生した場合の詳細表示
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
          <p className="text-gray-600 mb-4">Username: {username}</p>
          <div className="bg-white p-4 rounded-lg shadow mt-4 text-left">
            <p className="text-red-600 font-mono text-sm">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </p>
            <p className="text-sm text-gray-500">
              SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}

// 動的レンダリングを強制（データが常に最新になるように）
export const dynamic = 'force-dynamic'