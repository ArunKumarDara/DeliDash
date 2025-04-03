import API from "./axiosInstance";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface Order {
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
}

interface PaymentResponse {
  paymentUrl?: string;
  orderId?: Order;
}

interface PaymentPayload {
  amount: number;
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
  MUID: string;
  transactionId: string;
  paymentMethod: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  status: string;
  payment: {
    orderId: string;
    phonepeTransactionId: string;
    amount: number;
    status: string;
  };
}

/**
 * Initiates PhonePe payment
 * @param amount Payment amount in INR
 * @param orderId Associated order ID
 * @param userId User ID making the payment
 */
export const initiatePhonePePayment = async (
  paymentData: PaymentPayload
): Promise<PaymentResponse> => {
  try {
    if (paymentData.paymentMethod === "Cash on Delivery") {
      const response = await API.post(
        "/payment/cod",
        {
          orderId: paymentData.transactionId,
          ...paymentData,
        },
        { withCredentials: true }
      );
      return response.data;
    } else if (paymentData.paymentMethod === "PhonePe UPI") {
      const response = await API.post<{ paymentUrl: string }>(
        "/payment/upi",
        paymentData,
        { withCredentials: true }
      );
      return response.data;
    }
    throw new Error("Unsupported payment method");
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to initiate payment. Please try again."
    );
  }
};

export const verifyPhonePePayment = async (
  orderId: string
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await API.get<VerifyPaymentResponse>(
      `/payment/status/${orderId}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to verify payment status. Please try again."
    );
  }
};

/**
 * Handles cash on delivery payment
 * @param orderId Order ID for COD
 */
export const handleCashOnDelivery = async (
  orderId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await API.post(
      "/payment/cod",
      { orderId },
      { withCredentials: true }
    );

    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to process COD order. Please try again."
    );
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: "pending" | "paid"
) => {
  try {
    const response = await API.post(
      "/payment/status",
      { paymentId, status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Failed to update the status. Please try again."
    );
  }
};
