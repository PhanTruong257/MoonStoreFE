import { Badge } from 'antd'
import { Link } from 'react-router-dom'

import styles from '@/components/master/app-header.module.scss'
import { SearchBar } from '@/features/search/components/search-bar'
import { useAuth } from '@/hooks/useAuth'
import { useAppSelector } from '@/store/hooks'

export const AppHeader = () => {
  const { isAuthenticated } = useAuth()
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          NovaCart
        </Link>
        <SearchBar />
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/category/all">Category</Link>
          <Badge count={cartCount} size="small">
            <Link to="/cart">Cart</Link>
          </Badge>
          <Link to={isAuthenticated ? '/account' : '/login'}>
            {isAuthenticated ? 'Account' : 'Login'}
          </Link>
        </nav>
      </div>
    </header>
  )
}
