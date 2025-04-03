import API from "./axiosInstance";

interface OrderResponse {
  order: OrderResponse;
  _id: string;
  addressId: {
    _id: string;
    street: string;
    city: string;
    zip: string;
  };
  deliveryTime: string;
  deliveryInstructions?: string;
  menuItems: {
    item: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    restaurant: {
      _id: string;
      name: string;
      cuisineType: string;
    };
  }[];
  totalAmount: number;
  payment: PaymentDetails;
}

interface PaymentDetails {
  method: string;
  transactionId?: string; // Optional, since it may not exist for "Cash on Delivery"
  MUID?: string;
  status: string;
  paymentMethod: string; // Merchant Unique ID (if applicable)
}

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
  // payment: PaymentDetails;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const placeOrder = async (
  orderData: OrderPayload
): Promise<OrderPayload> => {
  try {
    const response = await API.post<OrderPayload>("/orders/add", orderData, {
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

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const response = await API.get<OrderResponse>("/orders/getById", {
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

export const getOrders = async ({
  pageParam = 1,
}: {
  pageParam: number;
}): Promise<OrderResponse[]> => {
  try {
    const response = await API.get<OrderResponse[]>("/orders/get", {
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
}): Promise<OrderResponse[]> => {
  try {
    const response = await API.get<OrderResponse[]>("/orders/getByUserId", {
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
interface UpdateOrderStatusResponse extends OrderResponse {
  status: string;
}

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<UpdateOrderStatusResponse> => {
  try {
    const response = await API.post<UpdateOrderStatusResponse>(
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
