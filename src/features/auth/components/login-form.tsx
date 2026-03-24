import { Form } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/service/auth-service'
import { useAppDispatch } from '@/store/hooks'
import { setAuth } from '@/store/slices/auth-slice'

interface LoginFormValues {
  email: string
  password: string
}

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (values: LoginFormValues) => {
    const auth = await authService.login(values)
    dispatch(setAuth(auth))

    const redirectTo =
      typeof location.state === 'object' && location.state && 'from' in location.state
        ? String((location.state as { from?: string }).from ?? '/account')
        : '/account'

    navigate(redirectTo)
  }

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="demo@shop.local" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input type="password" placeholder="123456" />
      </Form.Item>
      <Button htmlType="submit" type="primary" block>
        Login
      </Button>
      <p className="auth-meta">
        New customer? <Link to="/register">Create account</Link>
      </p>
    </Form>
  )
}
