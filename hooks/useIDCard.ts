"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"
import type { IDCardFormData, CardStyle } from "@/lib/types"
import { DEFAULT_FORM_DATA, DEFAULT_CARD_STYLE } from "@/lib/constants"
import { calculateExpiryYear, validateFormData } from "@/lib/utils"

import { useGlobalProfile } from "@/context/GlobalProfileContext"

export const useIDCard = (initialData: IDCardFormData = DEFAULT_FORM_DATA) => {
  // Card form data
  const [formData, setFormData] = useState<IDCardFormData>(initialData)

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Card style
  const [cardStyle, setCardStyle] = useState<CardStyle>(DEFAULT_CARD_STYLE)

  const { profile, updateProfile } = useGlobalProfile()

  // Sync from global profile
  useEffect(() => {
    setFormData((prev) => {
      let changed = false
      const updated = { ...prev }

      if (profile.universityName !== undefined && profile.universityName !== prev.universityName) { updated.universityName = profile.universityName; changed = true }
      if (profile.universityLogo !== undefined && profile.universityLogo !== prev.logo) { updated.logo = profile.universityLogo; changed = true }
      if (profile.universityAddress !== undefined && profile.universityAddress !== prev.universityAddress) { updated.universityAddress = profile.universityAddress; changed = true }
      if (profile.universityWebsite !== undefined && profile.universityWebsite !== prev.universityWebsite) { updated.universityWebsite = profile.universityWebsite; changed = true }
      if (profile.universityContact !== undefined && profile.universityContact !== prev.universityContact) { updated.universityContact = profile.universityContact; changed = true }
      if (profile.fullName !== undefined && profile.fullName !== prev.fullName) { updated.fullName = profile.fullName; changed = true }
      if (profile.studentId !== undefined && profile.studentId !== prev.studentId) { updated.studentId = profile.studentId; changed = true }
      if (profile.faculty !== undefined && profile.faculty !== prev.faculty) { updated.faculty = profile.faculty; changed = true }
      if (profile.studentPhoto !== undefined && profile.studentPhoto !== prev.photo) { updated.photo = profile.studentPhoto; changed = true }
      if (profile.cardBackgroundImage !== undefined && profile.cardBackgroundImage !== prev.backgroundImage) { updated.backgroundImage = profile.cardBackgroundImage; changed = true }

      return changed ? updated : prev
    })
  }, [profile])

  // Barcode references
  const barcodeRefs = {
    modern: useRef<SVGSVGElement>(null),
    classic: useRef<SVGSVGElement>(null),
    minimal: useRef<SVGSVGElement>(null),
    landscape: useRef<SVGSVGElement>(null),
  }

  // Validate form data
  useEffect(() => {
    setFormErrors(validateFormData(formData))
  }, [formData])

  // Generate barcode
  useEffect(() => {
    if (formData.codeType === "barcode" || formData.orientation === "landscape") {
      const studentId = formData.studentId || "S12345678"

      // Generate barcodes for various styles
      generateBarcode(barcodeRefs.modern.current, studentId, {
        width: 2,
        height: 40,
        fontSize: 12,
        displayValue: true,
      })

      generateBarcode(barcodeRefs.classic.current, studentId, {
        width: 1.5,
        height: 30,
        fontSize: 10,
        displayValue: true,
      })

      generateBarcode(barcodeRefs.minimal.current, studentId, {
        width: 2,
        height: 40,
        fontSize: 12,
        displayValue: true,
      })

      generateBarcode(barcodeRefs.landscape.current, studentId, {
        width: 1.5,
        height: 24,
        fontSize: 10,
        displayValue: false,
        textMargin: 0,
      })
    }
  }, [formData.studentId, formData.codeType, formData.orientation, cardStyle])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }

      // When enrollment year changes, automatically infer expiry time
      if (name === "enrollmentYear") {
        const year = Number.parseInt(value as string)
        if (!isNaN(year)) {
          const expiryYear = calculateExpiryYear(year, prev.programType)
          updated.validityEnd = `${expiryYear}-06`
        }
      }

      return updated
    })

    // Sync to global
    if (name === "universityName") updateProfile("universityName", value)
    if (name === "universityAddress") updateProfile("universityAddress", value)
    if (name === "universityWebsite") updateProfile("universityWebsite", value)
    if (name === "universityContact") updateProfile("universityContact", value)
    if (name === "fullName") updateProfile("fullName", value)
    if (name === "studentId") updateProfile("studentId", value)
    if (name === "faculty") updateProfile("faculty", value)
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }

      // When program type changes, automatically infer expiry time
      if (name === "programType" && typeof value === "string") {
        const enrollmentYear = Number.parseInt(prev.enrollmentYear)
        if (!isNaN(enrollmentYear)) {
          const expiryYear = calculateExpiryYear(enrollmentYear, value)
          updated.validityEnd = `${expiryYear}-06`
        }
      }

      return updated
    })

    if (name === "universityName" && typeof value === "string") updateProfile("universityName", value)
    if (name === "faculty" && typeof value === "string") updateProfile("faculty", value)
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFormData((prev) => ({ ...prev, [field]: result }))
        
        if (field === "logo") updateProfile("universityLogo", result)
        if (field === "photo") updateProfile("studentPhoto", result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA)
    setFormErrors({})
  }

  // Download card
  const downloadCard = async (quality: string) => {
    const cardElement = document.getElementById("student-card")
    if (!cardElement) return

    try {
      // Set scale based on export quality
      let scaleValue = 2
      switch (quality) {
        case "low":
          scaleValue = 2
          break
        case "medium":
          scaleValue = 3
          break
        case "high":
          scaleValue = 4
          break
        case "ultra":
          scaleValue = 6
          break
        default:
          scaleValue = 4
      }

      // 动态导入html2canvas
      const html2canvasModule = await import("html2canvas")
      const html2canvas = html2canvasModule.default

      // 捕获卡片元素
      const canvas = await html2canvas(cardElement, {
        scale: scaleValue, // 根据用户选择的质量设置缩放参数
        useCORS: true, // 允许加载跨域图像
        backgroundColor: null, // 保持背景透明
        logging: false, // 关闭日志
        allowTaint: true, // 允许污染画布
        scrollY: -window.scrollY, // 确保捕获整个内容，即使有滚动
      })

      // 创建下载链接
      const link = document.createElement("a")

      // 将canvas转换为dataURL
      const image = canvas.toDataURL("image/png")

      // 设置下载属性
      link.href = image
      link.download = `student-id-${formData.studentId || "card"}.png`

      // 触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error generating image:", err)
      alert("无法生成图片，请稍后再试")
    }
  }

  // 辅助函数：生成条形码
  const generateBarcode = (barcodeRef: SVGSVGElement | null, value: string, options: any) => {
    if (barcodeRef) {
      try {
        JsBarcode(barcodeRef, value, {
          format: "CODE128",
          lineColor: "#000",
          ...options,
          margin: 0,
          background: "transparent",
        })
      } catch (e) {
        console.error("Error generating barcode:", e)
      }
    }
  }

  return {
    formData,
    formErrors,
    cardStyle,
    barcodeRefs,
    setFormData,
    setCardStyle,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    resetForm,
    downloadCard,
  }
}
