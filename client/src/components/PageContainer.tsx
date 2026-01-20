import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '48px 20px',
      }}
    >
      {children}
    </div>
  )
}
