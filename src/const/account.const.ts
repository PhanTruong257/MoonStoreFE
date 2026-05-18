import { UI_TEXT } from "./ui-text";

const t = UI_TEXT.account;

export const ACCOUNT_TEXT = {
  breadcrumbPrefix: t.breadcrumbPrefix,
  breadcrumbCurrent: t.breadcrumbCurrent,
  welcomePrefix: t.welcomePrefix,
  welcomeName: "",
  profileTitle: t.profileTitle,
  passwordTitle: t.passwordTitle,
  currentPasswordPlaceholder: t.currentPasswordPlaceholder,
  newPasswordPlaceholder: t.newPasswordPlaceholder,
  confirmPasswordPlaceholder: t.confirmPasswordPlaceholder,
  cancelLabel: t.cancelLabel,
  saveLabel: t.saveLabel,
} as const;

export const ACCOUNT_SECTION_IDS = {
  profile: "account-profile-section",
  address: "account-address-section",
} as const;

export type AccountManageItemKey = "profile" | "address" | "payment";

export type AccountManageItem = {
  key: AccountManageItemKey;
  label: string;
  anchorId?: string;
  disabled?: boolean;
};

export const ACCOUNT_MANAGE_ITEMS: readonly AccountManageItem[] = [
  {
    key: "profile",
    label: t.manageItems[0].label,
    anchorId: ACCOUNT_SECTION_IDS.profile,
  },
  {
    key: "address",
    label: t.manageItems[1].label,
    anchorId: ACCOUNT_SECTION_IDS.address,
  },
  {
    key: "payment",
    label: t.manageItems[2].label,
    disabled: true,
  },
];

export const ACCOUNT_MENU = {
  manageTitle: t.manageTitle,
  orderTitle: t.orderTitle,
  orderItems: [t.myOrders],
  wishlistTitle: t.wishlistTitle,
} as const;

export const PROFILE_FIELDS = {
  firstNameLabel: t.firstNameLabel,
  lastNameLabel: t.lastNameLabel,
  emailLabel: t.emailLabel,
  addressLabel: t.addressLabel,
} as const;
