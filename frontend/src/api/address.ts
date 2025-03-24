import API from "./axiosInstance";

interface AddressData {
  phoneNumber: string;
  address: string;
  isDefault: boolean;
  type: "Home" | "Work" | "Other";
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Fetch all addresses
export const fetchAddresses = async (pageParam = 1) => {
  try {
    const response = await API.get("/address/get", {
      params: { page: pageParam, limit: 4 },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch addresses. Please try again."
    );
  }
};

// Add a new address
export const addAddress = async (data: AddressData) => {
  try {
    const response = await API.post("/address/add", data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to add address. Please try again."
    );
  }
};

// Update an existing address
export const updateAddress = async (id: string, data: AddressData) => {
  try {
    const response = await API.put(`/users/addresses/update/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to update address. Please try again."
    );
  }
};

// Delete an address
export const deleteAddress = async (id: string) => {
  try {
    const response = await API.delete(`/users/addresses/delete/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to delete address. Please try again."
    );
  }
};
