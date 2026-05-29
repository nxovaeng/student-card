"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { ScheduleFormData, ScheduleCourse } from "@/lib/types"
import { DEFAULT_SCHEDULE_DATA } from "@/lib/constants"
import { v4 as uuidv4 } from "uuid"

import { useGlobalProfile } from "@/context/GlobalProfileContext"

export const useSchedule = (initialData: ScheduleFormData = DEFAULT_SCHEDULE_DATA) => {
  const [formData, setFormData] = useState<ScheduleFormData>(initialData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [editingCourse, setEditingCourse] = useState<ScheduleCourse | null>(null)

  const { profile, updateProfile } = useGlobalProfile()

  // Sync from global profile
  useEffect(() => {
    setFormData((prev) => {
      let changed = false
      const updated = { ...prev }

      if (profile.universityName !== undefined && profile.universityName !== prev.universityName) { updated.universityName = profile.universityName; changed = true }
      if (profile.universityLogo !== undefined && profile.universityLogo !== prev.universityLogo) { updated.universityLogo = profile.universityLogo; changed = true }
      if (profile.fullName !== undefined && profile.fullName !== prev.fullName) { updated.fullName = profile.fullName; changed = true }
      if (profile.studentId !== undefined && profile.studentId !== prev.studentId) { updated.studentId = profile.studentId; changed = true }
      if (profile.faculty !== undefined && profile.faculty !== prev.department) { updated.department = profile.faculty; changed = true }
      if (profile.major !== undefined && profile.major !== prev.major) { updated.major = profile.major; changed = true }

      return changed ? updated : prev
    })
  }, [profile])

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // 处理复选框
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }))
      return
    }

    // 处理数字输入
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseInt(value, 10),
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
    if (name === "fullName") updateProfile("fullName", value)
    if (name === "studentId") updateProfile("studentId", value)
    if (name === "department") updateProfile("faculty", value)
    if (name === "major") updateProfile("major", value)
  }

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setFormData((prev) => ({
        ...prev,
        [field]: result,
      }))

      if (field === "universityLogo") updateProfile("universityLogo", result)
    }
    reader.readAsDataURL(file)
  }

  // 添加新课程
  const addCourse = () => {
    const newCourse: ScheduleCourse = {
      id: uuidv4(),
      courseCode: "",
      courseName: "",
      instructor: "",
      credits: 3,
      location: "",
      building: "",
      room: "",
      startTime: "",
      endTime: "",
      days: [],
      color: "#3b82f6",
      mode: "In-Person",
      type: "Lecture",
      notes: "",
    }

    setEditingCourse(newCourse)
  }

  // 开始编辑课程
  const editCourse = (courseId: string) => {
    const course = formData.courses.find((c) => c.id === courseId)
    if (course) {
      setEditingCourse({ ...course })
    }
  }

  // 保存课程
  const saveCourse = (course: ScheduleCourse) => {
    const isNew = !formData.courses.some((c) => c.id === course.id)

    if (isNew) {
      setFormData((prev) => ({
        ...prev,
        courses: [...prev.courses, course],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => (c.id === course.id ? course : c)),
      }))
    }

    setEditingCourse(null)
  }

  // 取消编辑课程
  const cancelEditCourse = () => {
    setEditingCourse(null)
  }

  // 删除课程
  const deleteCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((course) => course.id !== courseId),
    }))
  }

  // 重置表单
  const resetForm = () => {
    setFormData(DEFAULT_SCHEDULE_DATA)
    setFormErrors({})
  }

  // 验证表单
  useEffect(() => {
    const errors: Record<string, string> = {}

    if (!formData.fullName) {
      errors.fullName = "Student name is required"
    }

    if (!formData.studentId) {
      errors.studentId = "Student ID is required"
    }

    if (!formData.universityName) {
      errors.universityName = "University name is required"
    }

    setFormErrors(errors)
  }, [formData])

  return {
    formData,
    formErrors,
    editingCourse,
    handleInputChange,
    handleFileChange,
    addCourse,
    editCourse,
    saveCourse,
    cancelEditCourse,
    deleteCourse,
    resetForm,
    // Directly replace the courses array (used by template loader)
    setCourses: (courses: ScheduleCourse[]) => {
      setFormData((prev) => ({ ...prev, courses }))
    },
  }
}
