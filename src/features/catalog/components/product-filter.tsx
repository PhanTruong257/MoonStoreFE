import { Select } from 'antd'

import type { ProductFilterRequest } from '@/global-types'

interface ProductFilterProps {
  onChange: (filter: ProductFilterRequest) => void
}

export const ProductFilter = ({ onChange }: ProductFilterProps) => {
  return (
    <div className="product-filter">
      <Select
        defaultValue="all"
        options={[
          { value: 'all', label: 'All categories' },
          { value: 'shoes', label: 'Shoes' },
          { value: 'bags', label: 'Bags' },
          { value: 'lifestyle', label: 'Lifestyle' },
        ]}
        onChange={(category) => onChange({ category: category === 'all' ? undefined : category })}
      />
      <Select
        defaultValue="rating-desc"
        options={[
          { value: 'rating-desc', label: 'Top rated' },
          { value: 'price-asc', label: 'Price low to high' },
          { value: 'price-desc', label: 'Price high to low' },
        ]}
        onChange={(sortBy) =>
          onChange({ sortBy: sortBy as ProductFilterRequest['sortBy'] })
        }
      />
    </div>
  )
}
