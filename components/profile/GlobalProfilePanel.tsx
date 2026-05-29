"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useGlobalProfile } from "@/context/GlobalProfileContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, School, User, Upload, CheckCircle2, FileText } from "lucide-react"
import { MAJOR_DISCIPLINES } from "@/lib/constants"

interface University {
  name: string
  address: string
  website?: string
  contact?: string
}

interface UniversityData {
  [country: string]: University[]
}

const PRESIDENT_NAMES = [
  "Dr. James Anderson",
  "Dr. Sarah Mitchell",
  "Dr. Robert Smith",
  "Dr. Emily Chen",
  "Dr. Michael Johnson",
  "Dr. William Taylor",
  "Dr. Jessica Davis",
  "Dr. David Wilson",
  "Dr. Richard Miller",
  "Dr. Susan Moore"
]

/**
 * Global Profile Panel
 * A standalone panel for configuring shared school and student info.
 * Data entered here is automatically synced to all generator tabs.
 */
const GlobalProfilePanel: React.FC = () => {
  const { profile, updateProfile } = useGlobalProfile()

  // University database state
  const [uniData, setUniData] = useState<UniversityData>({})
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [countrySearch, setCountrySearch] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load university database
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/universities.json")
        if (!response.ok) return
        const jsonData = await response.json()
        setUniData(jsonData)
        setIsLoaded(true)
      } catch {
        console.error("Failed to load university data")
      }
    }
    loadData()
  }, [])

  // Filtered countries
  const filteredCountries = useMemo(() => {
    const countries = Object.keys(uniData).sort()
    if (!countrySearch) return countries
    return countries.filter((c) =>
      c.toLowerCase().includes(countrySearch.toLowerCase())
    )
  }, [uniData, countrySearch])

  // Universities for selected country
  const universities = useMemo(() => {
    if (!selectedCountry || !uniData[selectedCountry]) return []
    return uniData[selectedCountry]
  }, [uniData, selectedCountry])

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value)
  }, [])

  const handleUniversitySelect = useCallback(
    (value: string) => {
      const uni = universities.find((u) => u.name === value)
      if (uni) {
        updateProfile("universityName", uni.name)
        updateProfile("universityAddress", uni.address)
        if (uni.website) updateProfile("universityWebsite", uni.website)
        if (uni.contact) updateProfile("universityContact", uni.contact)
        
        // Auto-generate signature
        const nameIndex = uni.name.length % PRESIDENT_NAMES.length
        updateProfile("officialSignature", PRESIDENT_NAMES[nameIndex])

        // Auto-fill faculty/major if not already set
        if (!profile.faculty && MAJOR_DISCIPLINES.length > 0) {
          const defaultDisc = MAJOR_DISCIPLINES[0]
          updateProfile("faculty", defaultDisc.label)
          if (defaultDisc.majors.length > 0) {
            updateProfile("major", defaultDisc.majors[0])
          }
        }
      }
    },
    [universities, updateProfile]
  )

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProfile("studentPhoto", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Derived options for linked Faculty/Major
  const currentDiscipline = useMemo(() => {
    return MAJOR_DISCIPLINES.find((d) => d.label === profile.faculty) || MAJOR_DISCIPLINES[0]
  }, [profile.faculty])

  const handleFacultyChange = useCallback((value: string) => {
    updateProfile("faculty", value)
    const disc = MAJOR_DISCIPLINES.find((d) => d.label === value)
    if (disc && disc.majors.length > 0) {
      updateProfile("major", disc.majors[0])
    }
  }, [updateProfile])

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProfile("universityLogo", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle long logo upload
  const handleLongLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProfile("universityLogoLong", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle card background image upload
  const handleCardBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      updateProfile("cardBackgroundImage", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Count how many fields are filled (only user-visible required fields)
  const VISIBLE_FIELDS: (keyof typeof profile)[] = [
    "universityName", "universityAddress", "universityWebsite", "universityContact",
    "fullName", "studentId", "faculty", "major", "birthDate",
  ]
  const filledCount = VISIBLE_FIELDS.filter((k) => profile[k] && profile[k]!.length > 0).length
  const totalCount = VISIBLE_FIELDS.length

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <CheckCircle2 className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            Profile Completion
          </p>
          <p className="text-xs text-blue-600">
            Data entered here is shared across all document generators.
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {filledCount}/{totalCount} fields
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <School className="h-5 w-5 text-blue-600" />
              School Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* University Database Picker */}
            {isLoaded && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Quick Fill from Database ({Object.keys(uniData).length} countries)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Country</Label>
                    <Input
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Select value={selectedCountry} onValueChange={handleCountryChange}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {filteredCountries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">University</Label>
                    <Select
                      value=""
                      onValueChange={handleUniversitySelect}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue
                          placeholder={selectedCountry ? "Select university" : "Select country first"}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {universities.map((uni) => (
                          <SelectItem key={uni.name} value={uni.name}>
                            {uni.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Manual fields */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="gp-universityName">University Name</Label>
                <Input
                  id="gp-universityName"
                  value={profile.universityName}
                  onChange={(e) => updateProfile("universityName", e.target.value)}
                  placeholder="e.g. Massachusetts Institute of Technology"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="gp-universityWebsite">Website</Label>
                  <Input
                    id="gp-universityWebsite"
                    value={profile.universityWebsite}
                    onChange={(e) => updateProfile("universityWebsite", e.target.value)}
                    placeholder="e.g. www.mit.edu"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gp-universityContact">Contact</Label>
                  <Input
                    id="gp-universityContact"
                    value={profile.universityContact}
                    onChange={(e) => updateProfile("universityContact", e.target.value)}
                    placeholder="Phone or email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="gp-universityAddress">Address</Label>
                  <Input
                    id="gp-universityAddress"
                    value={profile.universityAddress}
                    onChange={(e) => updateProfile("universityAddress", e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gp-universityCity">City (For ID Card Display)</Label>
                  <Input
                    id="gp-universityCity"
                    value={profile.universityCity}
                    onChange={(e) => updateProfile("universityCity", e.target.value)}
                    placeholder="e.g. Boston, MA"
                  />
                </div>
              </div>

              {/* University Logo Upload */}
              <div className="space-y-1.5">
                <Label>University Logo (1:1)</Label>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-white">
                    {profile.universityLogo ? (
                      <img src={profile.universityLogo} alt="Logo" className="h-full w-full object-contain p-1" />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      id="gp-logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="gp-logo-upload"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {profile.universityLogo ? "Change Logo" : "Upload Logo"}
                    </Label>
                    <p className="text-xs text-slate-500">PNG or JPG, square preferred</p>
                  </div>
                </div>
              </div>

              {/* University Long Logo Upload */}
              <div className="space-y-1.5 mt-4">
                <Label>University Logo (6:1 Long)</Label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-48 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-white">
                    {profile.universityLogoLong ? (
                      <img src={profile.universityLogoLong} alt="Long Logo" className="h-full w-full object-contain p-1" />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      id="gp-long-logo-upload"
                      accept="image/*"
                      onChange={handleLongLogoUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="gp-long-logo-upload"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {profile.universityLogoLong ? "Change Logo" : "Upload Logo"}
                    </Label>
                    <p className="text-xs text-slate-500">PNG or JPG, 6:1 ratio preferred</p>
                  </div>
                </div>
              </div>

              {/* Card Background Image Upload */}
              <div className="space-y-1.5 mt-4">
                <Label>Card Background Image (ID Card)</Label>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-white">
                    {profile.cardBackgroundImage && profile.cardBackgroundImage.length > 50 ? (
                      <img src={profile.cardBackgroundImage} alt="Background" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      id="gp-bg-upload"
                      accept="image/*"
                      onChange={handleCardBackgroundImageUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="gp-bg-upload"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {(profile.cardBackgroundImage && profile.cardBackgroundImage.length > 50) ? "Change Background" : "Upload Background"}
                    </Label>
                    <p className="text-xs text-slate-500">Image for custom ID Card design</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 items-center justify-center">
              <div className="h-44 w-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-100 flex-shrink-0">
                {profile.studentPhoto ? (
                  <img src={profile.studentPhoto} alt="Photo" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-slate-400" />
                )}
              </div>
              <div className="text-center">
                <Input
                  type="file"
                  id="gp-photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="gp-photo-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 text-sm bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md font-medium text-slate-700"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {profile.studentPhoto ? "Change Photo" : "Upload Photo"}
                </Label>
                <p className="text-xs text-slate-500 mt-1">ID photo, 3:4 aspect ratio recommended</p>
              </div>
            </div>

            {/* Student fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="gp-fullName">Full Name</Label>
                  <Input
                    id="gp-fullName"
                    value={profile.fullName}
                    onChange={(e) => updateProfile("fullName", e.target.value)}
                    placeholder="Student full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gp-studentId">Student ID</Label>
                  <Input
                    id="gp-studentId"
                    value={profile.studentId}
                    onChange={(e) => updateProfile("studentId", e.target.value)}
                    placeholder="e.g. S20240001"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 mt-3">
                <Label htmlFor="gp-birthDate">Date of Birth</Label>
                <Input
                  id="gp-birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => updateProfile("birthDate", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label htmlFor="gp-faculty">Faculty / Department</Label>
                  <Select
                    value={profile.faculty || currentDiscipline.label}
                    onValueChange={handleFacultyChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                      {MAJOR_DISCIPLINES.map((d) => (
                        <SelectItem key={d.value} value={d.label}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gp-major">Major / Program</Label>
                  <Select
                    value={profile.major || currentDiscipline.majors[0]}
                    onValueChange={(value) => updateProfile("major", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                      {currentDiscipline.majors.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Settings */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Document Settings (Templates)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="gp-officialSignature">Official Signature Name</Label>
                <Input
                  id="gp-officialSignature"
                  value={profile.officialSignature}
                  onChange={(e) => updateProfile("officialSignature", e.target.value)}
                  placeholder="e.g. Registrar, MIT"
                />
                <p className="text-xs text-slate-500 mt-1">Displayed as the signature on certificates, transcripts, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shared info hint */}
      <div className="text-center text-xs text-slate-500 py-2">
        <GraduationCap className="h-4 w-4 inline-block mr-1 -mt-0.5" />
        Changes here are automatically applied to Student ID Card, Certificate, Schedule, Admission Letter, Transcript, and Tuition Receipt.
      </div>
    </div>
  )
}

export default GlobalProfilePanel
