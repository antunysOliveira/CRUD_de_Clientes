import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
const Service = (isAuth: boolean = false): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API,
    responseType: "json",
    timeout: 10000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });

  if (isAuth) {
    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  return client;
};

export default Service;