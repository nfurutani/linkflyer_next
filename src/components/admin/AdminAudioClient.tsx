'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  fetchSoundCloudMetadata, 
  isValidSoundCloudUrl, 
  formatTrackDisplayName,
  isSameSoundCloudTrack,
  SoundCloudMetadata 
} from '@/lib/utils/soundcloud'

interface AudioTrack {
  id: string
  user_id: string
  title: string
  url: string
  image_url?: string | null
  shop_link?: string | null
  order: number
  active: boolean
  created_at: string
  updated_at: string
}

interface SortableItemProps {
  track: AudioTrack
  index: number
  onToggleActive: (index: number) => void
  onEditTrack: (index: number) => void
}

function SortableItem({ track, index, onToggleActive, onEditTrack }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border border-gray-200 rounded-xl transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${!track.active ? 'bg-gray-50' : 'bg-white'}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 flex items-center text-gray-400 cursor-move touch-none p-2 -m-2"
      >
        <div className="grid grid-cols-2 gap-1 w-3 h-5">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>

      {/* Track Image */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {track.image_url ? (
          <img 
            src={track.image_url} 
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${!track.active ? 'text-gray-400' : 'text-gray-900'}`}>
          {track.title}
        </div>
        <div className={`text-sm truncate ${!track.active ? 'text-gray-400' : 'text-gray-500'}`}>
          {track.url}
        </div>
        {track.shop_link && (
          <div className="text-sm text-purple-600 truncate">
            Shop: {track.shop_link}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => onToggleActive(index)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            track.active ? 'bg-purple-600' : 'bg-gray-200'
          }`}
          aria-label={track.active ? 'Deactivate track' : 'Activate track'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              track.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEditTrack(index)}
          className="text-purple-600 hover:text-purple-700 p-1"
          aria-label="Edit track"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface AdminAudioClientProps {
  initialProfile: any
  initialTracks: AudioTrack[]
  userId: string
}

export default function AdminAudioClient({ initialProfile, initialTracks, userId }: AdminAudioClientProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [tracks, setTracks] = useState<AudioTrack[]>(initialTracks)
  const [saving, setSaving] = useState(false)
  const [newTrackUrl, setNewTrackUrl] = useState('')
  const [newTrackMetadata, setNewTrackMetadata] = useState<SoundCloudMetadata | null>(null)
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editTrackData, setEditTrackData] = useState({ title: '', shop_link: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleFetchMetadata = async () => {
    if (!newTrackUrl || !isValidSoundCloudUrl(newTrackUrl)) return

    // Check for duplicates
    const isDuplicate = tracks.some(track => isSameSoundCloudTrack(track.url, newTrackUrl))
    if (isDuplicate) {
      alert('This track is already in your list!')
      return
    }

    setFetchingMetadata(true)
    try {
      const response = await fetchSoundCloudMetadata(newTrackUrl)
      setNewTrackMetadata(response.metadata)
    } catch (error) {
      console.error('Error fetching metadata:', error)
      alert('Could not fetch track information. Please check the URL.')
    } finally {
      setFetchingMetadata(false)
    }
  }

  const handleAddTrack = async () => {
    if (!newTrackMetadata || !newTrackUrl) return

    setSaving(true)
    try {
      const newTrack: Partial<AudioTrack> = {
        user_id: userId,
        title: formatTrackDisplayName(newTrackMetadata),
        url: newTrackUrl,
        image_url: newTrackMetadata.imageUrl,
        shop_link: null,
        order: tracks.length,
        active: true,
      }

      const { data, error } = await supabase
        .from('audio')
        .insert(newTrack)
        .select()
        .single()

      if (error) throw error

      setTracks([...tracks, data])
      setNewTrackUrl('')
      setNewTrackMetadata(null)
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding track:', error)
      alert('Error adding track')
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = tracks.findIndex(track => track.id === active.id)
      const newIndex = tracks.findIndex(track => track.id === over.id)
      
      const newTracks = arrayMove(tracks, oldIndex, newIndex).map((track, index) => ({
        ...track,
        order: index
      }))
      
      setTracks(newTracks)
      await saveTracksOrder(newTracks)
    }
  }

  const saveTracksOrder = async (tracksToSave: AudioTrack[]) => {
    setSaving(true)
    try {
      const updates = tracksToSave.map(track => ({
        id: track.id,
        order: track.order,
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('audio')
          .update({ order: update.order })
          .eq('id', update.id)

        if (error) throw error
      }
    } catch (error) {
      console.error('Error updating track order:', error)
      alert('Error updating track order')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (index: number) => {
    const updated = [...tracks]
    updated[index] = { ...updated[index], active: !updated[index].active }
    setTracks(updated)

    setSaving(true)
    try {
      const { error } = await supabase
        .from('audio')
        .update({ active: updated[index].active })
        .eq('id', updated[index].id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating track:', error)
      alert('Error updating track')
    } finally {
      setSaving(false)
    }
  }

  const handleEditTrack = (index: number) => {
    setEditingIndex(index)
    setEditTrackData({
      title: tracks[index].title,
      shop_link: tracks[index].shop_link || '',
    })
    setShowEditModal(true)
  }

  const handleUpdateTrack = async () => {
    if (editingIndex === null) return

    setSaving(true)
    try {
      const updated = [...tracks]
      updated[editingIndex] = {
        ...updated[editingIndex],
        title: editTrackData.title,
        shop_link: editTrackData.shop_link || null,
      }

      const { error } = await supabase
        .from('audio')
        .update({
          title: editTrackData.title,
          shop_link: editTrackData.shop_link || null,
        })
        .eq('id', updated[editingIndex].id)

      if (error) throw error

      setTracks(updated)
      setShowEditModal(false)
      setEditingIndex(null)
    } catch (error) {
      console.error('Error updating track:', error)
      alert('Error updating track')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTrackFromModal = async () => {
    if (editingIndex === null) return
    if (!window.confirm('Are you sure you want to delete this track?')) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('audio')
        .delete()
        .eq('id', tracks[editingIndex].id)

      if (error) throw error

      const updated = tracks.filter((_, i) => i !== editingIndex)
      setTracks(updated)
      setShowEditModal(false)
      setEditingIndex(null)
    } catch (error) {
      console.error('Error deleting track:', error)
      alert('Error deleting track')
    } finally {
      setSaving(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Audio Tracks</h1>
              {saving && (
                <div className="ml-4 flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Track
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" style={{ paddingTop: '120px' }}>
        {/* Audio Tracks List */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Your Audio Tracks</h2>
            <p className="text-sm text-gray-500">Drag to reorder, toggle to show/hide on your profile</p>
          </div>
          
          {tracks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p>No audio tracks yet</p>
              <p className="text-sm">Add your first SoundCloud track to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={tracks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tracks.map((track, index) => (
                    <SortableItem
                      key={track.id}
                      track={track}
                      index={index}
                      onToggleActive={handleToggleActive}
                      onEditTrack={handleEditTrack}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Add Track Modal */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAddModal(false)}
          />
          
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add SoundCloud Track</h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewTrackUrl('')
                  setNewTrackMetadata(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SoundCloud URL
                </label>
                <input
                  type="url"
                  value={newTrackUrl}
                  onChange={(e) => setNewTrackUrl(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="https://soundcloud.com/artist/track"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleFetchMetadata}
                  disabled={!newTrackUrl || !isValidSoundCloudUrl(newTrackUrl) || fetchingMetadata}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {fetchingMetadata ? 'Loading...' : 'Preview'}
                </button>
              </div>
              
              {newTrackMetadata && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start gap-3">
                    {newTrackMetadata.imageUrl && (
                      <img 
                        src={newTrackMetadata.imageUrl} 
                        alt={newTrackMetadata.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {formatTrackDisplayName(newTrackMetadata)}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {newTrackUrl}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setNewTrackUrl('')
                    setNewTrackMetadata(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTrack}
                  disabled={!newTrackMetadata || saving}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Track'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Track Modal */}
      {showEditModal && editingIndex !== null && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowEditModal(false)}
          />
          
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Track</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTrackData.title}
                  onChange={(e) => setEditTrackData({ ...editTrackData, title: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Link (optional)
                </label>
                <input
                  type="url"
                  value={editTrackData.shop_link}
                  onChange={(e) => setEditTrackData({ ...editTrackData, shop_link: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="https://bandcamp.com/..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Link to buy this track (Bandcamp, Discogs, etc.)
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDeleteTrackFromModal}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Delete Track'}
                </button>
                <button
                  type="button"
                  onClick={handleUpdateTrack}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}