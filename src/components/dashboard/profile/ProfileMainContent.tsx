'use client'

import { ChangeEvent, useRef, useState, useEffect } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { User, Pencil, ArrowUpRight, Trash2, X, Check } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ProfileMainContent() {
  const { user, setUser, loadSession } = useUserStore()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || []
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        password: '********',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [user])

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setIsUploading(true)
    try {
      const res = await axiosInstance.post('/api/auth/avatar', formData)

      const updatedUser = res.data?.user || res.data?.data?.user
      if (updatedUser) {
        setUser(updatedUser)
        toast.success('Profile image updated successfully')
      } else {
        toast.success('Profile image updated')
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      const message = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to upload profile image'
      toast.error(message)
    } finally {
      setIsUploading(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleFieldEdit = (field: string) => {
    setEditingField(field)
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    // Reset to original values
    if (user) {
      const nameParts = user.name?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        password: '********',
        newPassword: '',
        confirmPassword: '',
      }))
    }
  }

  const handleFieldSave = async (field: string) => {
    if (field === 'password') {
      if (!formData.newPassword) {
        toast.error('Please enter a new password')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      if (formData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters')
        return
      }
    }

    setIsSaving(true)
    try {
      const updateData: any = {}
      
      if (field === 'firstName' || field === 'lastName') {
        updateData.name = `${formData.firstName} ${formData.lastName}`.trim()
      } else if (field === 'email') {
        updateData.email = formData.email
      } else if (field === 'password' && formData.newPassword) {
        updateData.password = formData.newPassword
      }

      const res = await axiosInstance.put('/api/auth/profile', updateData)
      
      const updatedUser = res.data?.user || res.data?.data?.user
      if (updatedUser) {
        setUser(updatedUser)
      }
      
      setEditingField(null)
      if (field === 'password') {
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: '',
          password: '********',
        }))
      }
      toast.success(`${field === 'password' ? 'Password' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`)
      
      await loadSession()
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error?.response?.data?.error || error?.response?.data?.message || `Failed to update ${field}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveChanges = async () => {
     setIsSaving(true)
    try {
      const updateData: any = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setIsSaving(false)
          return
        }
        if (formData.newPassword.length < 8) {
          toast.error('Password must be at least 8 characters')
          setIsSaving(false)
          return
        }
        updateData.password = formData.newPassword
      }

      const res = await axiosInstance.put('/api/auth/profile', updateData)
      
      const updatedUser = res.data?.user || res.data?.data?.user
      if (updatedUser) {
        setUser(updatedUser)
      }
      
      toast.success('Profile updated successfully')
      setEditingField(null)
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
        password: '********',
      }))
      await loadSession()
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error?.response?.data?.error || error?.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await axiosInstance.delete('/api/auth/delete-account')
      toast.success('Account deleted successfully')
      router.push('/login')
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error?.response?.data?.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const renderEditableField = (
    field: string,
    label: string,
    value: string,
    type: string = 'text',
    placeholder?: string
  ) => {
    const isEditing = editingField === field
    const isPasswordField = field === 'password'

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#9CA3AF]">{label}</Label>
        <div className="relative">
          <Input
            type={isPasswordField && !isEditing ? 'password' : type}
            value={isEditing && isPasswordField ? formData.newPassword : value}
            onChange={(e) => {
              if (isPasswordField && isEditing) {
                setFormData(prev => ({ ...prev, newPassword: e.target.value }))
              } else {
                setFormData(prev => ({ ...prev, [field]: e.target.value }))
              }
            }}
            placeholder={placeholder}
            className="bg-[#F9FAFB] border-none h-12 rounded-[12px] pr-10 focus-visible:ring-1 focus-visible:ring-gray-200"
            readOnly={!isEditing}
            disabled={isSaving}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleFieldSave(field)}
                  disabled={isSaving}
                  className="text-green-600 hover:text-green-700 cursor-pointer disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleFieldCancel}
                  disabled={isSaving}
                  className="text-red-600 hover:text-red-700 cursor-pointer disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleFieldEdit(field)}
                className="text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        </div>
        {isPasswordField && isEditing && (
          <>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              className="bg-[#F9FAFB] border-none h-12 rounded-[12px] focus-visible:ring-1 focus-visible:ring-gray-200"
              disabled={isSaving}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 bg-white rounded-[24px] p-8 border border-[#E5E7EB] shadow-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user?.name || 'Profile avatar'}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={48} className="text-gray-300" />
              )}
            </div>
            <button
              type="button"
              onClick={handleAvatarButtonClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-[#E5E7EB] shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-70"
            >
              <Pencil size={14} className="text-[#6B7280]" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="mt-3 text-sm font-medium text-[#6B7280]">Change your profile picture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderEditableField('firstName', 'First Name', formData.firstName)}
          {renderEditableField('lastName', 'Last Name', formData.lastName)}
        </div>

        <div className="space-y-2 mb-8">
          {renderEditableField('email', 'Email Address', formData.email, 'email')}
        </div>

        <div className="space-y-2 mb-12">
          {renderEditableField('password', 'Password', formData.password, 'password')}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#5C1616] hover:bg-[#4A1111] text-white px-8 py-6 rounded-[12px] font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
            <ArrowUpRight size={20} />
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            className="w-full sm:w-auto border-[#E5E7EB] text-[#5C1616] hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-8 py-6 rounded-[12px] font-bold flex items-center gap-2 transition-all group"
          >
            Delete Account
            <Trash2 size={20} className="text-[#5C1616] group-hover:text-red-600" />
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including highlights, notes, bookmarks, and reading progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
