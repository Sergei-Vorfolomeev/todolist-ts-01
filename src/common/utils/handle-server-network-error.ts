import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {ErrorType} from "features/Task/tasksReducer";
import {appActions} from "app/appReducer";

export const handleServerNetworkError = (dispatch: Dispatch, e: unknown) => {
    const err = e as Error | AxiosError<ErrorType>
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response?.data.message : err.message
        dispatch(appActions.setError({error}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    } else {
        dispatch(appActions.setError({error: `Native error: ${err.message}`}))
    }
}