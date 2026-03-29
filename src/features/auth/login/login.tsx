import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

import { useLogin } from '@/features/auth/login/hook'


export const Login = () => {
	const { form, error, isSubmitting, setField, submit } = useLogin()

	return (
		<section className={styles.panel}>
			<h1>Log in to Exclusive</h1>
			<p>Enter your details below</p>

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

			<div className={styles.actionRow}>
				<button type="button" className={styles.button} disabled={isSubmitting} onClick={submit}>
					{isSubmitting ? 'Logging in...' : 'Log In'}
				</button>

				<Link className={styles.link} to="/register">
					Forgot Password?
				</Link>
			</div>

			<div className={styles.bottom}>
				Don't have an account?
				<Link to="/register">Sign up</Link>
			</div>
		</section>
	)
}
