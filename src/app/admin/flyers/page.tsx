import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminFlyersClient from '@/components/admin/AdminFlyersClient'

export default async function AdminFlyersPage() {
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

  // Get user's flyers (active, not deleted)
  const { data: flyers, error } = await supabase
    .from('flyers')
    .select('*')
    .eq('user_id', user.id)
    .eq('active', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // Handle case where flyers table doesn't exist yet (fallback to empty array)
  const userFlyers = error ? [] : (flyers || [])

  return <AdminFlyersClient 
    initialProfile={profile} 
    initialFlyers={userFlyers}
    userId={user.id} 
  />
}