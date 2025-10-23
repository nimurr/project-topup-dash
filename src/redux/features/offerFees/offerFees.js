import { baseApi } from "../../baseApi/baseApi";

export const offerFeesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPromoCodeList: builder.query({
            query: () => ({
                url: '/copon',
                method: 'GET',
            }),
            providesTags: ['OfferFees'],
        }),
        createPromoCode: builder.mutation({
            query: (data) => ({
                url: '/copon/generate',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['OfferFees'],
        }),
        deletePromoCode: builder.mutation({
            query: (id) => ({
                url: `/copon/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['OfferFees'],
        }),
        updatePromoCode: builder.mutation({
            query: ({ id, data }) => ({
                url: `/copon/update/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['OfferFees'],
        }),

        gerAllFees: builder.query({
            query: () => ({
                url: '/info/fees',
                method: 'GET',
            }),
            providesTags: ['OfferFees'],
        }),
        updateFees: builder.mutation({
            query: (data) => ({
                url: '/info/fees',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['OfferFees'],
        }),
    }),
});

export const {
    useGetAllPromoCodeListQuery,
    useCreatePromoCodeMutation,
    useDeletePromoCodeMutation,
    useUpdatePromoCodeMutation,
    useGerAllFeesQuery,
    useUpdateFeesMutation,

} = offerFeesApi;