import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../components/Navbar.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
}))

describe('Navbar Component', () => {
  it('renders navbar with logo', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )
    expect(screen.getByText('GlacierFarm')).toBeDefined()
  })

  it('renders navigation links', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )
    expect(screen.getByText('Home')).toBeDefined()
    expect(screen.getByText('Products')).toBeDefined()
    expect(screen.getByText('Orders')).toBeDefined()
    expect(screen.getByText('Storage Units')).toBeDefined()
  })
})
