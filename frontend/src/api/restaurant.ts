import API from "./axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getRestaurants = async ({
  pageParam = 1,
  searchTerm = "",
  cuisines = [],
  ratings = [],
  priceRange = [0, 1000],
}: {
  pageParam: number;
  searchTerm: string;
  cuisines: string[];
  ratings: number[];
  priceRange: number[];
}) => {
  try {
    const response = await API.get("/restaurants/get", {
      params: {
        page: pageParam,
        limit: 6,
        search: searchTerm,
        cuisines: cuisines.join(","),
        ratings: ratings.join(","),
        priceMin: priceRange[0],
        priceMax: priceRange[1],
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

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const response = await API.get(`/restaurants/getById`, {
      params: { id: restaurantId },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch restaurant details. Please try again."
    );
  }
};
