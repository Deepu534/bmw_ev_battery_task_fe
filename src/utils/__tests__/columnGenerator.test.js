import { generateColumnDefinitions } from '../columnGenerator';

describe('columnGenerator', () => {
    describe('generateColumnDefinitions', () => {
        it('should return empty array for empty data', () => {
            const result = generateColumnDefinitions([]);
            expect(result).toEqual([]);
        });

        it('should return empty array for null data', () => {
            const result = generateColumnDefinitions(null);
            expect(result).toEqual([]);
        });

        it('should generate column definitions from data with text fields', () => {
            const data = [
                { id: 1, name: 'Test', description: 'A test item' },
                { id: 2, name: 'Test2', description: 'Another test' }
            ];

            const result = generateColumnDefinitions(data);

            expect(result.length).toBe(3); // id, name, description
            expect(result[0].field).toBe('id');
            expect(result[0].filter).toBe('agNumberColumnFilter');

            const nameColumn = result.find(col => col.field === 'name');
            expect(nameColumn.filter).toBe('agTextColumnFilter');
            expect(nameColumn.headerName).toBe('Name');
        });

        it('should detect number columns correctly', () => {
            const data = [
                { id: 1, Range_Km: 500, PriceEuro: 35000 }
            ];

            const result = generateColumnDefinitions(data);

            const rangeColumn = result.find(col => col.field === 'Range_Km');
            expect(rangeColumn.filter).toBe('agNumberColumnFilter');
            expect(rangeColumn.headerName).toBe('Range Km');

            const priceColumn = result.find(col => col.field === 'PriceEuro');
            expect(priceColumn.filter).toBe('agNumberColumnFilter');
            expect(priceColumn.headerName).toBe('Price Euro');
        });

        it('should format header names correctly', () => {
            const data = [
                { id: 1, Brand: 'BMW', BodyStyle: 'SUV', Range_Km: 500 }
            ];

            const result = generateColumnDefinitions(data);

            const brandColumn = result.find(col => col.field === 'Brand');
            expect(brandColumn.headerName).toBe('Brand');

            const bodyColumn = result.find(col => col.field === 'BodyStyle');
            expect(bodyColumn.headerName).toBe('Body Style');

            const rangeColumn = result.find(col => col.field === 'Range_Km');
            expect(rangeColumn.headerName).toBe('Range Km');
        });

        it('should handle mixed types across rows', () => {
            const data = [
                { id: 1, value: null },
                { id: 2, value: 100 },
                { id: 3, value: 200 }
            ];

            const result = generateColumnDefinitions(data);

            const valueColumn = result.find(col => col.field === 'value');
            expect(valueColumn.filter).toBe('agNumberColumnFilter');
        });

        it('should always put id column first', () => {
            const data = [
                { name: 'Test', Brand: 'BMW', id: 1, model: 'X5' }
            ];

            const result = generateColumnDefinitions(data);

            expect(result[0].field).toBe('id');
            expect(result[0].width).toBe(100);
        });

        it('should make all columns sortable and filterable', () => {
            const data = [
                { id: 1, name: 'Test', price: 100 }
            ];

            const result = generateColumnDefinitions(data);

            result.forEach(column => {
                expect(column.sortable).toBe(true);
                expect(column.filter).toBeDefined();
                expect(column.filterParams).toBeDefined();
                expect(column.filterParams.maxNumConditions).toBe(1);
                expect(column.filterParams.filterOptions).toBeDefined();
                expect(column.filterParams.suppressAndOrCondition).toBe(true);
            });
        });
    });
});

