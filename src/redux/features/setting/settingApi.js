import { baseApi } from "../../baseApi/baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllSettings: builder.query({
      query: () => ({
        url: "/general-info",
        method: "GET",
        providesTags: ["Setting"],
      }),
    }),

    updatePrivacyPolicyAll: builder.mutation({  // ✅ FIXED: Use mutation instead of query
      query: (data) => ({
        url: "/info/privacy-policy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/info/privacy-policy",
        method: "GET",
        providesTags: ["Setting"],
      }),
    }),

    gatTermsAndConditions: builder.query({
      query: () => ({
        url: "/info/terms-condition",
        method: "GET",
        providesTags: ["Setting"],
      }),
    }),
    updateTramsAndConditionsAll: builder.mutation({  // ✅ FIXED: Use mutation instead of query
      query: (data) => ({
        url: "/info/terms-condition",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),

    getAboutUs: builder.query({
      query: () => ({
        url: "/info/about-us",
        method: "GET",
        providesTags: ["Setting"],
      }),
    }),

    updateAboutUs: builder.mutation({  // ✅ FIXED: Use mutation instead of query
      query: (data) => ({
        url: "/info/about-us",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),



    addFaqMain: builder.mutation({  // ✅ FIXED: Use mutation instead of query
      query: (data) => ({
        url: "/general-info/add-new-faq",
        method: "POST",
        body: data,
      }),
    }),



    getUserProfile: builder.query({
      query: () => ({
        url: "/users/self/in",
        method: "GET",
        providesTags: ["Profile"],
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/self/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),


    getAllNotification: builder.query({
      query: () => ({
        url: "/info/notifications",
        method: "GET",
        providesTags: ["Notification"],
      }),
    }),

    sendUserNotification: builder.mutation({
      query: (data) => ({
        url: "/info/notifications/manual/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),


    getAllFaq: builder.query({
      query: () => ({
        url: "/faq",
        method: "GET",
        providesTags: ["Setting"],
      }),
    }),
    updateFaq: builder.mutation({  // ✅ FIXED: Use mutation instead of query
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),
    deleteFaq: builder.mutation({  // ✅ FIXED: Use mutation instead of query
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Setting"],
    }),




  }),
});

export const {
  useGetAllSettingsQuery,
  useUpdatePrivacyPolicyAllMutation, // ✅ FIXED: Mutation hook 
  useGetPrivacyPolicyQuery,

  useGatTermsAndConditionsQuery,
  useUpdateTramsAndConditionsAllMutation,

  useGetAboutUsQuery,

  useAddFaqMainMutation,
  useDeleteFaqMutation,

  useUpdateAboutUsMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,

  useGetAllNotificationQuery,
  useSendUserNotificationMutation,

  useGetAllFaqQuery,
  useUpdateFaqMutation

} = settingApi;
