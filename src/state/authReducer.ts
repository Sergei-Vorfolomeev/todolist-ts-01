import {Dispatch} from "redux";
import {authAPI, LoginType, UserType} from "../api/auth-api";
import {initializeAppAC, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {ErrorType} from "./tasksReducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState


export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login':
            return {...state, isLoggedIn: action.payload.value}
        default:
            return state
    }
}

// actions
const setIsLoggedInAC = (value: boolean) => {
    return {
        type: 'login',
        payload: {
            value
        }
    } as const
}

// thunks
export const loginTC = (data: LoginType) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.login(data)
            console.log(res.data.resultCode)
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
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
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.me()
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
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
            dispatch(initializeAppAC(true))
        }

    }
export const logoutTC = () =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
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
type ActionsType = SetIsLoggedInACType
type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>