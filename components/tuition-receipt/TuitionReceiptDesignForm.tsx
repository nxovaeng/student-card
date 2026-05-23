"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FONT_FAMILY_OPTIONS, BORDER_STYLE_OPTIONS } from "@/lib/constants"
import type { TuitionReceiptFormData } from "@/lib/types"

interface TuitionReceiptDesignFormProps {
  formData: TuitionReceiptFormData
  onChange: (name: string, value: string | boolean | number) => void
}

const TuitionReceiptDesignForm: React.FC<TuitionReceiptDesignFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Header Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.headerColor}
                  onChange={(e) => onChange("headerColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.headerColor}
                  onChange={(e) => onChange("headerColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.accentColor}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => onChange("textColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.textColor}
                  onChange={(e) => onChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Paper Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.paperColor}
                  onChange={(e) => onChange("paperColor", e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.paperColor}
                  onChange={(e) => onChange("paperColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={formData.fontFamily} onValueChange={(v) => onChange("fontFamily", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Border */}
      <Card>
        <CardHeader>
          <CardTitle>Border Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Border</Label>
              <Switch
                checked={formData.enableBorder}
                onCheckedChange={(v) => onChange("enableBorder", v)}
              />
            </div>
            {formData.enableBorder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Border Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.borderColor}
                      onChange={(e) => onChange("borderColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.borderColor}
                      onChange={(e) => onChange("borderColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Border Style</Label>
                  <Select value={formData.borderStyle} onValueChange={(v) => onChange("borderStyle", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BORDER_STYLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Watermark */}
      <Card>
        <CardHeader>
          <CardTitle>Watermark Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Watermark</Label>
              <Switch
                checked={formData.enableWatermark}
                onCheckedChange={(v) => onChange("enableWatermark", v)}
              />
            </div>
            {formData.enableWatermark && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Watermark Text</Label>
                  <Input
                    value={formData.watermarkText}
                    onChange={(e) => onChange("watermarkText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Watermark Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.watermarkColor}
                      onChange={(e) => onChange("watermarkColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.watermarkColor}
                      onChange={(e) => onChange("watermarkColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Opacity: {formData.watermarkOpacity}%</Label>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[formData.watermarkOpacity]}
                    onValueChange={(v) => onChange("watermarkOpacity", v[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Angle: {formData.watermarkAngle}°</Label>
                  <Slider
                    min={-90}
                    max={90}
                    step={1}
                    value={[parseInt(formData.watermarkAngle) || -30]}
                    onValueChange={(v) => onChange("watermarkAngle", String(v[0]))}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TuitionReceiptDesignForm
