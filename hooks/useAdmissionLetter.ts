"use client"

import type React from "react"

import { useState } from "react"
import type { AdmissionLetterFormData } from "@/lib/types"
import { DEFAULT_ADMISSION_LETTER_DATA } from "@/lib/constants"

import { useGlobalProfile } from "@/context/GlobalProfileContext"
import { generateDeterministicName } from "@/lib/utils"
import { useEffect } from "react"

/**
 * 录取通知书状态管理Hook
 */
export const useAdmissionLetter = (initialData: AdmissionLetterFormData = DEFAULT_ADMISSION_LETTER_DATA) => {
  // 表单数据状态
  const [formData, setFormData] = useState<AdmissionLetterFormData>(initialData)

  // 表单错误状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { profile, updateProfile } = useGlobalProfile()

  // Sync from global profile
  useEffect(() => {
    setFormData((prev) => {
      let changed = false
      const updated = { ...prev }

      if (profile.universityName !== undefined && profile.universityName !== prev.universityName) { 
        updated.universityName = profile.universityName; 
        updated.signatoryName = generateDeterministicName(profile.universityName)
        changed = true 
      }
      if (profile.universityLogo !== undefined && profile.universityLogo !== prev.universityLogo) { updated.universityLogo = profile.universityLogo; changed = true }
      if (profile.universityAddress !== undefined && profile.universityAddress !== prev.universityAddress) { updated.universityAddress = profile.universityAddress; changed = true }
      if (profile.universityContact !== undefined && profile.universityContact !== prev.universityContact) { updated.universityContact = profile.universityContact; changed = true }
      if (profile.universityWebsite !== undefined && profile.universityWebsite !== prev.universityWebsite) { updated.universityWebsite = profile.universityWebsite; changed = true }
      if (profile.fullName !== undefined && profile.fullName !== prev.studentName) { updated.studentName = profile.fullName; changed = true }
      if (profile.studentId !== undefined && profile.studentId !== prev.studentId) { updated.studentId = profile.studentId; changed = true }
      if (profile.faculty !== undefined && profile.faculty !== prev.departmentName) { updated.departmentName = profile.faculty; changed = true }
      if (profile.major !== undefined && profile.major !== prev.programName) { updated.programName = profile.major; changed = true }

      return changed ? updated : prev
    })
  }, [profile])

  // 处理输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // 处理复选框
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
      return
    }

    // 处理其他输入
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Sync to global
    if (name === "universityName") updateProfile("universityName", value)
    if (name === "universityAddress") updateProfile("universityAddress", value)
    if (name === "universityContact") updateProfile("universityContact", value)
    if (name === "universityWebsite") updateProfile("universityWebsite", value)
    if (name === "studentName") updateProfile("fullName", value)
    if (name === "studentId") updateProfile("studentId", value)
    if (name === "departmentName") updateProfile("faculty", value)
    if (name === "programName") updateProfile("major", value)

    // 清除错误
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target?.result as string,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  // 重置表单
  const resetForm = () => {
    setFormData(DEFAULT_ADMISSION_LETTER_DATA)
    setFormErrors({})
  }

  // 验证表单
  const validateForm = () => {
    const errors: Record<string, string> = {}

    // 必填字段验证
    const requiredFields = ["universityName", "studentName", "programName", "departmentName", "letterContent"]

    requiredFields.forEach((field) => {
      if (!formData[field as keyof AdmissionLetterFormData]) {
        errors[field] = "此字段为必填项"
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  return {
    formData,
    formErrors,
    handleInputChange,
    handleFileChange,
    resetForm,
    validateForm,
    setFormData,
  }
}
