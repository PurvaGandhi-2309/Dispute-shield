const API_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    // ⭐ CHANGED: detect file upload
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,

        headers: {
            // ⭐ CHANGED: don't send JSON Content-Type for FormData
            ...(isFormData
                ? {}
                : {
                    "Content-Type": "application/json",
                }),

            ...(token && {
                Authorization: `Bearer ${token}`,
            }),

            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};