"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface University {
  name: string
  address: string
}

interface UniversityData {
  [country: string]: University[]
}

interface UniversitySelectorProps {
  onSelect: (university: { name: string; address: string; country: string }) => void
  currentUniversity?: string
}

/**
 * University Selector Component
 * Provides country and university dropdowns with auto-fill capability
 * Data sourced from 130+ countries
 */
export const UniversitySelector: React.FC<UniversitySelectorProps> = ({ onSelect, currentUniversity }) => {
  const [data, setData] = useState<UniversityData>({})
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedUniversity, setSelectedUniversity] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load university data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/universities.json")
        if (!response.ok) return
        const jsonData = await response.json()
        setData(jsonData)
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load university data")
      }
    }
    loadData()
  }, [])

  // Get filtered country list
  const filteredCountries = useMemo(() => {
    const countries = Object.keys(data).sort()
    if (!searchQuery) return countries
    return countries.filter((c) =>
      c.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data, searchQuery])

  // Get universities for selected country
  const universities = useMemo(() => {
    if (!selectedCountry || !data[selectedCountry]) return []
    return data[selectedCountry]
  }, [data, selectedCountry])

  // Handle country selection
  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value)
    setSelectedUniversity("")
  }, [])

  // Handle university selection
  const handleUniversityChange = useCallback(
    (value: string) => {
      setSelectedUniversity(value)
      const uni = universities.find((u) => u.name === value)
      if (uni) {
        onSelect({
          name: uni.name,
          address: uni.address,
          country: selectedCountry,
        })
      }
    },
    [universities, selectedCountry, onSelect]
  )

  if (!isLoaded) return null

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Quick Fill — University Database
          <span className="text-xs font-normal text-muted-foreground ml-2">
            ({Object.keys(data).length} countries)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Search & Select */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
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

          {/* University Select */}
          <div className="space-y-2">
            <Label>University</Label>
            <Select
              value={selectedUniversity}
              onValueChange={handleUniversityChange}
              disabled={!selectedCountry}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={selectedCountry ? "Select a university" : "Select a country first"}
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
            {selectedUniversity && (
              <p className="text-xs text-muted-foreground mt-1">
                ✓ University info will be auto-filled
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UniversitySelector
