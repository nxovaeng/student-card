import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PROGRAM_DURATION, getDpiFromQuality, mmToPx } from "./constants"

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

export function generateDeterministicName(seed: string): string {
  if (!seed) return "Dr. John Doe"
  const index = seed.length % PRESIDENT_NAMES.length
  return PRESIDENT_NAMES[index]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to calculate expiry year
export const calculateExpiryYear = (enrollmentYear: number, programType: string): number => {
  return enrollmentYear + (PROGRAM_DURATION[programType as keyof typeof PROGRAM_DURATION] || PROGRAM_DURATION.default)
}

// Generate random card number
export const generateRandomCardNumber = (): string => {
  return "C" + Math.floor(10000000 + Math.random() * 90000000).toString()
}

// Convert hex color to rgba
export const hexToRgba = (hex: string, alpha = 1): string => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Convert watermark color and opacity to rgba
export const getWatermarkColor = (color: string, opacity: string): string => {
  return hexToRgba(color, Number(opacity) / 100)
}

// Format validity date display
export const formatValidityDate = (dateStr: string): string => {
  if (!dateStr) return ""
  return dateStr.replace("-", "/")
}

// Handle card background image style, including opacity
export const getBackgroundImageStyle = (image: string, opacity: string, isBack = false) => {
  if (!image) return {}

  const adjustedOpacity = isBack ? Number(opacity) / 200 : Number(opacity) / 100

  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: adjustedOpacity,
  }
}

// Change the DPI metadata of a base64 PNG data URL
function changeDpiDataUrl(base64Image: string, dpi: number): string {
  const parts = base64Image.split(",")
  if (parts.length !== 2 || !parts[0].includes("image/png")) return base64Image

  const dataStr = atob(parts[1])
  const data = new Uint8Array(dataStr.length)
  for (let i = 0; i < dataStr.length; i++) {
    data[i] = dataStr.charCodeAt(i)
  }

  const ppm = Math.round(dpi / 0.0254)
  const physChunk = new Uint8Array([
    0, 0, 0, 9, // Length 9
    112, 72, 89, 115, // 'pHYs'
    (ppm >>> 24) & 0xff, (ppm >>> 16) & 0xff, (ppm >>> 8) & 0xff, ppm & 0xff,
    (ppm >>> 24) & 0xff, (ppm >>> 16) & 0xff, (ppm >>> 8) & 0xff, ppm & 0xff,
    1, // Unit specifier (meter)
    0, 0, 0, 0 // CRC placeholder
  ])

  let crc = 0xffffffff
  for (let i = 4; i < 17; i++) {
    crc ^= physChunk[i]
    for (let j = 0; j < 8; j++) {
      if (crc & 1) crc = (crc >>> 1) ^ 0xedb88320
      else crc = crc >>> 1
    }
  }
  crc ^= 0xffffffff
  physChunk[17] = (crc >>> 24) & 0xff
  physChunk[18] = (crc >>> 16) & 0xff
  physChunk[19] = (crc >>> 8) & 0xff
  physChunk[20] = crc & 0xff

  let offset = 8
  const chunks: Uint8Array[] = []
  while (offset < data.length) {
    const len = (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]
    const type = String.fromCharCode(data[offset + 4], data[offset + 5], data[offset + 6], data[offset + 7])
    if (type !== "pHYs") {
      chunks.push(data.slice(offset, offset + 12 + len))
    }
    offset += 12 + len
  }

  const signature = data.slice(0, 8)
  const totalLength = signature.length + chunks.reduce((acc, c) => acc + c.length, 0) + physChunk.length
  const newData = new Uint8Array(totalLength)
  
  newData.set(signature, 0)
  newData.set(chunks[0], 8)
  newData.set(physChunk, 8 + chunks[0].length)
  
  let currOffset = 8 + chunks[0].length + physChunk.length
  for (let i = 1; i < chunks.length; i++) {
    newData.set(chunks[i], currOffset)
    currOffset += chunks[i].length
  }

  let binary = ""
  for (let i = 0; i < newData.length; i++) {
    binary += String.fromCharCode(newData[i])
  }
  return parts[0] + "," + btoa(binary)
}

// Export to image functionality
export const exportToImage = (canvas: HTMLCanvasElement, fileName: string, type: string, targetDpi?: number) => {
  const link = document.createElement("a")
  link.download = `${fileName}.${type}`
  let dataUrl = canvas.toDataURL(`image/${type}`)
  
  if (type === "png" && targetDpi) {
    dataUrl = changeDpiDataUrl(dataUrl, targetDpi)
  }
  
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export an HTML element to a PNG at a physically-correct size.
 *
 * Strategy:
 *  1. Measure the element's current rendered size in CSS pixels.
 *  2. Compute the target pixel dimensions from the physical mm size at the
 *     requested DPI (1 inch = 25.4 mm).
 *  3. Pass `scale = targetPx / renderedPx` to html2canvas so the output
 *     canvas is exactly the right number of pixels — no more "giant canvas"
 *     from blindly multiplying by 4 or 6.
 *
 * @param element   The DOM element to capture.
 * @param widthMm   Physical width in millimetres.
 * @param heightMm  Physical height in millimetres (0 = auto from aspect ratio).
 * @param quality   One of "low" | "medium" | "high" | "ultra".
 * @param fileName  Download filename (without extension).
 * @param bgColor   Background colour for the canvas.
 */
export const exportElementToPng = async (
  element: HTMLElement,
  widthMm: number,
  heightMm: number,
  quality: string,
  fileName: string,
  bgColor = "#ffffff",
): Promise<void> => {
  const dpi = getDpiFromQuality(quality)
  const targetWidthPx = mmToPx(widthMm, dpi)
  const targetHeightPx = heightMm > 0 ? mmToPx(heightMm, dpi) : 0

  const renderedWidth = element.offsetWidth || element.getBoundingClientRect().width
  const scale = renderedWidth > 0 ? targetWidthPx / renderedWidth : dpi / 96

  const html2canvasModule = await import("html2canvas")
  const html2canvas = html2canvasModule.default

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: bgColor,
    logging: false,
    scrollY: -window.scrollY,
    foreignObjectRendering: false,
    // If a fixed height is requested, crop/pad to it
    ...(targetHeightPx > 0 ? { height: element.offsetHeight } : {}),
  })

  // If a target height was specified and the canvas is taller, crop it
  let finalCanvas = canvas
  if (targetHeightPx > 0 && canvas.height !== targetHeightPx) {
    const cropped = document.createElement("canvas")
    cropped.width = canvas.width
    cropped.height = targetHeightPx
    const ctx = cropped.getContext("2d")
    if (ctx) {
      ctx.drawImage(canvas, 0, 0)
    }
    finalCanvas = cropped
  }

  exportToImage(finalCanvas, fileName, "png", dpi)
}

// Validate input data validity
export const validateFormData = (formData: any): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Required field validation
  if (!formData.fullName) errors.fullName = "Name cannot be empty"
  if (!formData.studentId) errors.studentId = "Student ID cannot be empty"
  if (!formData.faculty) errors.faculty = "Faculty cannot be empty"
  if (!formData.universityName) errors.universityName = "University name cannot be empty"

  return errors
}

// Format date
export function formatDate(dateString: string): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    // Format as YYYY/MM/DD format
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`
  } catch (error) {
    console.error("Date formatting error:", error)
    return dateString
  }
}
