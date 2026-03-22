# AGENTS.md - Instructions for AI Coding Agents

## Build, Lint, and Test Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build

# Run linter
npm run lint

# Type check
npm run typecheck

# Run all tests
npm test

# Run a single test file
npm test -- path/to/test-file.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
src/
├── api/
│   ├── api.ts              # OpenMRS REST API clients
│   └── pdf-generator.ts    # PDF and HTML generation
├── components/
│   ├── PrintButton.tsx     # Main print button component
│   └── PrintPreviewModal.tsx
├── commands/
│   ├── print-patient-action.tsx
│   └── print-visit-action.tsx
└── index.ts                # Module entry point
```

## Code Style Guidelines

### Imports
- Group imports: OpenMRS framework first, then third-party, then local
- Use relative imports for local files (`../api/api`)
- Named imports preferred: `import { getPatient } from '../api/api'`
- Default imports for React and libraries: `import React from 'react'`

### TypeScript
- Strict mode enabled - no `any` unless absolutely necessary
- Define interfaces for all data structures
- Use proper types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use optional chaining (`?.`) for potentially undefined properties

### React Components
- Functional components with TypeScript: `const Component: React.FC<Props> = () => {}`
- Use hooks (`useState`, `useEffect`) for state management
- Extract styles to CSS modules: `import styles from './Component.module.css'`
- Component props should be typed interfaces

### Naming Conventions
- Files: kebab-case for components (`print-button.tsx`)
- Interfaces: PascalCase (`Patient`, `Visit`)
- Functions: camelCase (`getPatient`, `generatePDF`)
- Variables: camelCase (`patientUuid`, `printData`)
- CSS classes: camelCase in JS, kebab-case in CSS files

### Error Handling
- Use try-catch for async operations
- Store errors in state for UI feedback: `const [error, setError] = useState<string | null>(null)`
- Display user-friendly error messages via translations
- Log technical details, show friendly messages to users

```typescript
try {
  const data = await fetchData();
} catch (err) {
  setError(err instanceof Error ? err.message : 'Failed to fetch data');
}
```

### Async Operations
- Use `async/await` pattern
- Handle loading states with `useState`
- Use `Promise.all` for parallel requests
- Always cleanup or handle promise rejections

### OpenMRS Specific Patterns
- Use `@openmrs/esm-framework` for core functionality
- Access global state via `getGlobalSpace('patient')`
- Use `useTranslation()` hook for i18n
- REST API via `openmrsFetch` and `restBaseUrl`

### API Layer
- Separate API calls into dedicated functions
- Return typed interfaces from API functions
- Use OpenMRS REST API conventions with `v=full` for complete data

### CSS Modules
- Use CSS modules for component-scoped styles
- Define all classes in `.module.css` files
- Use BEM-like naming: `printButton`, `spinner`, `error`

### Documentation
- JSDoc comments for complex functions
- Inline comments for non-obvious logic
- Keep functions small and focused (single responsibility)

### Testing
- Test files: `*.test.ts` or `*.test.tsx`
- Use Jest framework
- Test API functions, components, and utilities separately
- Mock OpenMRS framework dependencies

## Common Patterns

### Fetching Data
```typescript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const [patient, visits, encounters] = await Promise.all([
      getPatient(patientUuid),
      getVisits(patientUuid),
      getEncounters(patientUuid),
    ]);
    // Process data
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error message');
  } finally {
    setLoading(false);
  }
};
```

### Component Structure
```typescript
interface Props {
  patientUuid: string;
}

const Component: React.FC<Props> = ({ patientUuid }) => {
  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  
  // Logic here
  
  return <JSX />;
};

export default Component;
```

## Git Workflow
- Create descriptive commit messages
- Run lint and typecheck before committing
- Keep commits focused on single features/fixes
- Follow existing commit style in repo

## OpenMRS documentation
- Overview - https://openmrs.atlassian.net/wiki/spaces/docs/pages/151093495/Introduction+to+O3+for+Developers
- Key Repositories - https://openmrs.atlassian.net/wiki/spaces/docs/pages/150962486/Key+O3+Repositories
- Configuration - https://openmrs.atlassian.net/wiki/spaces/docs/pages/151093674/Configure+O3
- Frontend modules - https://openmrs.atlassian.net/wiki/spaces/docs/pages/150930084/Frontend+Modules
- Recipes for O3 - https://openmrs.atlassian.net/wiki/spaces/docs/pages/151093920/Recipes+for+O3+Development

## Dependencies
- React 18.2.0
- OpenMRS Framework 8.0.0
- jsPDF 2.5.1 for PDF generation
- html2canvas 1.4.1 for screenshots
- date-fns 2.30.0 for date formatting
- lodash-es 4.17.21 for utilities
