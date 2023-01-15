import {v1} from "uuid";
import {AddTodolistACType, SetTodolistsACType} from "./todolistsReducer";
import {Dispatch} from "redux";
import {TaskPriorities, TaskResponseType, tasksAPI, TaskStatuses} from "../api/tasks-api";
import {TasksStateType} from "../components/TaskWithRedux";

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: GeneralACType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(el => el.id !== action.payload.taskID)
            }
        }
        case "ADD-TASK": {
            const newTask: TaskResponseType = {
                id: v1(),
                title: action.payload.newTitle,
                status: TaskStatuses.New,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Middle,
                startDate: '',
                todolistId: action.payload.todolistID
            }
            return {...state, [newTask.todolistId]: [newTask, ...state[action.payload.todolistID]]}
        }
        case "CHANGE-CHECK-BOX": {
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(el =>
                    el.id === action.payload.taskID
                        ? {...el, status: action.payload.status}
                        : el
                )
            }
        }
        case "CHANGE-TITLE-TASK": {
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? {
                    ...el,
                    title: action.payload.newTitle
                } : el)
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.newID]: []}
        }
        case "SET-TODOLISTS": {
            const copyState: TasksStateType = {...state}
            action.payload.todolists.forEach(el => {
                copyState[el.id] = []
            })
            return copyState
        }
        case "SET-TASKS": {
            return {
                ...state,
                [action.payload.todolistID]: action.payload.tasks
            }
        }
        default:
            return state
    }
}

type GeneralACType = RemoveTaskACType | AddTaskACType | ChangeCheckBoxACType | ChangeTitleTaskACType
    | AddTodolistACType | SetTodolistsACType | SetTasksACType
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type ChangeCheckBoxACType = ReturnType<typeof changeCheckBoxAC>
type ChangeTitleTaskACType = ReturnType<typeof changeTitleTaskAC>
type SetTasksACType = ReturnType<typeof setTasksAC>
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
export const changeCheckBoxAC = (todolistID: string, taskID: string, status: TaskStatuses) => {
    return {
        type: 'CHANGE-CHECK-BOX',
        payload: {
            todolistID, taskID, status
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

export const setTasksAC = (tasks: TaskResponseType[], todolistID: string) => {
    return {
        type: 'SET-TASKS',
        payload: {
            todolistID, tasks
        }
    } as const
}

export const setTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    tasksAPI.getTasks(todolistID)
        .then(res => dispatch(setTasksAC(res.items, todolistID)))
}