"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { CertificatePreviewProps } from "@/lib/types"
import { EXPORT_QUALITY_OPTIONS } from "@/lib/constants"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"
import PreviewContainer from "@/components/common/PreviewContainer"

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ formData, onDownload, previewRef }) => {
  const [exportQuality, setExportQuality] = useState<string>("high")

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
  }

  const handleDownload = () => {
    if (onDownload) onDownload(exportQuality)
  }

  // ── Watermark ──────────────────────────────────────────────────────────────
  const renderWatermark = () => {
    if (!formData.enableWatermark || !formData.watermarkText) return null
    const size = Number.parseInt(formData.watermarkSize) || 14
    const angle = Number.parseInt(formData.watermarkAngle) || -30
    const opacity = (formData.watermarkOpacity / 100) * 2.5
    const density = Math.max(120, 200 - size * 4)
    const elements: React.ReactNode[] = []
    for (let row = -3; row < 25; row++) {
      for (let col = -1; col < 12; col++) {
        elements.push(
          <div
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              left: col * density + ((row % 2) * density) / 2,
              top: row * Math.max(36, density / 2.5),
              fontSize: size,
              color: formData.watermarkColor || "#000",
              opacity,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "center",
              pointerEvents: "none",
              zIndex: 3,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {formData.watermarkText.replace("LINE_DISABLED", "").trim()}
          </div>,
        )
      }
    }
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 3, pointerEvents: "none" }}>
        {elements}
      </div>
    )
  }

  // ── Decorative corner brackets ─────────────────────────────────────────────
  const renderCorners = () => {
    if (!formData.enablePattern) return null
    const c = formData.patternColor || formData.headerColor
    const op = (formData.patternOpacity || 15) / 100
    const sz = Number.parseInt(formData.patternSize) || 30
    const corners = [
      { top: 14, left: 14, borderTop: true, borderLeft: true },
      { top: 14, right: 14, borderTop: true, borderRight: true },
      { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
      { bottom: 14, right: 14, borderBottom: true, borderRight: true },
    ]
    return (
      <>
        {corners.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: sz,
              height: sz,
              opacity: op,
              zIndex: 2,
              pointerEvents: "none",
              ...pos,
              borderTop: pos.borderTop ? `2.5px solid ${c}` : undefined,
              borderBottom: pos.borderBottom ? `2.5px solid ${c}` : undefined,
              borderLeft: pos.borderLeft ? `2.5px solid ${c}` : undefined,
              borderRight: pos.borderRight ? `2.5px solid ${c}` : undefined,
            }}
          />
        ))}
        {/* Inner frame line */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            border: `0.5px solid ${c}`,
            opacity: op * 0.5,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </>
    )
  }

  const previewContent = (
    <div
      id="certificate-preview"
      ref={previewRef}
      style={{
        fontFamily: formData.fontFamily || "Times New Roman, serif",
        backgroundColor: formData.paperColor || "#fff",
        color: formData.textColor || "#000",
        width: "100%",
        maxWidth: "210mm",
        aspectRatio: "1 / 1.414",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        border: formData.enableBorder
          ? `1.5px ${formData.borderStyle || "solid"} ${formData.borderColor}`
          : "none",
      }}
    >
      {renderWatermark()}
      {renderCorners()}

      {/* ── Inner content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "5% 6%",
        }}
      >
        {/* ── Header band ── */}
        <div
          style={{
            backgroundColor: formData.headerColor,
            margin: "-5% -6% 0",
            padding: "3.5% 6% 3%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          {formData.universityLogo ? (
            <img
              src={formData.universityLogo}
              alt="University Logo"
              style={{ height: 52, width: 52, objectFit: "contain", flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 52, height: 52, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05em", letterSpacing: "0.06em" }}>
              {formData.universityName || "University Name"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.65em", marginTop: 2 }}>
              {formData.faculty || "Faculty / School"}
            </div>
          </div>
          {/* Issue date top-right */}
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.6em", textAlign: "right", flexShrink: 0 }}>
            <div>Issued</div>
            <div style={{ fontWeight: 600 }}>{formatDate(formData.issueDate)}</div>
          </div>
        </div>

        {/* ── Title ── */}
        <div style={{ textAlign: "center", margin: "4% 0 3%" }}>
          <div
            style={{
              fontSize: "0.6em",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: formData.headerColor,
              marginBottom: 6,
            }}
          >
            This is to certify that
          </div>
          <div
            style={{
              fontSize: "1.55em",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: formData.headerColor,
              borderBottom: `2px solid ${formData.headerColor}`,
              display: "inline-block",
              paddingBottom: 4,
            }}
          >
            {formData.certificateTitle || "Certificate of Enrollment"}
          </div>
        </div>

        {/* ── Student block ── */}
        <div
          style={{
            display: "flex",
            gap: "5%",
            alignItems: "flex-start",
            marginBottom: "3%",
          }}
        >
          {/* Photo */}
          <div
            style={{
              flexShrink: 0,
              width: 72,
              height: 96,
              border: `1.5px solid ${formData.headerColor}`,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            <img
              src={formData.studentPhoto || "/placeholder-user.jpg"}
              alt="Student"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info grid */}
          <div style={{ flex: 1, fontSize: "0.72em", lineHeight: 1.9 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Full Name", formData.fullName],
                  ["Student ID", formData.studentId],
                  ["Date of Birth", formatDate(formData.birthDate)],
                  ["Nationality", formData.nationality],
                  ["Faculty / School", formData.faculty],
                  ["Major / Program", formData.major],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td
                      style={{
                        fontWeight: 600,
                        width: "38%",
                        paddingRight: 8,
                        color: formData.headerColor,
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </td>
                    <td style={{ borderBottom: `0.5px solid ${formData.headerColor}30`, paddingBottom: 1 }}>
                      {value || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Academic details ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px 24px",
            fontSize: "0.68em",
            lineHeight: 1.8,
            backgroundColor: `${formData.headerColor}0d`,
            padding: "2% 3%",
            borderLeft: `3px solid ${formData.headerColor}`,
            marginBottom: "3%",
          }}
        >
          {[
            ["Degree Type", formData.degreeType],
            ["Study Mode", formData.studyMode],
            ["Enrollment Date", formatDate(formData.enrollmentDate)],
            ["Expected Graduation", formatDate(formData.expectedGraduationDate)],
            ["Current Year of Study", formData.currentYear],
            ["Validity Period", formData.validityPeriod],
          ].map(([label, value]) => (
            <div key={label}>
              <span style={{ fontWeight: 600, color: formData.headerColor }}>{label}: </span>
              <span>{value || "—"}</span>
            </div>
          ))}
        </div>

        {/* ── Certificate body text ── */}
        <div
          style={{
            fontSize: "0.7em",
            lineHeight: 1.75,
            textAlign: "justify",
            marginBottom: "3%",
            flex: 1,
          }}
        >
          {formData.certificateContent ||
            "This is to certify that the above-named student is currently enrolled as a full-time student in good academic standing at this institution. The student is making satisfactory progress toward the completion of their degree requirements."}
        </div>

        {/* ── Signature row ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${formData.headerColor}40`,
            paddingTop: "2%",
            marginTop: "auto",
          }}
        >
          {/* Seal placeholder */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: `2px dashed ${formData.headerColor}50`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.5em",
              color: `${formData.headerColor}70`,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            OFFICIAL
            <br />
            SEAL
          </div>

          {/* Signature */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "1.1em",
                color: "#1a1a1a",
                borderBottom: `1px solid #555`,
                paddingBottom: 2,
                minWidth: 140,
                marginBottom: 4,
              }}
            >
              {formData.issuerSignature || "Authorized Signature"}
            </div>
            <div style={{ fontSize: "0.62em", fontWeight: 600 }}>
              {formData.issuerTitle || "University Registrar"}
            </div>
            <div style={{ fontSize: "0.58em", color: "#555" }}>{formData.universityName}</div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: "2%",
            paddingTop: "1.5%",
            borderTop: `0.5px solid ${formData.headerColor}30`,
            fontSize: "0.55em",
            color: "#666",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {formData.contactInfo ||
            "For verification of this certificate, please contact the Office of the Registrar."}
        </div>
      </div>
    </div>
  )

  const footerContent = (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {EXPORT_QUALITY_OPTIONS.find((o) => o.value === exportQuality)?.label || "Select Export Quality"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {EXPORT_QUALITY_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setExportQuality(option.value)}
                className="flex items-center justify-between"
              >
                {option.label}
                {exportQuality === option.value && <span className="ml-2">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="default" onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Certificate
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">
        Output size: A4 (210 × 297 mm) at selected DPI
      </p>
    </>
  )

  return (
    <PreviewContainer title="Certificate Preview" footer={footerContent}>
      {previewContent}
    </PreviewContainer>
  )
}

export default CertificatePreview
