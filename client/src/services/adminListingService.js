
import api from "./api";

// Fetch all listings with search, filters and pagination
export const getAllAdminListings = async (
  search = "",
  category = "",
  status = "",
  page = 1
) => {
  const response = await api.get("/admin/listings", {
    params: {
      search,
      category,
      status,
      page,
      limit: 10,
    },
  });

  return response.data;
};

// Update listing status through admin moderation
export const updateListingStatusByAdmin = async (
  listingId,
  status
) => {
  const response = await api.patch(
    `/admin/listings/${listingId}/status`,
    { status }
  );

  return response.data;
};

// Delete any listing as an administrator
export const deleteListingByAdmin = async (listingId) => {
  const response = await api.delete(
    `/admin/listings/${listingId}`
  );

  return response.data;
};
