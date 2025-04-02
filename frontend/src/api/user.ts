import API from "./axiosInstance";

interface SignupData {
  userName: string;
  phoneNumber: string;
  mPin: string;
  avatar?: File;
}

interface LoginData {
  phoneNumber: string;
  mPin: string;
}

interface UpdateUserData {
  userName: string;
  phoneNumber: string;
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
        "Content-Type": "multipart/form-data",
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

export const updateUser = async (data: UpdateUserData) => {
  try {
    const response = await API.post("/users/update", data, {
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
        "Update failed. Please try again."
    );
  }
};

export const logout = async () => {
  try {
    const response = await API.post(
      "/users/logout",
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
        "Logout failed. Please try again."
    );
  }
};
