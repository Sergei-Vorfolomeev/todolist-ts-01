import {FilterType, TodolistsType} from "../App";

const initialState: TodolistsType[] = [];

export const todolistsReducer = (state: TodolistsType[] = initialState, action: GeneralACType): TodolistsType[] => {

    switch (action.type) {
        case "ADD-TODOLIST": {
            console.log(action.payload)
            return [...state,  {id: action.payload.todolistId, title: action.payload.newTitle, filter: 'all'}]
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
export type addTodolistACType = ReturnType<typeof addTodolistAC>
type removeTodolistACType = ReturnType<typeof removeTodolistAC>
type changeFilterACType = ReturnType<typeof changeFilterAC>

export const addTodolistAC = (newTitle: string, todolistId: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTitle, todolistId
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
