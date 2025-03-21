import API from "./axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getRestaurants = async ({ pageParam = 1 }) => {
  try {
    const response = await API.get("/restaurants/get", {
      params: { page: pageParam, limit: 6 }, // Fetching 6 restaurants per request
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch restaurants. Please try again."
    );
  }
};
