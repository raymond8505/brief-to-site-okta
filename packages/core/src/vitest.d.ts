// Wires @testing-library/jest-dom matcher types (toBeInTheDocument, toHaveClass, …) into
// Vitest's `expect` for type-checking. The runtime registration lives in root vitest.setup.ts.
import "@testing-library/jest-dom/vitest";
