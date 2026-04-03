import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import folderReducer from "./folder/folderSlice";
import studyReducer from "./study/studySlice";
import challengeReducer from "./challenge/challengeSlice";
import postReducer from "./post/postSlice";
import exploreReducer from "./explore/exploreSlice";
import achievementReducer from "./achievement/achievementSlice";

// Cấu hình persist
const rootPersistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user", "folders"],
};

const reducers = combineReducers({
  user: userReducer,
  folders: folderReducer,
  study: studyReducer,
  challenges: challengeReducer,
  posts: postReducer,
  explore: exploreReducer,
  achievements: achievementReducer,
});

//Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
