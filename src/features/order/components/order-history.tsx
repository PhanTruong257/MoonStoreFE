import { Table } from 'antd'

import type { Order } from '@/global-types'
import { formatCurrency } from '@/utils/currency'

interface OrderHistoryProps {
  orders: Order[]
}

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  return (
    <Table
      rowKey="id"
      dataSource={orders}
      pagination={false}
      columns={[
        { title: 'Order code', dataIndex: 'code' },
        { title: 'Status', dataIndex: 'status' },
        { title: 'Created at', dataIndex: 'createdAt' },
        {
          title: 'Total',
          dataIndex: 'total',
          render: (value: number) => formatCurrency(value),
        },
      ]}
    />
  )
}
