import { baseApi } from "../../baseApi/baseApi";

const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: ({ limit, createdAt }) => ({
                url: `/admin/transactions?limit=${limit}&createdAt=${createdAt}`,
                method: "GET",
            }),
            providesTags: ["Transaction"],
        }),
    }),
});

export const { useGetTransactionsQuery } = transactionApi;