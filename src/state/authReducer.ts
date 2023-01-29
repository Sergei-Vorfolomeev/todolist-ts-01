import {Dispatch} from "redux";
import {authAPI, LoginType} from "../api/auth-api";
import {setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {ErrorType} from "./tasksReducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState


export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/ SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.payload.value}
        default:
            return state
    }
}

// actions
const setIsLoggedInAC = (value: boolean) => {
    return {
        type: 'login/ SET-IS-LOGGED-IN',
        payload: {
            value
        }
    } as const
}

// thunks
export const setIsLoggedInTC = (data: LoginType) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.login(data)
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
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
    }

// types
type ActionsType = SetIsLoggedInACType
type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>