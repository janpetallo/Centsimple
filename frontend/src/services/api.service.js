const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        throw new Error('Not authenticated');
      }

      const errorData = await response.json();

      // This is for application-level errors sent by our backend (e.g., 409 Conflict)
      // Check if the server sent back a specific array of validation errors
      if (errorData.errors && errorData.errors.length > 0) {
        // Throw an error with the message from the *first* validation error
        throw new Error(errorData.errors[0].msg);
      }
      // Otherwise, use the generic message from the server or a fallback
      throw new Error(errorData.message || 'API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API client error:', error);
    throw error;
  }
}

async function registerUser(formData) {
  try {
    const url = `${API_BASE_URL}/auth/register`;
    const options = {
      method: 'POST',
      credentials: 'include', // include cookies including the JWT cookie
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    // This will catch network errors (e.g., user is offline) OR the error we threw above.
    // We re-throw it so the component's catch block can handle it and update the UI.
    console.error('Registration error:', error);
    throw error;
  }
}

async function verifyEmail(token) {
  try {
    // Construct URL as a string to avoid 'new URL()' error with relative paths
    const url = `${API_BASE_URL}/auth/verify-email?token=${token}`;
    const options = {
      method: 'GET',
      credentials: 'include',
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Verify email error:', error);
    throw error;
  }
}

async function resendVerificationEmail(email) {
  try {
    const url = `${API_BASE_URL}/auth/resend-verification`;
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Resend verification email error:', error);
    throw error;
  }
}

// This does not use the apiClient above so it correctly displays specific error message
async function loginUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // This correctly throws the specific message from the backend
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

async function logoutUser() {
  try {
    const url = `${API_BASE_URL}/auth/logout`;
    const options = {
      method: 'POST',
      credentials: 'include', // include cookies including the JWT cookie
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

async function checkAuthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include', // include cookies including the JWT cookie
    });

    // First, check if the response was NOT successful
    if (!response.ok) {
      // If we get a 401, it just means the user isn't logged in.
      // This is not a real "error" we need to throw. We can just return null.
      if (response.status === 401) {
        return null;
      }
      // For other errors (like 500), we can throw an error.
      throw new Error('Authentication check failed');
    }

    // Only parse the JSON when successful
    const data = await response.json(); // user data
    return data;
  } catch (error) {
    console.error('Check auth status error:', error);
    throw error;
  }
}

async function getCategories() {
  try {
    const url = `${API_BASE_URL}/categories`;
    const options = {
      method: 'GET',
      credentials: 'include',
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Get categories error:', error);
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
    // Use URLSearchParams to safely build the query string
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    if (dateRange) {
      params.append('dateRange', dateRange);
    }
    if (search) {
      params.append('search', search);
    }

    // Construct the final URL as a string, which is valid for fetch()
    const url = `${API_BASE_URL}/transactions?${params.toString()}`;
    const options = {
      method: 'GET',
      credentials: 'include',
    };

    const data = await apiClient(url, options);
    return data; // this includes pagination metadata
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
}

async function createCategory(categoryData) {
  try {
    const url = `${API_BASE_URL}/categories/create`;
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
}

async function createTransaction(transactionData) {
  try {
    const url = `${API_BASE_URL}/transactions/create`;
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    };
    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
}

async function updateCategory(categoryId, categoryData) {
  try {
    const url = `${API_BASE_URL}/categories/update/${categoryId}`;
    const options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
}

async function updateTransaction(transactionId, transactionData) {
  try {
    const url = `${API_BASE_URL}/transactions/update/${transactionId}`;
    const options = {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Update transaction error:', error);
    throw error;
  }
}

async function deleteCategory(categoryId) {
  try {
    const url = `${API_BASE_URL}/categories/delete/${categoryId}`;
    const options = {
      method: 'DELETE',
      credentials: 'include',
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
}

async function deleteTransaction(transactionId) {
  try {
    const url = `${API_BASE_URL}/transactions/delete/${transactionId}`;
    const options = {
      method: 'DELETE',
      credentials: 'include',
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Delete transaction error:', error);
    throw error;
  }
}

async function getSummaryReport(dateRange) {
  try {
    // Start with the base URL string
    let url = `${API_BASE_URL}/reports/summary`;

    // Safely add the dateRange parameter if it exists
    if (dateRange) {
      const params = new URLSearchParams({ dateRange });
      url += `?${params.toString()}`;
    }

    const options = {
      method: 'GET',
      credentials: 'include',
    };

    const data = await apiClient(url, options);
    return data;
  } catch (error) {
    console.error('Get summary report error:', error);
    throw error;
  }
}

async function toggleCategoryPin(categoryId) {
  try {
    const link = `${API_BASE_URL}/categories/${categoryId}/pin`;
    const options = {
      method: 'PUT',
      credentials: 'include',
    };

    const data = await apiClient(link, options);
    return data;
  } catch (error) {
    console.error('Toggle category pin error:', error);
    throw error;
  }
}

export {
  setupApiInterceptor,
  registerUser,
  verifyEmail,
  resendVerificationEmail,
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
  getSummaryReport,
  toggleCategoryPin,
};
