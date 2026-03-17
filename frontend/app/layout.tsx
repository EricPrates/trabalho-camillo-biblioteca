import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from '@/app/components/Menu/Navbar'

export const metadata: Metadata = {
  title: 'Sistema de Biblioteca',
  description: 'Sistema de gerenciamento de biblioteca',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
