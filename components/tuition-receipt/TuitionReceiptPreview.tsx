"use client"

import type React from "react"
import { useState } from "react"
import type { TuitionReceiptFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { EXPORT_QUALITY_OPTIONS } from "@/lib/constants"
import { Download } from "lucide-react"
import PreviewContainer from "@/components/common/PreviewContainer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TuitionReceiptPreviewProps {
  formData: TuitionReceiptFormData
  onDownload: (quality: string) => void
  previewRef?: React.RefObject<HTMLDivElement | null>
}

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const TuitionReceiptPreview: React.FC<TuitionReceiptPreviewProps> = ({ formData, onDownload, previewRef }) => {
  const [exportQuality, setExportQuality] = useState<string>("high")

  const totalFees = formData.feeItems.reduce((s, i) => s + i.amount, 0)
  const totalPayments = formData.payments.reduce((s, i) => s + i.amount, 0)
  const balance = totalFees - totalPayments

  const H = formData.headerColor || "#1e40af"
  const accent = formData.accentColor || "#4f46e5"

  const previewContent = (
    <div
      id="tuition-receipt-preview"
      ref={previewRef}
      style={{
        width: "100%",
        maxWidth: "148mm",   // A5 width
        margin: "0 auto",
        fontFamily: formData.fontFamily,
        color: formData.textColor,
        backgroundColor: formData.paperColor,
        border: formData.enableBorder ? `1.5px ${formData.borderStyle} ${formData.borderColor}` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watermark */}
      {formData.enableWatermark && formData.watermarkText && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{
            color: `rgba(${parseInt(formData.watermarkColor.slice(1,3),16)},${parseInt(formData.watermarkColor.slice(3,5),16)},${parseInt(formData.watermarkColor.slice(5,7),16)},${formData.watermarkOpacity/100})`,
            fontSize: `${parseInt(formData.watermarkSize)*0.9+1}rem`,
            transform: `rotate(${formData.watermarkAngle}deg)`,
            fontWeight: "bold",
            whiteSpace: "nowrap",
            letterSpacing: 4,
          }}>
            {formData.watermarkText}
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <div style={{ backgroundColor: H, padding: "18px 24px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{formData.universityName}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, marginTop: 2 }}>{formData.department}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 1 }}>{formData.universityAddress}</div>
            </div>
            <div style={{ width: 52, height: 52, flexShrink: 0 }}>
              <img src={formData.universityLogo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          </div>
        </div>

        {/* ── Receipt title + meta ── */}
        <div style={{ padding: "12px 24px 8px", borderBottom: `1px solid ${H}20`, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: H }}>{formData.receiptTitle}</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
              Receipt No: <strong>{formData.receiptNumber}</strong>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#555" }}>
            <div>Date: <strong>{formData.issueDate}</strong></div>
          </div>
        </div>

        {/* ── Student info ── */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid ${H}15`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px", fontSize: 11, lineHeight: 1.9 }}>
          {[
            ["Student", formData.studentName],
            ["Student ID", formData.studentId],
            ["Program", formData.program],
            ["Term", formData.term],
            ["Academic Year", formData.academicYear],
          ].map(([label, value]) => (
            <div key={label}>
              <span style={{ fontWeight: 600, color: H }}>{label}: </span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        {/* ── Fee table ── */}
        <div style={{ padding: "12px 24px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: H, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Charges
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ backgroundColor: `${H}10` }}>
                <th style={{ padding: "5px 8px", textAlign: "left", borderBottom: `2px solid ${H}`, fontWeight: 600 }}>Description</th>
                <th style={{ padding: "5px 8px", textAlign: "center", borderBottom: `2px solid ${H}`, fontWeight: 600, width: 80 }}>Category</th>
                <th style={{ padding: "5px 8px", textAlign: "right", borderBottom: `2px solid ${H}`, fontWeight: 600, width: 90 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.feeItems.map((item, i) => (
                <tr key={item.id} style={{ backgroundColor: i % 2 === 1 ? `${H}05` : "transparent" }}>
                  <td style={{ padding: "4px 8px", borderBottom: `1px solid ${H}12` }}>{item.description}</td>
                  <td style={{ padding: "4px 8px", borderBottom: `1px solid ${H}12`, textAlign: "center", textTransform: "capitalize", fontSize: 10, color: "#555" }}>{item.category}</td>
                  <td style={{ padding: "4px 8px", borderBottom: `1px solid ${H}12`, textAlign: "right" }}>${fmt(item.amount)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, backgroundColor: `${H}10` }}>
                <td colSpan={2} style={{ padding: "6px 8px", textAlign: "right", borderTop: `2px solid ${H}` }}>Total Charges</td>
                <td style={{ padding: "6px 8px", textAlign: "right", borderTop: `2px solid ${H}` }}>${fmt(totalFees)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Payments ── */}
        {formData.payments.length > 0 && (
          <div style={{ padding: "12px 24px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: H, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Payments & Credits
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ padding: "4px 8px", textAlign: "left", borderBottom: `1px solid ${H}30`, fontWeight: 600 }}>Description</th>
                  <th style={{ padding: "4px 8px", textAlign: "center", borderBottom: `1px solid ${H}30`, fontWeight: 600, width: 80 }}>Date</th>
                  <th style={{ padding: "4px 8px", textAlign: "right", borderBottom: `1px solid ${H}30`, fontWeight: 600, width: 90 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.payments.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "4px 8px", borderBottom: `1px solid ${H}10` }}>{item.description}</td>
                    <td style={{ padding: "4px 8px", borderBottom: `1px solid ${H}10`, textAlign: "center", fontSize: 10 }}>{item.date}</td>
                    <td style={{ padding: "4px 8px", borderBottom: `1px solid ${H}10`, textAlign: "right", color: "#16a34a" }}>−${fmt(item.amount)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700 }}>
                  <td colSpan={2} style={{ padding: "5px 8px", textAlign: "right", borderTop: `1px solid ${H}30` }}>Total Payments</td>
                  <td style={{ padding: "5px 8px", textAlign: "right", borderTop: `1px solid ${H}30`, color: "#16a34a" }}>−${fmt(totalPayments)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ── Balance ── */}
        <div style={{ margin: "12px 24px", padding: "10px 14px", backgroundColor: balance > 0 ? "#fef2f2" : "#f0fdf4", borderRadius: 6, border: `1px solid ${balance > 0 ? "#fca5a5" : "#86efac"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Balance Due</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: balance > 0 ? "#dc2626" : "#16a34a" }}>
              ${fmt(balance)}
            </span>
          </div>
          {balance <= 0 && (
            <div style={{ fontSize: 10, color: "#16a34a", marginTop: 3, textAlign: "right", fontWeight: 600 }}>
              ✓ PAID IN FULL
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ backgroundColor: `${H}08`, borderTop: `1px solid ${H}20`, padding: "10px 24px", fontSize: 9, color: "#777", textAlign: "center", lineHeight: 1.6 }}>
          {formData.footerNote}
        </div>
      </div>
    </div>
  )

  const footerContent = (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {EXPORT_QUALITY_OPTIONS.find((o) => o.value === exportQuality)?.label || "Select Quality"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {EXPORT_QUALITY_OPTIONS.map((o) => (
            <DropdownMenuItem key={o.value} onClick={() => setExportQuality(o.value)}>
              {o.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="default" onClick={() => onDownload(exportQuality)} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Download Receipt
      </Button>
    </div>
  )

  return (
    <PreviewContainer title="Tuition Receipt Preview" footer={footerContent}>
      {previewContent}
    </PreviewContainer>
  )
}

export default TuitionReceiptPreview
