"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormComponentProps } from "@/lib/types"
import type { CertificateFormData } from "@/lib/types"
import { DEGREE_TYPE_OPTIONS, STUDY_MODE_OPTIONS } from "@/lib/constants"

const CertificateInfoForm: React.FC<FormComponentProps> = ({ formData, onChange, onFileChange }) => {
  const data = formData as CertificateFormData

  const handleChange = (name: string, value: string | boolean) => {
    onChange(name, value)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (onFileChange) {
      onFileChange(e, field)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Certificate Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Certificate Title Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Certificate Title</h3>
          <div className="space-y-2">
            <Label htmlFor="certificateTitle">Certificate Title</Label>
            <Input
              id="certificateTitle"
              name="certificateTitle"
              value={data.certificateTitle}
              onChange={(e) => handleChange("certificateTitle", e.target.value)}
              placeholder="e.g., Certificate of Enrollment / Proof of Study"
            />
          </div>
        </div>

        {/* Student Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of Birth</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={data.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                value={data.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="Enter nationality"
              />
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty / School</Label>
              <Input
                id="faculty"
                name="faculty"
                value={data.faculty}
                onChange={(e) => handleChange("faculty", e.target.value)}
                placeholder="e.g., School of Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major / Program</Label>
              <Input
                id="major"
                name="major"
                value={data.major}
                onChange={(e) => handleChange("major", e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degreeType">Degree Type</Label>
              <Select value={data.degreeType} onValueChange={(value) => handleChange("degreeType", value)}>
                <SelectTrigger id="degreeType">
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
              <Label htmlFor="studyMode">Study Mode</Label>
              <Select value={data.studyMode} onValueChange={(value) => handleChange("studyMode", value)}>
                <SelectTrigger id="studyMode">
                  <SelectValue placeholder="Select study mode" />
                </SelectTrigger>
                <SelectContent>
                  {STUDY_MODE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date</Label>
              <Input
                id="enrollmentDate"
                name="enrollmentDate"
                type="date"
                value={data.enrollmentDate}
                onChange={(e) => handleChange("enrollmentDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedGraduationDate">Expected Graduation Date</Label>
              <Input
                id="expectedGraduationDate"
                name="expectedGraduationDate"
                type="date"
                value={data.expectedGraduationDate}
                onChange={(e) => handleChange("expectedGraduationDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentYear">Current Year of Study</Label>
              <Select value={data.currentYear} onValueChange={(value) => handleChange("currentYear", value)}>
                <SelectTrigger id="currentYear">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year", "Sixth Year", "Graduate Year 1", "Graduate Year 2", "Graduate Year 3"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Certificate Content Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Certificate Content</h3>
          <div className="space-y-2">
            <Label htmlFor="certificateContent">Certificate Text</Label>
            <Textarea
              id="certificateContent"
              name="certificateContent"
              value={data.certificateContent}
              onChange={(e) => handleChange("certificateContent", e.target.value)}
              placeholder="Enter certificate content (please use English)"
              rows={4}
            />
          </div>
        </div>

        {/* Issuance Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Issuance Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={data.issueDate}
                onChange={(e) => handleChange("issueDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validityPeriod">Validity Period</Label>
              <Input
                id="validityPeriod"
                name="validityPeriod"
                value={data.validityPeriod}
                onChange={(e) => handleChange("validityPeriod", e.target.value)}
                placeholder="e.g., 6 months"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuerTitle">Issuer Title</Label>
              <Input
                id="issuerTitle"
                name="issuerTitle"
                value={data.issuerTitle}
                onChange={(e) => handleChange("issuerTitle", e.target.value)}
                placeholder="e.g., Registrar, Dean"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuerSignature">Issuer Signature</Label>
              <Input
                id="issuerSignature"
                name="issuerSignature"
                value={data.issuerSignature}
                onChange={(e) => handleChange("issuerSignature", e.target.value)}
                placeholder="Enter issuer name as signature"
              />
              <p className="text-xs text-gray-500 mt-1">The text entered here will be displayed as signature</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Textarea
              id="contactInfo"
              name="contactInfo"
              value={data.contactInfo}
              onChange={(e) => handleChange("contactInfo", e.target.value)}
              placeholder="Enter contact information for verification (please use English)"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CertificateInfoForm
