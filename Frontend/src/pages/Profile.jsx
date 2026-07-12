import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Profile() {
  const token = localStorage.getItem("access");

  const [profile, setProfile] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [exists, setExists] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await API.get("/profiles/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.length > 0) {
        setProfile(res.data[0]);
        setExists(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      if (exists) {
        await API.patch(
          `/profiles/${profile.id}/`,
          {
            phone: profile.phone,
            address: profile.address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Profile Updated");
      } else {
        await API.post(
          "/profiles/",
          {
            phone: profile.phone,
            address: profile.address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Profile Created");
      }

      getProfile();
    } catch (error) {
      console.log(error.response?.data);

      alert("Profile Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-xl mx-auto py-16 px-5">
        <h1 className="text-4xl font-bold mb-8">
          My Profile
        </h1>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="mb-4 text-lg">
            Username:
            <span className="font-bold ml-2">
              {profile.username}
            </span>
          </p>

          <p className="mb-6 text-lg">
            Email:
            <span className="font-bold ml-2">
              {profile.email}
            </span>
          </p>

          <input
            type="text"
            placeholder="Phone Number"
            value={profile.phone || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone: e.target.value,
              })
            }
            className="border p-3 w-full mb-5 rounded"
          />

          <textarea
            placeholder="Address"
            value={profile.address || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                address: e.target.value,
              })
            }
            className="border p-3 w-full mb-5 rounded h-32"
          />

          <button
            onClick={saveProfile}
            className="bg-black text-white px-8 py-3 rounded"
          >
            Save Profile
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;