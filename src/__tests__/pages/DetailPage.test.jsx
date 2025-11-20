import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DetailPage from '../../pages/DetailPage';
import * as api from '../../services/api';

vi.mock('../../services/api', () => ({
    evMetricsAPI: {
        getAll: vi.fn(),
        getById: vi.fn(),
        delete: vi.fn()
    }
}));

describe('DetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading indicator initially', () => {
        // Arrange
        api.evMetricsAPI.getById.mockImplementation(() => new Promise(() => { }));

        // Act
        render(
            <MemoryRouter initialEntries={['/detail/1']}>
                <Routes>
                    <Route path="/detail/:id" element={<DetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Assert
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should display record details when data is loaded', async () => {
        // Arrange
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
            <MemoryRouter initialEntries={['/detail/1']}>
                <Routes>
                    <Route path="/detail/:id" element={<DetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Assert
        await waitFor(() => {
            expect(screen.getByText('Selected Ev Details')).toBeInTheDocument();
            expect(screen.getByText('BMW')).toBeInTheDocument();
            expect(screen.getByText('iX')).toBeInTheDocument();
        });
    });

    it('should show not found message when data is null', async () => {
        // Arrange
        api.evMetricsAPI.getById.mockResolvedValue(null);

        // Act
        render(
            <MemoryRouter initialEntries={['/detail/999']}>
                <Routes>
                    <Route path="/detail/:id" element={<DetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Assert
        await waitFor(() => {
            expect(screen.getByText('Record not found')).toBeInTheDocument();
        });
    });

    it('should navigate back when back button is clicked', async () => {
        // Arrange
        const user = userEvent.setup();
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
            <MemoryRouter initialEntries={['/detail/1']}>
                <Routes>
                    <Route path="/" element={<div>DataGrid Page</div>} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Selected Ev Details')).toBeInTheDocument();
        });

        const backButton = screen.getByRole('button', { name: /back to table/i });
        await user.click(backButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByText('DataGrid Page')).toBeInTheDocument();
        });
    });
});

