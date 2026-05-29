"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { CertificateFormData } from "@/lib/types"
import { DEFAULT_CERTIFICATE_DATA } from "@/lib/constants"

import { useGlobalProfile } from "@/context/GlobalProfileContext"

export const useCertificate = (initialData: CertificateFormData = DEFAULT_CERTIFICATE_DATA) => {
  // 证书表单数据
  const [formData, setFormData] = useState<CertificateFormData>(initialData)

  // 表单错误
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { profile, updateProfile } = useGlobalProfile()

  // Sync from global profile
  useEffect(() => {
    setFormData((prev) => {
      let changed = false
      const updated = { ...prev }

      if (profile.universityName !== undefined && profile.universityName !== prev.universityName) { updated.universityName = profile.universityName; changed = true }
      if (profile.universityLogo !== undefined && profile.universityLogo !== prev.universityLogo) { updated.universityLogo = profile.universityLogo; changed = true }
      if (profile.fullName !== undefined && profile.fullName !== prev.fullName) { updated.fullName = profile.fullName; changed = true }
      if (profile.birthDate !== undefined && profile.birthDate !== prev.birthDate) { updated.birthDate = profile.birthDate; changed = true }
      if (profile.studentId !== undefined && profile.studentId !== prev.studentId) { updated.studentId = profile.studentId; changed = true }
      if (profile.faculty !== undefined && profile.faculty !== prev.faculty) { updated.faculty = profile.faculty; changed = true }
      if (profile.major !== undefined && profile.major !== prev.major) { updated.major = profile.major; changed = true }
      if (profile.studentPhoto !== undefined && profile.studentPhoto !== prev.studentPhoto) { updated.studentPhoto = profile.studentPhoto; changed = true }

      return changed ? updated : prev
    })
  }, [profile])

  // 验证表单数据
  useEffect(() => {
    setFormErrors(validateCertificateData(formData))
  }, [formData])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Sync to global
    if (name === "universityName") updateProfile("universityName", value)
    if (name === "fullName") updateProfile("fullName", value)
    if (name === "studentId") updateProfile("studentId", value)
    if (name === "faculty") updateProfile("faculty", value)
    if (name === "major") updateProfile("major", value)
  }

  // 处理选择变化
  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "universityName" && typeof value === "string") updateProfile("universityName", value)
    if (name === "faculty" && typeof value === "string") updateProfile("faculty", value)
    if (name === "major" && typeof value === "string") updateProfile("major", value)
  }

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFormData((prev) => ({ ...prev, [field]: result }))

        if (field === "universityLogo") updateProfile("universityLogo", result)
        if (field === "studentPhoto") updateProfile("studentPhoto", result)
      }
      reader.readAsDataURL(file)
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData(DEFAULT_CERTIFICATE_DATA)
    setFormErrors({})
  }

  // 下载证书
  const downloadCertificate = async (quality: string) => {
    const certificateElement = document.getElementById("certificate-preview")
    if (!certificateElement) return

    try {
      // Use DPI-based export: A4 portrait = 210 × 297 mm
      const { exportElementToPng } = await import("@/lib/utils")
      await exportElementToPng(
        certificateElement,
        210,  // A4 width mm
        297,  // A4 height mm
        quality,
        `enrollment-certificate-${formData.studentId || "student"}`,
        formData.paperColor || "#ffffff",
      )
    } catch (err) {
      console.error("Error generating image:", err)
      alert("Unable to generate image, please try again later.")
    }
  }

  // 验证证书数据
  const validateCertificateData = (data: CertificateFormData): Record<string, string> => {
    const errors: Record<string, string> = {}

    // 必填字段验证
    if (!data.fullName) errors.fullName = "必填项"
    if (!data.studentId) errors.studentId = "必填项"
    if (!data.universityName) errors.universityName = "必填项"
    if (!data.faculty) errors.faculty = "必填项"
    if (!data.major) errors.major = "必填项"
    if (!data.degreeType) errors.degreeType = "必填项"
    if (!data.studyMode) errors.studyMode = "必填项"
    if (!data.enrollmentDate) errors.enrollmentDate = "必填项"
    if (!data.expectedGraduationDate) errors.expectedGraduationDate = "必填项"
    if (!data.issueDate) errors.issueDate = "必填项"

    return errors
  }

  return {
    formData,
    formErrors,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    resetForm,
    downloadCertificate,
  }
}
