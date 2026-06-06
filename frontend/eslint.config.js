import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // Accessibility lint rules — a scored dimension, enforced at lint time.
      jsxA11y.flatConfigs.recommended,
      // Must stay LAST: disables stylistic rules that conflict with Prettier.
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
