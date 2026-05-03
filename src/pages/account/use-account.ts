import { Form, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/app-store";
import {
  type AccountManageItem,
  type AccountManageItemKey,
} from "@/const/account.const";
import { USER_ROLE } from "@/const/role.const";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { setStoredUser } from "@/features/auth/auth-storage";
import { fetchProfile, updateProfile } from "@/services/auth-service";
import {
  createMyAddress,
  deleteMyAddress,
  fetchMyAddresses,
  setDefaultAddress,
  updateMyAddress,
  type UserAddress,
} from "@/services/users-service";

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const joinName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`.trim();

export type AccountAddressFormValues = {
  addressLine: string;
  city: string;
  district: string;
  isDefault?: boolean;
};

export const useAccount = () => {
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const initialName = splitName(storedUser?.fullName ?? "");

  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [email, setEmail] = useState(storedUser?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [initialProfile, setInitialProfile] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: storedUser?.email ?? "",
  });

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm] = Form.useForm<AccountAddressFormValues>();
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [activeManageKey, setActiveManageKey] =
    useState<AccountManageItemKey>("profile");

  const selectManageItem = (item: AccountManageItem) => {
    if (item.disabled || !item.anchorId) {
      return;
    }
    setActiveManageKey(item.key);
    const target = document.getElementById(item.anchorId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        if (!isMounted) {
          return;
        }
        const parsedName = splitName(profile.user.fullName ?? "");
        setFirstName(parsedName.firstName);
        setLastName(parsedName.lastName);
        setEmail(profile.user.email ?? "");
        setInitialProfile({
          firstName: parsedName.firstName,
          lastName: parsedName.lastName,
          email: profile.user.email ?? "",
        });
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(getAuthErrorMessage(err, "Unable to load profile."));
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadAddresses = async () => {
    setIsAddressLoading(true);
    try {
      const data = await fetchMyAddresses();
      setAddresses(data);
    } catch {
      void message.error("Unable to load addresses.");
    } finally {
      setIsAddressLoading(false);
    }
  };

  const accountUserId = storedUser?.id;

  useEffect(() => {
    if (!accountUserId) {
      return;
    }
    void reloadAddresses();
  }, [accountUserId]);

  const resetForm = () => {
    setFirstName(initialProfile.firstName);
    setLastName(initialProfile.lastName);
    setEmail(initialProfile.email);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  const submitProfile = async () => {
    if (!firstName.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (currentPassword || newPassword || confirmPassword) {
      setError("Password change is not supported yet.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const response = await updateProfile({
        fullName: joinName(firstName, lastName),
        email,
      });
      setStoredUser(response.user);
      setInitialProfile({ firstName, lastName, email });
      setSuccessMessage("Profile updated.");
    } catch (err) {
      setError(getAuthErrorMessage(err, "Unable to save profile."));
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateAddress = () => {
    setEditingAddress(null);
    addressForm.resetFields();
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    addressForm.setFieldsValue({
      addressLine: address.addressLine,
      city: address.city,
      district: address.district,
      isDefault: address.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => setIsAddressModalOpen(false);

  const submitAddress = async (values: AccountAddressFormValues) => {
    setIsAddressSaving(true);
    try {
      if (editingAddress) {
        await updateMyAddress(editingAddress.id, values);
        void message.success("Address updated.");
      } else {
        await createMyAddress(values);
        void message.success("Address added.");
      }
      setIsAddressModalOpen(false);
      await reloadAddresses();
    } catch {
      void message.error("Unable to save address.");
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteMyAddress(id);
      void message.success("Address removed.");
      await reloadAddresses();
    } catch {
      void message.error("Unable to remove address.");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      await reloadAddresses();
    } catch {
      void message.error("Unable to set default.");
    }
  };

  return {
    storedUser,
    isSeller: storedUser?.role === USER_ROLE.SELLER,
    firstName,
    lastName,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    isSaving,
    error,
    successMessage,
    addresses,
    isAddressLoading,
    editingAddress,
    isAddressModalOpen,
    addressForm,
    isAddressSaving,
    setFirstName,
    setLastName,
    setEmail,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    resetForm,
    submitProfile,
    openCreateAddress,
    openEditAddress,
    closeAddressModal,
    submitAddress,
    handleDeleteAddress,
    handleSetDefault,
    activeManageKey,
    selectManageItem,
  };
};
