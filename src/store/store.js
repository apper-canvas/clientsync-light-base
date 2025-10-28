import { configureStore } from "@reduxjs/toolkit";
import React from "react";

/**
 * Redux store configuration using Redux Toolkit
 * 
 * This store is configured with:
 * - Default middleware (includes thunk, immutability checks, serializability checks)
 * - DevTools integration enabled by default in development
 * 
 * To add reducers in the future, import them and add to the reducer object:
 * import userReducer from './slices/userSlice';
 * 
 * export const store = configureStore({
 *   reducer: {
 *     user: userReducer,
 *     // ... other reducers
 *   },
 * });
 */

export const store = configureStore({
  reducer: {
    // Add your reducers here as the application grows
    // Example: user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
// Ignore these action types for serialization checks if needed
        ignoredActions: [],
      },
    }),
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript support (optional, works in JS too)
export const RootState = store.getState;
export const AppDispatch = store.dispatch;