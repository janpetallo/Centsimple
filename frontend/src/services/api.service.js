let logoutCallback;

function setupApiInterceptor(logoutFunc) {
  logoutCallback = logoutFunc;
}

async function apiClient(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        // If we get a 401, it just means the user isn't logged in
        // In a real app, we would redirect them to the login page
        logoutCallback();
        throw new Error("Not authenticated");
      }

      const errorData = await response.json();

      // This is for application-level errors sent by our backend (e.g., 409 Conflict)
      // Check if the server sent back a specific array of validation errors
      if (errorData.errors && errorData.errors.length > 0) {
        // Throw an error with the message from the *first* validation error
        throw new Error(errorData.errors[0].msg);
      }
      // Otherwise, use the generic message from the server or a fallback
      throw new Error(errorData.message || "API request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API client error:", error);
    throw error;
  }
}

async function registerUser(formData) {
  try {
    const url = "http://localhost:5001/api/auth/register";
    const options = {
      method: "POST",
      credentials: "include", // include cookies including the JWT cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    // This will catch network errors (e.g., user is offline) OR the error we threw above.
    // We re-throw it so the component's catch block can handle it and update the UI.
    console.error("Registration error:", error);
    throw error;
  }
}

async function loginUser(formData) {
  try {
    const url = "http://localhost:5001/api/auth/login";
    const options = {
      method: "POST",
      credentials: "include", // include cookies including the JWT cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function logoutUser() {
  try {
    const url = "http://localhost:5001/api/auth/logout";
    const options = {
      method: "POST",
      credentials: "include", // include cookies including the JWT cookie
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

async function checkAuthStatus() {
  try {
    const response = await fetch("http://localhost:5001/api/auth/profile", {
      method: "GET",
      credentials: "include", // include cookies including the JWT cookie
    });

    // First, check if the response was NOT successful
    if (!response.ok) {
      // If we get a 401, it just means the user isn't logged in.
      // This is not a real "error" we need to throw. We can just return null.
      if (response.status === 401) {
        return null;
      }
      // For other errors (like 500), we can throw an error.
      throw new Error("Authentication check failed");
    }

    // Only parse the JSON when successful
    const data = await response.json(); // user data
    return data;
  } catch (error) {
    console.error("Check auth status error:", error);
    throw error;
  }
}

async function getCategories() {
  try {
    const url = "http://localhost:5001/api/categories";
    const options = {
      method: "GET",
      credentials: "include",
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Get categories error:", error);
    throw error;
  }
}

async function getTransactions(
  page = 1,
  categoryId = null,
  dateRange = null,
  search = null,
  limit = 10
) {
  try {
    const link = new URL("http://localhost:5001/api/transactions");
    link.searchParams.append("page", page);
    link.searchParams.append("limit", limit);

    if (categoryId) {
      link.searchParams.append("categoryId", categoryId);
    }

    if (dateRange) {
      link.searchParams.append("dateRange", dateRange);
    }

    if (search) {
      link.searchParams.append("search", search);
    }

    const url = link.toString();
    const options = {
      method: "GET",
      credentials: "include",
    };

    const data = await apiClient(url, options);
    return data; // this includes pagination metadata
  } catch (error) {
    console.error("Get transactions error:", error);
    throw error;
  }
}

async function createCategory(categoryData) {
  try {
    const url = "http://localhost:5001/api/categories/create";
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Create category error:", error);
    throw error;
  }
}

async function createTransaction(transactionData) {
  try {
    const url = "http://localhost:5001/api/transactions/create";
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    };
    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Create transaction error:", error);
    throw error;
  }
}

async function updateCategory(categoryId, categoryData) {
  try {
    const url = "http://localhost:5001/api/categories/update/" + categoryId;
    const options = {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
}

async function updateTransaction(transactionId, transactionData) {
  try {
    const url =
      "http://localhost:5001/api/transactions/update/" + transactionId;
    const options = {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Update transaction error:", error);
    throw error;
  }
}

async function deleteCategory(categoryId) {
  try {
    const url = "http://localhost:5001/api/categories/delete/" + categoryId;
    const options = {
      method: "DELETE",
      credentials: "include",
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
}

async function deleteTransaction(transactionId) {
  try {
    const url =
      "http://localhost:5001/api/transactions/delete/" + transactionId;
    const options = {
      method: "DELETE",
      credentials: "include",
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error("Delete transaction error:", error);
    throw error;
  }
}

export {
  setupApiInterceptor,
  registerUser,
  loginUser,
  logoutUser,
  checkAuthStatus,
  getCategories,
  getTransactions,
  createCategory,
  createTransaction,
  updateCategory,
  updateTransaction,
  deleteCategory,
  deleteTransaction,
};
