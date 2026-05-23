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

const TuitionReceiptPreview: React.FC<TuitionReceiptPreviewProps> = ({
  formData,
  onDownload,
  previewRef,
}) => {
  const [exportQuality, setExportQuality] = useState<string>("high")

  // Calculate totals
  const totalFees = formData.feeItems.reduce((sum, item) => sum + item.amount, 0)
  const totalPayments = formData.payments.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalFees - totalPayments

  const previewContent = (
    <div
      id="tuition-receipt-preview"
      ref={previewRef}
      className="w-full max-w-2xl mx-auto"
      style={{
        fontFamily: formData.fontFamily,
        color: formData.textColor,
        backgroundColor: formData.paperColor,
        border: formData.enableBorder ? `2px ${formData.borderStyle} ${formData.borderColor}` : "none",
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div
            style={{
              color: `rgba(${parseInt(formData.watermarkColor.slice(1, 3), 16)}, ${parseInt(formData.watermarkColor.slice(3, 5), 16)}, ${parseInt(formData.watermarkColor.slice(5, 7), 16)}, ${formData.watermarkOpacity / 100})`,
              fontSize: `${parseInt(formData.watermarkSize) * 0.8 + 1.5}rem`,
              transform: `rotate(${formData.watermarkAngle}deg)`,
              letterSpacing: "4px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {formData.watermarkText}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: formData.headerColor,
            color: "#ffffff",
            padding: "24px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>{formData.universityName}</div>
              <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>{formData.department}</div>
              <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px" }}>{formData.universityAddress}</div>
            </div>
            <div style={{ width: "60px", height: "60px" }}>
              <img
                src={formData.universityLogo}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* Receipt Title */}
        <div style={{ textAlign: "center", padding: "16px 32px 8px" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: formData.headerColor }}>
            {formData.receiptTitle}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Receipt No: {formData.receiptNumber} | Date: {formData.issueDate}
          </div>
        </div>

        {/* Student Info */}
        <div style={{ padding: "12px 32px", borderBottom: `1px solid ${formData.accentColor}30` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
            <div><strong>Student:</strong> {formData.studentName}</div>
            <div><strong>ID:</strong> {formData.studentId}</div>
            <div><strong>Program:</strong> {formData.program}</div>
            <div><strong>Term:</strong> {formData.term}</div>
            <div><strong>Academic Year:</strong> {formData.academicYear}</div>
          </div>
        </div>

        {/* Fee Table */}
        <div style={{ padding: "16px 32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: `${formData.accentColor}15` }}>
                <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: `2px solid ${formData.accentColor}` }}>Description</th>
                <th style={{ padding: "8px 12px", textAlign: "center", borderBottom: `2px solid ${formData.accentColor}`, width: "100px" }}>Category</th>
                <th style={{ padding: "8px 12px", textAlign: "right", borderBottom: `2px solid ${formData.accentColor}`, width: "100px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.feeItems.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 1 ? `${formData.accentColor}08` : "transparent" }}>
                  <td style={{ padding: "6px 12px", borderBottom: "1px solid #eee" }}>{item.description}</td>
                  <td style={{ padding: "6px 12px", borderBottom: "1px solid #eee", textAlign: "center", textTransform: "capitalize" }}>{item.category}</td>
                  <td style={{ padding: "6px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold", backgroundColor: `${formData.accentColor}15` }}>
                <td colSpan={2} style={{ padding: "8px 12px", textAlign: "right", borderTop: `2px solid ${formData.accentColor}` }}>Total Charges</td>
                <td style={{ padding: "8px 12px", textAlign: "right", borderTop: `2px solid ${formData.accentColor}` }}>${totalFees.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payments */}
        {formData.payments.length > 0 && (
          <div style={{ padding: "0 32px 16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: formData.headerColor }}>Payments & Credits</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 12px", textAlign: "left", borderBottom: `1px solid ${formData.accentColor}` }}>Description</th>
                  <th style={{ padding: "6px 12px", textAlign: "center", borderBottom: `1px solid ${formData.accentColor}`, width: "100px" }}>Date</th>
                  <th style={{ padding: "6px 12px", textAlign: "right", borderBottom: `1px solid ${formData.accentColor}`, width: "100px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.payments.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "6px 12px", borderBottom: "1px solid #eee" }}>{item.description}</td>
                    <td style={{ padding: "6px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>{item.date}</td>
                    <td style={{ padding: "6px 12px", borderBottom: "1px solid #eee", textAlign: "right", color: "#16a34a" }}>-${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2} style={{ padding: "8px 12px", textAlign: "right", borderTop: `1px solid ${formData.accentColor}` }}>Total Payments</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", borderTop: `1px solid ${formData.accentColor}`, color: "#16a34a" }}>-${totalPayments.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Balance */}
        <div style={{ padding: "12px 32px", margin: "0 32px", backgroundColor: balance > 0 ? "#fef2f2" : "#f0fdf4", borderRadius: "8px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>Balance Due</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: balance > 0 ? "#dc2626" : "#16a34a" }}>
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          {balance <= 0 && (
            <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px", textAlign: "right" }}>✓ PAID IN FULL</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 32px", borderTop: `1px solid #eee`, fontSize: "11px", color: "#888", textAlign: "center" }}>
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
            {EXPORT_QUALITY_OPTIONS.find((opt) => opt.value === exportQuality)?.label || "Select Quality"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {EXPORT_QUALITY_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => setExportQuality(option.value)}>
              {option.label}
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
