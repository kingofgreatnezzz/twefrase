import './globals.css'
import ClientThemeProvider from '../components/ClientThemeProvider'

export const metadata = {
  title: 'Twefrase - Wallet Phrase Input',
  description: 'Simple wallet phrase input application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  )
}
