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
  
  // Supabaseからユーザーデータを取得
  const { profile, audioTracks, flyers, socialLinks } = await getProfileWithAudioTracks(username)
  
  // プロファイルが見つからない場合は404
  if (!profile) {
    notFound()
  }
  
  // オーディオトラックをSoundCloudプレイヤー用に変換
  const tracks = transformAudioArrayToSoundCloudTracks(audioTracks, profile)
  
  return <ProfileClient 
    profile={profile} 
    socialLinks={socialLinks}
    tracks={tracks} 
    flyers={flyers} 
  />
}

// 動的レンダリングを強制（データが常に最新になるように）
export const dynamic = 'force-dynamic'