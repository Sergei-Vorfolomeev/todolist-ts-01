import {FilterType, TodolistsType} from "../App";

const initialState: TodolistsType[] = [];

export const todolistsReducer = (state: TodolistsType[] = initialState, action: GeneralACType): TodolistsType[] => {

    switch (action.type) {
        case "ADD-TODOLIST": {
            return [action.payload.newTodolist, ...state]
        }
        case "REMOVE-TODOLIST": {
            return state.filter(el => el.id !== action.payload.todolistID)
        }
        case "CHANGE-FILTER": {
            return state.map(el => el.id === action.payload.todolistID ? {
                ...el,
                filter: action.payload.filterValue
            } : el)
        }
        default:
            return state
    }
}
type GeneralACType = addTodolistACType | removeTodolistACType | changeFilterACType
type addTodolistACType = ReturnType<typeof addTodolistAC>
type removeTodolistACType = ReturnType<typeof removeTodolistAC>
type changeFilterACType = ReturnType<typeof changeFilterAC>

export const addTodolistAC = (newTitle: string, newTodolist: TodolistsType) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTitle, newTodolist
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
