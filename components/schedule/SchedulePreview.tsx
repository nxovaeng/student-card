"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPORT_QUALITY_OPTIONS, DAYS_OF_WEEK_OPTIONS } from "@/lib/constants"
import { Download } from "lucide-react"
import type { ScheduleFormData, ScheduleCourse } from "@/lib/types"

// Measures the outer container and sets --schedule-scale so the 900px-wide
// inner content scales to fill it exactly.
function ScaleUpdater() {
  useEffect(() => {
    const update = () => {
      const containers = document.querySelectorAll<HTMLElement>(".schedule-outer")
      containers.forEach((el) => {
        const w = el.offsetWidth
        const h = el.offsetHeight
        const inner = el.querySelector<HTMLElement>(".schedule-container")
        if (inner && w > 0 && h > 0) {
          const naturalH = Number(inner.getAttribute("data-natural-height")) || 600
          const scaleW = w / 900
          const scaleH = h / naturalH
          const scale = Math.min(scaleW, scaleH) * 0.94 // 0.94 to add a nice page margin
          el.style.setProperty("--schedule-scale", String(scale))
        }
      })
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return null
}

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

  // ── Layout constants ──────────────────────────────────────────────────────
  // These are the "natural" pixel sizes at which the schedule is designed.
  // The outer container scales the whole thing to fit landscape A4 ratio.
  const HOUR_HEIGHT = 52          // px per hour
  const TIME_COL_W = 65          // px — time label column
  const HEADER_H = 34          // px — day-name header row
  const BASE_FONT = 9          // px — base font (will be scaled up visually)
  const LUNCH_START = 12
  const LUNCH_END = 13
  const LUNCH_H = 24          // px — compact lunch row height
  const displayDays = getDisplayDays()
  const totalHours = formData.endHour - formData.startHour

  // Calculate natural total height so we can scale to fit
  const lunchRows = (formData.startHour <= LUNCH_START && formData.endHour > LUNCH_START) ? 1 : 0
  const normalRows = totalHours - lunchRows
  const HEADER_BAND_H = 50        // university header band
  const LEGEND_H = formData.courses.length > 0 ? 32 : 0
  const NOTES_H = (formData.showNotes && formData.courses.some(c => c.notes)) ? 26 : 0
  const naturalH = HEADER_BAND_H + HEADER_H + normalRows * HOUR_HEIGHT + lunchRows * LUNCH_H + LEGEND_H + NOTES_H

  // Landscape A4: 297 × 210 mm → natural width we design at
  const naturalW = 900            // px — design width

  const renderWeeklyView = () => {

    return (
      <div
        style={{
          width: naturalW,
          minHeight: naturalH,
          fontSize: BASE_FONT,
          lineHeight: 1.35,
          fontFamily: formData.fontFamily,
          backgroundColor: formData.paperColor,
          color: formData.textColor,
        }}
      >
        {/* ── University header band ── */}
        <div
          style={{
            backgroundColor: formData.headerColor,
            color: "#fff",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: HEADER_BAND_H,
            boxSizing: "border-box",
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
            <div style={{ fontWeight: 700, fontSize: "1.15em", letterSpacing: "0.02em" }}>
              {formData.universityName}
            </div>
            <div style={{ fontSize: "0.85em", opacity: 0.85, marginTop: 1 }}>
              {formData.scheduleTitle} &nbsp;·&nbsp; {formData.term} {formData.academicYear}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.85em", opacity: 0.9, lineHeight: 1.55 }}>
            <div><strong>Student:</strong> {formData.fullName}</div>
            <div><strong>ID:</strong> {formData.studentId}</div>
            <div><strong>Major:</strong> {formData.major}</div>
          </div>
        </div>

        {/* ── Day-name header row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${TIME_COL_W}px repeat(${displayDays.length}, 1fr)`,
            borderBottom: `2px solid ${formData.borderColor}`,
            height: HEADER_H,
          }}
        >
          <div
            style={{
              backgroundColor: formData.tableHeaderColor,
              borderRight: `1px solid ${formData.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85em",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.92em",
                fontWeight: 700,
                color: formData.textColor,
              }}
            >
              {day.label}
            </div>
          ))}
        </div>

        {/* ── Time rows ── */}
        <div>
          {Array.from({ length: totalHours }, (_, i) => {
            const hour = i + formData.startHour
            const timeStr = `${hour}:00`
            const displayTime = formatTime(timeStr)
            const isLunch = hour >= LUNCH_START && hour < LUNCH_END

            if (isLunch) {
              return (
                <div
                  key={timeStr}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `${TIME_COL_W}px repeat(${displayDays.length}, 1fr)`,
                    height: LUNCH_H,
                    borderBottom: `1px solid ${formData.borderColor}`,
                    backgroundColor: `${formData.tableHeaderColor}aa`,
                  }}
                >
                  <div
                    style={{
                      borderRight: `1px solid ${formData.borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75em",
                      fontWeight: 600,
                      color: `${formData.textColor}88`,
                      fontStyle: "italic",
                    }}
                  >
                    {displayTime}
                  </div>
                  <div
                    style={{
                      gridColumn: `2 / span ${displayDays.length}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.78em",
                      color: `${formData.textColor}77`,
                      fontStyle: "italic",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ── Lunch Break ──
                  </div>
                </div>
              )
            }

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
                    fontSize: "0.85em",
                    fontWeight: 600,
                    color: formData.textColor,
                    backgroundColor: `${formData.tableHeaderColor}55`,
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
                        const [eh, em] = (course.endTime || "0:0").split(":").map(Number)
                        const durationMin = (eh * 60 + em) - (sh * 60 + sm)
                        const topOffset = (sm / 60) * HOUR_HEIGHT
                        const blockHeight = Math.max((durationMin / 60) * HOUR_HEIGHT, 30)

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
                              borderRadius: 3,
                              padding: "4px 6px",
                              overflow: "hidden",
                              zIndex: 2,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <div
                              style={{
                                color: "#fff",
                                fontSize: "0.92em",
                                fontWeight: 700,
                                lineHeight: 1.2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {course.courseName}
                            </div>
                            {/* Hide details if block is too short */}
                            {blockHeight >= 38 && (
                              <div
                                style={{
                                  color: "rgba(255,255,255,0.9)",
                                  fontSize: "0.85em",
                                  lineHeight: 1.25,
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
              padding: "5px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 16px",
              backgroundColor: formData.paperColor,
              minHeight: LEGEND_H,
            }}
          >
            {formData.courses.map((course) => (
              <div key={course.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.85em" }}>
                <div
                  style={{
                    width: 9,
                    height: 9,
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
              padding: "4px 12px",
              fontSize: "0.85em",
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
        {/* 
          Outer wrapper: fixed landscape-A4 aspect ratio.
          Inner content is designed at naturalW=900px wide, then CSS-scaled
          to fill the container — so font sizes stay proportional and readable.
        */}
        <div
          ref={previewRef}
          className="schedule-outer"
          style={{
            width: "100%",
            aspectRatio: "297 / 210",
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${formData.borderColor}`,
            borderRadius: 6,
            backgroundColor: formData.paperColor,
          }}
        >
          {/* Watermark layer */}
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

          {/*
            The schedule is designed at 900px wide.
            CSS transform scales it to fill the outer container.
            previewRef points here so html2canvas captures the full 900px content.
          */}
          <div
            className="schedule-container"
            data-natural-height={naturalH}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 900,
              transformOrigin: "center",
              transform: "translate(-50%, -50%) scale(var(--schedule-scale, 1))",
            }}
          >
            {renderWeeklyView()}
          </div>

          <ScaleUpdater />
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
