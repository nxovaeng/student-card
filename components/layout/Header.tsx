"use client"

import { FileText, ExternalLink, Github } from "lucide-react"
import Link from "next/link"

export default function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
      <div className="flex h-16 w-full items-center justify-between px-4">
        {/* Website Logo and Name */}
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold text-white md:text-2xl">
            <span className="font-extrabold tracking-tight">Student ID Generator</span>
          </h1>
        </div>
      </div>
    </header>
  )
}
