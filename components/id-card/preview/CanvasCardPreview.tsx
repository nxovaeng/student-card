"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { IDCardFormData } from "@/lib/types"
import { PRESET_TEMPLATES } from "@/lib/constants"

interface CanvasCardPreviewProps {
  formData: IDCardFormData
}

/**
 * Canvas Card Preview Component
 * Renders ID card using Canvas API with preset PNG templates
 * Ported from card-generator's server.js generateCard() function
 */
export const CanvasCardPreview: React.FC<CanvasCardPreviewProps> = ({ formData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const renderCard = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Canvas size matches original template: 1280x804
      canvas.width = 1280
      canvas.height = 804

      // Find the selected template
      const template = PRESET_TEMPLATES.find((t) => t.id === formData.presetTemplate)
      if (!template) return

      // Determine which set
      const isSet2 = template.set === 2

      // Load and draw template background
      const templateImg = new Image()
      templateImg.crossOrigin = "anonymous"
      templateImg.src = template.image

      await new Promise<void>((resolve) => {
        templateImg.onload = () => resolve()
        templateImg.onerror = () => resolve()
      })

      ctx.clearRect(0, 0, 1280, 804)
      ctx.drawImage(templateImg, 0, 0, 1280, 804)

      // Draw college logo
      if (formData.logo && formData.logo !== "/placeholder.svg?height=60&width=60") {
        const logo = new Image()
        logo.crossOrigin = "anonymous"
        logo.src = formData.logo

        await new Promise<void>((resolve) => {
          logo.onload = () => resolve()
          logo.onerror = () => resolve()
        })

        if (logo.complete && logo.naturalWidth > 0) {
          if (isSet2) {
            ctx.save()
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
            ctx.shadowBlur = 4
            ctx.shadowOffsetX = 2
            ctx.shadowOffsetY = 2
            ctx.drawImage(logo, 433, 177, 102, 102)
            ctx.restore()
          } else {
            ctx.drawImage(logo, 15, 49, 165, 165)
          }

          // Center icon (watermark logo)
          ctx.save()
          const opacity = formData.centerIconOpacity || 0.1
          ctx.globalAlpha = opacity
          const iconWidth = 620
          const iconHeight = 620
          const centerX = (1280 - iconWidth) / 2
          const centerY = (804 - iconHeight) / 2
          ctx.drawImage(logo, centerX, centerY, iconWidth, iconHeight)
          ctx.restore()
        }
      }

      // Draw student photo (circular clip)
      if (formData.photo && !formData.photo.includes("placeholder")) {
        const photo = new Image()
        photo.crossOrigin = "anonymous"
        photo.src = formData.photo

        await new Promise<void>((resolve) => {
          photo.onload = () => resolve()
          photo.onerror = () => resolve()
        })

        if (photo.complete && photo.naturalWidth > 0) {
          const x = isSet2 ? 67 : 155
          const y = isSet2 ? 179 : 227
          const size = isSet2 ? 282 : 348
          const radius = size / 2

          ctx.save()
          ctx.beginPath()
          ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(photo, x, y, size, size)
          ctx.restore()
        }
      }

      // Draw text fields
      const name = (formData.fullName || "John Smith").toUpperCase()
      const dob = formData.validityStart || "2001-01-25"
      const studentId = formData.studentId || "2023001001"
      const address = (formData.universityAddress || "123 University Avenue").substring(0, 30)
      const academicYear = formData.enrollmentYear
        ? `${formData.enrollmentYear}-${parseInt(formData.enrollmentYear) + 4}`
        : "2025-2028"
      const expDate = formData.validityEnd || "31 DEC 2025"
      const issueDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase()
      const collegeName = (formData.universityName || "International University").toUpperCase()

      if (isSet2) {
        // Set 2 text rendering (white text with shadow)
        ctx.fillStyle = "#FFFFFF"
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        ctx.font = "bold 52px serif"
        ctx.fillText(name, 85, 750)

        ctx.font = "bold 40px serif"
        ctx.fillText(dob, 715, 428)
        ctx.fillText(studentId, 715, 359)
        ctx.fillText(address, 715, 490)
        ctx.fillText(academicYear, 715, 553)
        ctx.fillText(expDate, 715, 620)

        ctx.font = "bold 30px serif"
        ctx.fillText(issueDate, 1050, 80)

        ctx.font = "bold 40px serif"
        ctx.fillText("Date Of Issue", 1005, 40)
      } else {
        // Set 1 text rendering
        ctx.fillStyle = "#F45245"
        ctx.font = "bold 52px serif"
        ctx.fillText(name, 625, 402)

        ctx.fillStyle = "#000000"
        ctx.font = "bold 31px serif"
        ctx.fillText(dob, 808, 512)
        ctx.fillText(studentId, 810, 462)
        ctx.fillText(address, 810, 557)

        ctx.fillStyle = "#F45245"
        ctx.font = "bold 45px serif"
        ctx.fillText(academicYear, 665, 694)

        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 30px serif"
        ctx.fillText(issueDate, 1050, 80)
        ctx.fillText(expDate, 65, 785)

        ctx.font = "bold 40px serif"
        ctx.fillText("Date Of Issue", 1005, 40)
        ctx.font = "bold 34px serif"
        ctx.fillText("Card Expires", 10, 745)
      }

      // Draw college name (multi-line if needed)
      ctx.fillStyle = isSet2 ? "#FFFFFF" : "#000000"
      ctx.font = "bold 32px serif"
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      const words = collegeName.split(" ")
      let line1 = ""
      let line2 = ""
      let line1Full = false

      for (const word of words) {
        if (!line1Full) {
          const testLine = line1 ? line1 + " " + word : word
          if (testLine.length <= 28) {
            line1 = testLine
          } else {
            line1Full = true
            line2 = word
          }
        } else {
          line2 += (line2 ? " " : "") + word
        }
      }

      const xOffset = isSet2 ? 380 : 0
      const yOffset = isSet2 ? 110 : 0

      if (!line2) {
        ctx.fillText(line1, 165 + xOffset, 130 + yOffset)
      } else {
        ctx.fillText(line1, 158 + xOffset, 112 + yOffset)
        ctx.fillText(line2, 200 + xOffset, 149 + yOffset)
      }

      // Draw signature
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.font = "italic 38px cursive"
      const signature = formData.officialSignature || "S. Davis"
      const sigX = isSet2 ? 955 : 1047
      const sigY = isSet2 ? 700 : 693
      ctx.fillText(signature, sigX, sigY)

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      setIsReady(true)
    }

    if (formData.presetTemplate) {
      renderCard()
    }
  }, [formData])

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg shadow-lg"
        style={{ aspectRatio: "1280/804", maxWidth: "100%" }}
      />
    </div>
  )
}

export default CanvasCardPreview
