"use client"

import type React from "react"
import { useState, type RefObject } from "react"
import type { IDCardFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { EXPORT_QUALITY_OPTIONS } from "@/lib/constants"
import CardPreview from "@/components/id-card/preview/CardPreview"
import { Download } from "lucide-react"
import { useFormContext } from "react-hook-form"
import PreviewContainer from "@/components/common/PreviewContainer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

/**
 * Preview Form Component
 * Used for displaying card preview and export options
 */
export interface IDCardPreviewFormProps {
  formData: IDCardFormData
  onChange: (name: string, value: string | boolean) => void
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void
  onDownload: (quality: string) => void
  previewRef?: RefObject<HTMLDivElement | null>
}

export const PreviewForm: React.FC<IDCardPreviewFormProps> = ({ formData, onChange, onDownload, previewRef }) => {
  // Get form context
  const form = useFormContext()

  // Export quality
  const [exportQuality, setExportQuality] = useState<string>("high")

  // Handle download button click
  const handleDownload = () => {
    onDownload(exportQuality)
  }

  // Handle quality selection
  const handleQualityChange = (quality: string) => {
    setExportQuality(quality)
  }

  // Preview content
  const previewContent = (
    <div id="student-card" ref={previewRef} className={`w-full ${formData.orientation === 'portrait' ? 'max-w-[280px]' : 'max-w-md'} mx-auto`}>
      {/* Card front preview */}
      <CardPreview formData={formData} />
    </div>
  )

  // Footer action area
  const footerContent = (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export quality selection */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {EXPORT_QUALITY_OPTIONS.find((opt) => opt.value === exportQuality)?.label || "Select Export Quality"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {EXPORT_QUALITY_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleQualityChange(option.value)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {exportQuality === option.value && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Download button */}
        <Button variant="default" onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Student ID
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">
        Output size: Credit Card (85.6 × 54 mm) at selected DPI
      </p>
    </>
  )

  return (
    <>
      <PreviewContainer title="Student ID Preview" footer={footerContent}>
        {previewContent}
      </PreviewContainer>
    </>
  )
}

export default PreviewForm
