'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { FlyerUpload } from '@/components/flyers/FlyerUpload'

interface Flyer {
  id: string
  user_id: string
  image_url?: string | null
  title?: string | null
  description?: string | null
  event_date?: string | null
  venue_name?: string | null
  venue_address?: string | null
  active: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

interface AdminFlyersClientProps {
  initialProfile: any
  initialFlyers: Flyer[]
  userId: string
}

export default function AdminFlyersClient({ initialProfile, initialFlyers, userId }: AdminFlyersClientProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [flyers, setFlyers] = useState<Flyer[]>(initialFlyers)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const refreshFlyers = async () => {
    try {
      const { data: updatedFlyers, error } = await supabase
        .from('flyers')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      
      if (!error && updatedFlyers) {
        setFlyers(updatedFlyers)
      }
    } catch (error) {
      console.error('Error refreshing flyers:', error)
    }
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    refreshFlyers()
  }

  const handleDeleteFlyer = async (flyer: Flyer) => {
    if (!window.confirm('Are you sure you want to delete this flyer? This action cannot be undone.')) {
      return
    }

    setDeleting(flyer.id)
    try {
      // 1. Soft delete in database (mark as inactive and set deleted_at)
      const { error: deleteError } = await supabase
        .from('flyers')
        .update({
          active: false,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', flyer.id)

      if (deleteError) throw deleteError

      // 2. Delete image from storage if exists
      if (flyer.image_url) {
        const imagePath = flyer.image_url.split('/').pop()
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from('flyer-images')
            .remove([imagePath])
          
          if (storageError) {
            console.warn('Failed to delete image from storage:', storageError)
            // Don't throw error as the database deletion succeeded
          }
        }
      }

      // 3. Remove from UI state
      setFlyers(flyers.filter(f => f.id !== flyer.id))
    } catch (error) {
      console.error('Error deleting flyer:', error)
      alert('Error deleting flyer. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const formatEventDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <div className="bg-white shadow fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Event Flyers</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" style={{ paddingTop: '120px' }}>
        {/* Upload Section */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Upload Event Flyer</h2>
              <p className="text-sm text-gray-500">Share your upcoming events</p>
            </div>
            {!showUpload && (
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Flyer
              </button>
            )}
          </div>
          
          {showUpload ? (
            <FlyerUpload
              userId={userId}
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUpload(false)}
            />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-500">Click "Upload Flyer" to get started</p>
              <p className="text-sm text-gray-400 mt-2">AI will analyze your flyer and extract event details</p>
            </div>
          )}
        </div>

        {/* Flyers Grid */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Your Event Flyers</h2>
            <p className="text-sm text-gray-500">
              {flyers.length === 0 ? 'No flyers uploaded yet' : `${flyers.length} flyer${flyers.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {flyers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>No event flyers yet</p>
              <p className="text-sm">Upload your first flyer to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flyers.map((flyer) => (
                <div key={flyer.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Flyer Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    {flyer.image_url ? (
                      <Image
                        src={flyer.image_url}
                        alt={flyer.title || 'Event flyer'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Flyer Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {flyer.title || 'Untitled Event'}
                        </h3>
                        {flyer.event_date && (
                          <p className="text-sm text-gray-600">
                            {formatEventDate(flyer.event_date)}
                          </p>
                        )}
                        {flyer.venue_name && (
                          <p className="text-sm text-gray-500 truncate">
                            {flyer.venue_name}
                          </p>
                        )}
                      </div>
                    </div>

                    {flyer.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {flyer.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => window.open(`/flyers/${flyer.id}`, '_blank')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        View →
                      </button>
                      
                      <button
                        onClick={() => handleDeleteFlyer(flyer)}
                        disabled={deleting === flyer.id}
                        className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                        aria-label="Delete flyer"
                      >
                        {deleting === flyer.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}