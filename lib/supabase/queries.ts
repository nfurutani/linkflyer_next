import { supabase } from './client'
import { Profile, Audio } from '../../types/database'

/**
 * プロファイルをusernameで取得
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      // PGRST116はレコードが見つからないエラー
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    
    return data
  } catch (error) {
    return null
  }
}

/**
 * ユーザーのオーディオトラックを取得
 */
export async function getAudioTracksByUserId(userId: string): Promise<Audio[]> {
  try {
    const { data, error } = await supabase
      .from('audio')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('order')

    if (error) {
      throw error
    }
    
    return data || []
  } catch (error) {
    return []
  }
}

/**
 * ユーザーのフライヤーを取得
 */
export async function getFlyersByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('flyers')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }
    
    return data || []
  } catch (error) {
    return []
  }
}

/**
 * プロファイル、オーディオトラック、フライヤーを一括取得
 */
export async function getProfileWithAudioTracks(username: string) {
  try {
    const profile = await getProfileByUsername(username)
    if (!profile) {
      return { profile: null, audioTracks: [], flyers: [] }
    }

    const audioTracks = await getAudioTracksByUserId(profile.user_id)
    const flyers = await getFlyersByUserId(profile.user_id)
    return { profile, audioTracks, flyers }
  } catch (error) {
    return { profile: null, audioTracks: [], flyers: [] }
  }
}