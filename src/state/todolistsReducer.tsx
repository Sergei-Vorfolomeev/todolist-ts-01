import {todolistAPI, TodolistResponseType} from "../api/todolist-api";
import {Dispatch} from "redux";

export type TodolistsDomainType = TodolistResponseType & {
    filter: FilterType
}
export type FilterType = 'all' | 'active' | 'completed'

const initialState: TodolistsDomainType[] = [];

export const todolistsReducer = (state: TodolistsDomainType[] = initialState, action: GeneralACType): TodolistsDomainType[] => {

    switch (action.type) {
        case "ADD-TODOLIST": {
            const newTodo: TodolistsDomainType = {...action.payload.todolist, filter: 'all'}
            return [newTodo, ...state]
        }
        case "REMOVE-TODOLIST": {
            return state.filter(el => el.id !== action.payload.todolistID)
        }
        case "CHANGE-FILTER": {
            return state.map(el =>
                el.id === action.payload.todolistID
                    ? {...el, filter: action.payload.filterValue}
                    : el
            )
        }
        case "SET-TODOLISTS": {
            return action.payload.todolists.map(el => ({...el, filter: 'all'}))
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(el =>
                el.id === action.payload.todolistID
                ? {...el, title: action.payload.title}
                : el)
        }
        default:
            return state
    }
}
type GeneralACType = AddTodolistACType
    | RemoveTodolistACType
    | ChangeFilterACType
    | SetTodolistsACType
    | ChangeTodolistTitleACType
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type ChangeFilterACType = ReturnType<typeof changeFilterAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>

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



export const setTodolistsTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res))
        })
}
export const removeTodolistTC = (todolistID: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todolistID)
        .then(res => dispatch(removeTodolistAC(todolistID)))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
        .then(res => dispatch(addTodolistAC(res.data.item)))
}
export const changeTodolistTitleTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.updateTodolist(todolistID, title)
        .then(res => dispatch(changeTodolistTitleAC(todolistID, title)))
}
