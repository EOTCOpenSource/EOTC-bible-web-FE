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
import { useAchievementsStore } from '@/stores/achievementStore'
import AchievementCard from '@/components/achievements/AchievementCard'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const ProfileMainContent = () => {
  const { user, setUser, loadSession } = useUserStore()
  const t = useTranslations('Dashboard')
  const tForms = useTranslations('Forms')
  const tCommon = useTranslations('Common')
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
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})
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

  const { achievements, loadAchievements } = useAchievementsStore()

  useEffect(() => {
    loadAchievements()
  }, [loadAchievements])

  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)

  const tierValue: Record<string, number> = { bronze: 1, silver: 2, gold: 3, platinum: 4 }

  const latestUnlocked =
    unlocked.length > 0
      ? [...unlocked].sort((a, b) => {
          if (tierValue[a.tier] !== tierValue[b.tier]) return tierValue[b.tier] - tierValue[a.tier]
          return b.target - a.target
        })[0]
      : null

  const upcoming =
    locked.length > 0
      ? [...locked].sort((a, b) => {
          const pctA = a.progressValue / a.target
          const pctB = b.progressValue / b.target
          return pctB - pctA
        })[0]
      : null

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
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to upload profile image'
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
    setTimeout(() => {
      const input = inputRefs.current[field]
      if (input) {
        input.focus()
        const len = input.value.length
        try {
          input.setSelectionRange(len, len)
        } catch (e) {
          // Ignore unsupported types like 'email'
        }
      }
    }, 0)
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    // Reset to original values
    if (user) {
      const nameParts = user.name?.split(' ') || []
      setFormData((prev) => ({
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
        setFormData((prev) => ({
          ...prev,
          newPassword: '',
          confirmPassword: '',
          password: '********',
        }))
      }
      toast.success(
        `${field === 'password' ? 'Password' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
      )

      await loadSession()
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          `Failed to update ${field}`,
      )
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
      setFormData((prev) => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
        password: '********',
      }))
      await loadSession()
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Failed to update profile',
      )
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
    placeholder?: string,
  ) => {
    const isEditing = editingField === field
    const isPasswordField = field === 'password'

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#9CA3AF] dark:text-gray-400">{label}</Label>
        <div className="relative">
          <Input
            ref={(el) => {
              inputRefs.current[field] = el as HTMLInputElement | null
            }}
            type={isPasswordField && !isEditing ? 'password' : type}
            value={isEditing && isPasswordField ? formData.newPassword : value}
            onChange={(e) => {
              if (isPasswordField && isEditing) {
                setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
              } else {
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
            }}
            placeholder={placeholder}
            className="h-10 rounded-[12px] border-none bg-[#F9FAFB] pr-10 focus-visible:ring-1 focus-visible:ring-gray-200 dark:bg-[#3D2D2D] dark:text-white dark:focus-visible:ring-gray-600"
            readOnly={!isEditing}
            disabled={isSaving}
          />
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleFieldSave(field)}
                  disabled={isSaving}
                  className="cursor-pointer text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleFieldCancel}
                  disabled={isSaving}
                  className="cursor-pointer text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleFieldEdit(field)}
                className="cursor-pointer text-[#9CA3AF] hover:text-[#6B7280]"
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              placeholder="Confirm new password"
              className="h-12 rounded-[12px] border-none bg-[#F9FAFB] focus-visible:ring-1 focus-visible:ring-gray-200 dark:bg-[#3D2D2D] dark:text-white dark:focus-visible:ring-gray-600"
              disabled={isSaving}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex h-auto min-h-[475px] w-full flex-col rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm md:w-[502px] dark:border-[#3D2D2D] dark:bg-[#2A2020]">
        <div className="mb-8 flex flex-shrink-0 flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="flex flex-shrink-0 flex-col items-center">
            <div className="group relative cursor-pointer" onClick={handleAvatarButtonClick}>
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-50 shadow-sm ring-1 ring-gray-100 dark:border-[#3D2D2D] dark:bg-neutral-700 dark:ring-neutral-600">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user?.name || 'Profile avatar'}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={36} className="text-gray-300" />
                )}
              </div>
              <button
                type="button"
                disabled={isUploading}
                className="absolute right-0 bottom-0 z-10 rounded-full border border-gray-100 bg-white p-1.5 shadow-md transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              >
                <Pencil size={12} className="text-gray-600 dark:text-gray-200" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {tCommon('edit')}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('profilePicUpdates')}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 overflow-hidden">
            {latestUnlocked && (
              <div className="-ml-2 w-[105%] origin-top-left scale-95 transform">
                <AchievementCard achievement={latestUnlocked} />
              </div>
            )}
            {upcoming && (
              <div className="-ml-2 w-[105%] origin-top-left scale-95 transform md:mt-[-10px]">
                <AchievementCard achievement={upcoming} />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderEditableField('firstName', tForms('firstName'), formData.firstName)}
          {renderEditableField('lastName', tForms('lastName'), formData.lastName)}
        </div>

        <div className="mb-4 space-y-4">
          {renderEditableField('email', tForms('email'), formData.email, 'email')}
        </div>

        <div className="mb-6 space-y-4">
          {renderEditableField('password', tForms('password'), formData.password, 'password')}
        </div>

        <div className="mt-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex h-[42px] w-[152px] items-center justify-between gap-[6px] overflow-hidden rounded-[8px] bg-[#392D2D] py-[5px] pr-[4px] pl-[10px] text-sm font-medium text-white transition-all hover:bg-[#1A1A19] disabled:opacity-50"
          >
            {isSaving ? tCommon('loading') : t('saveChanges')}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-white text-[#392D2D]">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            className="flex h-[42px] w-[155px] items-center justify-between gap-[6px] overflow-hidden rounded-[8px] border border-[#621B1C] bg-white py-[5px] pr-[4px] pl-[10px] text-sm font-medium text-[#621B1C] transition-all hover:bg-neutral-50 disabled:opacity-50 dark:bg-transparent dark:text-red-400 dark:hover:bg-[#3D2D2D]"
          >
            {t('deleteAccount')}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#621B1C] text-white">
              <Trash2 size={18} strokeWidth={2.5} />
            </div>
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteAccount')}</DialogTitle>
            <DialogDescription>{t('confirmDeleteAccount')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {tCommon('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? tCommon('loading') : t('deleteAccount')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
