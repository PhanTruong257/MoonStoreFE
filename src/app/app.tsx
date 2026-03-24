import { Outlet } from 'react-router-dom'

import { AppFooter } from '@/components/master/app-footer'
import { AppHeader } from '@/components/master/app-header'
import { MainContainer } from '@/components/master/main-container'

export const AppShell = () => {
  return (
    <div className="app-root">
      <AppHeader />
      <MainContainer>
        <Outlet />
      </MainContainer>
      <AppFooter />
    </div>
  )
}
