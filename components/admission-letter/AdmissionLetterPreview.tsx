"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import PreviewContainer from "@/components/common/PreviewContainer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPORT_QUALITY_OPTIONS } from "@/lib/constants"
import type { AdmissionLetterPreviewProps } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function AdmissionLetterPreview({
  formData,
  onChange,
  onDownload,
  previewRef,
}: AdmissionLetterPreviewProps) {
  const handleDownload = () => {
    if (onDownload) onDownload(formData.pngQuality || "high")
  }

  const fmtDate = (d: string) => (d ? formatDate(d) : "")

  const H = formData.headerColor || "#1e40af"
  const accent = formData.accentColor || "#4f46e5"

  // Watermark grid
  const renderWatermark = () => {
    if (!formData.enableWatermark || !formData.watermarkText) return null
    const items: React.ReactNode[] = []
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        items.push(
          <div
            key={`${r}-${c}`}
            style={{
              position: "absolute",
              top: `${r * 13}%`,
              left: `${c * 14 - 4}%`,
              fontSize: `${Number.parseInt(formData.watermarkSize) || 14}px`,
              color: formData.watermarkColor,
              opacity: formData.watermarkOpacity / 100,
              transform: `rotate(${formData.watermarkAngle}deg)`,
              whiteSpace: "nowrap",
              fontWeight: "bold",
              pointerEvents: "none",
            }}
          >
            {formData.watermarkText}
          </div>,
        )
      }
    }
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 5, pointerEvents: "none" }}>
        {items}
      </div>
    )
  }

  const downloadButton = (
    <div className="flex items-center gap-2">
      <Select value={formData.pngQuality || "high"} onValueChange={(v) => onChange("pngQuality", v)}>
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
    <PreviewContainer title="Admission Letter Preview" actions={downloadButton}>
      <div
        ref={previewRef}
        style={{
          width: "100%",
          maxWidth: "210mm",
          margin: "0 auto",
          backgroundColor: formData.paperColor || "#fff",
          color: formData.textColor || "#111",
          fontFamily: formData.fontFamily || "Times New Roman, serif",
          position: "relative",
          overflow: "hidden",
          border: formData.enableBorder ? `1.5px ${formData.borderStyle} ${formData.borderColor}` : "none",
        }}
      >
        {renderWatermark()}

        {/* ── Top accent bar ── */}
        <div style={{ height: 6, backgroundColor: H }} />

        {/* ── Letterhead ── */}
        <div style={{ padding: "24px 36px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${H}25` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {formData.universityLogo && (
              <img src={formData.universityLogo} alt="Logo" style={{ height: 56, width: 56, objectFit: "contain" }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: H, letterSpacing: "0.02em" }}>
                {formData.universityName}
              </div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 2, lineHeight: 1.6 }}>
                {formData.universityAddress}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#555", lineHeight: 1.7 }}>
            <div>{formData.universityContact}</div>
            <div>{formData.universityWebsite}</div>
          </div>
        </div>

        {/* ── Document title ── */}
        <div style={{ textAlign: "center", padding: "18px 36px 12px" }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 20,
              fontWeight: 700,
              color: H,
              borderBottom: `2.5px solid ${accent}`,
              paddingBottom: 5,
              letterSpacing: "0.04em",
            }}
          >
            {formData.letterTitle || "Letter of Admission"}
          </div>
        </div>

        {/* ── Date + recipient ── */}
        <div style={{ padding: "0 36px 14px", fontSize: 12, lineHeight: 1.9 }}>
          <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
            <div><span style={{ fontWeight: 600 }}>Date: </span>{fmtDate(formData.admissionDate)}</div>
            {formData.applicationId && (
              <div><span style={{ fontWeight: 600 }}>Application ID: </span>{formData.applicationId}</div>
            )}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>To: </span>{formData.studentName}
          </div>
          {formData.studentId && (
            <div><span style={{ fontWeight: 600 }}>Student ID: </span>{formData.studentId}</div>
          )}
          {formData.studentAddress && (
            <div><span style={{ fontWeight: 600 }}>Address: </span>{formData.studentAddress}</div>
          )}
          {formData.studentEmail && (
            <div><span style={{ fontWeight: 600 }}>Email: </span>{formData.studentEmail}</div>
          )}
        </div>

        {/* ── Letter body ── */}
        <div style={{ padding: "0 36px 16px", fontSize: 12, lineHeight: 1.85, textAlign: "justify", whiteSpace: "pre-line" }}>
          {formData.letterContent}
        </div>

        {/* ── Admission details box ── */}
        <div
          style={{
            margin: "0 36px 16px",
            border: `1px solid ${H}30`,
            borderLeft: `4px solid ${H}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: `${H}10`, padding: "8px 14px", borderBottom: `1px solid ${H}20` }}>
            <span style={{ fontWeight: 700, fontSize: 12, color: H, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Admission Details
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", padding: "10px 14px", fontSize: 11, lineHeight: 2 }}>
            {([
              ["Program", formData.programName],
              ["Department", formData.departmentName],
              ["Degree", formData.degreeType],
              ["Duration", formData.programDuration],
              ["Start Date", fmtDate(formData.programStartDate)],
              formData.scholarshipInfo ? ["Scholarship", formData.scholarshipInfo] : null,
              formData.depositAmount ? ["Deposit Required", `$${formData.depositAmount}`] : null,
              formData.depositDeadline ? ["Deposit Deadline", fmtDate(formData.depositDeadline)] : null,
            ].filter(Boolean) as string[][]
            ).map(([label, value]) => (
                <div key={label as string} style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontWeight: 600, color: H, minWidth: 90, flexShrink: 0 }}>{label}:</span>
                  <span>{value || "—"}</span>
                </div>
              ))}
          </div>
        </div>

        {/* ── Congratulatory message ── */}
        {formData.congratulatoryMessage && (
          <div style={{ margin: "0 36px 14px", padding: "10px 14px", backgroundColor: `${accent}0d`, borderRadius: 4, fontSize: 12, fontStyle: "italic", color: H, lineHeight: 1.7 }}>
            {formData.congratulatoryMessage}
          </div>
        )}

        {/* ── Next steps ── */}
        {formData.nextStepsInfo && (
          <div style={{ padding: "0 36px 16px", fontSize: 12, lineHeight: 1.85 }}>
            <div style={{ fontWeight: 700, color: H, marginBottom: 6, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Next Steps
            </div>
            <div style={{ whiteSpace: "pre-line" }}>{formData.nextStepsInfo}</div>
          </div>
        )}

        {/* ── Signature ── */}
        <div style={{ padding: "16px 36px 20px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 18, borderBottom: "1px solid #333", paddingBottom: 3, minWidth: 180, marginBottom: 5 }}>
              {formData.signatoryName}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{formData.signatoryTitle}</div>
            <div style={{ fontSize: 11, color: "#555" }}>{formData.universityName}</div>
          </div>
        </div>

        {/* ── Bottom accent bar ── */}
        <div style={{ height: 4, backgroundColor: accent }} />
      </div>
    </PreviewContainer>
  )
}
