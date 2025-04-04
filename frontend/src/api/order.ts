import API from "./axiosInstance";

interface OrderPayload {
  addressId: string;
  deliveryTime: string;
  deliveryInstructions: string;
  menuItems: {
    item: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  totalAmount: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const placeOrder = async (orderData: OrderPayload) => {
  try {
    const response = await API.post("/orders/add", orderData, {
      withCredentials: true,
    });

    // Return the created order data
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

export const getOrderById = async (orderId: string) => {
  try {
    const response = await API.get("/orders/getById", {
      params: { orderId: orderId },
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch order details. Please try again."
    );
  }
};

export const getOrders = async ({ pageParam = 1 }: { pageParam: number }) => {
  try {
    const response = await API.get("/orders/get", {
      params: { pageParam: pageParam, limit: 5 },
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch orders. Please try again."
    );
  }
};

export const getOrdersByUserId = async ({
  pageParam = 1,
}: {
  pageParam: number;
}) => {
  try {
    const response = await API.get("/orders/getByUserId", {
      params: { pageParam: pageParam, limit: 10 },
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch user orders. Please try again."
    );
  }
};

// Add this to your existing interfaces
// interface UpdateOrderStatusResponse extends Order {
//   status: string;
// }

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await API.post(
      "/orders/updateStatus",
      { orderId, status },
      { withCredentials: true }
    );

    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to update order status. Please try again."
    );
  }
};
