import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminAudioClient from '@/components/admin/AdminAudioClient'

export default async function AdminAudioPage() {
  const supabase = await createServerSupabaseClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get audio tracks (using 'audio' table name as per React version)
  const { data: audioTracks, error } = await supabase
    .from('audio')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true })

  // Handle case where audio table doesn't exist yet (fallback to empty array)
  const tracks = error ? [] : (audioTracks || [])

  return <AdminAudioClient 
    initialProfile={profile} 
    initialTracks={tracks}
    userId={user.id} 
  />
}