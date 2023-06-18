import {authAPI, LoginType, UserType} from "common/api/auth-api";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "app/appReducer";
import {clearTodolistsAndTasks} from "common/actions/common.actions";

const initialState = {
    isLoggedIn: false
}

// THUNKS
export const login = createAppAsyncThunk<{ value: boolean }, LoginType>
('auth/login', async (data: LoginType, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {value: true}
        } else {
            handleServerAppError<{ userId: number }>(dispatch, res.data)
            return rejectWithValue(res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})
export const logout = createAppAsyncThunk<{ value: boolean }, void>
('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearTodolistsAndTasks())
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {value: false}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})
export const me = createAppAsyncThunk<{ value: boolean }, void>
('auth/me', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {value: true}
        } else {
            // handleServerAppError<UserType>(dispatch, res.data)
            dispatch(appActions.setAppStatus({status: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.initializeApp({value: true}))
    }
})

// SLICE
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
        builder.addCase(me.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {login, logout, me}