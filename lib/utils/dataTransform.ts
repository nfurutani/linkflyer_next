import { Profile, Audio } from '../../types/database'

/**
 * SoundCloudプレイヤー用のトラック情報
 */
export interface SoundCloudTrack {
  sc_title: string
  user_name: string
  sc_img: string
  url: string
  title?: string
  image_url?: string | null
  profile_img?: string | null
  bio?: string | null
  shopLink?: string | null
}

/**
 * SupabaseのAudioデータをSoundCloudTrackに変換
 */
export function transformAudioToSoundCloudTrack(
  audio: Audio, 
  profile: Profile
): SoundCloudTrack {
  return {
    sc_title: audio.title,
    user_name: profile.display_name || profile.username,
    sc_img: audio.image_url || '/placeholder-track.jpg',
    url: audio.url,
    title: audio.title,
    image_url: audio.image_url,
    profile_img: profile.profile_image,
    bio: profile.bio,
    shopLink: audio.shop_link,
  }
}

/**
 * 複数のAudioデータを一括変換
 */
export function transformAudioArrayToSoundCloudTracks(
  audioArray: Audio[],
  profile: Profile
): SoundCloudTrack[] {
  return audioArray.map(audio => transformAudioToSoundCloudTrack(audio, profile))
}