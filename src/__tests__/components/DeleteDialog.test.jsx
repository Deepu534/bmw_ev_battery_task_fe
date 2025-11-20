import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteDialog from '../../components/DeleteDialog';

describe('DeleteDialog', () => {
    it('should render dialog with provided content when open', () => {
        // Arrange
        const props = {
            title: 'Delete Item',
            description: 'Are you sure you want to delete this item?',
            proceedText: 'Delete',
            cancelText: 'Cancel',
            open: true,
            onClose: vi.fn(),
            onConfirm: vi.fn()
        };

        // Act
        render(<DeleteDialog {...props} />);

        // Assert
        expect(screen.getByText('Delete Item')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should not render dialog when closed', () => {
        // Arrange
        const props = {
            title: 'Delete Item',
            description: 'Are you sure?',
            proceedText: 'Delete',
            cancelText: 'Cancel',
            open: false,
            onClose: vi.fn(),
            onConfirm: vi.fn()
        };

        // Act
        render(<DeleteDialog {...props} />);

        // Assert
        expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
        const onClose = vi.fn();
        const props = {
            title: 'Delete Item',
            description: 'Are you sure?',
            proceedText: 'Delete',
            cancelText: 'Cancel',
            open: true,
            onClose,
            onConfirm: vi.fn()
        };

        // Act
        render(<DeleteDialog {...props} />);
        await user.click(screen.getByRole('button', { name: /cancel/i }));

        // Assert
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when delete button is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const props = {
            title: 'Delete Item',
            description: 'Are you sure?',
            proceedText: 'Delete',
            cancelText: 'Cancel',
            open: true,
            onClose: vi.fn(),
            onConfirm
        };

        // Act
        render(<DeleteDialog {...props} />);
        await user.click(screen.getByRole('button', { name: /delete/i }));

        // Assert
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});

