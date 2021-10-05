import { configureStore } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./features/example";

// Create browser history reducer (connected-react-router)
export const browserHistory = createBrowserHistory();

// Build state
export const store = configureStore({
  reducer: {
    example: counterReducer,
    router: connectRouter(browserHistory),
  },
});

// Create State type for use throughout the app
export type RootState = ReturnType<typeof store.getState>;

// Create type for usage with dispatch
export type AppDispatch = typeof store.dispatch;

// Create typed versions of select and dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
