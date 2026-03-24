import { Empty } from 'antd'

interface EmptyStateProps {
  description: string
}

export const EmptyState = ({ description }: EmptyStateProps) => {
  return <Empty description={description} />
}
