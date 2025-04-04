import API from "./axiosInstance";

interface AddressData {
  phoneNumber: string;
  address: string;
  isDefault: boolean;
  type: "Home" | "Office" | "Other";
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface SetDefaultAddressResponse {
  success: boolean;
  message: string;
  address: {
    _id: string;
    isDefault: boolean;
    // other address fields...
  };
}

/**
 * Set an address as default and mark all others as non-default
 * @param addressId The ID of the address to set as default
 * @returns Promise with the updated address
 */

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
    const response = await API.put(
      "/address/updateStatus",
      { data, id },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
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
export const deleteAddress = async (addressId: string) => {
  try {
    console.log(addressId);
    const response = await API.delete("/address/delete", {
      params: { addressId: addressId },
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

// Add this to your API calls file (e.g., addressApi.ts)
export const setDefaultAddress = async (
  addressId: string
): Promise<SetDefaultAddressResponse> => {
  try {
    const response = await API.put(
      `/address/setDefault/${addressId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to set default address. Please try again."
    );
  }
};
