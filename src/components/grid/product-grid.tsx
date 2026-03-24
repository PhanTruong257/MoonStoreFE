import { Card, Rate } from 'antd'
import { Link } from 'react-router-dom'

import type { Product } from '@/global-types'
import { formatCurrency } from '@/utils/currency'

interface ProductGridProps {
  products: Product[]
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <Card
          key={product.id}
          hoverable
          cover={<img src={product.imageUrl} alt={product.name} loading="lazy" />}
        >
          <Link to={`/product/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <Rate disabled value={product.rating} allowHalf />
          <p className="price">{formatCurrency(product.price)}</p>
        </Card>
      ))}
    </div>
  )
}
