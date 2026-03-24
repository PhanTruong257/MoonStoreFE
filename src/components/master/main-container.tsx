import type { PropsWithChildren } from 'react'

export const MainContainer = ({ children }: PropsWithChildren) => {
  return <main className="main-container">{children}</main>
}
