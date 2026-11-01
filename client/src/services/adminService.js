
import api from "./api";

// Fetch users with search and pagination
export const getAllUsers = async (search = "", page = 1) => {
  const response = await api.get("/admin/users", {
    params: {
      search,
      page,
      limit: 10,
    },
  });

  return response.data;
};

// Block or unblock a user
export const updateUserBlockStatus = async (userId, isBlocked) => {
  const response = await api.patch(
    `/admin/users/${userId}/block`,
    { isBlocked }
  );

  return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);

  return response.data;
};
