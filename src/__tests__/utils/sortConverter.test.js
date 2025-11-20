import { describe, test, expect } from 'vitest';
import { convertSortToAPIFormat } from '../../utils/sortConverter';

describe('sortConverter', () => {
    describe('convertSortToAPIFormat', () => {
        test('should return empty object for empty sort model', () => {
            // Arrange
            const sortModel = [];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({});
        });

        test('should convert ascending sort', () => {
            // Arrange
            const sortModel = [
                { colId: 'brand', sort: 'asc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'brand',
                direction: 'asc'
            });
        });

        test('should convert descending sort', () => {
            // Arrange
            const sortModel = [
                { colId: 'model', sort: 'desc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'model',
                direction: 'desc'
            });
        });

        test('should use range field directly', () => {
            // Arrange
            const sortModel = [
                { colId: 'range', sort: 'asc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'range',
                direction: 'asc'
            });
        });

        test('should map price to price field', () => {
            // Arrange
            const sortModel = [
                { colId: 'price', sort: 'desc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'price',
                direction: 'desc'
            });
        });

        test('should only use first sort when multiple sorts provided', () => {
            // Arrange
            const sortModel = [
                { colId: 'brand', sort: 'asc' },
                { colId: 'model', sort: 'desc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'brand',
                direction: 'asc'
            });
        });

        test('should use topSpeed field directly', () => {
            // Arrange
            const sortModel = [
                { colId: 'topSpeed', sort: 'desc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'topSpeed',
                direction: 'desc'
            });
        });

        test('should use efficiency field directly', () => {
            // Arrange
            const sortModel = [
                { colId: 'efficiency', sort: 'asc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'efficiency',
                direction: 'asc'
            });
        });

        test('should map acceleration to acceleration field', () => {
            // Arrange
            const sortModel = [
                { colId: 'acceleration', sort: 'desc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'acceleration',
                direction: 'desc'
            });
        });

        test('should use field names directly', () => {
            // Arrange
            const sortModel = [
                { colId: 'seats', sort: 'asc' }
            ];

            // Act
            const result = convertSortToAPIFormat(sortModel);

            // Assert
            expect(result).toEqual({
                field: 'seats',
                direction: 'asc'
            });
        });
    });
});

