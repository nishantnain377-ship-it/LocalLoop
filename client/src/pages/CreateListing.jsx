
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  ArrowLeft,
  RefreshCw,
  MapPin,
  AlertCircle,
  Save,
} from "lucide-react";

import api from "../services/api";

function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "Sale",
    price: "",
    locality: "",
    city: "",
    pincode: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.city.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (
      formData.type !== "Free" &&
      (!formData.price || Number(formData.price) <= 0)
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      formData.pincode &&
      !/^\d{6}$/.test(formData.pincode)
    ) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    const listingData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      locality: formData.locality.trim(),
      city: formData.city.trim(),
      price:
        formData.type === "Free"
          ? 0
          : Number(formData.price),
    };

    setSaving(true);

    try {
      const response = await api.post("/listings", listingData);

      alert(
        response.data.message || "Listing created successfully!"
      );

      navigate("/my-listings");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create listing. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Go Back
        </button>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-blue-100 p-3.5 text-blue-600">
            <PackagePlus size={27} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create New Listing
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              List your product and connect with people nearby.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Product Information */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Product Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell buyers about your product.
              </p>
            </div>

            <div>
              <label className={labelClass}>Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                placeholder="Example: Samsung Galaxy S24"
                className={inputClass}
                required
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {formData.title.length}/100
              </p>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                maxLength={2000}
                placeholder="Describe your product, its condition and important details..."
                className={`${inputClass} resize-y`}
                required
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {formData.description.length}/2000
              </p>
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Listing Type and Price */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Listing Type and Price
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose how you want to offer your product.
              </p>
            </div>

            <div>
              <label className={labelClass}>Listing Type *</label>

              <div className="grid grid-cols-3 gap-3">
                {["Sale", "Rent", "Free"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((previous) => ({
                        ...previous,
                        type,
                        price:
                          type === "Free"
                            ? "0"
                            : previous.type === "Free"
                              ? ""
                              : previous.price,
                      }))
                    }
                    className={`rounded-xl border py-3 text-sm font-semibold transition ${
                      formData.type === type
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                disabled={formData.type === "Free"}
                placeholder="Enter amount"
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
                required={formData.type !== "Free"}
              />

              {formData.type === "Free" && (
                <p className="mt-2 text-sm text-green-600">
                  This item will be listed for free.
                </p>
              )}
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Location */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Location Details
              </h2>
            </div>

            <div>
              <label className={labelClass}>Locality</label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Example: Khekra"
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="6-digit pincode"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Publishing Listing...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Publish Listing
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Please check your product details before publishing.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;
