import {setAppStatusAC, setErrorAC} from "../state/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/tasks-api";

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
        dispatch(setAppStatusAC('failed'))
    } else {
        dispatch(setErrorAC('Some Error'))
        dispatch(setAppStatusAC('failed'))
    }
}

export const handleServerNetworkError = (dispatch: Dispatch, errorMessage: string) => {
    dispatch(setErrorAC(errorMessage))
    dispatch(setAppStatusAC('failed'))
}