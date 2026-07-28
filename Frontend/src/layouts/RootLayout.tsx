import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useEffect } from 'react'

export const RootLayout = () => {
  const theme = useSelector((state: RootState) => state.theme.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Outlet />
    </div>
  )
}
