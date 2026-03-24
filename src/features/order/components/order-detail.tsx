import { Descriptions } from 'antd'

import type { Order } from '@/global-types'
import { formatCurrency } from '@/utils/currency'

interface OrderDetailProps {
  order?: Order
}

export const OrderDetail = ({ order }: OrderDetailProps) => {
  if (!order) {
    return null
  }

  return (
    <Descriptions title="Latest order" column={1} bordered>
      <Descriptions.Item label="Code">{order.code}</Descriptions.Item>
      <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
      <Descriptions.Item label="Total">{formatCurrency(order.total)}</Descriptions.Item>
      <Descriptions.Item label="Created at">{order.createdAt}</Descriptions.Item>
    </Descriptions>
  )
}
