'use client';
import React from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { items as initialItems } from '../../data/supermarketData'; // Import your items data
import { Item } from '../../data/supermarketType';

// Define the columns for the DataGrid
const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200 },
    {
        field: "price",
        headerName: "Price",
        width: 110,
        type: "number",
        valueGetter: (value, row) => `R$${row.price}`,
    },
    {
        field: "stockQuantity",
        headerName: "Stock Quantity",
        width: 150,
        type: "number",
    },
];

// Function to delete a single product
// const deleteProduct = (id: string) => {
//     // Implement your delete logic here
//     console.log(`Deleting product with ID ${id}`);
// };

// Inventory component
const Inventory = () => {
    const [products, setProducts] = React.useState<Item[]>(initialItems);

    // Function to delete all products
    const deleteAllProducts = () => {
        setProducts([]);
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Inventory</h1>
            </div>
            <DataGrid
                rows={products}
                columns={columns}
                getRowId={(row) => row.id} // Ensure row.id is correctly typed
                checkboxSelection
                className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
            />
        </div>
    );
};

export default Inventory;
