import {Dispatch} from "redux";
import {ResponseType} from "common/api/tasks-api";
import {appActions} from "app/appReducer";
import axios, {AxiosError} from "axios";
import {ErrorType} from "features/Task/tasksReducer";

export const handleServerAppError = <T = {}>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(appActions.setError({error: data.messages[0]}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    } else {
        dispatch(appActions.setError({error: 'Some Error'}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    }
}

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