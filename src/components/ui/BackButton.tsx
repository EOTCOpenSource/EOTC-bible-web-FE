"use client"

import { useRouter } from "next/navigation"
import { Button } from "./button"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"

export default function BackButton() {
  const router = useRouter()
  const t = useTranslations("Auth")

  return (
    <div className="absolute top-4 left-4 flex items-center bg-gray-200 rounded-md">
      <Button
        variant={"ghost"}
        onClick={() => router.back()}
      >
        <ChevronLeft />
        <span className="ml-2">{t("back")}</span>
      </Button>
    </div>
  )
}