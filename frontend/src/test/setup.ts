// Vitest global test setup.
// - jest-dom adds DOM matchers (toBeInTheDocument, ...).
// - jest-axe adds the accessibility matcher (toHaveNoViolations).
import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'
import { expect, vi } from 'vitest'

expect.extend(toHaveNoViolations)

// jsdom does not implement matchMedia; provide a no-match stub so components
// that read prefers-reduced-motion (etc.) render without throwing in tests.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}
