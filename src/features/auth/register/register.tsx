import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

import { useRegister } from '@/features/auth/register/hook'


export const Register = () => {
	const { form, error, isSubmitting, setField, submit } = useRegister()

	return (
		<section className={styles.panel}>
			<h1>Create an account</h1>
			<p>Enter your details below</p>

			<input
				className={styles.field}
				placeholder="Name"
				value={form.name}
				onChange={(event) => setField('name', event.target.value)}
			/>

			<input
				className={styles.field}
				type="email"
				placeholder="Email or Phone Number"
				value={form.email}
				onChange={(event) => setField('email', event.target.value)}
			/>

			<input
				className={styles.field}
				type="password"
				placeholder="Password"
				value={form.password}
				onChange={(event) => setField('password', event.target.value)}
			/>

			{error ? <p className={styles.error}>{error}</p> : null}

			<button type="button" className={styles.button} disabled={isSubmitting} onClick={submit}>
				{isSubmitting ? 'Creating...' : 'Create Account'}
			</button>

			<button type="button" className={styles.google}>
				Sign up with Google
			</button>

			<div className={styles.bottom}>
				Already have account?
				<Link to="/login">Log in</Link>
			</div>
		</section>
	)
}
