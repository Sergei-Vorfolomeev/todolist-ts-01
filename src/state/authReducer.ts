import {Dispatch} from "redux";
import {authAPI, LoginType, UserType} from "api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios from "axios";
import {ErrorType} from "./tasksReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "state/appReducer";
import {clearTodolistsAndTasks} from "common/actions/common.actions";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{value: boolean}>) => {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login':
//             return {...state, isLoggedIn: action.payload.value}
//         default:
//             return state
//     }
// }

// actions
// const setIsLoggedInAC = (value: boolean) => {
//     return {
//         type: 'login',
//         payload: {
//             value
//         }
//     } as const
// }

// thunks
export const loginTC = (data: LoginType) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await authAPI.login(data)
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({value: true}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else  {
                handleServerAppError<{userId: number}>(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                debugger
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
    }
export const meTC = () =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await authAPI.me()
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({value: true}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else  {
                handleServerAppError<UserType>(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
            }
        } finally {
            dispatch(appActions.initializeApp({value: true}))
        }

    }
export const logoutTC = () =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({value: false}))
                dispatch(clearTodolistsAndTasks())
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else  {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
    }

// types
//type ActionsType = SetIsLoggedInACType
//type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>