import { LoginForm } from '@/features/auth/components/login-form'

export const LoginPage = () => {
  return (
    <section className="page-section auth-page">
      <h1>Welcome back</h1>
      <p>Sign in to continue your shopping journey.</p>
      <LoginForm />
    </section>
  )
}
