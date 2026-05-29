"use client"

import { useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InfoForm from "@/components/id-card/form/InfoForm"
import DesignForm from "@/components/id-card/form/DesignForm"
import PreviewForm from "@/components/id-card/form/PreviewForm"
import { useIDCard } from "@/hooks/useIDCard"
import { DEFAULT_FORM_DATA } from "@/lib/constants"
import { exportElementToPng, validateFormData } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import type { IDCardFormData, ScheduleCourse } from "@/lib/types"
import CertificateGenerator from "@/components/certificate/CertificateGenerator"
import ScheduleGenerator from "@/components/schedule/ScheduleGenerator"
import AdmissionLetterGenerator from "@/components/admission-letter/AdmissionLetterGenerator"
import TranscriptGenerator from "@/components/transcript/TranscriptGenerator"
import TuitionReceiptGenerator from "@/components/tuition-receipt/TuitionReceiptGenerator"
import Footer from "@/components/layout/Footer"

import GlobalProfilePanel from "@/components/profile/GlobalProfilePanel"

/**
 * Home Page Component
 */
export default function Home() {
  // Use non-null assertion to ensure ref type doesn't include null
  const previewRef = useRef<HTMLDivElement>(null)

  // Use react-hook-form
  const form = useForm<IDCardFormData>({
    defaultValues: DEFAULT_FORM_DATA as IDCardFormData,
  })

  // Use custom Hook to get card state and handler functions
  const { formData, formErrors, handleInputChange, handleFileChange, resetForm } = useIDCard(
    DEFAULT_FORM_DATA as IDCardFormData,
  )

  // Handle form field changes
  const handleFormChange = (name: string, value: string | boolean | number | string[] | ScheduleCourse[]) => {
    handleInputChange({ target: { name, value } } as any)
  }

  // Download card image
  const handleDownload = async (quality: string) => {
    if (!previewRef.current) return

    // Validate form data
    const errors = validateFormData(formData)
    if (Object.keys(errors).length > 0) {
      alert("Please complete all required information first.")
      return
    }

    const fileName = `${formData.fullName || "student"}_id_card`

    try {
      const fixStyle = document.createElement("style")
      fixStyle.id = "export-fix-style"
      fixStyle.textContent = `img { display: inline-block !important; }`
      document.head.appendChild(fixStyle)

      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Credit card ISO/IEC 7810 ID-1: 85.6 × 54 mm
      // Portrait cards use 54 × 85.6 mm
      const isPortrait = formData.orientation === "portrait"
      await exportElementToPng(
        previewRef.current,
        isPortrait ? 54 : 85.6,
        isPortrait ? 85.6 : 54,
        quality,
        fileName,
        formData.cardColor || "#1e40af",
      )

      document.getElementById("export-fix-style")?.remove()
    } catch (err) {
      console.error("Error occurred while exporting image:", err)
      alert("Failed to export image, please try again later")
    }
  }


  return (
    <>
      <div className="w-full max-w-screen-2xl mx-auto px-4 pt-4 pb-8">
        {/* Document type selection */}
        <Tabs defaultValue="profile" className="w-full mb-6 tabs-container">
          <div className="bg-gray-100 rounded-md p-2 w-full">
            <TabsList className="flex mx-0 tabs-list overflow-x-auto bg-transparent">
              <TabsTrigger className="tabs-trigger" value="profile">
                📋 Profile
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="id-card">
                Student ID Card
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="certificate">
                Certificate of Enrollment
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="schedule">
                Course Schedule
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="admission">
                Admission Letter
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="transcript">
                Transcript
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="tuition-receipt">
                Tuition Receipt
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile">
            <GlobalProfilePanel />
          </TabsContent>

          <TabsContent value="id-card">
            {/* Form error message */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Form Information Incomplete</AlertTitle>
                <AlertDescription>Please fill in all required fields before proceeding.</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <Tabs defaultValue="info" className="w-full tabs-container">
                <div className="bg-gray-100 rounded-md p-2 w-full mb-6">
                  <TabsList className="flex mx-0 tabs-list overflow-x-auto bg-transparent">
                    <TabsTrigger className="tabs-trigger" value="info">
                      ID Information
                    </TabsTrigger>
                    <TabsTrigger className="tabs-trigger" value="design">
                      Design Options
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="info" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form section */}
                    <div className="order-2 md:order-1">
                      <InfoForm formData={formData} onChange={handleFormChange} onFileChange={handleFileChange} />
                    </div>

                    {/* Preview section */}
                    <div className="order-1 md:order-2">
                      <PreviewForm
                        formData={formData}
                        onChange={handleFormChange}
                        onFileChange={handleFileChange}
                        onDownload={handleDownload}
                        previewRef={previewRef}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form section */}
                    <div className="order-2 md:order-1">
                      <DesignForm formData={formData} onChange={handleFormChange} onFileChange={handleFileChange} />
                    </div>

                    {/* Preview section */}
                    <div className="order-1 md:order-2">
                      <PreviewForm
                        formData={formData}
                        onChange={handleFormChange}
                        onFileChange={handleFileChange}
                        onDownload={handleDownload}
                        previewRef={previewRef}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Form>
          </TabsContent>

          <TabsContent value="certificate">
            <CertificateGenerator />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleGenerator />
          </TabsContent>

          <TabsContent value="admission">
            <AdmissionLetterGenerator />
          </TabsContent>

          <TabsContent value="transcript">
            <TranscriptGenerator />
          </TabsContent>

          <TabsContent value="tuition-receipt">
            <TuitionReceiptGenerator />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </>
  )
}
