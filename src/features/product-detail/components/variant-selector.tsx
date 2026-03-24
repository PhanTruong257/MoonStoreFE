import { Segmented } from 'antd'

import type { ProductVariant } from '@/global-types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  value?: string
  onChange: (value: string) => void
}

export const VariantSelector = ({ variants, value, onChange }: VariantSelectorProps) => {
  return (
    <Segmented
      options={variants.map((variant) => ({
        label: `${variant.label} ${variant.value}`,
        value: variant.value,
      }))}
      value={value}
      onChange={(next) => onChange(String(next))}
    />
  )
}
