import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Interface for Category
export interface Category {
  id: number;
  name: string;
  image: string;
}

// Interface for Item
export interface Item {
  id: string; // UUID
  categoryId: number;
  name: string;
  image: string;
  price: number;
  description: string;
  weight: number;
  stockQuantity: number;
  unit: string;
  discount?: number;
  promotionEnd?: Date;
}

// Interface for Supermarket
export interface Supermarket {
  id: string;
  name: string;
  image: string;
  address: string;
  categories: number[]; // Array of Category IDs
  items: string[]; // Array of Item IDs
}

// Interface for User
export interface User {
  _id: string;
  username: string;
  email: string;
  uid: string;
  authentication: {
    password: string;
    sessionToken?: string;
    salt: string;
  };
  address?: string[];
  phone?: string;
  userType: 'Admin' | 'Driver' | 'Supermarket' | 'Client' | 'Picker';
  profilePicture?: string;
  profile: string;
}

// API Endpoints
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: 'api',
  tagTypes: ['Categories', 'Items', 'Supermarkets', 'Users'],
  endpoints: (build) => ({
    // Category Endpoints
    getCategories: build.query<Category[], void>({
      query: () => '/category',
      providesTags: ['Categories'],
    }),
    createCategory: build.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: '/category',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: build.mutation<
      Category,
      { id: number; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: build.mutation<void, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

    // Item Endpoints
    getItems: build.query<Item[], string | void>({
      query: (search) => ({
        url: '/item',
        params: search ? { search } : {},
      }),
      providesTags: ['Items'],
    }),
    createItem: build.mutation<Item, Partial<Item>>({
      query: (newItem) => ({
        url: '/item',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['Items'],
    }),
    updateItem: build.mutation<Item, { id: string; data: Partial<Item> }>({
      query: ({ id, data }) => ({
        url: `/item/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Items'],
    }),
    deleteItem: build.mutation<void, string>({
      query: (id) => ({
        url: `/item/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Items'],
    }),

    // Supermarket Endpoints
    getSupermarkets: build.query<Supermarket[], void>({
      query: () => '/supermarket',
      providesTags: ['Supermarkets'],
    }),
    createSupermarket: build.mutation<Supermarket, Partial<Supermarket>>({
      query: (newSupermarket) => ({
        url: '/supermarket',
        method: 'POST',
        body: newSupermarket,
      }),
      invalidatesTags: ['Supermarkets'],
    }),
    deleteSupermarket: build.mutation<void, string>({
      query: (id) => ({
        url: `/supermarket/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supermarkets'],
    }),

    // User Endpoints
    getUsers: build.query<User[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUserDetails: build.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Users'],
    }),
    updateUser: build.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    createUser: build.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetSupermarketsQuery,
  useCreateSupermarketMutation,
  useDeleteSupermarketMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
} = api;
