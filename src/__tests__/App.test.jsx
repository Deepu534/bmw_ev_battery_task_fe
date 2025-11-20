import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
    evMetricsAPI: {
        getAll: vi.fn(),
        getById: vi.fn(),
        delete: vi.fn()
    }
}));

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render DataGridPage on root path', () => {
        // Arrange
        const initialRoute = '/';
        api.evMetricsAPI.getAll.mockResolvedValue({ data: [], total: 0 });

        // Act
        render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <App />
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByText(/EV - Battery Cell Info/i)).toBeInTheDocument();
    });

    it('should render DetailPage on detail route', async () => {
        // Arrange
        const initialRoute = '/detail/1';
        const mockData = {
            id: 1,
            Brand: 'BMW',
            Model: 'iX',
            Segment: 'E',
            BodyStyle: 'SUV',
            Range_Km: 425,
            PriceEuro: 77300
        };
        api.evMetricsAPI.getById.mockResolvedValue(mockData);

        // Act
        render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <App />
            </MemoryRouter>
        );

        // Assert
        await waitFor(() => {
            expect(screen.getByText(/Selected Ev Details/i)).toBeInTheDocument();
        });
    });
});

