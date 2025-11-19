import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from '../pages/HomePage.jsx'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}))

describe('HomePage Component', () => {
  it('renders home page with title', () => {
    render(<HomePage />)
    expect(screen.getByText('Portable Cold Storage')).toBeDefined()
  })

  it('renders feature cards', () => {
    render(<HomePage />)
    expect(screen.getByText('Cold Storage')).toBeDefined()
    expect(screen.getByText('Easy Transport')).toBeDefined()
  })

  it('renders call-to-action buttons', () => {
    render(<HomePage />)
    expect(screen.getByText('Explore Products')).toBeDefined()
  })
})
