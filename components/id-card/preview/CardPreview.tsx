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
 * Card Preview — routes to the correct card component based on orientation / template mode.
 */
export const CardPreview: React.FC<CardPreviewProps> = ({ formData }) => {
  const barcodeRef = useRef<SVGSVGElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  // Generate barcode whenever relevant fields change
  useEffect(() => {
    if (!isClient || !barcodeRef.current) return
    try {
      const studentId = formData.studentId || "S12345678"
      JsBarcode(barcodeRef.current, studentId, {
        format: "CODE128",
        lineColor: "#000",
        width: formData.orientation === "landscape" ? 1.5 : 2,
        height: formData.orientation === "landscape" ? 22 : 28,
        displayValue: false,
        margin: 0,
        background: "transparent",
        textMargin: 0,
      })
    } catch (e) {
      console.error("Barcode error:", e)
    }
  }, [formData.studentId, formData.codeType, formData.orientation, isClient])

  if (!isClient) return null

  // Preset template mode — Canvas-based rendering
  if (formData.templateMode === "preset" && formData.presetTemplate) {
    return <CanvasCardPreview formData={formData} />
  }

  // Landscape card
  if (formData.orientation === "landscape") {
    return (
      <div className="w-full">
        <ModernLandscapeCard
          formData={formData}
          barcodeRef={barcodeRef}
          cardStyle={formData.cardStyle || "modern"}
          orientation="landscape"
        />
      </div>
    )
  }

  // Portrait card
  return (
    <div className="w-full">
      <ModernPortraitCard
        formData={formData}
        barcodeRef={barcodeRef}
        cardStyle={formData.cardStyle || "modern"}
        orientation="portrait"
      />
    </div>
  )
}

export default CardPreview
