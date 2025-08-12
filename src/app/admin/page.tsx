import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth')
  }

  // Fetch or create profile
  let profile = null
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code === 'PGRST116') {
    // Profile doesn't exist, create one
    const newProfile = {
      user_id: user.id,
      username: user.email?.split('@')[0] || 'user',
      display_name: null,
      bio: null,
      profile_image: null,
    }

    const { data: createdProfile } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single()

    profile = createdProfile
  } else {
    profile = data
  }

  return <AdminDashboardClient profile={profile} />
}