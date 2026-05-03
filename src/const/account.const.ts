export const ACCOUNT_TEXT = {
  breadcrumbPrefix: "Home /",
  breadcrumbCurrent: "My Account",
  welcomePrefix: "Welcome!",
  welcomeName: "Md Rimel",
  profileTitle: "Edit Your Profile",
  passwordTitle: "Password Changes",
  currentPasswordPlaceholder: "Current Password",
  newPasswordPlaceholder: "New Password",
  confirmPasswordPlaceholder: "Confirm New Password",
  cancelLabel: "Cancel",
  saveLabel: "Save Changes",
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
    label: "My Profile",
    anchorId: ACCOUNT_SECTION_IDS.profile,
  },
  {
    key: "address",
    label: "Address Book",
    anchorId: ACCOUNT_SECTION_IDS.address,
  },
  {
    key: "payment",
    label: "My Payment Options",
    disabled: true,
  },
];

export const ACCOUNT_MENU = {
  manageTitle: "Manage My Account",
  orderTitle: "My Orders",
  orderItems: ["My Returns", "My Cancellations"],
  wishlistTitle: "My Wishlist",
} as const;

export const PROFILE_FIELDS = {
  firstNameLabel: "First Name",
  lastNameLabel: "Last Name",
  emailLabel: "Email",
  addressLabel: "Address",
} as const;
