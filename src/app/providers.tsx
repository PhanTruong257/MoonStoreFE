import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { antdThemeToken } from '@/config/antd-theme'
import { ThemeContextProvider } from '@/context/theme-context'
import { appStore } from '@/store/app-store'

import { router } from './router'

export const AppProviders = () => {
  return (
    <Provider store={appStore}>
      <ThemeContextProvider>
        <ConfigProvider theme={{ token: antdThemeToken }}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </ThemeContextProvider>
    </Provider>
  )
}
