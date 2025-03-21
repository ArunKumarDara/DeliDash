import API from "./axiosInstance";

interface SignupData {
  userName: string;
  phoneNumber: string;
  mPin: string;
}

interface LoginData {
  phoneNumber: string;
  mPin: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const signupUser = async (data: SignupData) => {
  try {
    const response = await API.post("/users/signup", data, {
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
        "Signup failed. Please try again."
    );
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await API.post("/users/login", data, {
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
        "Login failed. Please try again."
    );
  }
};

export const getUser = async () => {
  try {
    const response = await API.get("/users/profile", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message ||
        apiError.message ||
        "Login failed. Please try again."
    );
  }
};
