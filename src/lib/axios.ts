import axios from "axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
    .replace(/\/+$/, "")
    .replace(/\/api\/v1$/, "");

export const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

import { getSession } from "next-auth/react";

// Adding interceptors (e.g. for attaching auth tokens dynamically if needed)
axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        const token = session?.user?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
