import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie"; // 👈 token read from cookies

import {
  Base_Url,
  Sign_Up,
  Update_Profile,
  Verify_Sign_Up,
  Get_Profile,
  Sign_In,
  Get_Users,
  Get_Message,
  Message_Send,
} from "@/app/config/configUrl";

// 🔹 Local state
const initialState = {
  isLoggedIn: false,
  user: null, // default should be null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      Cookies.remove("token"); // optional: remove token on logout
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// 🔹 RTK Query API
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Base_Url,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token"); // 👈 get token from cookies
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: ({ userData }) => ({
        url: `${Sign_Up}`,
        method: "POST",
        body: userData,
      }),
    }),

    verifySignUp: builder.mutation({
      query: ({ userData }) => ({
        url: `${Verify_Sign_Up}`,
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: ({ userData }) => ({
        url: `${Sign_In}`,
        method: "POST",
        body: userData,
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: `${Get_Profile}`,
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ userData }) => ({
        url: `${Update_Profile}`,
        method: "PUT",
        body: userData,
      }),
    }),

    getUser: builder.query({
      query: () => ({
        url: `${Get_Users}`, // same as getProfile
        method: "GET",
      }),
    }),
    getMessage: builder.query({
      query: ({ id }) => ({
        url: `${Get_Message}/${id}`, // same as getProfile
        method: "GET",
      }),
    }),

    sendMessage: builder.mutation({
      query: ({ receiverId, userData }) => ({
        url: `${Message_Send}?receiverId=${receiverId}`,
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useSignUpMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useVerifySignUpMutation,
  useGetUserQuery,
  useGetMessageQuery,
  useSendMessageMutation
} = authApi;
