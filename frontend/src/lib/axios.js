import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://bondedhub-backend.onrender.com/api/v1/",
    withCredentials: true
})

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 // Call your refresh token endpoint
//                 await axiosInstance.post('/auth/refresh-token');
//                 return axiosInstance(originalRequest);
//             } catch (refreshError) {
//                 // Refresh failed – redirect to login
//                 window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );