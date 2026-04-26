import { message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/app-store";
import { USER_ROLE } from "@/const/role.const";
import { SELLER_APPLICATION_STATUS } from "@/const/seller-status.const";
import { authActions } from "@/features/auth/auth-slice";
import { setStoredUser } from "@/features/auth/auth-storage";
import {
  createSellerProfile,
  fetchMySellerProfile,
  updateMySellerProfile,
} from "@/services/seller-service";
import type { SellerProfile } from "@/services/seller-service";

export const useSellerApply = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const seller = await fetchMySellerProfile();
        if (!isMounted) {
          return;
        }
        setProfile(seller);
        if (seller) {
          setShopName(seller.shopName);
          setDescription(seller.description ?? "");
        }
      } catch {
        if (!isMounted) {
          return;
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user?.role === USER_ROLE.ADMIN) {
      void navigate("/admin", { replace: true });
      return;
    }
    if (
      profile?.status === SELLER_APPLICATION_STATUS.ACTIVE &&
      user?.role === USER_ROLE.SELLER
    ) {
      void navigate("/seller", { replace: true });
    }
  }, [profile, user, navigate]);

  useEffect(() => {
    if (
      profile?.status === SELLER_APPLICATION_STATUS.ACTIVE &&
      user &&
      user.role !== USER_ROLE.SELLER
    ) {
      const synced = { ...user, role: USER_ROLE.SELLER };
      setStoredUser(synced);
      dispatch(authActions.loginSucceeded(synced));
    }
  }, [profile, user, dispatch]);

  const submit = async () => {
    if (!shopName.trim()) {
      void message.error("Please enter a shop name.");
      return;
    }

    setIsSubmitting(true);
    try {
      let next: SellerProfile | null = null;
      if (
        profile &&
        profile.status !== SELLER_APPLICATION_STATUS.ACTIVE
      ) {
        try {
          next = await updateMySellerProfile({ shopName, description });
        } catch {
          next = null;
        }
      }
      if (!next) {
        next = (await createSellerProfile({ shopName, description })).seller;
      }

      setProfile(next);
      void message.success(
        next?.status === SELLER_APPLICATION_STATUS.REJECTED
          ? "Application updated and resubmitted."
          : "Application submitted. Awaiting admin review.",
      );
    } catch {
      void message.error("Unable to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    shopName,
    description,
    isLoading,
    isSubmitting,
    setShopName,
    setDescription,
    submit,
    isAlreadyActive:
      profile?.status === SELLER_APPLICATION_STATUS.ACTIVE,
  };
};
