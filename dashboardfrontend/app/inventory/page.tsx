"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    useTable,
    useRowSelect,
    Column,
    TableInstance,
    Row,
    CellProps,
} from 'react-table';
import { useItem } from '../context/ItemContext';
import { useSupermarket } from '../context/SupermarketContext';
import { useLogin } from '../context/LoginContext';
import { useRouter } from "next/navigation";

interface Item {
    _id: string;
    name: string;
    price: number;
    stockQuantity: number;
}

interface ItemRow extends Row<Item> {
    getToggleRowSelectedProps: () => any;
}

const Inventory = () => {
    const { items, fetchItemsBySupermarket, deleteItem } = useItem();
    const { isAuthenticated, user } = useLogin();
    const { supermarketId } = useSupermarket();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const router = useRouter();

    const fetchItems = useCallback(async () => {
        if (supermarketId) {
            await fetchItemsBySupermarket();
        } else {
            console.warn('supermarketId is undefined');
        }
    }, [fetchItemsBySupermarket, supermarketId]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && supermarketId && isInitialLoad) {
            fetchItems().then(() => setIsInitialLoad(false));
        }
    }, [isAuthenticated, supermarketId, fetchItems, isInitialLoad]);

    const columns: Column<Item>[] = React.useMemo(
        () => [
            {
                id: 'selection',
                Header: ({ getToggleAllRowsSelectedProps }: any) => {
                    const { indeterminate, ...rest } = getToggleAllRowsSelectedProps();
                    const checkboxRef = useRef<HTMLInputElement>(null);

                    useEffect(() => {
                        if (checkboxRef.current) {
                            checkboxRef.current.indeterminate = !!indeterminate;
                        }
                    }, [indeterminate]);

                    return (
                        <input
                            type="checkbox"
                            id="select-all"
                            {...rest}
                            ref={checkboxRef}
                        />
                    );
                },
                Cell: ({ row }: { row: Row<Item> }) => {
                    // Use type assertion to inform TypeScript that getToggleRowSelectedProps exists
                    const { indeterminate, ...rest } = (row as any).getToggleRowSelectedProps();
                    const checkboxRef = useRef<HTMLInputElement>(null);

                    useEffect(() => {
                        if (checkboxRef.current) {
                            checkboxRef.current.indeterminate = !!indeterminate;
                        }
                    }, [indeterminate]);

                    return (
                        <input
                            type="checkbox"
                            id={`select-row-${row.original._id}`}
                            {...rest}
                            ref={checkboxRef}
                        />
                    );
                },
                width: 50,
            },
            { Header: 'ID', accessor: '_id' },
            { Header: 'Product Name', accessor: 'name' },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: ({ value }: { value: number }) => `R$${value.toFixed(2)}`,
            },
            { Header: 'Stock Quantity', accessor: 'stockQuantity' },
            {
                Header: 'Actions',
                Cell: ({ row }: CellProps<Item>) => (
                    <button
                        className="bg-gray-400 hover:bg-black-300 text-white px-4 py-2 rounded"
                        onClick={() => {
                            console.log(`Deleting item with ID: ${row.original._id}`);
                            deleteItem(row.original._id);
                        }}
                    >
                        Delete
                    </button>
                ),
                width: 100,
            },
        ],
        [deleteItem]
    );

    const data = React.useMemo(() => items, [items]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { selectedRowIds },
        getToggleAllRowsSelectedProps,
    } = useTable<Item>(
        {
            columns,
            data
        },
        useRowSelect,
        hooks => {
            // No additional hooks needed here
        }
    ) as TableInstance<Item> & {
        state: {
            selectedRowIds: Record<string, boolean>;
        };
        getToggleAllRowsSelectedProps: () => any;
    };

    const handleDeleteSelected = useCallback(() => {
        console.log("Selected Row IDs:", selectedRowIds);
        if (Object.keys(selectedRowIds).length === 0) return;
        Object.keys(selectedRowIds).forEach(id => {
            console.log(`Deleting selected item with ID: ${id}`);
            deleteItem(id);
        });
    }, [selectedRowIds, deleteItem]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button
                    className="bg-black-300 text-white px-4 py-2 rounded"
                    onClick={handleDeleteSelected}
                    disabled={Object.keys(selectedRowIds).length === 0}
                >
                    Delete Selected
                </button>
            </div>
            <div className="overflow-x-auto">
                <table
                    {...getTableProps()}
                    className="min-w-full bg-white shadow rounded-lg border border-gray-200"
                >
                    <thead>
                        {headerGroups.map(headerGroup => {
                            const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();

                            return (
                                <tr key={key} {...headerGroupProps} className="bg-gray-100 border-b">
                                    {headerGroup.headers.map(column => {
                                        const { key: columnKey, ...columnProps } = column.getHeaderProps();

                                        return (
                                            <th key={columnKey} {...columnProps} className="p-3 text-left border-b">
                                                {column.render('Header')}
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            const { key, ...rowProps } = row.getRowProps();

                            return (
                                <tr key={key} {...rowProps} className="hover:bg-gray-50">
                                    {row.cells.map(cell => {
                                        const { key: cellKey, ...cellProps } = cell.getCellProps();

                                        return (
                                            <td key={cellKey} {...cellProps} className="p-3 border-b">
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
