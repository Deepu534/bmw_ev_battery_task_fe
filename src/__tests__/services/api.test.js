import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();
const mockDelete = vi.fn();

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            get: mockGet,
            delete: mockDelete
        }))
    }
}));

// Import after mocking
const { evMetricsAPI } = await import('../../services/api');

describe('evMetricsAPI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        test('should fetch all records with params', async () => {
            // Arrange
            const mockData = {
                data: [{ id: 1, Brand: 'BMW' }],
                pagination: { total: 1 }
            };

            mockGet.mockResolvedValue({ data: mockData });
            const params = { page: 1, limit: 50 };

            // Act
            const result = await evMetricsAPI.getAll(params);

            // Assert
            expect(result).toEqual(mockData);
            expect(mockGet).toHaveBeenCalledWith('/ev-metrics', { params });
        });

        test('should call API with empty params when none provided', async () => {
            // Arrange
            const mockData = { data: [], pagination: {} };
            mockGet.mockResolvedValue({ data: mockData });

            // Act
            await evMetricsAPI.getAll();

            // Assert
            expect(mockGet).toHaveBeenCalledWith('/ev-metrics', { params: {} });
        });
    });

    describe('getById', () => {
        test('should fetch single record by id', async () => {
            // Arrange
            const mockRecord = { id: 1, Brand: 'BMW', Model: 'i4' };
            mockGet.mockResolvedValue({ data: mockRecord });

            // Act
            const result = await evMetricsAPI.getById(1);

            // Assert
            expect(result).toEqual(mockRecord);
            expect(mockGet).toHaveBeenCalledWith('/ev-metrics/1');
        });
    });

    describe('delete', () => {
        test('should delete record by id', async () => {
            // Arrange
            mockDelete.mockResolvedValue({});

            // Act
            await evMetricsAPI.delete(1);

            // Assert
            expect(mockDelete).toHaveBeenCalledWith('/ev-metrics/1');
            expect(mockDelete).toHaveBeenCalledTimes(1);
        });
    });
});

