import {Dispatch} from "redux";
import {ResponseType} from "common/types/common.types";
import {appActions} from "app/appReducer";

/**
 * Function that handles errors occurring with server interaction
 * @param dispatch - dispatch from Redux
 * @param data - server response in format ResponseType<D>
 * @param showError - parameter indicating whether to display the error
 */
export const handleServerAppError = <T = {}>(dispatch: Dispatch, data: ResponseType<T>, showError: boolean = true) => {
    if (showError) {
        dispatch(appActions.setError(data.messages.length ? {error: data.messages[0]} : {error: 'Some Error'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}