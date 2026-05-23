"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { HAND_TEMPLATES } from "@/lib/constants"
import { Download, Hand } from "lucide-react"

// Hand configuration matching server.js HAND_CONFIG
const HAND_CONFIG: Record<string, { x: number; y: number; w: number; h: number; rotate: number }> = {
  hand1: { x: 177, y: 53, w: 828, h: 850, rotate: 5.8 },
  hand2: { x: 158, y: 86, w: 774, h: 820, rotate: -1 },
}

interface HandHoldingPreviewProps {
  cardElementId: string
}

/**
 * Hand Holding Preview Component
 * Composites the generated ID card into a hand-holding photo using Canvas API
 * Ported from card-generator's generateCardInHand() function
 */
export const HandHoldingPreview: React.FC<HandHoldingPreviewProps> = ({ cardElementId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedHand, setSelectedHand] = useState<string>("hand1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  // Generate the composite image
  const generateComposite = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsGenerating(true)

    try {
      // Capture the card element using html2canvas
      const cardElement = document.getElementById(cardElementId)
      if (!cardElement) {
        console.error("Card element not found")
        setIsGenerating(false)
        return
      }

      const html2canvasModule = await import("html2canvas")
      const html2canvas = html2canvasModule.default
      const cardCanvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
      })

      // Get hand config
      const config = HAND_CONFIG[selectedHand]
      if (!config) {
        setIsGenerating(false)
        return
      }

      // Load hand image
      const handTemplate = HAND_TEMPLATES.find((h) => h.id === selectedHand)
      if (!handTemplate) {
        setIsGenerating(false)
        return
      }

      const handImg = new Image()
      handImg.crossOrigin = "anonymous"
      handImg.src = handTemplate.image

      await new Promise<void>((resolve) => {
        handImg.onload = () => resolve()
        handImg.onerror = () => resolve()
      })

      // Set canvas size to match hand image
      canvas.width = handImg.width
      canvas.height = handImg.height

      // Draw hand image
      ctx.drawImage(handImg, 0, 0)

      // Draw card onto hand with rotation
      ctx.save()
      ctx.translate(config.x + config.w / 2, config.y + config.h / 2)
      ctx.rotate((config.rotate * Math.PI) / 180)

      // Clip to card shape
      ctx.beginPath()
      ctx.rect(-config.w / 2, -config.h / 2, config.w, config.h)
      ctx.clip()

      // Draw the captured card
      ctx.drawImage(
        cardCanvas,
        -config.w / 2,
        -config.h / 2,
        config.w,
        config.h
      )
      ctx.restore()

      setIsGenerated(true)
    } catch (error) {
      console.error("Error generating hand composite")
    }

    setIsGenerating(false)
  }, [cardElementId, selectedHand])

  // Download the composite
  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "student-id-hand-holding.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Hand className="h-4 w-4" />
          Hand Holding Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hand selection */}
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Hand Style</Label>
              <Select value={selectedHand} onValueChange={setSelectedHand}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HAND_TEMPLATES.map((hand) => (
                    <SelectItem key={hand.id} value={hand.id}>
                      {hand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateComposite}
              disabled={isGenerating}
              variant="default"
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Hand className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {/* Canvas preview */}
          <div className="rounded-lg overflow-hidden border bg-muted/30">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{
                display: isGenerated ? "block" : "none",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
            {!isGenerated && (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                Click &quot;Generate&quot; to create a hand-holding preview
              </div>
            )}
          </div>

          {/* Download button */}
          {isGenerated && (
            <Button onClick={handleDownload} variant="outline" className="w-full flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Hand Holding Image
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HandHoldingPreview
