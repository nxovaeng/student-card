"use client"

import type React from "react"
import { useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useTuitionReceipt } from "@/hooks/useTuitionReceipt"
import { DEFAULT_TUITION_RECEIPT_DATA } from "@/lib/constants"
import TuitionReceiptInfoForm from "./TuitionReceiptInfoForm"
import TuitionReceiptDesignForm from "./TuitionReceiptDesignForm"
import TuitionReceiptPreview from "./TuitionReceiptPreview"
import type { TuitionReceiptFormData } from "@/lib/types"

const TuitionReceiptGenerator: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null)

  const form = useForm<TuitionReceiptFormData>({
    defaultValues: DEFAULT_TUITION_RECEIPT_DATA as TuitionReceiptFormData,
  })

  const {
    formData,
    formErrors,
    handleInputChange,
    handleFileChange,
    addFeeItem,
    removeFeeItem,
    updateFeeItem,
    addPayment,
    removePayment,
    updatePayment,
    resetForm,
  } = useTuitionReceipt(DEFAULT_TUITION_RECEIPT_DATA)

  const handleFormChange = (name: string, value: string | boolean | number) => {
    handleInputChange({ target: { name, value } } as any)
  }

  const handleDownload = async (quality: string) => {
    if (!previewRef.current) return

    const fileName = `tuition-receipt-${formData.studentId || "student"}`

    try {
      const fixStyle = document.createElement("style")
      fixStyle.id = "export-fix-style"
      fixStyle.textContent = `img { display: inline-block !important; }`
      document.head.appendChild(fixStyle)

      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Use DPI-based export: A5 portrait = 148 × 210 mm
      const { exportElementToPng } = await import("@/lib/utils")
      await exportElementToPng(
        previewRef.current,
        148,
        210,
        quality,
        fileName,
        formData.paperColor || "#ffffff",
      )

      document.getElementById("export-fix-style")?.remove()
    } catch (err) {
      console.error("Export error:", err)
    }
  }

  return (
    <div>
      {Object.keys(formErrors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incomplete Form Information</AlertTitle>
          <AlertDescription>Please fill in all required fields before proceeding.</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <Tabs defaultValue="info" className="w-full tabs-container">
          <div className="bg-gray-100 rounded-md p-2 w-full mb-6">
            <TabsList className="flex mx-0 tabs-list overflow-x-auto bg-transparent">
              <TabsTrigger className="tabs-trigger" value="info">
                Receipt Information
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="design">
                Design Options
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="order-2 lg:order-1">
                <TuitionReceiptInfoForm
                  formData={formData}
                  onChange={handleFormChange}
                  onFileChange={handleFileChange}
                  addFeeItem={addFeeItem}
                  removeFeeItem={removeFeeItem}
                  updateFeeItem={updateFeeItem}
                  addPayment={addPayment}
                  removePayment={removePayment}
                  updatePayment={updatePayment}
                />
              </div>

              <div className="order-1 lg:order-2">
                <TuitionReceiptPreview
                  formData={formData}
                  onDownload={handleDownload}
                  previewRef={previewRef}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="order-2 lg:order-1">
                <TuitionReceiptDesignForm
                  formData={formData}
                  onChange={handleFormChange}
                />
              </div>

              <div className="order-1 lg:order-2">
                <TuitionReceiptPreview
                  formData={formData}
                  onDownload={handleDownload}
                  previewRef={previewRef}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Form>
    </div>
  )
}

export default TuitionReceiptGenerator
