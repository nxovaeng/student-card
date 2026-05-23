"use client"

import React, { useState } from "react"
import type { FormComponentProps } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { CARD_ORIENTATION_OPTIONS, CARD_STYLE_OPTIONS, CODE_TYPE_OPTIONS } from "@/lib/constants"
import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import TemplateSelector from "./TemplateSelector"

/**
 * Card Design Form Component
 * Used for configuring card style, color, orientation and other design-related options
 */
export const DesignForm: React.FC<FormComponentProps> = ({ formData, onChange, onFileChange }) => {
  // Get form context
  const form = useFormContext()
  const [activeTab, setActiveTab] = useState("basic")

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    onChange(name, value)
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    onChange(name, checked)
  }

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    onChange(name, String(value[0]))
  }

  return (
    <>
      {/* Template Mode Selector */}
      <TemplateSelector
        templateMode={formData.templateMode || "custom"}
        presetTemplate={formData.presetTemplate || ""}
        onModeChange={(mode) => onChange("templateMode", mode)}
        onTemplateSelect={(templateId) => {
          onChange("presetTemplate", templateId)
          onChange("templateMode", "preset")
        }}
      />

    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Design Options</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={formData.templateMode === "preset" ? "media" : activeTab}
          onValueChange={setActiveTab}
        >
          {formData.templateMode !== "preset" && (
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="media">Media Settings</TabsTrigger>
              <TabsTrigger value="watermark">Watermark Settings</TabsTrigger>
            </TabsList>
          )}
          {formData.templateMode === "preset" && (
            <div className="mb-4 text-sm text-blue-800 bg-blue-50 p-3 rounded-md border border-blue-200">
              <span className="font-semibold">Preset Mode:</span> Most design settings are handled by the template. You can configure your media assets below.
            </div>
          )}

          {/* Basic settings tab */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Card Orientation */}
              <FormField
                control={form.control}
                name="orientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Orientation</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleSelectChange("orientation", value)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select card orientation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARD_ORIENTATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose card display orientation (portrait or landscape)</FormDescription>
                  </FormItem>
                )}
              />

              {/* Card Style */}
              <FormField
                control={form.control}
                name="cardStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Style</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleSelectChange("cardStyle", value)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select card style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARD_STYLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the visual style of the card</FormDescription>
                  </FormItem>
                )}
              />

              {/* Card Color */}
              <FormField
                control={form.control}
                name="cardColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Color</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        className="flex-1"
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Text Color */}
              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Color</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        className="flex-1"
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Code Type */}
              <FormField
                control={form.control}
                name="codeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleSelectChange("codeType", value)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select code type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CODE_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the type of verification code displayed on the card</FormDescription>
                  </FormItem>
                )}
              />

              {/* Realistic Effect */}
              <FormField
                control={form.control}
                name="realisticEffect"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Realistic Effect</FormLabel>
                      <FormDescription>Enable realistic card texture effect</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          handleSwitchChange("realisticEffect", checked)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Media settings tab */}
          <TabsContent value="media">
            <div className="grid grid-cols-1 gap-4 mt-4">

              {/* Background Opacity */}
              <FormField
                control={form.control}
                name="backgroundOpacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Opacity: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[Number.parseInt(field.value) || 0]}
                        onValueChange={(value) => {
                          field.onChange(String(value[0]))
                          handleSliderChange("backgroundOpacity", value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>Adjust background image opacity</FormDescription>
                  </FormItem>
                )}
              />

              {/* Center Icon Opacity */}
              {formData.templateMode === "preset" && (
                <FormField
                  control={form.control}
                  name="centerIconOpacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Icon Opacity: {field.value || 0.1}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.05}
                          value={[Number.parseFloat(String(field.value)) || 0.1]}
                          onValueChange={(value) => {
                            field.onChange(value[0])
                            // Custom handler if needed, handleSliderChange converts to string
                            onChange("centerIconOpacity", value[0])
                          }}
                        />
                      </FormControl>
                      <FormDescription>Adjust the opacity of the large center watermark logo (Preset Set 2)</FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </TabsContent>

          {/* Watermark settings tab */}
          <TabsContent value="watermark">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Enable Watermark */}
              <FormField
                control={form.control}
                name="enableWatermark"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Watermark</FormLabel>
                      <FormDescription>Display semi-transparent watermark on card</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          handleSwitchChange("enableWatermark", checked)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Watermark Text */}
              <FormField
                control={form.control}
                name="watermarkText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watermark Text</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        placeholder="Enter watermark text"
                        disabled={!formData.enableWatermark}
                      />
                    </FormControl>
                    <FormDescription>Watermark text displayed on the card</FormDescription>
                  </FormItem>
                )}
              />

              {/* Watermark Color */}
              <FormField
                control={form.control}
                name="watermarkColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watermark Color</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        className="w-16 h-10 p-1"
                        disabled={!formData.enableWatermark}
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          handleInputChange(e)
                        }}
                        className="flex-1"
                        disabled={!formData.enableWatermark}
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Watermark Size */}
              <FormField
                control={form.control}
                name="watermarkSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watermark Size: {field.value}px</FormLabel>
                    <FormControl>
                      <Slider
                        min={8}
                        max={64}
                        step={1}
                        value={[Number.parseInt(field.value) || 32]}
                        onValueChange={(value) => {
                          field.onChange(String(value[0]))
                          handleSliderChange("watermarkSize", value)
                        }}
                        disabled={!formData.enableWatermark}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Watermark Angle */}
              <FormField
                control={form.control}
                name="watermarkAngle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watermark Angle: {field.value}°</FormLabel>
                    <FormControl>
                      <Slider
                        min={-90}
                        max={90}
                        step={1}
                        value={[Number.parseInt(field.value) || 45]}
                        onValueChange={(value) => {
                          field.onChange(String(value[0]))
                          handleSliderChange("watermarkAngle", value)
                        }}
                        disabled={!formData.enableWatermark}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Watermark Opacity */}
              <FormField
                control={form.control}
                name="watermarkOpacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watermark Opacity: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={50}
                        step={1}
                        value={[Number.parseInt(field.value) || 10]}
                        onValueChange={(value) => {
                          field.onChange(String(value[0]))
                          handleSliderChange("watermarkOpacity", value)
                        }}
                        disabled={!formData.enableWatermark}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
    </>
  )
}

export default DesignForm
