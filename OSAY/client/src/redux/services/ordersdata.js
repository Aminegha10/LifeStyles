import { createApi , fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const OrdersApi = createApi({
    reducerPath: 'orders',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/orders',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getAllorders: builder.query({
            query: () => ({
                url: '/getAll',
                method: 'GET',
            }),
        }),
        getordersById: builder.query({
            query: (id) => ({
                url: `/getOrder/${id}`,
                method: 'GET',
            }),
        }),
        getUserOrder: builder.query({
            query: (id) => ({
                url: `/getUserOrder/${id}`,
                method: 'GET',
            }),
        }),
        addorders: builder.mutation({
            query: (order) => ({
                url: '/addOrder',
                method: 'POST',
                body: order,
                
            }),
        }),
      
        deleteorders: builder.mutation({
            query: (id) => ({
                url: `/deleteOrder/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useGetAllordersQuery , useGetordersByIdQuery , useAddordersMutation , useDeleteordersMutation , useGetUserOrderQuery } = OrdersApi