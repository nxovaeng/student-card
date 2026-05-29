"use client"

import { useState } from "react"
import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPORT_QUALITY_OPTIONS, DAYS_OF_WEEK_OPTIONS } from "@/lib/constants"
import { Download } from "lucide-react"
import type { ScheduleFormData, ScheduleCourse } from "@/lib/types"

interface SchedulePreviewProps {
  formData: ScheduleFormData
  onChange: (name: string, value: string | boolean | number | string[] | ScheduleCourse[]) => void
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void
  onDownload?: (quality: string) => void
  previewRef?: React.RefObject<HTMLDivElement>
}

export default function SchedulePreview({
  formData,
  onChange,
  onFileChange,
  onDownload,
  previewRef,
}: SchedulePreviewProps) {
  const [exportQuality, setExportQuality] = useState<string>(formData.pngQuality || "high")

  const handleDownload = () => {
    if (onDownload) onDownload(exportQuality)
  }

  // Format time to 12h or 24h
  const formatTime = (time: string) => {
    if (!time) return ""
    if (formData.hourFormat === "12h") {
      const [hours, minutes] = time.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const hour12 = hours % 12 || 12
      return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`
    }
    return time
  }

  const getDisplayDays = () => {
    let days = [...DAYS_OF_WEEK_OPTIONS]
    if (!formData.showWeekends) {
      days = days.filter((d) => d.value !== "Saturday" && d.value !== "Sunday")
    }
    return days
  }

  const isCourseOnDay = (course: ScheduleCourse, day: string) => course.days.includes(day)

  // ─── Landscape A4 weekly grid ────────────────────────────────────────────
  // A4 landscape: 297 × 210 mm. We render at a fixed CSS width that matches
  // the aspect ratio; the export hook will scale to the correct physical size.
  const renderWeeklyView = () => {
    // Each hour row height in px (for the preview render)
    const HOUR_HEIGHT = 56
    const TIME_COL_WIDTH = 64 // px
    const displayDays = getDisplayDays()
    const totalHours = formData.endHour - formData.startHour

    return (
      <div
        style={{
          // Landscape A4 aspect ratio: 297/210 ≈ 1.414 wide
          width: "100%",
          aspectRatio: "297 / 210",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            backgroundColor: formData.headerColor,
            color: "#ffffff",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          {formData.universityLogo && (
            <img
              src={formData.universityLogo}
              alt="Logo"
              style={{ height: 36, width: 36, objectFit: "contain", flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>
              {formData.universityName}
            </div>
            <div style={{ fontSize: 10, opacity: 0.85 }}>
              {formData.scheduleTitle} &nbsp;·&nbsp; {formData.term} {formData.academicYear}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, opacity: 0.9, lineHeight: 1.5 }}>
            <div>
              <strong>Student:</strong> {formData.fullName}
            </div>
            <div>
              <strong>ID:</strong> {formData.studentId}
            </div>
            <div>
              <strong>Dept / Major:</strong> {formData.department} / {formData.major}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Day header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${displayDays.length}, 1fr)`,
              borderBottom: `1px solid ${formData.borderColor}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                backgroundColor: formData.tableHeaderColor,
                borderRight: `1px solid ${formData.borderColor}`,
                padding: "4px 6px",
                fontSize: 10,
                fontWeight: 600,
                textAlign: "center",
                color: formData.textColor,
              }}
            >
              Time
            </div>
            {displayDays.map((day) => (
              <div
                key={day.value}
                style={{
                  backgroundColor: formData.tableHeaderColor,
                  borderRight: `1px solid ${formData.borderColor}`,
                  padding: "4px 6px",
                  fontSize: 10,
                  fontWeight: 600,
                  textAlign: "center",
                  color: formData.textColor,
                }}
              >
                {day.label}
              </div>
            ))}
          </div>

          {/* Time rows */}
          <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
            {Array.from({ length: totalHours }, (_, i) => {
              const hour = i + formData.startHour
              const timeStr = `${hour}:00`
              const displayTime = formatTime(timeStr)

              return (
                <div
                  key={timeStr}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${displayDays.length}, 1fr)`,
                    height: `${HOUR_HEIGHT}px`,
                    borderBottom: `1px solid ${formData.borderColor}`,
                  }}
                >
                  {/* Time label */}
                  <div
                    style={{
                      borderRight: `1px solid ${formData.borderColor}`,
                      padding: "3px 6px",
                      fontSize: 9,
                      fontWeight: 500,
                      color: formData.textColor,
                      textAlign: "center",
                      verticalAlign: "top",
                      lineHeight: 1.2,
                      paddingTop: 4,
                    }}
                  >
                    {displayTime}
                  </div>

                  {/* Day cells */}
                  {displayDays.map((day) => {
                    const startingCourses = formData.courses.filter((course) => {
                      if (!isCourseOnDay(course, day.value)) return false
                      if (!course.startTime) return false
                      const [sh] = course.startTime.split(":").map(Number)
                      return sh === hour
                    })

                    return (
                      <div
                        key={`${day.value}-${timeStr}`}
                        style={{
                          borderRight: `1px solid ${formData.borderColor}`,
                          position: "relative",
                          height: `${HOUR_HEIGHT}px`,
                        }}
                      >
                        {startingCourses.map((course) => {
                          const [sh, sm] = (course.startTime || "0:0").split(":").map(Number)
                          const [eh, em] = (course.endTime || "0:0").split(":").map(Number)
                          const durationMin = (eh * 60 + em) - (sh * 60 + sm)
                          const topOffset = (sm / 60) * HOUR_HEIGHT
                          const height = Math.max((durationMin / 60) * HOUR_HEIGHT, 20)

                          return (
                            <div
                              key={course.id}
                              style={{
                                position: "absolute",
                                top: topOffset,
                                left: 2,
                                right: 2,
                                height,
                                backgroundColor: course.color,
                                borderRadius: 3,
                                padding: "2px 4px",
                                overflow: "hidden",
                                zIndex: 2,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                            >
                              <div
                                style={{
                                  color: "#fff",
                                  fontSize: 8,
                                  fontWeight: 700,
                                  lineHeight: 1.2,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {course.courseName}
                              </div>
                              {height > 28 && (
                                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 7, lineHeight: 1.2 }}>
                                  {course.courseCode}
                                  {formData.showLocations && (course.building || course.room) && (
                                    <span> · {course.building} {course.room}</span>
                                  )}
                                  {formData.showInstructors && course.instructor && (
                                    <span> · {course.instructor}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Footer: legend + notes ── */}
        {formData.courses.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${formData.borderColor}`,
              padding: "6px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 16px",
              flexShrink: 0,
              backgroundColor: formData.paperColor,
            }}
          >
            {formData.courses.map((course) => (
              <div key={course.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: course.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: formData.textColor }}>
                  {course.courseCode}: {course.courseName}
                  {formData.showCredits && ` (${course.credits} cr)`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Notes section */}
        {formData.showNotes && formData.courses.some((c) => c.notes) && (
          <div
            style={{
              borderTop: `1px solid ${formData.borderColor}`,
              padding: "4px 12px",
              fontSize: 8,
              color: formData.textColor,
              flexShrink: 0,
            }}
          >
            <strong>Notes: </strong>
            {formData.courses
              .filter((c) => c.notes)
              .map((c) => `${c.courseCode}: ${c.notes}`)
              .join(" | ")}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Preview (Landscape A4)</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={previewRef}
          className="schedule-container relative rounded-lg shadow-sm overflow-hidden"
          style={{
            backgroundColor: formData.paperColor,
            color: formData.textColor,
            fontFamily: formData.fontFamily,
            border: `1px solid ${formData.borderColor}`,
          }}
        >
          {/* Watermark overlay */}
          {formData.enableWatermark && formData.watermarkText && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 20,
                overflow: "hidden",
              }}
            >
              {Array.from({ length: 4 }, (_, row) =>
                Array.from({ length: 6 }, (_, col) => (
                  <span
                    key={`${row}-${col}`}
                    style={{
                      position: "absolute",
                      top: `${row * 28 + 10}%`,
                      left: `${col * 20 - 5}%`,
                      fontSize: `${Number(formData.watermarkSize) || 14}px`,
                      color: formData.watermarkColor,
                      opacity: formData.watermarkOpacity / 100,
                      transform: `rotate(${formData.watermarkAngle}deg)`,
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    {formData.watermarkText}
                  </span>
                )),
              )}
            </div>
          )}

          {renderWeeklyView()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Select value={exportQuality} onValueChange={setExportQuality}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select export quality" />
          </SelectTrigger>
          <SelectContent>
            {EXPORT_QUALITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Schedule (PNG)
        </Button>
      </CardFooter>
    </Card>
  )
}
