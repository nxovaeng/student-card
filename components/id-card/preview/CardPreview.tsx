"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { CardPreviewProps } from "@/lib/types"
import ModernPortraitCard from "../portrait/ModernCard"
import ModernLandscapeCard from "../landscape/ModernCard"
import JsBarcode from "jsbarcode"
import { QRCodeSVG } from "qrcode.react"
import CanvasCardPreview from "./CanvasCardPreview"

/**
 * Card Preview Component
 * Display different card views based on card orientation and style
 */
export const CardPreview: React.FC<CardPreviewProps> = ({ formData }) => {
  // Create barcode reference
  const barcodeRef = useRef<SVGSVGElement>(null)
  const [isClient, setIsClient] = useState(false)

  // Client-side rendering detection (prevent SSR errors)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate barcode
  useEffect(() => {
    if (isClient && barcodeRef.current && (formData.codeType === "barcode" || formData.orientation === "landscape")) {
      try {
        const studentId = formData.studentId || "S12345678"

        if (formData.orientation === "landscape") {
          // Landscape card barcode style
          JsBarcode(barcodeRef.current, studentId, {
            format: "CODE128",
            lineColor: "#000",
            width: 1.5,
            height: 24,
            displayValue: false, // Don't show text below barcode
            margin: 0,
            background: "transparent",
            textMargin: 0,
          })
        } else {
          // Portrait card barcode style
          JsBarcode(barcodeRef.current, studentId, {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 40,
            displayValue: true,
            fontSize: 12,
            margin: 0,
            background: "transparent",
          })
        }
      } catch (error) {
        console.error("Barcode generation error:", error)
      }
    }
  }, [formData.studentId, formData.codeType, formData.orientation, isClient])

  // 渲染卡片正面
  if (!isClient) return null

  // Preset template mode - use Canvas rendering
  if (formData.templateMode === "preset" && formData.presetTemplate) {
    return <CanvasCardPreview formData={formData} />
  }

  // 横向卡片 - 现代风格
  if (formData.orientation === "landscape") {
    return (
      <div className="w-full">
        <ModernLandscapeCard formData={formData} barcodeRef={barcodeRef} cardStyle={formData.cardStyle || "modern"} orientation={formData.orientation || "landscape"} />
      </div>
    )
  }

  // 竖向卡片
  return (
    <div className="w-full">
      {formData.cardStyle === "modern" && (
        <div className="overflow-hidden rounded-lg shadow-lg" style={{ backgroundColor: formData.cardColor }}>
          <div className="relative p-6">
            {/* 背景图片 - 全覆盖 */}
            {formData.backgroundImage && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${formData.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: Number(formData.backgroundOpacity) / 100,
                }}
              ></div>
            )}

            {/* 水印层 */}
            {formData.enableWatermark && (
              <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent ${formData.watermarkLineWidth}px,
                    rgba(${Number.parseInt(formData.watermarkColor.slice(1, 3), 16)}, ${Number.parseInt(formData.watermarkColor.slice(3, 5), 16)}, ${Number.parseInt(formData.watermarkColor.slice(5, 7), 16)}, ${Number(formData.watermarkOpacity) / 100}) ${formData.watermarkLineWidth}px,
                    rgba(${Number.parseInt(formData.watermarkColor.slice(1, 3), 16)}, ${Number.parseInt(formData.watermarkColor.slice(3, 5), 16)}, ${Number.parseInt(formData.watermarkColor.slice(5, 7), 16)}, ${Number(formData.watermarkOpacity) / 100}) ${Number(formData.watermarkLineWidth) * 2}px
                  )`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="transform text-center"
                    style={{
                      color: `rgba(${Number.parseInt(formData.watermarkColor.slice(1, 3), 16)}, ${Number.parseInt(formData.watermarkColor.slice(3, 5), 16)}, ${Number.parseInt(formData.watermarkColor.slice(5, 7), 16)}, ${Number(formData.watermarkOpacity) / 100})`,
                      letterSpacing: "2px",
                      width: "100%",
                      fontSize: `${Number(formData.watermarkSize) * 0.8 + 1.5}rem`,
                      transform: `rotate(${formData.watermarkAngle}deg)`,
                    }}
                  >
                    {formData.watermarkText}
                  </div>
                </div>
              </div>
            )}

            {/* Header Section */}
            <div className="relative z-10 mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: formData.textColor }}>
                  {formData.universityName || "INTERNATIONAL UNIVERSITY"}
                </div>
                <div className="mt-1 text-2xl font-bold" style={{ color: formData.textColor }}>
                  STUDENT ID CARD
                </div>
              </div>
              <div className="h-16 w-16">
                <img
                  src={formData.logo || "/placeholder.svg"}
                  alt="University Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Main Content Section */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-5">
              {/* Photo Column */}
              <div className="flex flex-col items-center">
                <div className="h-36 w-28 overflow-hidden rounded border bg-white shadow-sm">
                  <img
                    src={formData.photo || "/placeholder.svg"}
                    alt="Student"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 space-y-3" style={{ color: formData.textColor }}>
                <div>
                  <div className="text-xs opacity-80">FULL NAME</div>
                  <div className="text-lg font-semibold">{formData.fullName || "JOHN SMITH"}</div>
                </div>

                <div>
                  <div className="text-xs opacity-80">FACULTY</div>
                  <div className="font-semibold">{formData.faculty || "ENGINEERING"}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs opacity-80">PROGRAM</div>
                    <div className="font-semibold">{formData.programType}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">ENROLLED</div>
                    <div className="font-semibold">{formData.enrollmentYear}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ID 和 Valid Until 显示在同一行 */}
            <div className="relative z-10 mt-4 grid grid-cols-2 gap-3" style={{ color: formData.textColor }}>
              <div>
                <div className="text-xs opacity-80">STUDENT ID</div>
                <div className="font-semibold">{formData.studentId || "S12345678"}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">VALID UNTIL</div>
                <div className="font-semibold">
                  {formData.validityEnd ? formData.validityEnd.replace("-", "/") : "2028/06"}
                </div>
              </div>
            </div>

            {/* Code Section */}
            <div className="relative z-10 mt-5 border-t border-white/20 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: formData.textColor }}>
                  {formData.codeType === "qrcode" ? "SCAN QR CODE FOR VERIFICATION" : "SCAN BARCODE FOR VERIFICATION"}
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                {formData.codeType === "qrcode" ? (
                  <div className="bg-white p-2 rounded-sm shadow-sm">
                    <QRCodeSVG
                      value={`ID:${formData.studentId || "S12345678"}`}
                      size={80}
                      bgColor={"#FFFFFF"}
                      fgColor={"#000000"}
                      level={"M"}
                      includeMargin={false}
                    />
                  </div>
                ) : (
                  <div className="bg-white py-1 px-2 rounded-sm shadow-sm">
                    <svg ref={barcodeRef} className="w-full max-w-[180px]"></svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-black/10 p-2 text-center text-xs" style={{ color: formData.textColor }}>
            This card remains the property of the university. If found, please return to the Student Office.
          </div>
        </div>
      )}

      {formData.cardStyle !== "modern" && <ModernPortraitCard formData={formData} barcodeRef={barcodeRef} cardStyle={formData.cardStyle || "modern"} orientation={formData.orientation || "portrait"} />}
    </div>
  )
}

export default CardPreview
