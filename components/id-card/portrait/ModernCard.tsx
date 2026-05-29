import type React from "react"
import type { CardComponentProps } from "@/lib/types"
import { CardElements } from "@/components/id-card/common/CardElements"
import { QRCodeSVG } from "qrcode.react"
import { formatValidityDate } from "@/lib/utils"

/**
 * Portrait Modern ID Card
 * Aspect ratio: 54 × 85.6 mm (ISO ID-1 portrait)
 * Layout inspired by real university student ID cards.
 */
export const ModernCard: React.FC<CardComponentProps> = ({ formData, barcodeRef }) => {
  const primary = formData.cardColor || "#1e40af"
  const textCol = formData.textColor || "#ffffff"

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        aspectRatio: "54 / 85.6",
        maxWidth: "100%",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardElements formData={formData}>
        {/* ── Top header band ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 100%)`,
            padding: "6% 5% 5%",
            position: "relative",
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          {/* Diagonal stripe overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 10px)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "8%" }}>
            <div
              style={{
                width: "18%",
                aspectRatio: "1",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "1.5px solid rgba(255,255,255,0.5)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={formData.logo || "/placeholder.svg"}
                alt="Logo"
                style={{ width: "80%", height: "80%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  color: textCol,
                  fontWeight: 800,
                  fontSize: "0.52em",
                  letterSpacing: "0.06em",
                  lineHeight: 1.2,
                }}
              >
                {formData.universityName || "International University"}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.36em",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Student ID Card
              </div>
            </div>
          </div>
        </div>

        {/* ── Photo ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-8%",
            position: "relative",
            zIndex: 3,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36%",
              aspectRatio: "3/4",
              border: `2.5px solid ${primary}`,
              overflow: "hidden",
              backgroundColor: "#e5e7eb",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <img
              src={formData.photo || "/placeholder-user.jpg"}
              alt="Student"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ── Info block ── */}
        <div
          style={{
            flex: 1,
            padding: "4% 6% 3%",
            display: "flex",
            flexDirection: "column",
            gap: "3%",
            zIndex: 2,
          }}
        >
          {/* Name */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.65em",
                fontWeight: 700,
                color: "#111",
                letterSpacing: "0.02em",
              }}
            >
              {formData.fullName || "JOHN SMITH"}
            </div>
            <div style={{ fontSize: "0.38em", color: "#666", marginTop: 2 }}>
              {formData.faculty || "School of Engineering"}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: `${primary}25`, margin: "1% 0" }} />

          {/* Details grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4% 6%", fontSize: "0.38em" }}>
            {[
              ["Student ID", formData.studentId || "2024001001"],
              ["Program", formData.programType || "Bachelor"],
              ["Enrolled", formData.enrollmentYear || "2024"],
              ["Valid Until", formatValidityDate(formData.validityEnd) || "2028/06"],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.85em" }}>
                  {label}
                </div>
                <div style={{ color: "#222", fontWeight: 600, marginTop: 1 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* QR / Barcode */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "auto",
              paddingTop: "3%",
              borderTop: `1px solid ${primary}20`,
            }}
          >
            {formData.codeType === "qrcode" ? (
              <div style={{ backgroundColor: "#fff", padding: 3, border: `1px solid ${primary}30` }}>
                <QRCodeSVG
                  value={`ID:${formData.studentId || "S12345678"}`}
                  size={52}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                  includeMargin={false}
                />
              </div>
            ) : (
              <div style={{ backgroundColor: "#fff", padding: "2px 4px" }}>
                <svg ref={barcodeRef} style={{ width: "100%", maxWidth: 120, height: 28, display: "block" }} />
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom footer band ── */}
        <div
          style={{
            backgroundColor: primary,
            padding: "2.5% 5%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: "0.3em", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>
            {formData.universityWebsite || "www.university.edu"}
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.38em",
              color: "rgba(255,255,255,0.9)",
              borderBottom: "0.5px solid rgba(255,255,255,0.5)",
              paddingBottom: 1,
            }}
          >
            {formData.officialSignature || "S. Davis"}
          </div>
        </div>
      </CardElements>
    </div>
  )
}

export default ModernCard
