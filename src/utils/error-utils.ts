import {Dispatch} from "redux";
import {ResponseType} from "api/tasks-api";
import {appActions} from "state/appReducer";

export const handleServerAppError = <T = {}>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(appActions.setError({error: data.messages[0]}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    } else {
        dispatch(appActions.setError({error: 'Some Error'}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    }
}

export const handleServerNetworkError = (dispatch: Dispatch, errorMessage: string) => {
    dispatch(appActions.setError({error: errorMessage}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
}