import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionButtons from '../../components/ActionButtons';

describe('ActionButtons', () => {
    test('should render View and Delete buttons', () => {
        // Arrange
        const mockNavigate = vi.fn();
        const mockHandleDelete = vi.fn();
        const id = 1;

        // Act
        render(
            <ActionButtons
                id={id}
                navigate={mockNavigate}
                handleDeleteClick={mockHandleDelete}
            />
        );

        // Assert
        expect(screen.getByText('View')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    test('should call navigate with correct id when View button is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockNavigate = vi.fn();
        const mockHandleDelete = vi.fn();
        const id = 5;

        render(
            <ActionButtons
                id={id}
                navigate={mockNavigate}
                handleDeleteClick={mockHandleDelete}
            />
        );

        // Act
        await user.click(screen.getByText('View'));

        // Assert
        expect(mockNavigate).toHaveBeenCalledWith('/detail/5');
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('should call handleDeleteClick with correct id when Delete button is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
        const mockNavigate = vi.fn();
        const mockHandleDelete = vi.fn();
        const id = 10;

        render(
            <ActionButtons
                id={id}
                navigate={mockNavigate}
                handleDeleteClick={mockHandleDelete}
            />
        );

        // Act
        await user.click(screen.getByText('Delete'));

        // Assert
        expect(mockHandleDelete).toHaveBeenCalledWith(10);
        expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    });
});

