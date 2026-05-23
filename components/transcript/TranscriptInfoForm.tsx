"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEGREE_TYPE_OPTIONS } from "@/lib/constants"
import CourseGradeEditor from "./CourseGradeEditor"
import type { TranscriptFormData, TranscriptCourse } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TranscriptInfoFormProps {
  formData: TranscriptFormData
  onChange: (name: string, value: string | boolean | number) => void
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void
  onCoursesChange: (courses: TranscriptCourse[]) => void
}

/**
 * 成绩单信息表单组件
 */
export default function TranscriptInfoForm({
  formData,
  onChange,
  onFileChange,
  onCoursesChange,
}: TranscriptInfoFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // 处理Logo上传
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      if (onFileChange) {
        onFileChange(e, "universityLogo")
      }
    }
  }

  // 处理照片上传
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      if (onFileChange) {
        onFileChange(e, "studentPhoto")
      }
    }
  }

  return (
    <>
      {/* 学生信息 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>学生信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="programName">
                专业名称
              </Label>
              <Input
                id="programName"
                name="programName"
                value={formData.programName}
                onChange={(e) => onChange("programName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentName">
                院系名称
              </Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={formData.departmentName}
                onChange={(e) => onChange("departmentName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degreeType">
                学位类型
              </Label>
              <Select value={formData.degreeType} onValueChange={(value) => onChange("degreeType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择学位类型" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">
                入学日期
              </Label>
              <Input
                id="enrollmentDate"
                name="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => onChange("enrollmentDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedGraduationDate">
                预计毕业日期
              </Label>
              <Input
                id="expectedGraduationDate"
                name="expectedGraduationDate"
                type="date"
                value={formData.expectedGraduationDate}
                onChange={(e) => onChange("expectedGraduationDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 签发信息 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>签发信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">
                签发日期
              </Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => onChange("issueDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrarName">
                教务长姓名
              </Label>
              <Input
                id="registrarName"
                name="registrarName"
                value={formData.registrarName}
                onChange={(e) => onChange("registrarName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrarTitle">
                教务长职位
              </Label>
              <Input
                id="registrarTitle"
                name="registrarTitle"
                value={formData.registrarTitle}
                onChange={(e) => onChange("registrarTitle", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 课程和成绩信息 */}
      <Card>
        <CardHeader>
          <CardTitle>课程和成绩信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <CourseGradeEditor courses={formData.courses} onChange={onCoursesChange} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
