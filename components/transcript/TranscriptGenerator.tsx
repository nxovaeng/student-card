"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TranscriptInfoForm from "./TranscriptInfoForm"
import TranscriptDesignForm from "./TranscriptDesignForm"
import TranscriptPreview from "./TranscriptPreview"
import { useTranscript } from "@/hooks/useTranscript"
import { DEFAULT_TRANSCRIPT_DATA } from "@/lib/constants"

/**
 * 成绩单生成器组件
 */
export default function TranscriptGenerator() {
  const [activeTab, setActiveTab] = useState("info")
  const previewRef = useRef<HTMLDivElement>(null)

  // 使用自定义Hook获取成绩单状态和处理函数
  const { formData, handleInputChange, handleFileChange, handleCoursesChange, resetForm } =
    useTranscript(DEFAULT_TRANSCRIPT_DATA)

  // 处理表单字段变更
  const handleFormChange = (name: string, value: string | boolean | number) => {
    const event = {
      target: {
        name,
        value,
        type: typeof value === "boolean" ? "checkbox" : "text",
      },
    } as React.ChangeEvent<HTMLInputElement>

    handleInputChange(event)
  }

  // 下载成绩单图片
  const handleDownload = async (quality: string) => {
    if (!previewRef.current) return

    const fileName = `${formData.studentName || "student"}_transcript`

    try {
      const fixStyle = document.createElement("style")
      fixStyle.id = "export-fix-style"
      fixStyle.textContent = `img { display: inline-block !important; }`
      document.head.appendChild(fixStyle)

      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Use DPI-based export: A4 portrait = 210 × 297 mm
      const { exportElementToPng } = await import("@/lib/utils")
      await exportElementToPng(
        previewRef.current,
        210,
        297,
        quality,
        fileName,
        formData.paperColor || "#ffffff",
      )

      document.getElementById("export-fix-style")?.remove()
    } catch (err) {
      console.error("Export error:", err)
      alert("Export failed, please try again later.")
    }
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full tabs-container">
        <div className="bg-gray-100 rounded-md p-2 w-full mb-6">
          <TabsList className="flex mx-0 tabs-list overflow-x-auto bg-transparent">
            <TabsTrigger className="tabs-trigger" value="info">
              成绩信息
            </TabsTrigger>
            <TabsTrigger className="tabs-trigger" value="design">
              设计选项
            </TabsTrigger>
            <TabsTrigger className="tabs-trigger" value="preview">
              预览
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="mt-0">
          <TranscriptInfoForm
            formData={formData}
            onChange={handleFormChange}
            onFileChange={handleFileChange}
            onCoursesChange={handleCoursesChange}
          />
        </TabsContent>

        <TabsContent value="design" className="mt-0">
          <TranscriptDesignForm formData={formData} onChange={handleFormChange} />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <TranscriptPreview
            formData={formData}
            onChange={handleFormChange}
            onDownload={handleDownload}
            previewRef={previewRef}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
