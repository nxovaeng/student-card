"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DEGREE_TYPE_OPTIONS } from "@/lib/constants"
import type { AdmissionLetterInfoFormProps } from "@/lib/types"

/**
 * Admission Letter Information Form Component
 */
export default function AdmissionLetterInfoForm({
  formData,
  formErrors,
  onChange,
  onFileChange,
  onSubmit,
}: AdmissionLetterInfoFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* Admission Information */}
        <Card>
          <CardHeader>
            <CardTitle>Admission Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={onChange}
                  placeholder="e.g., Computer Science"
                  className={formErrors.programName ? "border-red-500" : ""}
                />
                {formErrors.programName && <p className="text-red-500 text-sm">{formErrors.programName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentName">Department Name</Label>
                <Input
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={onChange}
                  placeholder="e.g., School of Computer Science"
                  className={formErrors.departmentName ? "border-red-500" : ""}
                />
                {formErrors.departmentName && <p className="text-red-500 text-sm">{formErrors.departmentName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degreeType">Degree Type</Label>
                <Select
                  name="degreeType"
                  value={formData.degreeType}
                  onValueChange={(value) => onChange({ target: { name: "degreeType", value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEGREE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={onChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programStartDate">Program Start Date</Label>
                <Input
                  id="programStartDate"
                  name="programStartDate"
                  type="date"
                  value={formData.programStartDate}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="programDuration">Program Duration</Label>
                <Input
                  id="programDuration"
                  name="programDuration"
                  value={formData.programDuration}
                  onChange={onChange}
                  placeholder="e.g., 4 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scholarshipInfo">Scholarship Information</Label>
                <Input
                  id="scholarshipInfo"
                  name="scholarshipInfo"
                  value={formData.scholarshipInfo}
                  onChange={onChange}
                  placeholder="e.g., First-class scholarship $5000/year"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Letter Content */}
        <Card>
          <CardHeader>
            <CardTitle>Letter Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="letterTitle">Letter Title</Label>
              <Input
                id="letterTitle"
                name="letterTitle"
                value={formData.letterTitle}
                onChange={onChange}
                placeholder="e.g., Letter of Admission"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterContent">Letter Content</Label>
              <Textarea
                id="letterContent"
                name="letterContent"
                value={formData.letterContent}
                onChange={onChange}
                placeholder="Enter the main content of the admission letter..."
                rows={6}
                className={formErrors.letterContent ? "border-red-500" : ""}
              />
              {formErrors.letterContent && <p className="text-red-500 text-sm">{formErrors.letterContent}</p>}
              <p className="text-xs text-gray-500">Supports line breaks, use \n for line breaks</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="congratulatoryMessage">Congratulatory Message</Label>
              <Textarea
                id="congratulatoryMessage"
                name="congratulatoryMessage"
                value={formData.congratulatoryMessage}
                onChange={onChange}
                placeholder="Enter congratulatory message..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextStepsInfo">Next Steps</Label>
              <Textarea
                id="nextStepsInfo"
                name="nextStepsInfo"
                value={formData.nextStepsInfo}
                onChange={onChange}
                placeholder="Enter the next steps the student needs to complete..."
                rows={4}
              />
              <p className="text-xs text-gray-500">Supports line breaks, use \n for line breaks</p>
            </div>
          </CardContent>
        </Card>

        {/* Signature Information */}
        <Card>
          <CardHeader>
            <CardTitle>Signature Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signatoryName">Signatory Name</Label>
                <Input
                  id="signatoryName"
                  name="signatoryName"
                  value={formData.signatoryName}
                  onChange={onChange}
                  placeholder="e.g., Director Li"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatoryTitle">Signatory Title</Label>
                <Input
                  id="signatoryTitle"
                  name="signatoryTitle"
                  value={formData.signatoryTitle}
                  onChange={onChange}
                  placeholder="e.g., Director of Admissions"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              Reset
            </Button>
            <Button type="submit">Next Step</Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
