import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminSocialClient from '@/components/admin/AdminSocialClient'

export default async function AdminSocialPage() {
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

  // Get social links from social table
  const { data: socialLinks, error: socialError } = await supabase
    .from('social')
    .select('*')
    .eq('user_id', user.id)
    .order('order_index', { ascending: true })

  // Handle case where social table doesn't exist yet (fallback to empty array)
  const userSocialLinks = socialError ? [] : (socialLinks || [])

  return <AdminSocialClient 
    initialProfile={profile} 
    initialSocialLinks={userSocialLinks}
    userId={user.id} 
  />
}