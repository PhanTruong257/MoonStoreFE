import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AdminAnalyticsDashboard,
  AnalyticsAskHistoryItem,
  AnalyticsAskResult,
} from "@/services/admin-service";

export type AnalyticsConversationEntry = {
  id: string;
  question: string;
  answer: string;
  data: AnalyticsAskResult[];
  pending: boolean;
};

export type AdminAnalyticsState = {
  dashboard: AdminAnalyticsDashboard | null;
  isLoading: boolean;
  error: string | null;
  conversation: AnalyticsConversationEntry[];
  isAsking: boolean;
};

const initialState: AdminAnalyticsState = {
  dashboard: null,
  isLoading: false,
  error: null,
  conversation: [],
  isAsking: false,
};

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {
    dashboardRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    dashboardSucceeded: (state, action: PayloadAction<AdminAnalyticsDashboard>) => {
      state.isLoading = false;
      state.dashboard = action.payload;
    },
    dashboardFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    askRequested: (
      state,
      action: PayloadAction<{
        id: string;
        question: string;
        history: AnalyticsAskHistoryItem[];
      }>,
    ) => {
      state.isAsking = true;
      state.conversation.push({
        id: action.payload.id,
        question: action.payload.question,
        answer: "",
        data: [],
        pending: true,
      });
    },
    askSucceeded: (
      state,
      action: PayloadAction<{ id: string; answer: string; data: AnalyticsAskResult[] }>,
    ) => {
      state.isAsking = false;
      const entry = state.conversation.find((e) => e.id === action.payload.id);
      if (entry) {
        entry.answer = action.payload.answer;
        entry.data = action.payload.data;
        entry.pending = false;
      }
    },
    askFailed: (state, action: PayloadAction<{ id: string; error: string }>) => {
      state.isAsking = false;
      const entry = state.conversation.find((e) => e.id === action.payload.id);
      if (entry) {
        entry.answer = action.payload.error;
        entry.pending = false;
      }
    },
  },
});

export const adminAnalyticsReducer = adminAnalyticsSlice.reducer;
export const adminAnalyticsActions = adminAnalyticsSlice.actions;
