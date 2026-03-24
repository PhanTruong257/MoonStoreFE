import { Card } from 'antd'

import { CheckoutForm } from '@/features/checkout/components/checkout-form'

export const CheckoutPage = () => {
  return (
    <section className="page-section checkout-layout">
      <div>
        <h1>Checkout</h1>
        <CheckoutForm />
      </div>
      <Card title="Secure payment">
        <p>Your payment information is encrypted and secured.</p>
      </Card>
    </section>
  )
}
