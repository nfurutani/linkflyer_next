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
      // 直接Supabaseクエリを実行してデバッグ
      const debugQuery = async () => {
        const { supabase } = await import('../../../lib/supabase/client')
        const { data: allProfiles, error: allError } = await supabase
          .from('profiles')
          .select('username, user_id, display_name')
          .limit(10)
        
        return { allProfiles, allError }
      }
      
      const { allProfiles, allError } = await debugQuery()
      
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found Debug</h1>
            <p className="text-gray-600 mb-4">Searching for: <strong>{username}</strong></p>
            
            <div className="bg-white p-4 rounded-lg shadow mt-4">
              <h3 className="font-bold mb-2">Environment Status:</h3>
              <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow mt-4">
              <h3 className="font-bold mb-2">Database Connection Test:</h3>
              {allError ? (
                <div className="text-red-600">
                  <p>❌ Connection Error:</p>
                  <pre className="text-xs bg-red-50 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(allError, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <p>✅ Connection Success</p>
                  <p>Found {allProfiles?.length || 0} profiles in database</p>
                </div>
              )}
            </div>
            
            {allProfiles && allProfiles.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow mt-4">
                <h3 className="font-bold mb-2">Available Profiles:</h3>
                <div className="space-y-2">
                  {allProfiles.map((p: any) => (
                    <div key={p.user_id} className="border-l-4 border-blue-400 pl-4">
                      <p><strong>Username:</strong> "{p.username}"</p>
                      <p><strong>Display Name:</strong> {p.display_name}</p>
                      <p><strong>User ID:</strong> {p.user_id}</p>
                      <p className="text-sm text-gray-500">
                        Match: {p.username === username ? '✅ MATCH' : '❌ NO MATCH'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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