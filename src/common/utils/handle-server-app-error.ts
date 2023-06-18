import {Dispatch} from "redux";
import {ResponseType} from "common/types/common.types";
import {appActions} from "app/appReducer";

export const handleServerAppError = <T = {}>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(appActions.setError({error: data.messages[0]}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    } else {
        dispatch(appActions.setError({error: 'Some Error'}))
        dispatch(appActions.setAppStatus({status: 'failed'}))
    }
}