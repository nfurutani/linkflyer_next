export interface Profile {
  user_id: string
  username: string
  display_name: string | null
  bio: string | null
  profile_image: string | null
  // Legacy social fields (will be deprecated)
  instagram_username: string | null
  x_username: string | null
  youtube_url: string | null
  threads_username: string | null
  soundcloud_url: string | null
  tiktok_username: string | null
  bandcamp_url: string | null
  discogs_url: string | null
  email_address: string | null
  facebook_url: string | null
  website_url: string | null
  social_links_order: string | null
  created_at: string
  updated_at: string
}

export interface Social {
  id: string
  user_id: string
  platform: string
  value: string
  active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Audio {
  id: string
  user_id: string
  title: string
  url: string
  image_url: string | null
  shop_link: string | null
  order: number
  active: boolean
  created_at: string
  updated_at: string
}

// Legacy alias for backward compatibility during transition
export type Link = Audio;

export interface Flyer {
  id: string
  user_id: string
  image_url: string
  title: string | null
  description: string | null
  event_date: string | null
  venue_name: string | null
  venue_address: string | null
  address_components: any[] | null
  geocode_lat: number | null
  geocode_lng: number | null
  created_at: string
  updated_at: string
  active: boolean
  deleted_at: string | null
}