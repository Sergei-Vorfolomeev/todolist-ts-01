import {ChangeTodolistTitleArgType, todolistAPI} from "common/api/todolist-api";
import {appActions, RequestStatusType} from "app/appReducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodolistsAndTasks} from "common/actions/common.actions";
import {TodolistResponseType} from "common/types";

export type TodolistsDomainType = TodolistResponseType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'

const initialState: TodolistsDomainType[] = [];

// THUNKS
export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistResponseType[] }, void>
('todolists/setTodolists', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})
export const removeTodolist = createAppAsyncThunk<{ todolistID: string }, string>
('todolists/removeTodolist', async (todolistID: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.changeEntityStatus({todolistID, entityStatus: 'loading'}))
    try {
        const res = await todolistAPI.deleteTodolist(todolistID)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolistID}
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(appActions.setAppStatus({status: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        dispatch(todolistsActions.changeEntityStatus({todolistID, entityStatus: 'failed'}))
        return rejectWithValue(null)
    }
})
export const addTodolist = createAppAsyncThunk<{ todolist: TodolistResponseType }, string>
('todolists/addTodolist', async (title: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError<{ item: TodolistResponseType }>(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})
export const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleArgType, ChangeTodolistTitleArgType>(
    'todolists/changeTodolistTitle', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        const {todolistID, title} = arg
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.updateTodolist(arg)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return {todolistID, title}
            } else {
                handleServerAppError(dispatch, res.data)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, e)
            return rejectWithValue(null)
        }
    })

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        changeFilter: (state, action: PayloadAction<{ todolistID: string, filterValue: FilterType }>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            if (index !== -1) state[index].filter = action.payload.filterValue
        },
        changeEntityStatus: (state, action: PayloadAction<{ todolistID: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            state.splice(index, 1)
        })
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            const newTodo: TodolistsDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            state.unshift(newTodo)
        })
        builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            if (index !== -1) state[index].title = action.payload.title
        })
        builder.addCase(clearTodolistsAndTasks, () => {
            return []
        })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {removeTodolist, addTodolist, changeTodolistTitle, fetchTodolists}