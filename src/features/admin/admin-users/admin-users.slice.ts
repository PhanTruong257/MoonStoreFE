import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ADMIN_FILTER_ALL } from "@/const/admin.const";
import type { AdminUserRoleFilter as RoleFilter } from "@/const/admin.const";
import type { AdminUser } from "@/services/admin-service";

export type { RoleFilter };

export type AdminUsersState = {
  users: AdminUser[];
  roleFilter: RoleFilter;
  isLoading: boolean;
  isActing: boolean;
  actingId: number | null;
  error: string | null;
};

const initialState: AdminUsersState = {
  users: [],
  roleFilter: ADMIN_FILTER_ALL,
  isLoading: false,
  isActing: false,
  actingId: null,
  error: null,
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
    actionSucceeded: (state) => {
      state.isActing = false;
      state.actingId = null;
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
