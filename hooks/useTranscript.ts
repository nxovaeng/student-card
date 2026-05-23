"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { TranscriptFormData, TranscriptCourse } from "@/lib/types"
import { DEFAULT_TRANSCRIPT_DATA, GRADE_POINTS } from "@/lib/constants"

import { useGlobalProfile } from "@/context/GlobalProfileContext"
import { useEffect } from "react"

/**
 * 成绩单状态管理Hook
 */
export const useTranscript = (initialData: TranscriptFormData = DEFAULT_TRANSCRIPT_DATA) => {
  const [formData, setFormData] = useState<TranscriptFormData>(initialData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { profile, updateProfile } = useGlobalProfile()

  // Sync from global profile
  useEffect(() => {
    setFormData((prev) => {
      let changed = false
      const updated = { ...prev }

      if (profile.universityName && profile.universityName !== prev.universityName) { updated.universityName = profile.universityName; changed = true }
      if (profile.universityLogo && profile.universityLogo !== prev.universityLogo) { updated.universityLogo = profile.universityLogo; changed = true }
      if (profile.universityAddress && profile.universityAddress !== prev.universityAddress) { updated.universityAddress = profile.universityAddress; changed = true }
      if (profile.universityContact && profile.universityContact !== prev.universityContact) { updated.universityContact = profile.universityContact; changed = true }
      if (profile.universityWebsite && profile.universityWebsite !== prev.universityWebsite) { updated.universityWebsite = profile.universityWebsite; changed = true }
      if (profile.fullName && profile.fullName !== prev.studentName) { updated.studentName = profile.fullName; changed = true }
      if (profile.studentId && profile.studentId !== prev.studentId) { updated.studentId = profile.studentId; changed = true }
      if (profile.faculty && profile.faculty !== prev.departmentName) { updated.departmentName = profile.faculty; changed = true }
      if (profile.major && profile.major !== prev.programName) { updated.programName = profile.major; changed = true }
      if (profile.studentPhoto && profile.studentPhoto !== prev.studentPhoto) { updated.studentPhoto = profile.studentPhoto; changed = true }

      return changed ? updated : prev
    })
  }, [profile])

  // 处理表单字段变更
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target
      const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }))

      // Sync to global
      if (typeof newValue === "string") {
        if (name === "universityName") updateProfile("universityName", newValue)
        if (name === "universityAddress") updateProfile("universityAddress", newValue)
        if (name === "universityContact") updateProfile("universityContact", newValue)
        if (name === "universityWebsite") updateProfile("universityWebsite", newValue)
        if (name === "studentName") updateProfile("fullName", newValue)
        if (name === "studentId") updateProfile("studentId", newValue)
        if (name === "departmentName") updateProfile("faculty", newValue)
        if (name === "programName") updateProfile("major", newValue)
      }

      // 清除该字段的错误
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [formErrors, updateProfile],
  )

  // 处理文件上传
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const result = event.target?.result as string
        setFormData((prev) => ({
          ...prev,
          [field]: result,
        }))

        if (field === "universityLogo") updateProfile("universityLogo", result)
        if (field === "studentPhoto") updateProfile("studentPhoto", result)
      }
    }
    reader.readAsDataURL(file)
  }, [updateProfile])

  // 处理课程变更
  const handleCoursesChange = useCallback((courses: TranscriptCourse[]) => {
    setFormData((prev) => {
      // 计算总学分和已完成学分
      const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
      const completedCredits = courses
        .filter((course) => course.completed)
        .reduce((sum, course) => sum + course.credits, 0)

      // 计算GPA
      let totalGradePoints = 0
      let totalGradeCredits = 0

      courses.forEach((course) => {
        if (course.completed && GRADE_POINTS[course.grade as keyof typeof GRADE_POINTS] !== null) {
          const gradePoint = GRADE_POINTS[course.grade as keyof typeof GRADE_POINTS] || 0
          totalGradePoints += gradePoint * course.credits
          totalGradeCredits += course.credits
        }
      })

      const currentGPA = totalGradeCredits > 0 ? (totalGradePoints / totalGradeCredits).toFixed(2) : "0.00"

      return {
        ...prev,
        courses,
        totalCredits,
        completedCredits,
        currentGPA,
      }
    })
  }, [])

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData(initialData)
    setFormErrors({})
  }, [initialData])

  // 直接设置字段值
  const setFieldValue = useCallback((name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  return {
    formData,
    formErrors,
    handleInputChange,
    handleFileChange,
    handleCoursesChange,
    resetForm,
    setFieldValue,
  }
}
