import { Form, Select } from 'antd'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CheckoutRequest } from '@/global-types'
import { useAppDispatch } from '@/store/hooks'
import { checkoutThunk } from '@/store/thunks'

export const CheckoutForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (values: CheckoutRequest) => {
    await dispatch(checkoutThunk(values))
    navigate('/order-success')
  }

  return (
    <Form layout="vertical" onFinish={onSubmit} initialValues={{ shippingMethod: 'standard', paymentMethod: 'cod' }}>
      <Form.Item label="Full name" name="fullName" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Shipping method" name="shippingMethod">
        <Select
          options={[
            { value: 'standard', label: 'Standard' },
            { value: 'express', label: 'Express' },
          ]}
        />
      </Form.Item>
      <Form.Item label="Payment method" name="paymentMethod">
        <Select
          options={[
            { value: 'cod', label: 'Cash on delivery' },
            { value: 'card', label: 'Credit card' },
          ]}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Place order
      </Button>
    </Form>
  )
}
