import {todolistAPI, TodolistResponseType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {ErrorType} from "./tasksReducer";

export type TodolistsDomainType = TodolistResponseType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'

const initialState: TodolistsDomainType[] = [];

export const todolistsReducer = (state: TodolistsDomainType[] = initialState, action: GeneralACType): TodolistsDomainType[] => {

    switch (action.type) {
        case "ADD-TODOLIST":
            const newTodo: TodolistsDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            return [newTodo, ...state]
        case "REMOVE-TODOLIST":
            return state.filter(el => el.id !== action.payload.todolistID)
        case "CHANGE-FILTER":
            return state.map(el =>
                el.id === action.payload.todolistID
                    ? {...el, filter: action.payload.filterValue}
                    : el
            )
        case "SET-TODOLISTS":
            return action.payload.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-TITLE":
            return state.map(el =>
                el.id === action.payload.todolistID
                    ? {...el, title: action.payload.title}
                    : el)
        case "CHANGE-ENTITY-STATUS":
            return state.map(el => el.id === action.payload.todolistID ? {
                ...el,
                entityStatus: action.payload.entityStatus
            } : el)
        default:
            return state
    }
}

// TYPES
type GeneralACType =
    | AddTodolistACType
    | RemoveTodolistACType
    | ChangeFilterACType
    | SetTodolistsACType
    | ChangeTodolistTitleACType
    | ChangeEntityStatusACType
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type ChangeFilterACType = ReturnType<typeof changeFilterAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeEntityStatusACType = ReturnType<typeof changeEntityStatusAC>


// ACTIONS
export const addTodolistAC = (todolist: TodolistResponseType) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolist
        }
    } as const
}
export const removeTodolistAC = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todolistID
        }
    } as const
}
export const changeFilterAC = (todolistID: string, filterValue: FilterType) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            todolistID, filterValue
        }
    } as const
}
export const setTodolistsAC = (todolists: TodolistResponseType[]) => {
    return {
        type: 'SET-TODOLISTS',
        payload: {todolists}
    } as const
}
export const changeTodolistTitleAC = (todolistID: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            title, todolistID
        }
    } as const
}
export const changeEntityStatusAC = (todolistID: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-ENTITY-STATUS',
        payload: {
            todolistID, entityStatus
        }
    } as const
}


// THUNKS
export const setTodolistsTC = () =>
    async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
        try {
        const res = await todolistAPI.getTodolists()
            dispatch(setTodolistsAC(res.data))
            dispatch(dispatch(setAppStatusAC('succeeded')))
        } catch(e) {
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
        dispatch(setAppStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistID, 'loading'))
        try {
            const res = await todolistAPI.deleteTodolist(todolistID)
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistID))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
                dispatch(changeEntityStatusAC(todolistID, 'failed'))
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
                dispatch(changeEntityStatusAC(todolistID, 'failed'))
            }
        }
        // .then(res => {
        //     if (res.data.resultCode === 0) {
        //         dispatch(removeTodolistAC(todolistID))
        //         dispatch(setAppStatusAC('succeeded'))
        //     } else {
        //         handleServerAppError(dispatch, res.data)
        //     }
        // })
        // .catch(e => {
        //     handleServerNetworkError(dispatch, e.message)
        //     dispatch(changeEntityStatusAC(todolistID, 'failed'))
        // })
    }
export const addTodolistTC = (title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await todolistAPI.createTodolist(title)
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
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
        // .then(res => {
        //     if (res.data.resultCode === 0) {
        //         dispatch(addTodolistAC(res.data.data.item))
        //         dispatch(setAppStatusAC('succeeded'))
        //     } else {
        //         handleServerAppError<{item: TodolistResponseType}>(dispatch, res.data)
        //     }
        // })
        // .catch(e => {
        //     handleServerNetworkError(dispatch, e.message)
        // })
    }
export const changeTodolistTitleTC = (todolistID: string, title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await todolistAPI.updateTodolist(todolistID, title)
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistID, title))
                dispatch(setAppStatusAC('succeeded'))
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