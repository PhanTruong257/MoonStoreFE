import { RegisterForm } from '@/features/auth/components/register-form'

export const RegisterPage = () => {
  return (
    <section className="page-section auth-page">
      <h1>Create your account</h1>
      <p>Join NovaCart to track orders and checkout faster.</p>
      <RegisterForm />
    </section>
  )
}
