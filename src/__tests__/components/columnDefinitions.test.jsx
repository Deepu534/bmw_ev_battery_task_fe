import { describe, it, expect, vi } from 'vitest';
import { getColumnDefinitions } from '../../components/columnDefinitions';

describe('columnDefinitions', () => {
    it('should generate columns from data with Actions column', () => {
        // Arrange
        const data = [
            { id: 1, Brand: 'BMW', Model: 'iX', PriceEuro: 77300 }
        ];
        const navigate = vi.fn();
        const handleDeleteClick = vi.fn();

        // Act
        const columns = getColumnDefinitions(data, navigate, handleDeleteClick);

        // Assert
        expect(columns.length).toBeGreaterThan(0);
        const actionsColumn = columns.find(col => col.field === 'actions');
        expect(actionsColumn).toBeDefined();
        expect(actionsColumn.headerName).toBe('Actions');
        expect(actionsColumn.sortable).toBe(false);
        expect(actionsColumn.filter).toBe(false);
    });

    it('should include data columns along with Actions', () => {
        // Arrange
        const data = [
            { id: 1, name: 'Test Item', value: 100 }
        ];
        const navigate = vi.fn();
        const handleDeleteClick = vi.fn();

        // Act
        const columns = getColumnDefinitions(data, navigate, handleDeleteClick);

        // Assert
        const dataColumns = columns.filter(col => col.field !== 'actions');
        expect(dataColumns.length).toBeGreaterThan(0);
        expect(columns[columns.length - 1].field).toBe('actions');
    });

    it('should return Actions column for empty data', () => {
        // Arrange
        const data = [];
        const navigate = vi.fn();
        const handleDeleteClick = vi.fn();

        // Act
        const columns = getColumnDefinitions(data, navigate, handleDeleteClick);

        // Assert
        expect(columns.length).toBe(1);
        expect(columns[0].field).toBe('actions');
    });

    it('should pin Actions column to the right', () => {
        // Arrange
        const data = [{ id: 1, name: 'Test' }];
        const navigate = vi.fn();
        const handleDeleteClick = vi.fn();

        // Act
        const columns = getColumnDefinitions(data, navigate, handleDeleteClick);

        // Assert
        const actionsColumn = columns.find(col => col.field === 'actions');
        expect(actionsColumn.pinned).toBe('right');
        expect(actionsColumn.lockPosition).toBe(true);
    });
});

