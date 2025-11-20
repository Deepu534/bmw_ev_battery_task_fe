import '@testing-library/jest-dom';

// Suppress MUI warnings in tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: An update to') ||
                args[0].includes('not wrapped in act'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

