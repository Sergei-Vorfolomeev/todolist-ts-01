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
            const newTodo: TodolistsDomainType = {
                id: action.payload.newID,
                title: action.payload.newTitle,
                filter: 'all',
                addedDate: '',
                order: 0
            }
            return [...state, newTodo]
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
        default:
            return state
    }
}
type GeneralACType = AddTodolistACType | RemoveTodolistACType | ChangeFilterACType | SetTodolistsACType
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type ChangeFilterACType = ReturnType<typeof changeFilterAC>
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>

export const addTodolistAC = (newTitle: string, newID: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTitle, newID
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
export const setTodolistsTC = () => (dispatch: Dispatch, ) => {
    todolistAPI.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC(res))
        })
}
