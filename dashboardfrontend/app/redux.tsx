import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector, Provider } from "react-redux";
import globalReducer from "@/app/state";
import authReducer from "@/app/state/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Redux persistence setup (Noop storage for SSR support)
const createNoopStorage = () => {
    return {
        getItem(_key: string): Promise<null> {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string): Promise<string> { // Explicitly type 'value' as string
            return Promise.resolve(value);
        },
        removeItem(_key: string): Promise<void> {
            return Promise.resolve();
        },
    };
};


const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["global", "auth"],
};

const rootReducer = combineReducers({
    global: globalReducer,
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        storeRef.current = makeStore();
        setupListeners(storeRef.current.dispatch);
    }
    const persistor = persistStore(storeRef.current);

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
