"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdmissionLetterInfoForm from "./AdmissionLetterInfoForm"
import AdmissionLetterDesignForm from "./AdmissionLetterDesignForm"
import AdmissionLetterPreview from "./AdmissionLetterPreview"
import { useAdmissionLetter } from "@/hooks/useAdmissionLetter"

/**
 * Admission Letter Generator Component
 */
export default function AdmissionLetterGenerator() {
  // Use admission letter Hook
  const { formData, formErrors, handleInputChange, handleFileChange, resetForm, validateForm, setFormData } =
    useAdmissionLetter()

  // Preview reference
  const previewRef = useRef<HTMLDivElement>(null)

  // Active tab state
  const [activeTab, setActiveTab] = useState("info")

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setActiveTab("preview")
    }
  }

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle download
  const handleDownload = async (quality: string) => {
    if (!previewRef.current) return

    try {
      // Use DPI-based export: A4 portrait = 210 × 297 mm
      const { exportElementToPng } = await import("@/lib/utils")
      await exportElementToPng(
        previewRef.current,
        210,
        297,
        quality,
        `admission-letter-${formData.studentName.replace(/\s+/g, "-")}`,
        formData.paperColor || "#ffffff",
      )
    } catch (error) {
      console.error("Export error:", error)
      alert("An error occurred during export, please try again.")
    }
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full tabs-container">
        <div className="bg-gray-100 rounded-md p-2 w-full mb-6">
          <TabsList className="flex mx-0 tabs-list overflow-x-auto bg-transparent">
            <TabsTrigger className="tabs-trigger" value="info">
              Admission Information
            </TabsTrigger>
            <TabsTrigger className="tabs-trigger" value="design">
              Design Options
            </TabsTrigger>
            <TabsTrigger className="tabs-trigger" value="preview">
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Information Form */}
        <TabsContent value="info" className="mt-0">
          <AdmissionLetterInfoForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
        </TabsContent>

        {/* Design Form */}
        <TabsContent value="design" className="mt-0">
          <AdmissionLetterDesignForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview" className="mt-0">
          <AdmissionLetterPreview
            formData={formData}
            onChange={handleFieldChange}
            onDownload={handleDownload}
            previewRef={previewRef}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
