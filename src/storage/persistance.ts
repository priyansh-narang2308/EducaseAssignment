import { Reducer } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, PersistConfig } from 'redux-persist';

export interface PersistPartial {
    _persist: {
        version: number;
        rehydrated: boolean;
    };
}

export const configurePersistence = <S, A extends { type: any }>(
    key: string,
    reducer: Reducer<S, A>,
    whitelist?: (keyof S)[],
    blacklist?: (keyof S)[]
): Reducer<S & PersistPartial, A> => {
    const persistConfig: PersistConfig<S> = {
        key,
        storage: AsyncStorage,
        whitelist: whitelist as string[],
        blacklist: blacklist as string[],
    };

    return persistReducer(persistConfig, reducer);
};
