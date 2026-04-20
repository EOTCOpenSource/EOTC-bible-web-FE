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

  const unlocked = achievements.filter(a => a.unlocked)
  const locked = achievements.filter(a => !a.unlocked)

  const tierValue: Record<string, number> = { bronze: 1, silver: 2, gold: 3, platinum: 4 }

  const latestUnlocked = unlocked.length > 0
    ? [...unlocked].sort((a, b) => {
      if (tierValue[a.tier] !== tierValue[b.tier]) return tierValue[b.tier] - tierValue[a.tier]
      return b.target - a.target
    })[0]
    : null

  const upcoming = locked.length > 0
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
        <Label className="text-sm font-medium text-[#9CA3AF] dark:text-gray-400">{label}</Label>
        <div className="relative">
          <Input
            ref={(el) => { inputRefs.current[field] = el as HTMLInputElement | null }}
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
            className="bg-[#F9FAFB] dark:bg-[#3D2D2D] dark:text-white border-none h-10 rounded-[12px] pr-10 focus-visible:ring-1 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-600"
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
              className="bg-[#F9FAFB] dark:bg-[#3D2D2D] dark:text-white border-none h-12 rounded-[12px] focus-visible:ring-1 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-600"
              disabled={isSaving}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="w-full md:w-[502px] min-h-[475px] h-auto bg-white dark:bg-[#2A2020] rounded-[20px] p-6 border border-gray-100 dark:border-[#3D2D2D] shadow-sm flex flex-col">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 flex-shrink-0">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative group cursor-pointer" onClick={handleAvatarButtonClick}>
              <div className="h-20 w-20 rounded-full bg-gray-50 dark:bg-neutral-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-[#3D2D2D] shadow-sm ring-1 ring-gray-100 dark:ring-neutral-600">
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
                className="absolute bottom-0 right-0 bg-white dark:bg-neutral-700 p-1.5 rounded-full border border-gray-100 dark:border-neutral-600 shadow-md hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors z-10"
              >
                <Pencil size={12} className="text-gray-600 dark:text-gray-200" />
              </button>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-[10px]">
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
            <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{t('profilePicUpdates')}</p>
          </div>

          <div className="flex flex-col w-full gap-3 overflow-hidden">
            {latestUnlocked && (
              <div className="transform scale-95 origin-top-left -ml-2 w-[105%]">
                <AchievementCard achievement={latestUnlocked} />
              </div>
            )}
            {upcoming && (
              <div className="transform scale-95 origin-top-left -ml-2 w-[105%] md:mt-[-10px]">
                <AchievementCard achievement={upcoming} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {renderEditableField('firstName', tForms('firstName'), formData.firstName)}
          {renderEditableField('lastName', tForms('lastName'), formData.lastName)}
        </div>

        <div className="space-y-4 mb-4">
          {renderEditableField('email', tForms('email'), formData.email, 'email')}
        </div>

        <div className="space-y-4 mb-6">
          {renderEditableField('password', tForms('password'), formData.password, 'password')}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-[152px] h-[42px] bg-[#392D2D] hover:bg-[#1A1A19] text-white pl-[10px] pr-[4px] py-[5px] rounded-[8px] gap-[6px] font-medium flex items-center justify-between transition-all disabled:opacity-50 text-sm overflow-hidden"
          >
            {isSaving ? tCommon('loading') : t('saveChanges')}
            <div className="bg-white rounded-[6px] h-8 w-8 flex items-center justify-center text-[#392D2D] shrink-0">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            className="w-[155px] h-[42px] bg-white dark:bg-transparent border border-[#621B1C] hover:bg-neutral-50 dark:hover:bg-[#3D2D2D] text-[#621B1C] dark:text-red-400 pl-[10px] pr-[4px] py-[5px] rounded-[8px] gap-[6px] font-medium flex items-center justify-between transition-all disabled:opacity-50 text-sm overflow-hidden"
          >
            {t('deleteAccount')}
            <div className="bg-[#621B1C] rounded-[6px] h-8 w-8 flex items-center justify-center text-white shrink-0">
              <Trash2 size={18} strokeWidth={2.5} />
            </div>
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteAccount')}</DialogTitle>
            <DialogDescription>
              {t('confirmDeleteAccount')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
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
