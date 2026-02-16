# Agent Guidelines for crypto_dashboard

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start Vite dev server

# Building
npm run build            # Type check and build for production
npm run preview          # Preview production build locally

# Linting
npm run lint             # Run ESLint on all files

# Testing
npm run test             # Run all Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Run single test
npm test -- --testPathPattern=ComponentName
npm test -- ComponentName.test.tsx
npm test -- -t "test name pattern"
```

## Code Style Guidelines

### TypeScript Configuration
- **Target**: ES2022 with strict mode enabled
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx transform (no need to import React)
- ** verbatimModuleSyntax**: true (use `type` for type imports)

### Imports
- Use `import type { TypeName }` for type-only imports
- Path alias `@/` maps to `src/` directory
- Group imports: React/external libraries first, then internal modules
- No `.js` extension needed for TypeScript imports

```typescript
// Good
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Token } from '@/types/token';
import { useWalletTokens } from '@/hooks/useWalletTokens';

// Bad - missing 'type' keyword for type imports
import { Token } from '@/types/token';
```

### Formatting
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Trailing commas**: Avoid
- **Indentation**: 2 spaces
- **Line width**: Follow existing patterns (~80-100 chars)

### Naming Conventions
- **Components**: PascalCase (e.g., `TokensTable.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWalletTokens.ts`)
- **Types/Interfaces**: PascalCase (e.g., `Token`, `ExplorerConfig`)
- **Constants**: UPPER_SNAKE_CASE for exported constants
- **Functions/Variables**: camelCase
- **Files**: Match the default export name for components

### React Patterns
- Components are **default exports** in their own files
- Hooks are **named exports**
- Use function declarations for components, not arrow functions
- Destructure props in function parameters
- Use type annotations for props interfaces

```typescript
// Good
interface PortfolioTotalProps {
  tokens: Token[];
  isLoading?: boolean;
}

function PortfolioTotal({ tokens, isLoading }: PortfolioTotalProps) {
  // ...
}

export default PortfolioTotal;
```

### TypeScript Strictness
- No unused locals or parameters (enforced by TS config)
- No implicit returns
- No unchecked side-effect imports
- Explicit types on exported functions
- Avoid `any` type - use `unknown` when type is uncertain

### Error Handling
- Use try/catch for async operations
- Return empty arrays/null for missing data rather than throwing
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### Styling
- Use **Tailwind CSS** for all styling
- Prefer Tailwind utility classes over inline styles
- Use `className` for styling (not `style` prop)
- Common pattern: `bg-slate-800/50`, `rounded-lg`, `border border-slate-700`

### Testing
- Use **React Testing Library** with Jest
- Tests located in `__tests__` subdirectory or `.test.ts` files
- Test file naming: `ComponentName.test.tsx`
- Use `screen` for queries, avoid destructuring from `render`
- Coverage thresholds: 70% minimum for branches, functions, lines, statements
- Mock external dependencies in `src/__mocks__/`

```typescript
// Good test pattern
import { render, screen } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
});
```

### Project Structure
```
src/
  components/       # React components (default exports)
    __tests__/      # Component tests
  hooks/            # Custom React hooks (named exports)
  services/         # API calls and external services
  config/           # Configuration files
  types/            # TypeScript type definitions
  lib/              # Library configurations (wagmi, etc.)
  __mocks__/        # Jest mocks
```

### Web3 Specifics
- Use **Wagmi** hooks for blockchain interactions
- Use **Reown AppKit** for wallet connections
- Chain configurations in `src/lib/appkit.ts`
- Token types defined in `src/types/token.ts`

### Environment Variables
- Access via `import.meta.env.VAR_NAME`
- Defined in `.env` file
- Referenced in `vite.config.ts` for build-time replacement

### Git
- Do NOT commit the `.env` file
- Do NOT commit secrets or API keys
- `bun.lock` is committed (uses Bun package manager)
