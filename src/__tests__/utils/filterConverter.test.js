import { describe, test, expect } from 'vitest';
import { convertFilterToAPIFormat } from '../../utils/filterConverter';

describe('filterConverter', () => {
    describe('convertFilterToAPIFormat', () => {
        test('should return empty object for empty filter model', () => {
            // Arrange
            const filterModel = {};

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({});
        });

        test('should convert text filter with contains operator', () => {
            // Arrange
            const filterModel = {
                brand: {
                    filterType: 'text',
                    type: 'contains',
                    filter: 'BMW'
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                brand: {
                    operator: 'contains',
                    value: 'BMW'
                }
            });
        });

        test('should convert text filter with notContains operator', () => {
            // Arrange
            const filterModel = {
                model: {
                    filterType: 'text',
                    type: 'notContains',
                    filter: 'X5'
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                model: {
                    operator: 'notContains',
                    value: 'X5'
                }
            });
        });

        test('should convert number filter with equals operator', () => {
            // Arrange
            const filterModel = {
                range: {
                    filterType: 'number',
                    type: 'equals',
                    filter: 500
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                range: {
                    operator: 'equals',
                    value: 500
                }
            });
        });

        test('should convert number filter with notEqual operator', () => {
            // Arrange
            const filterModel = {
                price: {
                    filterType: 'number',
                    type: 'notEqual',
                    filter: 50000
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                price: {
                    operator: 'notEqual',
                    value: 50000
                }
            });
        });

        test('should convert number filter with greaterThan operator', () => {
            // Arrange
            const filterModel = {
                range: {
                    filterType: 'number',
                    type: 'greaterThan',
                    filter: 400
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                range: {
                    operator: 'greaterThan',
                    value: 400
                }
            });
        });

        test('should handle multiple filters', () => {
            // Arrange
            const filterModel = {
                brand: {
                    filterType: 'text',
                    type: 'contains',
                    filter: 'BMW'
                },
                range: {
                    filterType: 'number',
                    type: 'greaterThan',
                    filter: 400
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                brand: {
                    operator: 'contains',
                    value: 'BMW'
                },
                range: {
                    operator: 'greaterThan',
                    value: 400
                }
            });
        });

        test('should skip filters with empty values', () => {
            // Arrange
            const filterModel = {
                brand: {
                    filterType: 'text',
                    type: 'contains',
                    filter: ''
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({});
        });

        test('should convert blank filter to isEmpty operator', () => {
            // Arrange
            const filterModel = {
                brand: {
                    filterType: 'text',
                    type: 'blank',
                    filter: null
                }
            };

            // Act
            const result = convertFilterToAPIFormat(filterModel);

            // Assert
            expect(result).toEqual({
                brand: {
                    operator: 'isEmpty',
                    value: null
                }
            });
        });
    });
});

