"use client"

import { useState } from "react"
import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import PreviewContainer from "@/components/common/PreviewContainer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPORT_QUALITY_OPTIONS, GRADE_POINTS } from "@/lib/constants"
import { hexToRgba } from "@/lib/utils"
import type { TranscriptFormData, TranscriptCourse } from "@/lib/types"

interface TranscriptPreviewProps {
  formData: TranscriptFormData
  onChange: (name: string, value: string | boolean | number) => void
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void
  onDownload?: (quality: string) => void
  previewRef?: React.RefObject<HTMLDivElement>
}

export default function TranscriptPreview({ formData, onChange, onDownload, previewRef }: TranscriptPreviewProps) {
  const [exportQuality, setExportQuality] = useState("high")
  const localRef = useRef<HTMLDivElement>(null)
  const finalRef = previewRef || localRef

  // ── GPA helpers ────────────────────────────────────────────────────────────
  const getGradePoint = (grade: string) => {
    const p = GRADE_POINTS[grade as keyof typeof GRADE_POINTS]
    return p !== null && p !== undefined ? p.toFixed(1) : "—"
  }

  const calcSemGPA = (courses: TranscriptCourse[], sem: string, yr: string) => {
    const sc = courses.filter((c) => c.semester === sem && c.academicYear === yr && c.completed)
    let pts = 0, creds = 0
    sc.forEach((c) => {
      const gp = GRADE_POINTS[c.grade as keyof typeof GRADE_POINTS]
      if (gp !== null && gp !== undefined) { pts += gp * c.credits; creds += c.credits }
    })
    return creds > 0 ? (pts / creds).toFixed(2) : "N/A"
  }

  const getSemCombos = (courses: TranscriptCourse[]) => {
    const seen = new Set<string>()
    const out: { semester: string; academicYear: string }[] = []
    courses.forEach((c) => {
      const key = `${c.academicYear}|${c.semester}`
      if (!seen.has(key)) { seen.add(key); out.push({ semester: c.semester, academicYear: c.academicYear }) }
    })
    const order: Record<string, number> = { Fall: 0, Spring: 1, Summer: 2, Winter: 3 }
    return out.sort((a, b) => {
      const yr = a.academicYear.localeCompare(b.academicYear)
      return yr !== 0 ? yr : (order[a.semester] ?? 0) - (order[b.semester] ?? 0)
    })
  }

  const handleDownload = () => { if (onDownload) onDownload(exportQuality) }

  const H = formData.headerColor || "#1e40af"
  const accent = formData.accentColor || "#4f46e5"

  const downloadButton = (
    <div className="flex items-center gap-2">
      <Select value={exportQuality} onValueChange={setExportQuality}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Export quality" />
        </SelectTrigger>
        <SelectContent>
          {EXPORT_QUALITY_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    </div>
  )

  return (
    <PreviewContainer title="Official Academic Transcript" actions={downloadButton}>
      <div
        ref={finalRef}
        style={{
          width: "100%",
          maxWidth: "210mm",
          margin: "0 auto",
          backgroundColor: formData.paperColor || "#fff",
          color: formData.textColor || "#111",
          fontFamily: formData.fontFamily || "Times New Roman, serif",
          border: formData.enableBorder ? `1px ${formData.borderStyle} ${formData.borderColor}` : "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Watermark */}
        {formData.enableWatermark && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(${formData.watermarkAngle}deg,
                ${hexToRgba(formData.watermarkColor, formData.watermarkOpacity / 100)},
                ${hexToRgba(formData.watermarkColor, formData.watermarkOpacity / 100)} 1px,
                transparent 1px,
                transparent ${formData.watermarkSize}px)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* ── Header band ── */}
          <div style={{ backgroundColor: H, padding: "18px 28px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {formData.universityLogo && (
                  <img
                    src={formData.universityLogo}
                    alt="Logo"
                    style={{ height: 52, width: 52, objectFit: "contain" }}
                  />
                )}
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "0.03em" }}>
                    {formData.universityName}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 2 }}>
                    {formData.universityAddress}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 1 }}>
                    {formData.universityContact}
                    {formData.universityWebsite && ` · ${formData.universityWebsite}`}
                  </div>
                </div>
              </div>
              {formData.showStudentPhoto && formData.studentPhoto && (
                <div style={{ width: 56, height: 72, border: "2px solid rgba(255,255,255,0.5)", overflow: "hidden", flexShrink: 0 }}>
                  <img src={formData.studentPhoto} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          </div>

          {/* ── Document title ── */}
          <div style={{ textAlign: "center", padding: "12px 28px 8px", borderBottom: `2px solid ${H}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: H }}>
              Official Academic Transcript
            </div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 3 }}>
              Issued: {formData.issueDate} &nbsp;·&nbsp; This document is not valid without the registrar's signature and university seal.
            </div>
          </div>

          {/* ── Student info grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", padding: "12px 28px", fontSize: 12, lineHeight: 1.9, borderBottom: `1px solid ${H}20` }}>
            {[
              ["Student Name", formData.studentName],
              ["Degree", formData.degreeType],
              ["Student ID", formData.studentId],
              ["Enrollment Date", formData.enrollmentDate],
              ["Program", formData.programName],
              ["Expected Graduation", formData.expectedGraduationDate],
              ["Department", formData.departmentName],
              ["Cumulative GPA", formData.currentGPA],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 6 }}>
                <span style={{ fontWeight: 600, color: H, minWidth: 130, flexShrink: 0 }}>{label}:</span>
                <span>{value || "—"}</span>
              </div>
            ))}
          </div>

          {/* ── Grade scale ── */}
          {formData.showGradeScale && (
            <div style={{ padding: "8px 28px", backgroundColor: `${H}08`, borderBottom: `1px solid ${H}20`, fontSize: 10, color: "#555" }}>
              <span style={{ fontWeight: 600, color: H, marginRight: 8 }}>Grading Scale:</span>
              A+/A=4.0 &nbsp; A−=3.7 &nbsp; B+=3.3 &nbsp; B=3.0 &nbsp; B−=2.7 &nbsp; C+=2.3 &nbsp; C=2.0 &nbsp; C−=1.7 &nbsp; D+=1.3 &nbsp; D=1.0 &nbsp; F=0.0 &nbsp; P/NP/W/I = Not in GPA
            </div>
          )}

          {/* ── Semester blocks ── */}
          <div style={{ padding: "0 28px 16px" }}>
            {getSemCombos(formData.courses).map((combo) => {
              const semCourses = formData.courses.filter(
                (c) => c.semester === combo.semester && c.academicYear === combo.academicYear,
              )
              const semGPA = calcSemGPA(formData.courses, combo.semester, combo.academicYear)
              const semCredits = semCourses.filter((c) => c.completed).reduce((s, c) => s + c.credits, 0)

              return (
                <div key={`${combo.academicYear}-${combo.semester}`} style={{ marginTop: 14 }}>
                  {/* Semester header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: `${H}12`,
                      borderLeft: `3px solid ${H}`,
                      padding: "5px 10px",
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 12, color: H }}>
                      {combo.semester} {combo.academicYear}
                    </span>
                    <span style={{ fontSize: 11, color: "#555" }}>
                      Credits: {semCredits}
                      {formData.showSemesterGPA && ` · Semester GPA: ${semGPA}`}
                    </span>
                  </div>

                  {/* Course table */}
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr style={{ backgroundColor: `${H}08` }}>
                        <th style={{ padding: "4px 8px", textAlign: "left", fontWeight: 600, borderBottom: `1px solid ${H}30`, width: "12%" }}>Code</th>
                        <th style={{ padding: "4px 8px", textAlign: "left", fontWeight: 600, borderBottom: `1px solid ${H}30` }}>Course Title</th>
                        <th style={{ padding: "4px 8px", textAlign: "center", fontWeight: 600, borderBottom: `1px solid ${H}30`, width: "8%" }}>Cr.</th>
                        <th style={{ padding: "4px 8px", textAlign: "center", fontWeight: 600, borderBottom: `1px solid ${H}30`, width: "8%" }}>Grade</th>
                        {formData.showGradePoints && (
                          <th style={{ padding: "4px 8px", textAlign: "center", fontWeight: 600, borderBottom: `1px solid ${H}30`, width: "10%" }}>Pts</th>
                        )}
                        <th style={{ padding: "4px 8px", textAlign: "center", fontWeight: 600, borderBottom: `1px solid ${H}30`, width: "10%" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semCourses.map((course, idx) => (
                        <tr key={course.id} style={{ backgroundColor: idx % 2 === 1 ? `${H}05` : "transparent" }}>
                          <td style={{ padding: "3px 8px", borderBottom: `1px solid ${H}15`, fontFamily: "monospace", fontSize: 10 }}>{course.courseCode}</td>
                          <td style={{ padding: "3px 8px", borderBottom: `1px solid ${H}15` }}>{course.courseName}</td>
                          <td style={{ padding: "3px 8px", borderBottom: `1px solid ${H}15`, textAlign: "center" }}>{course.credits}</td>
                          <td style={{ padding: "3px 8px", borderBottom: `1px solid ${H}15`, textAlign: "center", fontWeight: 600 }}>{course.grade}</td>
                          {formData.showGradePoints && (
                            <td style={{ padding: "3px 8px", borderBottom: `1px solid ${H}15`, textAlign: "center" }}>{getGradePoint(course.grade)}</td>
                          )}
                          <td style={{ padding: "3px 8px", borderBottom: `1px solid ${H}15`, textAlign: "center" }}>
                            <span style={{
                              fontSize: 9,
                              padding: "1px 5px",
                              borderRadius: 3,
                              backgroundColor: course.completed ? "#dcfce7" : "#fef9c3",
                              color: course.completed ? "#166534" : "#854d0e",
                              fontWeight: 600,
                            }}>
                              {course.completed ? "Completed" : "In Progress"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>

          {/* ── Summary bar ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", margin: "0 28px 16px", border: `1px solid ${H}30`, borderRadius: 4, overflow: "hidden" }}>
            {[
              ["Total Credits Attempted", formData.totalCredits],
              ["Credits Earned", formData.completedCredits],
              ["Cumulative GPA", formData.currentGPA],
            ].map(([label, value], i) => (
              <div
                key={label}
                style={{
                  padding: "10px 14px",
                  textAlign: "center",
                  borderRight: i < 2 ? `1px solid ${H}30` : "none",
                  backgroundColor: i === 2 ? `${H}10` : "transparent",
                }}
              >
                <div style={{ fontSize: 10, color: "#666", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: H }}>{value}</div>
              </div>
            ))}
          </div>

          {/* ── Signature ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "12px 28px 16px", borderTop: `1px solid ${H}20` }}>
            <div style={{ fontSize: 10, color: "#555" }}>
              <div>Issue Date: <strong>{formData.issueDate}</strong></div>
              <div style={{ marginTop: 4, maxWidth: 280, lineHeight: 1.5 }}>
                This transcript is an official document of {formData.universityName}. Any alteration renders it invalid.
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16, borderBottom: "1px solid #333", paddingBottom: 2, minWidth: 180, marginBottom: 4 }}>
                {formData.registrarName}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{formData.registrarTitle}</div>
              <div style={{ fontSize: 10, color: "#555" }}>{formData.universityName}</div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{ backgroundColor: H, padding: "8px 28px", display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.8)" }}>
            <span>For verification: {formData.universityContact}</span>
            <span>{formData.universityWebsite}</span>
          </div>
        </div>
      </div>
    </PreviewContainer>
  )
}
