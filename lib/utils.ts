import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PROGRAM_DURATION, getDpiFromQuality, mmToPx } from "./constants"

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

// Export to image functionality
export const exportToImage = (canvas: HTMLCanvasElement, fileName: string, type: string) => {
  const link = document.createElement("a")
  link.download = `${fileName}.${type}`
  link.href = canvas.toDataURL(`image/${type}`)
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

  exportToImage(finalCanvas, fileName, "png")
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
