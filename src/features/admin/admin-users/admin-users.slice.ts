import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ADMIN_FILTER_ALL } from "@/const/admin.const";
import type { AdminUserRoleFilter as RoleFilter } from "@/const/admin.const";
import type { AdminUser, GrantUserRolePayload } from "@/services/admin-service";

export type { RoleFilter };

export type AdminUsersState = {
  users: AdminUser[];
  roleFilter: RoleFilter;
  isLoading: boolean;
  isActing: boolean;
  actingId: number | null;
  error: string | null;
  grantRoleModal: {
    open: boolean;
    userId: number | null;
  };
};

const initialState: AdminUsersState = {
  users: [],
  roleFilter: ADMIN_FILTER_ALL,
  isLoading: false,
  isActing: false,
  actingId: null,
  error: null,
  grantRoleModal: {
    open: false,
    userId: null,
  },
};

const slice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    requested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    succeeded: (state, action: PayloadAction<AdminUser[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    roleFilterChanged: (state, action: PayloadAction<RoleFilter>) => {
      state.roleFilter = action.payload;
    },
    promoteRequested: (state, action: PayloadAction<number>) => {
      state.isActing = true;
      state.actingId = action.payload;
    },
    disableRequested: (state, action: PayloadAction<number>) => {
      state.isActing = true;
      state.actingId = action.payload;
    },
    enableRequested: (state, action: PayloadAction<number>) => {
      state.isActing = true;
      state.actingId = action.payload;
    },
    grantRoleModalOpened: (state, action: PayloadAction<number>) => {
      state.grantRoleModal = { open: true, userId: action.payload };
    },
    grantRoleModalClosed: (state) => {
      state.grantRoleModal = { open: false, userId: null };
    },
    grantRoleRequested: (
      state,
      _action: PayloadAction<{ userId: number } & GrantUserRolePayload>,
    ) => {
      state.isActing = true;
      state.actingId = _action.payload.userId;
    },
    actionSucceeded: (state) => {
      state.isActing = false;
      state.actingId = null;
      state.grantRoleModal = { open: false, userId: null };
    },
    actionFailed: (state, action: PayloadAction<string>) => {
      state.isActing = false;
      state.actingId = null;
      state.error = action.payload;
    },
  },
});

export const adminUsersReducer = slice.reducer;
export const adminUsersActions = slice.actions;
