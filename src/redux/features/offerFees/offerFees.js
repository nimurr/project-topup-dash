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
    }),
});

export const { 
    useGetAllPromoCodeListQuery, 
    useCreatePromoCodeMutation, 
    useDeletePromoCodeMutation } = offerFeesApi;