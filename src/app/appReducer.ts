import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false as boolean
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{error: null | string}>) => {
            state.error = action.payload.error
        },
        initializeApp: (state, action: PayloadAction<{value: boolean}>) => {
            state.isInitialized = action.payload.value
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions
