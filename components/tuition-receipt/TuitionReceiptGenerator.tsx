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
import html2canvas from "html2canvas"
import { exportToImage } from "@/lib/utils"

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

  const handleDownload = (quality: string) => {
    if (!previewRef.current) return

    const fileName = `tuition-receipt-${formData.studentId || "student"}`

    const styleFixElement = document.createElement("style")
    styleFixElement.id = "export-fix-style"
    styleFixElement.textContent = `
      #tuition-receipt-preview img { display: inline-block !important; }
      #tuition-receipt-preview { font-variant: normal !important; }
    `
    document.head.appendChild(styleFixElement)

    window.scrollTo(0, 0)

    setTimeout(() => {
      html2canvas(previewRef.current as HTMLElement, {
        scale: quality === "ultra" ? 4 : quality === "high" ? 3 : quality === "medium" ? 2 : 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: formData.paperColor,
        scrollY: -window.scrollY,
        foreignObjectRendering: false,
      }).then((canvas) => {
        exportToImage(canvas, fileName, "png")
        document.getElementById("export-fix-style")?.remove()
      })
    }, 300)
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
