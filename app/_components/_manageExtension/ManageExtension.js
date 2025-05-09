"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ManageExtension = () => {
  const [search, setSearch] = useState("");
  const [newExtension, setNewExtension] = useState("");
  const [extensions, setExtensions] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectId, setSelectId] = useState("");
  const [editVal, setEditVal] = useState("");
  const [updateBtnShow, setUpdateBtnShow] = useState(false);

  const filteredExtensions = extensions.filter((ext) =>
    ext.name.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch extensions on load
  const fetchExtensions = () => {
    axios
      .get("/api/getExtension")
      .then((res) => setExtensions(res.data.extensions))
      .catch((error) => console.error("Error fetching extensions:", error));
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const handleAddExtension = () => {
    axios
      .post("/api/addExtension", { name: newExtension })
      .then((res) => {
        toast.success(res.data.message);
        setNewExtension("");
        fetchExtensions(); // Refresh list
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to add extension");
      });
  };

  const handleDeleteExtension = async (id) => {
    if (!window.confirm("Are you sure you want to delete this extension?"))
      return;

    try {
      const res = await axios.post("/api/deleteExtension", { id });
      if (res.status === 200) {
        toast.success("Extension deleted successfully");
        setExtensions((prev) => prev.filter((ext) => ext._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting extension");
    }
  };

  const handleStatusToggle = (id, currentStatus) => {
    axios
      .post("/api/updateExtensionStatus", { id, isActive: !currentStatus })
      .then(() => {
        toast.success("Status updated successfully");
        setExtensions((prev) =>
          prev.map((ext) =>
            ext._id === id ? { ...ext, isActive: !currentStatus } : ext
          )
        );
      })
      .catch(() => {
        toast.error("Error updating status");
      });
  };

  const handleEditShow = (id, val) => {
    setSelectId(id);
    setEdit(true);
    setEditVal(val);
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setUpdateBtnShow(false);
    setEditVal("");
  };

  const editOnChange = (val) => {
    setEditVal(val);
    const trimmed = val.trim();
    const isValidExtension = /^\.[a-z]{2,10}$/i.test(trimmed);

    if (trimmed.length === 0) {
      setUpdateBtnShow(false);
      return;
    }

    if (!isValidExtension) {
      toast.error("Invalid extension format. Use format like .com or .xyz");
      setUpdateBtnShow(false);
      return;
    }

    setUpdateBtnShow(true);
  };

  const handleEditSubmit = (id) => {
    axios
      .post("/api/editExtension", { id, newName: editVal })
      .then(() => {
        toast.success("Extension updated successfully");
        setExtensions((prev) =>
          prev.map((ext) =>
            ext._id === id ? { ...ext, name: editVal } : ext
          )
        );
        setEditVal("");
        setEdit(false);
        setUpdateBtnShow(false);
      })
      .catch(() => {
        toast.error("Error updating extension");
      });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-center font-bold text-[20px] mb-6">
        Manage Domain Extensions
      </h1>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search extensions..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="New extension (e.g., .xyz)"
          className="flex-1 border border-gray-300 rounded px-4 py-2"
          value={newExtension}
          onChange={(e) => setNewExtension(e.target.value)}
        />
        <button
          onClick={handleAddExtension}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded"
        >
          + Add Extension
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredExtensions.map((ext) => (
          <div
            key={ext._id || ext.name}
            className="flex justify-between items-center border border-gray-300 rounded p-3"
          >
            <span className="font-medium">{ext.name}</span>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 cursor-pointer rounded text-white text-sm ${
                  ext.isActive ? "bg-green-600" : "bg-gray-500"
                }`}
                onClick={() => handleStatusToggle(ext._id, ext.isActive)}
              >
                {ext.isActive ? "Active" : "Inactive"}
              </button>

              {edit && selectId === ext._id ? (
                <div className="flex gap-x-1">
                  <input
                    type="text"
                    onChange={(e) => editOnChange(e.target.value)}
                    value={editVal}
                    placeholder="Edit extension (e.g., .xyz)"
                    className="flex-1 border border-gray-300 rounded px-4 py-2"
                  />
                  {updateBtnShow && (
                    <button
                      onClick={() => handleEditSubmit(ext._id)}
                      className="px-3 py-1 rounded cursor-pointer bg-green-600 text-white text-sm"
                    >
                      Update
                    </button>
                  )}
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 rounded cursor-pointer bg-red-400 text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditShow(ext._id, ext.name)}
                  className="px-3 py-1 rounded cursor-pointer bg-yellow-500 text-white text-sm"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDeleteExtension(ext._id)}
                className="px-3 py-1 rounded bg-red-600 cursor-pointer text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredExtensions.length === 0 && (
          <p className="text-center text-gray-500">No extensions found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageExtension;
