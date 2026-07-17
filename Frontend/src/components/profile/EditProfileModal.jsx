import { useState } from "react";
import {
  updateProfile,
  uploadProfilePhoto,
} from "../../services/authService";

function EditProfileModal({ user, onClose, fetchUser }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    skills: user.skills?.join(", ") || "",
    githubUsername: user.githubUsername || "",
    linkedin: user.linkedin || "",
    portfolio: user.portfolio || "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setImageUploading(true);

      await uploadProfilePhoto(file);

      await fetchUser();
    } catch (err) {
      console.log(err);
      alert("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfile({
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      await fetchUser();

      onClose();
    } catch (err) {
      console.log(err);
      alert("Unable to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-10">

          <h2 className="text-2xl font-bold">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[75vh]"
        >

          <div className="p-6 grid lg:grid-cols-3 gap-8">

            {/* Left Side */}

            <div className="flex flex-col items-center">

              <img
                src={
                  user.photoUrl ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow"
              />

              <label className="mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">

                {imageUploading
                  ? "Uploading..."
                  : "Choose New Image"}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />

              </label>

            </div>

            {/* Right Side */}

            <div className="lg:col-span-2 space-y-5">

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

              </div>
                            <textarea
                rows={4}
                name="about"
                placeholder="Tell us something about yourself..."
                value={formData.about}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                name="skills"
                placeholder="React, Node.js, MongoDB, Java..."
                value={formData.skills}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                name="githubUsername"
                placeholder="GitHub Username"
                value={formData.githubUsername}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="url"
                name="portfolio"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

          </div>

          {/* Footer */}

          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProfileModal;