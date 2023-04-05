import {todolistAPI, TodolistResponseType} from "api/todolist-api";
import {Dispatch} from "redux";
import {appActions, RequestStatusType} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios from "axios";
import {ErrorType} from "./tasksReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TodolistsDomainType = TodolistResponseType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'

const initialState: TodolistsDomainType[] = [];

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistResponseType }>) => {
            const newTodo: TodolistsDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            state.unshift(newTodo)
        },
        removeTodolist: (state, action: PayloadAction<{ todolistID: string }>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            state.splice(index, 1)
        },
        changeFilter: (state, action: PayloadAction<{ todolistID: string, filterValue: FilterType }>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            if (index !== -1) state[index].filter = action.payload.filterValue
        },
        setTodolists: (state, action: PayloadAction<{todolists: TodolistResponseType[]}>) => {
            return action.payload.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistTitle: (state, action: PayloadAction<{todolistID: string, title: string}>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            if (index !== -1) state[index].title = action.payload.title
        },
        changeEntityStatus: (state, action:PayloadAction<{todolistID: string, entityStatus: RequestStatusType}>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistID)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        }
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// THUNKS
export const setTodolistsTC = () =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.getTodolists()
            dispatch(todolistsActions.setTodolists({todolists: res.data}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
    }
export const removeTodolistTC = (todolistID: string) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(todolistsActions.changeEntityStatus({todolistID, entityStatus: 'loading'}))
        try {
            const res = await todolistAPI.deleteTodolist(todolistID)
            if (res.data.resultCode === 0) {
                dispatch(todolistsActions.removeTodolist({todolistID}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
                dispatch(appActions.setAppStatus({status: 'failed'}))

            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
                dispatch(todolistsActions.changeEntityStatus({todolistID, entityStatus: 'failed'}))
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
                dispatch(todolistsActions.changeEntityStatus({todolistID, entityStatus: 'failed'}))
            }
        }
    }
export const addTodolistTC = (title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.createTodolist(title)
            console.log(res)
            if (res.data.resultCode === 0) {
                dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError<{ item: TodolistResponseType }>(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
    }
export const changeTodolistTitleTC = (todolistID: string, title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.updateTodolist(todolistID, title)
            if (res.data.resultCode === 0) {
                dispatch(todolistsActions.changeTodolistTitle({todolistID, title}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
    }