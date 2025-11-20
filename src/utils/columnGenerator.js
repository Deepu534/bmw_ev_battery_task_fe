const detectColumnType = (value) => {
    if (value === null || value === undefined || value === '') {
        return 'text';
    }
    return typeof value === 'number' ? 'number' : 'text';
};

export const generateColumnDefinitions = (data) => {
    if (!data || data.length === 0) {
        return [];
    }

    const allKeys = new Set();
    data.forEach(row => {
        Object.keys(row).forEach(key => allKeys.add(key));
    });

    const keys = Array.from(allKeys).filter(key => key !== 'id');

    const columnTypes = {};
    keys.forEach(key => {
        for (let row of data) {
            if (row[key] !== null && row[key] !== undefined && row[key] !== '') {
                columnTypes[key] = detectColumnType(row[key]);
                break;
            }
        }
        if (!columnTypes[key]) {
            columnTypes[key] = 'text';
        }
    });

    const columns = [];
    const numberFilterOptions = ['equals', 'notEqual', 'lessThan', 'greaterThan', 'lessThanOrEqual', 'greaterThanOrEqual', 'blank'];
    const textFilterOptions = ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith', 'blank'];

    if (allKeys.has('id')) {
        columns.push({
            field: 'id',
            headerName: 'ID',
            width: 100,
            sortable: true,
            filter: 'agNumberColumnFilter',
            filterParams: {
                filterOptions: numberFilterOptions
            }
        });
    }

    keys.forEach(key => {
        const isNumber = columnTypes[key] === 'number';

        const filterParams = isNumber
            ? {
                filterOptions: numberFilterOptions
            }
            : {
                filterOptions: textFilterOptions
            };

        columns.push({
            field: key,
            headerName: formatFieldName(key),
            sortable: true,
            filter: isNumber ? 'agNumberColumnFilter' : 'agTextColumnFilter',
            filterParams: filterParams
        });
    });

    return columns;
};

export const formatFieldName = (fieldName) => {
    return fieldName
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/^\w/, c => c.toUpperCase());
};

export const formatFieldValue = (value, key) => {
    if (value === null || value === undefined) return 'N/A';
    if (key.toLowerCase().includes('date')) {
        return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    return value;
};

