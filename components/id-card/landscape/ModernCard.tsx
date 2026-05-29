import type React from "react"
import type { CardComponentProps } from "@/lib/types"
import { CardElements } from "@/components/id-card/common/CardElements"

/**
 * Landscape Modern ID Card
 * ISO/IEC 7810 ID-1 standard: 85.60 × 53.98 mm, aspect ratio 1.586:1
 * Layout inspired by real university student ID cards.
 */
export const ModernCard: React.FC<CardComponentProps> = ({ formData, barcodeRef }) => {
  const primary = formData.cardColor || "#1e40af"
  const textCol = formData.textColor || "#ffffff"

  // Derive a slightly lighter shade for the header gradient
  const headerGradient = `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        aspectRatio: "1.586 / 1",
        maxWidth: "100%",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.12)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <CardElements formData={formData}>
        {/* ── Left colour band ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "36%",
            background: headerGradient,
            zIndex: 1,
          }}
        >
          {/* Subtle diagonal stripe overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 10px)",
            }}
          />

          {/* University logo */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "52%",
              aspectRatio: "1",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            <img
              src={formData.logo || "/placeholder.svg"}
              alt="Logo"
              style={{ width: "80%", height: "80%", objectFit: "contain" }}
            />
          </div>

          {/* Student photo */}
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "68%",
              aspectRatio: "3/4",
              border: "2px solid rgba(255,255,255,0.7)",
              overflow: "hidden",
              backgroundColor: "#e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={formData.photo || "/placeholder-user.jpg"}
              alt="Student"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* ── Right content area ── */}
        <div
          style={{
            position: "absolute",
            left: "37%",
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            padding: "5% 5% 4% 4%",
          }}
        >
          {/* Header: university name + "STUDENT ID" */}
          <div style={{ borderBottom: `1.5px solid ${primary}30`, paddingBottom: "4%", marginBottom: "4%" }}>
            <div
              style={{
                fontSize: "0.55em",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: primary,
                lineHeight: 1.2,
              }}
            >
              {formData.universityName || "International University"}
            </div>
            <div
              style={{
                fontSize: "0.42em",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#666",
                marginTop: 2,
              }}
            >
              Student Identification Card
            </div>
          </div>

          {/* Name + faculty */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "0.72em",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.2,
                marginBottom: "2%",
              }}
            >
              {formData.fullName || "JOHN SMITH"}
            </div>
            <div style={{ fontSize: "0.42em", color: "#555", marginBottom: "1%" }}>
              {formData.faculty || "School of Engineering"}
            </div>
            <div style={{ fontSize: "0.4em", color: "#777" }}>
              {formData.programType || "Bachelor"} · {formData.enrollmentYear || "2024"}
            </div>

            {/* Info grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3% 4%",
                marginTop: "5%",
              }}
            >
              {[
                ["ID No.", formData.studentId || "2024001001"],
                ["Valid Until", formData.validityEnd ? formData.validityEnd.slice(0, 7).replace("-", "/") : "2028/06"],
                ["Issue Date", formData.issueDate ? formData.issueDate.slice(0, 7).replace("-", "/") : "2024/09"],
                ["Card No.", formData.cardNumber || "C12345678"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: "0.32em", color: "#999", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "0.42em", fontWeight: 600, color: "#222", marginTop: 1 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Barcode + signature row */}
          <div
            style={{
              borderTop: `1px solid ${primary}20`,
              paddingTop: "3%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "4%",
            }}
          >
            {/* Barcode */}
            <div style={{ flex: 1, backgroundColor: "#fff", padding: "1px 0" }}>
              <svg ref={barcodeRef} style={{ width: "100%", height: 22, display: "block" }} />
            </div>

            {/* Signature */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.5em",
                  color: "#333",
                  borderBottom: "0.5px solid #999",
                  paddingBottom: 1,
                  minWidth: 60,
                }}
              >
                {formData.officialSignature || "S. Davis"}
              </div>
              <div style={{ fontSize: "0.3em", color: "#888", marginTop: 1 }}>Registrar</div>
            </div>
          </div>
        </div>

        {/* ── Hologram dot (realistic effect) ── */}
        {formData.realisticEffect && (
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "28%",
              width: "5%",
              aspectRatio: "1",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(100,200,255,0.5), rgba(200,100,255,0.3), transparent)",
              zIndex: 10,
              opacity: 0.85,
            }}
          />
        )}
      </CardElements>
    </div>
  )
}

export default ModernCard
