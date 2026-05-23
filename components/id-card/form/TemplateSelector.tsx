"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PRESET_TEMPLATES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  templateMode: "custom" | "preset"
  presetTemplate: string
  onModeChange: (mode: "custom" | "preset") => void
  onTemplateSelect: (templateId: string) => void
}

/**
 * Template Selector Component
 * Displays preset template thumbnails in a grid and allows switching between
 * custom design mode and preset template mode
 */
export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templateMode,
  presetTemplate,
  onModeChange,
  onTemplateSelect,
}) => {
  const classicTemplates = PRESET_TEMPLATES.filter((t) => t.set === 1)
  const modernTemplates = PRESET_TEMPLATES.filter((t) => t.set === 2)

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Template Mode</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => onModeChange("custom")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              templateMode === "custom"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background hover:bg-muted border-input"
            )}
          >
            ✨ Custom Design
          </button>
          <button
            type="button"
            onClick={() => onModeChange("preset")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              templateMode === "preset"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background hover:bg-muted border-input"
            )}
          >
            📋 Preset Templates
          </button>
        </div>

        {/* Template Grid (only shown in preset mode) */}
        {templateMode === "preset" && (
          <div className="space-y-4">
            {/* Classic Set */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Classic Series</h4>
              <div className="grid grid-cols-3 gap-2">
                {classicTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => onTemplateSelect(template.id)}
                    className={cn(
                      "relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] aspect-[1.586/1]",
                      presetTemplate === template.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img
                      src={template.image}
                      alt={template.label}
                      className="w-full h-full object-cover"
                    />
                    {presetTemplate === template.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                          <path
                            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                            fill="white"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                      <span className="text-[10px] text-white">{template.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modern Set */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Modern Dark Series</h4>
              <div className="grid grid-cols-3 gap-2">
                {modernTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => onTemplateSelect(template.id)}
                    className={cn(
                      "relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] aspect-[1.586/1]",
                      presetTemplate === template.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img
                      src={template.image}
                      alt={template.label}
                      className="w-full h-full object-cover"
                    />
                    {presetTemplate === template.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                          <path
                            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                            fill="white"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                      <span className="text-[10px] text-white">{template.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {templateMode === "custom" && (
          <p className="text-sm text-muted-foreground">
            Using custom design mode. Configure colors, styles, and layout in the settings below.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default TemplateSelector
