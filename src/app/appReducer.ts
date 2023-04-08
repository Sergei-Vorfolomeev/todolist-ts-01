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
// export const appReducer = (state: InitialStateType = initialState, action: AppActionsType) => {
//     switch (action.type) {
//         case "APP/SET-STATUS":
//             return {
//                 ...state,
//                 status: action.payload.status
//             }
//         case "APP/SET-ERROR":
//             return {
//                 ...state,
//                 error: action.payload.error
//             }
//         case "INITIALIZE-APP":
//             return {
//                 ...state,
//                 isInitialized: action.payload.value
//             }
//         default:
//             return state
//     }
// }


// actions
// export const setAppStatusAC = (status: RequestStatusType) => {
//     return {
//         type: 'APP/SET-STATUS',
//         payload: {
//             status
//         }
//     } as const
// }
// export const setErrorAC = (error: null | string) => {
//     return {
//         type: 'APP/SET-ERROR',
//         payload: {
//             error
//         }
//     } as const
// }
// export const initializeAppAC = (value: boolean) => {
//     return {
//         type: 'INITIALIZE-APP',
//         payload: {
//             value
//         }
//     } as const
// }





// // types
// export type AppActionsType = SetAppStatusACType | SetErrorACType | InitializeAppACType
// type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
// type SetErrorACType = ReturnType<typeof setErrorAC>
// type InitializeAppACType = ReturnType<typeof initializeAppAC>