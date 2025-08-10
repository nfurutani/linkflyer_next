import { supabase } from './client'
import { Profile, Audio } from '../../types/database'

/**
 * プロファイルをusernameで取得
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    console.log(`🔍 Searching for profile with username: "${username}"`)
    console.log('Username type:', typeof username)
    console.log('Username value:', username)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('Profile query error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error, null, 2)
      })
      
      // PGRST116はレコードが見つからないエラー
      if (error.code === 'PGRST116') {
        console.log(`Profile not found for username: "${username}"`)
        return null
      }
      
      throw error
    }
    
    console.log('✅ Profile found:', data)
    return data
  } catch (error) {
    console.error('Error fetching profile - full details:', {
      error,
      errorString: JSON.stringify(error, null, 2),
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })
    return null
  }
}

/**
 * ユーザーのオーディオトラックを取得
 */
export async function getAudioTracksByUserId(userId: string): Promise<Audio[]> {
  try {
    console.log(`🎵 Searching for audio tracks for user_id: ${userId}`)
    
    const { data, error } = await supabase
      .from('audio')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('order')

    if (error) {
      console.error('Audio tracks query error:', error)
      throw error
    }
    
    console.log(`✅ Found ${data?.length || 0} audio tracks:`, data)
    return data || []
  } catch (error) {
    console.error('Error fetching audio tracks:', error)
    return []
  }
}

/**
 * ユーザーのフライヤーを取得
 */
export async function getFlyersByUserId(userId: string) {
  try {
    console.log(`🎫 Searching for flyers for user_id: ${userId}`)
    
    const { data, error } = await supabase
      .from('flyers')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Flyers query error:', error)
      throw error
    }
    
    console.log(`✅ Found ${data?.length || 0} flyers:`, data)
    return data || []
  } catch (error) {
    console.error('Error fetching flyers:', error)
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
    console.error('Error fetching profile with audio tracks:', error)
    return { profile: null, audioTracks: [], flyers: [] }
  }
}