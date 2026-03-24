import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import folderReducer from "./folder/folderSlice";

// Cấu hình persist
const rootPersistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user", "folders"],
};

const reducers = combineReducers({
  user: userReducer,
  folders: folderReducer,
});

//Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
