import { create } from 'zustand'
import axios from '../lib/axios.js'
import toast from 'react-hot-toast'

const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword}) => {
        set({ loading: true })

        if(password !== confirmPassword){
            set({ loading: false })
            toast.error("Passwords do not match")
            return
        }

        try {
            const res = await axios.post("/auth/signup", { name, email, password })
            set({ user: res.data, loading: false })
        } 
        catch (error) {
            set({ loading: false })
            toast.error(error.response?.data?.message || "An error occurred")
        }
    },

    login: async (email, password) => {
        set({ loading: true })

        try {
            const res = await axios.post("/auth/login", { email, password })
            set({ user: res.data, loading: false })    
        } 
        catch (error) {
            set({ loading: false })
            toast.error(error.response?.data?.message || "An error occurred")
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
        } catch (error) {
            console.error(error);
        } finally {
            set({ user: null });
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true })

        try {
            const res = await axios.get("/auth/profile")
            set({ user: res.data, checkingAuth: false})
        } 
        catch {
            set({ checkingAuth: false, user: null })
            // toast.error(error.response?.data?.message || "An error occurred")
        }
    },

    refreshToken: async () => {
        set({ checkingAuth: true });

        try {
            const response = await axios.post("/auth/refresh-token");
            return response.data;
        } finally {
            set({ checkingAuth: false });
        }
    }

}))

export { useUserStore }


// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        // Only refresh if the access token has expired
        if (
            status === 401 &&
            data?.message === "Unauthorized - Access token expired" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = useUserStore.getState().refreshToken();
                }

                await refreshPromise;

                return axios(originalRequest);
            } catch (refreshError) {
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                refreshPromise = null;
            }
        }

        // For all other 401s (not logged in, invalid token, etc.)
        return Promise.reject(error);
    }
);