"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FEE_CATEGORY_OPTIONS, SEMESTER_OPTIONS } from "@/lib/constants"
import type { TuitionReceiptFormData, TuitionFeeItem, TuitionPaymentItem } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface TuitionReceiptInfoFormProps {
  formData: TuitionReceiptFormData
  onChange: (name: string, value: string | boolean | number) => void
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void
  addFeeItem: () => void
  removeFeeItem: (id: string) => void
  updateFeeItem: (id: string, field: keyof TuitionFeeItem, value: string | number) => void
  addPayment: () => void
  removePayment: (id: string) => void
  updatePayment: (id: string, field: keyof TuitionPaymentItem, value: string | number) => void
}

const TuitionReceiptInfoForm: React.FC<TuitionReceiptInfoFormProps> = ({
  formData,
  onChange,
  onFileChange,
  addFeeItem,
  removeFeeItem,
  updateFeeItem,
  addPayment,
  removePayment,
  updatePayment,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value)
  }

  return (
    <div className="space-y-6">
      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Term</Label>
              <Input name="term" value={formData.term} onChange={handleChange} placeholder="e.g., Fall 2024" />
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input name="academicYear" value={formData.academicYear} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fee Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addFeeItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Fee
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.feeItems.map((item) => (
              <div key={item.id} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateFeeItem(item.id, "description", e.target.value)}
                    placeholder="Fee description"
                  />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Amount ($)</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateFeeItem(item.id, "amount", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-32 space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={item.category}
                    onValueChange={(value) => updateFeeItem(item.id, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeeItem(item.id)}
                  className="text-destructive hover:text-destructive/90 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payments & Credits</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addPayment}>
            <Plus className="h-4 w-4 mr-1" /> Add Payment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.payments.map((item) => (
              <div key={item.id} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updatePayment(item.id, "description", e.target.value)}
                    placeholder="Payment description"
                  />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Amount ($)</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updatePayment(item.id, "amount", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-36 space-y-1">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(e) => updatePayment(item.id, "date", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePayment(item.id)}
                  className="text-destructive hover:text-destructive/90 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Receipt Details */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Receipt Title</Label>
              <Input name="receiptTitle" value={formData.receiptTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Receipt Number</Label>
              <Input name="receiptNumber" value={formData.receiptNumber} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label>Footer Note</Label>
              <Input name="footerNote" value={formData.footerNote} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TuitionReceiptInfoForm
