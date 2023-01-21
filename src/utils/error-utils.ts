import {setAppStatusAC, setErrorAC} from "../state/appReducer";
import {Dispatch} from "redux";

export const handleServerAppError = () => {

}

export const handleServerNetworkError = (dispatch: Dispatch, errorMessage: string) => {
    dispatch(setErrorAC(errorMessage))
    dispatch(setAppStatusAC('failed'))
}