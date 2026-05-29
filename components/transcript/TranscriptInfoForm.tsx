"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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

export default function TranscriptInfoForm({
  formData,
  onChange,
  onFileChange,
  onCoursesChange,
}: TranscriptInfoFormProps) {
  return (
    <>
      {/* Student Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degreeType">Degree Type</Label>
              <Select value={formData.degreeType} onValueChange={(v) => onChange("degreeType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date</Label>
              <Input
                id="enrollmentDate"
                name="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => onChange("enrollmentDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedGraduationDate">Expected Graduation</Label>
              <Input
                id="expectedGraduationDate"
                name="expectedGraduationDate"
                type="date"
                value={formData.expectedGraduationDate}
                onChange={(e) => onChange("expectedGraduationDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicStanding">Academic Standing</Label>
              <Input
                id="academicStanding"
                name="academicStanding"
                value={formData.academicStanding}
                onChange={(e) => onChange("academicStanding", e.target.value)}
                placeholder="e.g., Good Standing"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "showGradePoints", label: "Show Grade Points" },
            { id: "showGradeScale", label: "Show Grading Scale" },
            { id: "showSemesterGPA", label: "Show Semester GPA" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center justify-between">
              <Label htmlFor={id}>{label}</Label>
              <Switch
                id={id}
                checked={formData[id as keyof TranscriptFormData] as boolean}
                onCheckedChange={(v) => onChange(id, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Issuance Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Issuance Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => onChange("issueDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrarName">Registrar Name</Label>
              <Input
                id="registrarName"
                name="registrarName"
                value={formData.registrarName || ""}
                onChange={(e) => onChange("registrarName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrarTitle">Registrar Title</Label>
              <Input
                id="registrarTitle"
                name="registrarTitle"
                value={formData.registrarTitle || ""}
                onChange={(e) => onChange("registrarTitle", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseGradeEditor courses={formData.courses} onChange={onCoursesChange} />
        </CardContent>
      </Card>
    </>
  )
}
