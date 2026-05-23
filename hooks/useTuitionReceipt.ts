"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { TuitionReceiptFormData, TuitionFeeItem, TuitionPaymentItem } from "@/lib/types"
import { DEFAULT_TUITION_RECEIPT_DATA } from "@/lib/constants"

export const useTuitionReceipt = (initialData: TuitionReceiptFormData = DEFAULT_TUITION_RECEIPT_DATA) => {
  const [formData, setFormData] = useState<TuitionReceiptFormData>(initialData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormErrors(validateData(formData))
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Add fee item
  const addFeeItem = () => {
    const newItem: TuitionFeeItem = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      category: "fee",
    }
    setFormData({
      ...formData,
      feeItems: [...formData.feeItems, newItem],
    })
  }

  // Remove fee item
  const removeFeeItem = (id: string) => {
    setFormData({
      ...formData,
      feeItems: formData.feeItems.filter((item) => item.id !== id),
    })
  }

  // Update fee item
  const updateFeeItem = (id: string, field: keyof TuitionFeeItem, value: string | number) => {
    setFormData({
      ...formData,
      feeItems: formData.feeItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  // Add payment
  const addPayment = () => {
    const newPayment: TuitionPaymentItem = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    }
    setFormData({
      ...formData,
      payments: [...formData.payments, newPayment],
    })
  }

  // Remove payment
  const removePayment = (id: string) => {
    setFormData({
      ...formData,
      payments: formData.payments.filter((item) => item.id !== id),
    })
  }

  // Update payment
  const updatePayment = (id: string, field: keyof TuitionPaymentItem, value: string | number) => {
    setFormData({
      ...formData,
      payments: formData.payments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const resetForm = () => {
    setFormData(DEFAULT_TUITION_RECEIPT_DATA)
    setFormErrors({})
  }

  const downloadReceipt = async (quality: string) => {
    const element = document.getElementById("tuition-receipt-preview")
    if (!element) return

    try {
      let scaleValue = 2
      switch (quality) {
        case "low": scaleValue = 2; break
        case "medium": scaleValue = 3; break
        case "high": scaleValue = 4; break
        case "ultra": scaleValue = 6; break
        default: scaleValue = 4
      }

      const html2canvasModule = await import("html2canvas")
      const html2canvas = html2canvasModule.default

      const canvas = await html2canvas(element, {
        scale: scaleValue,
        useCORS: true,
        backgroundColor: formData.paperColor,
        logging: false,
        allowTaint: true,
        scrollY: -window.scrollY,
      })

      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `tuition-receipt-${formData.studentId || "student"}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error generating image:", err)
    }
  }

  const validateData = (data: TuitionReceiptFormData): Record<string, string> => {
    const errors: Record<string, string> = {}
    if (!data.studentName) errors.studentName = "Required"
    if (!data.studentId) errors.studentId = "Required"
    if (!data.universityName) errors.universityName = "Required"
    return errors
  }

  return {
    formData,
    formErrors,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    addFeeItem,
    removeFeeItem,
    updateFeeItem,
    addPayment,
    removePayment,
    updatePayment,
    resetForm,
    downloadReceipt,
  }
}
