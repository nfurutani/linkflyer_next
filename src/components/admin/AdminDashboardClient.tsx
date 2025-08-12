'use client'

import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'

interface AdminDashboardClientProps {
  profile: any
}

export default function AdminDashboardClient({ profile }: AdminDashboardClientProps) {
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <div className="bg-white shadow fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingTop: '120px' }}>
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Profile Preview</h2>
          <div className="text-center">
            {profile?.profile_image && (
              <img
                src={profile.profile_image}
                alt={profile.display_name || profile.username}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h3 className="text-xl font-bold">{profile?.display_name || profile?.username}</h3>
            {profile?.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
            <div className="mt-4">
              <button
                onClick={() => window.open(`/${profile?.username}`, '_blank')}
                className="text-purple-600 hover:text-purple-700"
              >
                View Public Profile →
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/edit')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-600">Update your basic information and profile picture</p>
          </button>

          <button
            onClick={() => router.push('/admin/social')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Social Links</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-600">Manage your social media connections</p>
          </button>

          <button
            onClick={() => router.push('/admin/audio')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Audio</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-600">Add and organize your audio tracks</p>
          </button>

          <button
            onClick={() => router.push('/admin/flyers')}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Event Flyers</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-600">Upload and manage your event flyers</p>
          </button>
        </div>
      </div>
    </>
  )
}