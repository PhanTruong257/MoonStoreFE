import { AutoComplete } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAppSelector } from '@/store/hooks'

export const SearchBar = () => {
  const navigate = useNavigate()
  const products = useAppSelector((state) => state.product.products)
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebouncedValue(keyword)

  const options = useMemo(() => {
    if (!debouncedKeyword) {
      return []
    }

    return products
      .filter((product) => product.name.toLowerCase().includes(debouncedKeyword.toLowerCase()))
      .slice(0, 6)
      .map((product) => ({
        label: product.name,
        value: product.id,
      }))
  }, [debouncedKeyword, products])

  return (
    <AutoComplete
      className="search-bar"
      options={options}
      onSearch={setKeyword}
      onSelect={(productId) => navigate(`/product/${productId}`)}
      placeholder="Search for products"
    />
  )
}
