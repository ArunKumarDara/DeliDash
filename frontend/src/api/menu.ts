import API from "./axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getMenuItems = async ({
  pageParam = 1,
  restaurantId,
  search,
  category,
}: {
  pageParam: number;
  restaurantId: string;
  search: string;
  category: string;
}) => {
  try {
    const response = await API.get("/menu/get", {
      params: {
        page: pageParam,
        limit: 10,
        restaurantId,
        search,
        category,
      },
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
