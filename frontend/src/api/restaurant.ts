import API from "./axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface Restaurant {
  name: string;
  phoneNumber: string;
  address: string;
  cuisineType: string;
}

interface RestaurantResponse {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  cuisineType: string;
  status: string;
  // Add other fields that your API returns
}

export const addRestaurant = async (
  restaurantData: Restaurant
): Promise<RestaurantResponse> => {
  try {
    const response = await API.post("/restaurants/add", restaurantData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to add restaurant. Please try again."
    );
  }
};

export const getRestaurants = async ({
  pageParam = 1,
  searchTerm,
  cuisines,
  ratings,
  priceRange,
  adminDashboard,
}: {
  pageParam: number;
  searchTerm?: string;
  cuisines?: string[];
  ratings?: number[];
  priceRange?: number[];
  adminDashboard?: boolean;
}) => {
  const params: Record<string, any> = {
    page: pageParam,
    limit: 6,
  };

  // Only add filter params if they exist
  if (searchTerm) params.search = searchTerm;
  if (cuisines?.length) params.cuisines = cuisines.join(",");
  if (ratings?.length) params.ratings = ratings.join(",");
  if (priceRange) {
    params.priceMin = priceRange[0];
    params.priceMax = priceRange[1];
  }

  try {
    const response = await API.get("/restaurants/get", {
      params,
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

export const getRestaurantById = async (restaurantId: string) => {
  try {
    const response = await API.get(`/restaurants/getById`, {
      params: { restaurantId: restaurantId },
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

export const deleteRestaurant = async (restaurantId: string): Promise<void> => {
  console.log(restaurantId);
  try {
    await API.delete(`/restaurants/delete`, {
      params: { restaurantId: restaurantId },
      withCredentials: true,
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to delete restaurant. Please try again."
    );
  }
};

export const updateRestaurant = async (
  restaurantId: string,
  updatedData: Partial<Restaurant>
): Promise<RestaurantResponse> => {
  try {
    const response = await API.put(
      `/restaurants/update`,
      { restaurantId, ...updatedData },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to update restaurant. Please try again."
    );
  }
};
