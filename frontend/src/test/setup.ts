// Vitest global test setup.
// - jest-dom adds DOM matchers (toBeInTheDocument, ...).
// - jest-axe adds the accessibility matcher (toHaveNoViolations).
import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)
