"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Attribute = {
  key: string
  value: string
}

type VariantImages = {
  key: string
  order: number
}

type Variants = {
  _id: string
  sku: string
  stock: number
  attributes: Attribute[]
  variantImages: VariantImages[]
}

interface ProductVariantsProps {
  variants: Variants[]
  onVariantChange: (variant: Variants) => void
}

export function ProductVariants({
  variants,
  onVariantChange,
}: ProductVariantsProps) {
  // 1. Extract all unique attribute keys and their possible values
  const attributeMap = React.useMemo(() => {
    const map: Record<string, Set<string>> = {}
    variants.forEach(v => {
      v.attributes.forEach(attr => {
        if (!map[attr.key]) map[attr.key] = new Set()
        map[attr.key].add(attr.value)
      })
    })
    
    // Convert Sets back to Arrays for mapping in the UI
    const finalMap: Record<string, string[]> = {}
    Object.keys(map).forEach(key => {
      finalMap[key] = Array.from(map[key])
    })
    return finalMap
  }, [variants])

  // 2. Track currently selected attributes { "Color": "Red", "Size": "M" }
  const [selectedAttrs, setSelectedAttrs] = React.useState<Record<string, string>>({})

  console.log("Variant:  =", selectedAttrs)

  // 3. Initialize default selection to the first available variant
  React.useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedAttrs).length === 0) {
      const initialSelection: Record<string, string> = {}
      variants[0].attributes.forEach(attr => {
        initialSelection[attr.key] = attr.value
      })
      setSelectedAttrs(initialSelection)
      onVariantChange(variants[0])
    }
  }, [variants])

  // 4. Handle user clicking a new attribute option
  const handleSelect = (key: string, value: string) => {
    const newSelection = { ...selectedAttrs, [key]: value }
    setSelectedAttrs(newSelection)

    // Find the exact variant sku that matches ALL currently selected attributes
    const matchingVariant = variants.find(variant => {
      return variant.attributes.every(
        attr => newSelection[attr.key] === attr.value
      )
    })

    if (matchingVariant) {
      onVariantChange(matchingVariant)
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(attributeMap).map(([attrKey, attrValues]) => (
        <div key={attrKey} className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{attrKey}</span>
            <span className="text-sm text-gray-500">{selectedAttrs[attrKey]}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {attrValues.map(value => {
              const isSelected = selectedAttrs[attrKey] === value
              
              // Optional: You can render color swatches dynamically if the key is "Color"
              // and the value happens to be a hex code, otherwise use text buttons.
              const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(value)

              if (attrKey.toLowerCase() === 'color' && isHexColor) {
                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(attrKey, value)}
                    className={cn(
                      "h-8 w-8 rounded-full ring-offset-2",
                      isSelected ? "ring-2 ring-primary" : "ring-1 ring-gray-300"
                    )}
                    style={{ backgroundColor: value }}
                    aria-label={`Select ${value}`}
                  />
                )
              }

              return (
                <button
                  key={value}
                  onClick={() => handleSelect(attrKey, value)}
                  className={cn(
                    "h-10 px-4 rounded-md border text-sm transition font-medium",
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}