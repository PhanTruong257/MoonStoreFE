export const USER_ROLE = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
  SHIPPER: "shipper",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE_TAG_COLORS: Record<string, string> = {
  [USER_ROLE.USER]: "default",
  [USER_ROLE.SELLER]: "blue",
  [USER_ROLE.ADMIN]: "purple",
  [USER_ROLE.SHIPPER]: "cyan",
};

export const USER_STATUS = {
  ACTIVE: "active",
  DISABLED: "disabled",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_TAG_COLORS: Record<string, string> = {
  [USER_STATUS.ACTIVE]: "green",
  [USER_STATUS.DISABLED]: "red",
};
