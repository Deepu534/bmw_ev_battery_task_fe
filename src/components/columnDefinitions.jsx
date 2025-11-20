import ActionButtons from './ActionButtons';
import { generateColumnDefinitions } from '../utils/columnGenerator';

export const getColumnDefinitions = (data, navigate, handleDeleteClick) => {
    const columns = generateColumnDefinitions(data);

    const actionsColumn = {
        field: 'actions',
        headerName: 'Actions',
        width: 220,
        cellRenderer: (params) => {
            if (!params.data) {
                return null;
            }
            return (
                <ActionButtons
                    id={params.data.id}
                    navigate={navigate}
                    handleDeleteClick={handleDeleteClick}
                />
            );
        },
        sortable: false,
        filter: false,
        pinned: 'right',
        lockPosition: true,
        cellStyle: {
            padding: '8px',
            verticalAlign: 'middle'
        },
    };

    return [...columns, actionsColumn];
};

