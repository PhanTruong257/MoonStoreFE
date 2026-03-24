import { Form } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/service/auth-service'
import { useAppDispatch } from '@/store/hooks'
import { setAuth } from '@/store/slices/auth-slice'

interface RegisterFormValues {
  name: string
  email: string
  password: string
}

export const RegisterForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onSubmit = async (values: RegisterFormValues) => {
    const auth = await authService.register(values)
    dispatch(setAuth(auth))
    navigate('/account')
  }

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
        <Input type="password" />
      </Form.Item>
      <Button htmlType="submit" type="primary" block>
        Register
      </Button>
      <p className="auth-meta">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </Form>
  )
}
