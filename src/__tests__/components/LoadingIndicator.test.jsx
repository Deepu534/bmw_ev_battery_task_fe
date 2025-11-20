import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingIndicator from '../../components/LoadingIndicator';

describe('LoadingIndicator', () => {
    it('should render loading spinner', () => {
        // Arrange & Act
        render(<LoadingIndicator />);

        // Assert
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
    });
});

