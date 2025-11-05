import { baseApi } from "../../baseApi/baseApi";

const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: ({ page, limit }) => ({
                url: `/admin/transactions?checkoutSessionId&mode&status&page${page}&limit${limit}`,
                method: "GET",
            }),
            providesTags: ["Transaction"],
        }),
    }),
});

export const { useGetTransactionsQuery } = transactionApi;