import {Dispatch} from "redux";
import {authAPI, LoginType} from "../api/auth-api";
import {setAppStatusAC} from "./appReducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState


export const authReducer = (state: InitialStateType, action: ActionsType) => {
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
            }
        } catch (e) {

        }
    }

// types
type ActionsType = SetIsLoggedInACType
type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>