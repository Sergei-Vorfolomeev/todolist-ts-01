import {TasksStateType} from "../App";
import {v1} from "uuid";
import {addTodolistACType} from "./todolistsReducer";

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action:GeneralACType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.payload.todolistID]: state[action.payload.todolistID].filter(el => el.id !== action.payload.taskID)}
        }
        case "ADD-TASK": {
            const newTask = {id: v1(), title: action.payload.newTitle, isDone: false}
            return {...state, [action.payload.todolistID]: [newTask, ...state[action.payload.todolistID]]}
        }
        case "CHANGE-CHECK-BOX": {
            return {...state, [action.payload.todolistID]: state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {...el, isDone: action.payload.checkBoxValue} : el)}
        }
        case "CHANGE-TITLE-TASK": {
            return {...state, [action.payload.todolistID]: state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {...el, title: action.payload.newTitle} : el)}
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.newID]: []}
        }
        default: return state
    }
}

type GeneralACType = removeTaskACType | addTaskACType | changeCheckBoxACType | changeTitleTaskACType | addTodolistACType
type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeCheckBoxACType = ReturnType<typeof changeCheckBoxAC>
type changeTitleTaskACType = ReturnType<typeof changeTitleTaskAC>
// type addTasksInTodolistACType = ReturnType<typeof addTasksInTodolistAC>

export const removeTaskAC = (todolistID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistID, taskID
        }
    } as const
}
export const addTaskAC = (todolistID: string, newTitle: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistID, newTitle
        }
    } as const
}
export const changeCheckBoxAC = (todolistID: string, taskID: string, checkBoxValue: boolean) => {
    return {
        type: 'CHANGE-CHECK-BOX',
        payload: {
            todolistID, taskID, checkBoxValue
        }
    } as const
}
export const changeTitleTaskAC = (todolistID: string, taskID: string, newTitle: string) => {
    return {
        type: 'CHANGE-TITLE-TASK',
        payload: {
            todolistID, taskID, newTitle
        }
    } as const
}
// export const addTasksInTodolistAC = (todolistId: string) => {
//     return {
//         type: 'ADD-TODOLIST',
//         payload: {
//             todolistId
//         }
//     } as const
// }