"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface GlobalProfile {
  universityName: string
  universityLogo: string
  universityAddress: string
  universityCity: string
  universityWebsite: string
  universityContact: string
  fullName: string
  studentId: string
  faculty: string
  major: string
  birthDate: string
  studentPhoto: string
  universityLogoLong: string
  cardBackgroundImage: string
}

const DEFAULT_PROFILE: GlobalProfile = {
  universityName: "",
  universityLogo: "/placeholder.svg?height=60&width=60",
  universityAddress: "",
  universityCity: "",
  universityWebsite: "",
  universityContact: "",
  fullName: "",
  studentId: "",
  faculty: "",
  major: "",
  birthDate: "2001-01-25",
  studentPhoto: "/placeholder.svg?height=150&width=120",
  universityLogoLong: "/placeholder.svg?height=40&width=200",
  cardBackgroundImage: "/placeholder.svg?height=90&width=140",
}

interface GlobalProfileContextType {
  profile: GlobalProfile
  updateProfile: (key: keyof GlobalProfile, value: string) => void
}

const GlobalProfileContext = createContext<GlobalProfileContextType | undefined>(undefined)

export const GlobalProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<GlobalProfile>(DEFAULT_PROFILE)

  const updateProfile = (key: keyof GlobalProfile, value: string) => {
    setProfile((prev) => {
      // Only update if the value has actually changed to prevent infinite loops
      if (prev[key] === value) return prev
      return { ...prev, [key]: value }
    })
  }

  return (
    <GlobalProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </GlobalProfileContext.Provider>
  )
}

export const useGlobalProfile = () => {
  const context = useContext(GlobalProfileContext)
  if (context === undefined) {
    throw new Error("useGlobalProfile must be used within a GlobalProfileProvider")
  }
  return context
}
