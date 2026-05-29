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
  previewRef?: React.RefObject<HTMLDivElement | null>
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

  const formatTime = (time: string) => {
    if (!time) return ""
    if (formData.hourFormat === "12h") {
      const [h, m] = time.split(":").map(Number)
      const period = h >= 12 ? "PM" : "AM"
      const h12 = h % 12 || 12
      return `${h12}:${m.toString().padStart(2, "0")} ${period}`
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

  const renderWeeklyView = () => {
    // ── Layout constants ──────────────────────────────────────────────────────
    // HOUR_HEIGHT controls how tall each 1-hour row is in the preview (px).
    // Larger = more readable text inside course blocks.
    const HOUR_HEIGHT = 80          // px per hour
    const TIME_COL_W  = 72          // px — time label column
    const HEADER_H    = 36          // px — day-name header row
    const BASE_FONT   = 13          // px — base font size for the whole grid
    const displayDays = getDisplayDays()
    const totalHours  = formData.endHour - formData.startHour

    return (
      <div style={{ fontSize: BASE_FONT, lineHeight: 1.35 }}>

        {/* ── University header ── */}
        <div
          style={{
            backgroundColor: formData.headerColor,
            color: "#fff",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {formData.universityLogo && (
            <img
              src={formData.universityLogo}
              alt="Logo"
              style={{ height: 40, width: 40, objectFit: "contain", flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "1.1em", letterSpacing: "0.03em" }}>
              {formData.universityName}
            </div>
            <div style={{ fontSize: "0.82em", opacity: 0.85, marginTop: 2 }}>
              {formData.scheduleTitle} &nbsp;·&nbsp; {formData.term} {formData.academicYear}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.82em", opacity: 0.9, lineHeight: 1.6 }}>
            <div><strong>Student:</strong> {formData.fullName}</div>
            <div><strong>ID:</strong> {formData.studentId}</div>
            <div><strong>Dept / Major:</strong> {formData.department} / {formData.major}</div>
          </div>
        </div>

        {/* ── Day-name header row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${TIME_COL_W}px repeat(${displayDays.length}, 1fr)`,
            borderBottom: `2px solid ${formData.borderColor}`,
          }}
        >
          {/* Empty corner */}
          <div
            style={{
              backgroundColor: formData.tableHeaderColor,
              borderRight: `1px solid ${formData.borderColor}`,
              height: HEADER_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78em",
              fontWeight: 700,
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
                height: HEADER_H,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85em",
                fontWeight: 700,
                color: formData.textColor,
              }}
            >
              {day.label}
            </div>
          ))}
        </div>

        {/* ── Time rows ── */}
        <div style={{ overflow: "hidden" }}>
          {Array.from({ length: totalHours }, (_, i) => {
            const hour = i + formData.startHour
            const timeStr = `${hour}:00`
            const displayTime = formatTime(timeStr)

            return (
              <div
                key={timeStr}
                style={{
                  display: "grid",
                  gridTemplateColumns: `${TIME_COL_W}px repeat(${displayDays.length}, 1fr)`,
                  height: HOUR_HEIGHT,
                  borderBottom: `1px solid ${formData.borderColor}`,
                }}
              >
                {/* Time label */}
                <div
                  style={{
                    borderRight: `1px solid ${formData.borderColor}`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 5,
                    fontSize: "0.78em",
                    fontWeight: 600,
                    color: formData.textColor,
                    backgroundColor: `${formData.tableHeaderColor}60`,
                  }}
                >
                  {displayTime}
                </div>

                {/* Day cells */}
                {displayDays.map((day) => {
                  const startingCourses = formData.courses.filter((course) => {
                    if (!course.days.includes(day.value)) return false
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
                        height: HOUR_HEIGHT,
                      }}
                    >
                      {startingCourses.map((course) => {
                        const [sh, sm] = (course.startTime || "0:0").split(":").map(Number)
                        const [eh, em] = (course.endTime   || "0:0").split(":").map(Number)
                        const durationMin = (eh * 60 + em) - (sh * 60 + sm)
                        const topOffset   = (sm / 60) * HOUR_HEIGHT
                        const blockHeight = Math.max((durationMin / 60) * HOUR_HEIGHT, 28)

                        return (
                          <div
                            key={course.id}
                            style={{
                              position: "absolute",
                              top: topOffset,
                              left: 2,
                              right: 2,
                              height: blockHeight,
                              backgroundColor: course.color,
                              borderRadius: 4,
                              padding: "4px 6px",
                              overflow: "hidden",
                              zIndex: 2,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            {/* Course name — always visible */}
                            <div
                              style={{
                                color: "#fff",
                                fontSize: "0.82em",
                                fontWeight: 700,
                                lineHeight: 1.25,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {course.courseName}
                            </div>

                            {/* Secondary info — only if block is tall enough */}
                            {blockHeight >= 44 && (
                              <div
                                style={{
                                  color: "rgba(255,255,255,0.92)",
                                  fontSize: "0.72em",
                                  lineHeight: 1.3,
                                  overflow: "hidden",
                                }}
                              >
                                {course.courseCode && (
                                  <span style={{ display: "block" }}>{course.courseCode}</span>
                                )}
                                {formData.showLocations && (course.building || course.room) && (
                                  <span style={{ display: "block" }}>
                                    {course.building} {course.room}
                                  </span>
                                )}
                                {formData.showInstructors && course.instructor && (
                                  <span style={{ display: "block" }}>{course.instructor}</span>
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

        {/* ── Legend ── */}
        {formData.courses.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${formData.borderColor}`,
              padding: "8px 14px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 20px",
              backgroundColor: formData.paperColor,
            }}
          >
            {formData.courses.map((course) => (
              <div key={course.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78em" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: course.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: formData.textColor }}>
                  <strong>{course.courseCode}</strong>: {course.courseName}
                  {formData.showCredits && ` (${course.credits} cr)`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Notes ── */}
        {formData.showNotes && formData.courses.some((c) => c.notes) && (
          <div
            style={{
              borderTop: `1px solid ${formData.borderColor}`,
              padding: "6px 14px",
              fontSize: "0.78em",
              color: formData.textColor,
            }}
          >
            <strong>Notes: </strong>
            {formData.courses
              .filter((c) => c.notes)
              .map((c) => `${c.courseCode}: ${c.notes}`)
              .join("  |  ")}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Preview — Landscape A4</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Outer wrapper: landscape A4 aspect ratio, overflow hidden for clean export */}
        <div
          ref={previewRef}
          className="schedule-container"
          style={{
            backgroundColor: formData.paperColor,
            color: formData.textColor,
            fontFamily: formData.fontFamily,
            border: `1px solid ${formData.borderColor}`,
            borderRadius: 6,
            overflow: "hidden",
            position: "relative",
            // Landscape A4: 297 × 210 mm → ratio ≈ 1.414 wide
            width: "100%",
            aspectRatio: "297 / 210",
          }}
        >
          {/* Watermark */}
          {formData.enableWatermark && formData.watermarkText && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 20,
                overflow: "hidden",
              }}
            >
              {Array.from({ length: 4 }, (_, row) =>
                Array.from({ length: 7 }, (_, col) => (
                  <span
                    key={`${row}-${col}`}
                    style={{
                      position: "absolute",
                      top: `${row * 26 + 8}%`,
                      left: `${col * 16 - 4}%`,
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

          {/* Scale the inner content to fill the fixed-ratio container */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {renderWeeklyView()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="flex w-full justify-between items-center gap-4">
          <Select value={exportQuality} onValueChange={setExportQuality}>
            <SelectTrigger className="w-[260px]">
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
        </div>
        <p className="text-xs text-muted-foreground text-center w-full">
          Output: Landscape A4 (297 × 210 mm) at selected DPI — font size scales proportionally
        </p>
      </CardFooter>
    </Card>
  )
}
