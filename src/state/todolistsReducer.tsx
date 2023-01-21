import {todolistAPI, TodolistResponseType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC, setErrorAC} from "./appReducer";

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
            return state.map(el => el.id === action.payload.todolistID ? {...el, entityStatus: action.payload.entityStatus} : el)
        default:
            return state
    }
}
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


// thunks

export const setTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res))
            dispatch(dispatch(setAppStatusAC('succeeded')))
        })
        .catch(e => {
            dispatch(setErrorAC(e.message))
            dispatch(setAppStatusAC('failed'))
        })
}
export const removeTodolistTC = (todolistID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeEntityStatusAC(todolistID, 'loading'))
    todolistAPI.deleteTodolist(todolistID)
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(removeTodolistAC(todolistID))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.messages.length) {
                    dispatch(setErrorAC(res.messages[0]))
                    dispatch(setAppStatusAC('failed'))
                } else {
                    dispatch(setErrorAC('Some Error'))
                    dispatch(setAppStatusAC('failed'))
                }
            }
        })
        .catch(e => {
            dispatch(setAppStatusAC('failed'))
            dispatch(changeEntityStatusAC(todolistID, 'failed'))
            dispatch(setErrorAC(e.message))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(addTodolistAC(res.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.messages.length) {
                    dispatch(setErrorAC(res.messages[0]))
                    dispatch(setAppStatusAC('failed'))
                } else {
                    dispatch(setErrorAC('Some Error'))
                    dispatch(setAppStatusAC('failed'))
                }
            }
        })
        .catch(e => {
            dispatch(setAppStatusAC('failed'))
            dispatch(setErrorAC(e.message))
        })
}
export const changeTodolistTitleTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.updateTodolist(todolistID, title)
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistID, title))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.messages.length) {
                    dispatch(setErrorAC(res.messages[0]))
                    dispatch(setAppStatusAC('failed'))
                } else {
                    dispatch(setErrorAC('Some Error'))
                    dispatch(setAppStatusAC('failed'))
                }
            }
        })
        .catch(e => {
            dispatch(setAppStatusAC('failed'))
            dispatch(setErrorAC(e.message))
        })
}
