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

// Define social platforms with their input types and placeholder text
const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', type: 'username', placeholder: '@username', baseUrl: 'https://instagram.com/' },
  { id: 'threads', name: 'Threads', type: 'username', placeholder: '@username', baseUrl: 'https://threads.net/' },
  { id: 'tiktok', name: 'TikTok', type: 'username', placeholder: '@username', baseUrl: 'https://tiktok.com/' },
  { id: 'x', name: 'X', type: 'username', placeholder: '@username', baseUrl: 'https://x.com/' },
  { id: 'facebook', name: 'Facebook', type: 'url', placeholder: 'https://facebook.com/profile', baseUrl: '' },
  { id: 'youtube', name: 'YouTube', type: 'url', placeholder: 'https://youtube.com/@channel', baseUrl: '' },
  { id: 'discogs', name: 'Discogs', type: 'url', placeholder: 'https://discogs.com/artist/name', baseUrl: '' },
  { id: 'bandcamp', name: 'Bandcamp', type: 'url', placeholder: 'https://artist.bandcamp.com', baseUrl: '' },
  { id: 'soundcloud', name: 'SoundCloud', type: 'url', placeholder: 'https://soundcloud.com/artist', baseUrl: '' },
  { id: 'website', name: 'Website', type: 'url', placeholder: 'https://example.com', baseUrl: '' },
  { id: 'email', name: 'Email', type: 'email', placeholder: 'contact@example.com', baseUrl: 'mailto:' },
]

interface SocialLink {
  id?: string
  platform: string
  value: string
  active: boolean
  order_index: number
}

interface SortableItemProps {
  link: SocialLink
  index: number
  svgIcon: string
  onToggleActive: (index: number) => void
  onEditLink: (index: number) => void
}

function SortableItem({ link, index, svgIcon, onToggleActive, onEditLink }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.platform })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const platform = socialPlatforms.find(p => p.id === link.platform)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 border border-gray-200 rounded-xl transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
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

      <div
        className="w-6 h-6 text-gray-600 flex-shrink-0"
        dangerouslySetInnerHTML={{ __html: svgIcon }}
      />

      <div className="flex-1 min-w-0">
        <div className={`font-medium ${!link.active ? 'text-gray-400' : ''}`}>
          {platform?.name}
        </div>
        <div className={`text-sm break-all ${!link.active ? 'text-gray-400' : 'text-gray-500'}`}>
          {platform?.type === 'username' ? `@${link.value.replace('@', '')}` : link.value}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => onToggleActive(index)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            link.active ? 'bg-purple-600' : 'bg-gray-200'
          }`}
          aria-label={link.active ? 'Deactivate link' : 'Activate link'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              link.active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEditLink(index)}
          className="text-purple-600 hover:text-purple-700 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface AdminSocialClientProps {
  initialProfile: any
  initialSocialLinks: SocialLink[]
  userId: string
}

export default function AdminSocialClient({ initialProfile, initialSocialLinks, userId }: AdminSocialClientProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks)
  const [svgIcons, setSvgIcons] = useState<Record<string, string>>({})
  const [newLink, setNewLink] = useState<SocialLink>({ platform: '', value: '', active: true, order_index: 0 })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showQuickAddModal, setShowQuickAddModal] = useState(false)
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
    loadSvgIcons()
    
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])


  const loadSvgIcons = async () => {
    const icons: Record<string, string> = {}
    
    // Load all SVG icons
    for (const platform of socialPlatforms) {
      try {
        const response = await fetch(`/icons/${platform.id}.svg`)
        if (response.ok) {
          const svgText = await response.text()
          icons[platform.id] = svgText
        }
      } catch (error) {
        console.error(`Error loading ${platform.id} icon:`, error)
      }
    }
    
    setSvgIcons(icons)
  }

  const formatUrlForDatabase = (link: SocialLink): string => {
    const platform = socialPlatforms.find(p => p.id === link.platform)
    if (!platform) return ''

    if (platform.type === 'username') {
      // Remove @ if present and construct full URL
      const username = link.value.replace('@', '')
      return platform.baseUrl + username
    } else if (platform.type === 'email') {
      return platform.baseUrl + link.value
    }
    
    return link.value // URL type - return as is
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = socialLinks.findIndex(link => link.platform === active.id)
      const newIndex = socialLinks.findIndex(link => link.platform === over.id)
      
      const newLinks = arrayMove(socialLinks, oldIndex, newIndex).map((link, index) => ({
        ...link,
        order_index: index
      }))
      
      setSocialLinks(newLinks)
      await saveLinksToDatabase(newLinks)
    }
  }

  const handleAddOrUpdateLink = async () => {
    if (!newLink.platform || !newLink.value) return

    let updatedLinks
    if (editingIndex !== null) {
      // Update existing link
      updatedLinks = [...socialLinks]
      updatedLinks[editingIndex] = newLink
      setEditingIndex(null)
    } else {
      // Add new link with next order_index
      const nextOrderIndex = socialLinks.length
      updatedLinks = [...socialLinks, { ...newLink, order_index: nextOrderIndex }]
    }

    setSocialLinks(updatedLinks)
    
    // Reset form
    setNewLink({ platform: '', value: '', active: true, order_index: 0 })
    
    // Save immediately
    await saveLinksToDatabase(updatedLinks)
  }

  const handleEditLink = (index: number) => {
    setNewLink(socialLinks[index])
    setEditingIndex(index)
    setShowQuickAddModal(true)
  }

  const handleRemoveLink = async () => {
    if (editingIndex === null) return
    
    const updatedLinks = socialLinks.filter((_, i) => i !== editingIndex)
    setSocialLinks(updatedLinks)
    setNewLink({ platform: '', value: '', active: true, order_index: 0 })
    setEditingIndex(null)
    await saveLinksToDatabase(updatedLinks)
  }

  const handleToggleActive = async (index: number) => {
    const updated = [...socialLinks]
    updated[index] = { ...updated[index], active: !updated[index].active }
    setSocialLinks(updated)
    await saveLinksToDatabase(updated)
  }

  const saveLinksToDatabase = async (linksToSave: SocialLink[]) => {
    setSaving(true)
    try {
      // First, delete existing social links for this user
      const { error: deleteError } = await supabase
        .from('social')
        .delete()
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Error deleting existing social links:', deleteError)
      }

      // Then insert new social links
      const socialLinksToInsert = linksToSave
        .filter(link => link.platform && link.value)
        .map(link => ({
          user_id: userId,
          platform: link.platform,
          value: link.value,
          active: link.active,
          order_index: link.order_index,
        }))

      if (socialLinksToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('social')
          .insert(socialLinksToInsert)

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error('Error saving social links:', error)
      alert('Error saving social links')
    } finally {
      setSaving(false)
    }
  }

  const getInputType = (platform: string) => {
    const p = socialPlatforms.find(p => p.id === platform)
    if (p?.type === 'email') return 'email'
    if (p?.type === 'url') return 'url'
    return 'text'
  }

  const getPlaceholder = (platform: string) => {
    const p = socialPlatforms.find(p => p.id === platform)
    return p?.placeholder || ''
  }

  // Get available platforms (not already added)
  const availablePlatforms = socialPlatforms.filter(
    platform => !socialLinks.some(link => link.platform === platform.id) || 
                (editingIndex !== null && socialLinks[editingIndex].platform === platform.id)
  )

  return (
    <>
      <div className="bg-white shadow fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <button
              onClick={() => router.push('/admin')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Social Links</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" style={{ paddingTop: '120px' }}>
        {/* Registered Social Links */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Your Social Links</h2>
              {saving && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowQuickAddModal(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              aria-label="Add social link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {socialLinks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No social links added yet. Add your first link above!
            </p>
          ) : (
            <div className="space-y-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={socialLinks.map(l => l.platform)}
                  strategy={verticalListSortingStrategy}
                >
                  {socialLinks.map((link, index) => (
                    <SortableItem
                      key={link.platform}
                      link={link}
                      index={index}
                      svgIcon={svgIcons[link.platform] || ''}
                      onToggleActive={handleToggleActive}
                      onEditLink={handleEditLink}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowQuickAddModal(false)}
          />
          
          {isMobile ? (
            /* Mobile Bottom Sheet */
            <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-2xl transform transition-transform duration-300 ease-out"
              style={{ 
                animation: 'slideUp 0.3s ease-out',
                height: '70vh'
              }}>
              <style jsx>{`
                @keyframes slideUp {
                  from {
                    transform: translateY(100%);
                  }
                  to {
                    transform: translateY(0);
                  }
                }
              `}</style>
              {/* Handle Bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {editingIndex !== null ? 'Edit Social Link' : 'Add Social Link'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowQuickAddModal(false)
                      setNewLink({ platform: '', value: '', active: true, order_index: 0 })
                      setEditingIndex(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 -m-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    {editingIndex !== null ? (
                      <div className="flex items-center gap-3 py-2">
                        <div 
                          className="w-5 h-5 text-gray-600"
                          dangerouslySetInnerHTML={{ __html: svgIcons[newLink.platform] || '' }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {socialPlatforms.find(p => p.id === newLink.platform)?.name}
                        </span>
                      </div>
                    ) : (
                      <select
                        value={newLink.platform}
                        onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      >
                        <option value="">Select...</option>
                        {socialPlatforms.filter(
                          platform => !socialLinks.some(link => link.platform === platform.id)
                        ).map(platform => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {newLink.platform && editingIndex === null && (
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-6 h-6 text-gray-600"
                        dangerouslySetInnerHTML={{ __html: svgIcons[newLink.platform] || '' }}
                      />
                      <span className="text-sm text-gray-600">
                        {socialPlatforms.find(p => p.id === newLink.platform)?.name}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newLink.platform ? (
                        socialPlatforms.find(p => p.id === newLink.platform)?.type === 'username' ? 'Username' :
                        socialPlatforms.find(p => p.id === newLink.platform)?.type === 'email' ? 'Email Address' :
                        'URL'
                      ) : 'Value'}
                    </label>
                    <input
                      type={getInputType(newLink.platform)}
                      value={newLink.value}
                      onChange={(e) => setNewLink({ ...newLink, value: e.target.value })}
                      className={`block w-full rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
                        editingIndex !== null ? 'border-2 border-blue-400' : 'border-gray-300'
                      }`}
                      placeholder={getPlaceholder(newLink.platform)}
                      disabled={!newLink.platform}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    {editingIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveLink()
                          setShowQuickAddModal(false)
                        }}
                        className="flex-1 px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        handleAddOrUpdateLink()
                        setShowQuickAddModal(false)
                      }}
                      disabled={!newLink.platform || !newLink.value}
                      className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      {editingIndex !== null ? 'Update' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Popup */
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingIndex !== null ? 'Edit Social Link' : 'Add Social Link'}
                </h3>
                <button
                  onClick={() => {
                    setShowQuickAddModal(false)
                    setNewLink({ platform: '', value: '', active: true, order_index: 0 })
                    setEditingIndex(null)
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
                    Platform
                  </label>
                  {editingIndex !== null ? (
                    <div className="flex items-center gap-3 py-2">
                      <div 
                        className="w-5 h-5 text-gray-600"
                        dangerouslySetInnerHTML={{ __html: svgIcons[newLink.platform] || '' }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {socialPlatforms.find(p => p.id === newLink.platform)?.name}
                      </span>
                    </div>
                  ) : (
                    <select
                      value={newLink.platform}
                      onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    >
                      <option value="">Select...</option>
                      {socialPlatforms.filter(
                        platform => !socialLinks.some(link => link.platform === platform.id)
                      ).map(platform => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {newLink.platform && editingIndex === null && (
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-6 h-6 text-gray-600"
                      dangerouslySetInnerHTML={{ __html: svgIcons[newLink.platform] || '' }}
                    />
                    <span className="text-sm text-gray-600">
                      {socialPlatforms.find(p => p.id === newLink.platform)?.name}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newLink.platform ? (
                      socialPlatforms.find(p => p.id === newLink.platform)?.type === 'username' ? 'Username' :
                      socialPlatforms.find(p => p.id === newLink.platform)?.type === 'email' ? 'Email Address' :
                      'URL'
                    ) : 'Value'}
                  </label>
                  <input
                    type={getInputType(newLink.platform)}
                    value={newLink.value}
                    onChange={(e) => setNewLink({ ...newLink, value: e.target.value })}
                    className={`block w-full rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${
                      editingIndex !== null ? 'border-2 border-blue-400' : 'border-gray-300'
                    }`}
                    placeholder={getPlaceholder(newLink.platform)}
                    disabled={!newLink.platform}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveLink()
                        setShowQuickAddModal(false)
                      }}
                      className="flex-1 px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleAddOrUpdateLink()
                      setShowQuickAddModal(false)
                    }}
                    disabled={!newLink.platform || !newLink.value}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}