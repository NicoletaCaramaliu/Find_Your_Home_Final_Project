import React, { useState } from "react";
import { LoggedUser } from "../../types/User";
import api from "../../api";
import { parseError } from "../../utils/parseError";

interface Props {
  user: LoggedUser;
  refreshUser: () => void;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserProfileCard: React.FC<Props> = ({ user, refreshUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editProfilePicture, setEditProfilePicture] = useState(user.profilePicture || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    try {
      let imageUrl = editProfilePicture;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await api.put("/User/updateProfilePicture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data;
      }

      await api.put("/User/updateMyInfo", {
        username: editUsername,
        profilePicture: imageUrl,
      });

      setIsEditing(false);
      refreshUser();
    } catch (error) {
      setDeleteMessage(parseError(error));
    }
  };

  const handleChangePassword = async () => {
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordChangeError("Completează toate câmpurile.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Parolele nu coincid.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setPasswordChangeError("Parola nouă nu respectă cerințele de securitate.");
      return;
    }

    try {
      const response = await api.put("/User/changePassword", { oldPassword, newPassword });
      const message = response.data?.message;
      setPasswordChangeSuccess(parseError({ response: { data: { errorCode: message } } }));
      setShowPasswordForm(false);
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      refreshUser();
    } catch (error: any) {
      setPasswordChangeError(parseError(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/User/deleteMe");
      setDeleteMessage(parseError({ response: { data: { errorCode: 'USER_DELETED_SUCCESSFULLY' } } }));
      setTimeout(() => window.location.href = "/login", 2000);  
    } catch (error: any) {
      setDeleteMessage(parseError(error));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow mb-6">
      {!isEditing ? (
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-4 items-center">
            <img
              src={user.profilePicture || "/images/defaultProfPicture.avif"}
              alt="Profil"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Înregistrat din: {new Date(user.createdAt).toLocaleDateString("ro-RO")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Editează</button>
            <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Șterge contul</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="p-2 border rounded" placeholder="Username" />
          <div>
            <label className="block text-sm mb-1">Poză de profil:</label>
            <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setSelectedFile(file); setEditProfilePicture(URL.createObjectURL(file)); }}} className="p-2 border rounded w-full" />
            {editProfilePicture && <img src={editProfilePicture} alt="Preview" className="w-24 h-24 mt-2 object-cover rounded border" />}
          </div>
          <span onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-sm text-blue-600 hover:underline cursor-pointer">{showPasswordForm ? "Anulează schimbarea parolei" : "Schimbă parola"}</span>
          {showPasswordForm && (
            <div className="border rounded p-4 bg-gray-50 dark:bg-gray-700 flex flex-col gap-3">
              <input type="password" placeholder="Parola veche" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="p-2 border rounded" />
              <input type="password" placeholder="Parolă nouă" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 border rounded" />
              <input type="password" placeholder="Confirmă noua parolă" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="p-2 border rounded" />
              <button onClick={handleChangePassword} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvează noua parolă</button>
              {passwordChangeError && <p className="text-red-600">{passwordChangeError}</p>}
              {passwordChangeSuccess && <p className="text-green-600">{passwordChangeSuccess}</p>}
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvează</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Anulează</button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Ești sigur că vrei să ștergi contul?</p>
          <p className="text-sm">Această acțiune este ireversibilă.</p>
          <div className="flex gap-4 mt-3">
            <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Da, șterge</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Anulează</button>
          </div>
        </div>
      )}
      
      {deleteMessage && <p className={`mt-4 ${deleteMessage.includes('șters') ? 'text-green-600' : 'text-red-600'}`}>{deleteMessage}</p>}
    </div>
  );
};

export default UserProfileCard;
