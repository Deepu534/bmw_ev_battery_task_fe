import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationSnackbar from '../../components/NotificationSnackbar';

describe('NotificationSnackbar', () => {
    it('should render snackbar with message when open', () => {
        // Arrange
        const props = {
            open: true,
            message: 'Operation successful',
            severity: 'success',
            onClose: vi.fn()
        };

        // Act
        render(<NotificationSnackbar {...props} />);

        // Assert
        expect(screen.getByText('Operation successful')).toBeInTheDocument();
    });

    it('should not render snackbar when closed', () => {
        // Arrange
        const props = {
            open: false,
            message: 'Operation successful',
            severity: 'success',
            onClose: vi.fn()
        };

        // Act
        render(<NotificationSnackbar {...props} />);

        // Assert
        expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });

    it('should render with error severity', () => {
        // Arrange
        const props = {
            open: true,
            message: 'Operation failed',
            severity: 'error',
            onClose: vi.fn()
        };

        // Act
        render(<NotificationSnackbar {...props} />);

        // Assert
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByText('Operation failed')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
        const onClose = vi.fn();
        const props = {
            open: true,
            message: 'Test message',
            severity: 'info',
            onClose
        };

        // Act
        render(<NotificationSnackbar {...props} />);
        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);

        // Assert
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

