import {AddTodolistACType, SetTodolistsACType} from "./todolistsReducer";
import {Dispatch} from "redux";
import {TaskModelAPIType, TaskPriorities, TaskResponseType, tasksAPI, TaskStatuses} from "../api/tasks-api";
import {TasksStateType} from "../components/TaskWithRedux";
import {AppRootStateType} from "./store";
import {setAppStatusAC, setErrorAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";

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
            const newTask: TaskResponseType = action.payload.task
            return {...state, [action.payload.todolistID]: [newTask, ...state[action.payload.todolistID]]}
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(el =>
                    el.id === action.payload.taskID
                        ? {...el, ...action.payload.apiModel}
                        : el
                )
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todolist.id]: []}
        }
        case "SET-TODOLISTS": {
            const copyState: TasksStateType = {...state}
            action.payload.todolists.forEach(el => copyState[el.id] = [])
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


export const removeTaskAC = (todolistID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistID, taskID
        }
    } as const
}
export const addTaskAC = (todolistID: string, task: TaskResponseType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistID, task
        }
    } as const
}
export const updateTaskAC = (todolistID: string, taskID: string, apiModel: TaskModelAPIType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistID, taskID, apiModel
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


// THUNKS

export const setTasksTC = (todolistID: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await tasksAPI.getTasks(todolistID)
            dispatch(setTasksAC(res.data.items, todolistID))
            dispatch(setAppStatusAC('succeeded'))
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
            } else {
                handleServerNetworkError(dispatch, 'Some Error')
            }
        }
        // .then(res => {
            //         dispatch(setTasksAC(res.data.items, todolistID))
            //         dispatch(setAppStatusAC('succeeded'))
            //     }
            // )
            // .catch(e => {
            //     handleServerNetworkError(dispatch, e.message)
            // })
    }

export const removeTaskTC = (todolistID: string, taskID: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await tasksAPI.deleteTask(todolistID, taskID)
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todolistID, taskID))
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
        // .then(res => {
        //     if (res.data.resultCode === 0) {
        //         dispatch(removeTaskAC(todolistID, taskID))
        //         dispatch(setAppStatusAC('succeeded'))
        //     } else {
        //         handleServerAppError(dispatch, res.data)
        //     }
        // })
        // .catch(e => {
        //     handleServerNetworkError(dispatch, e.message)
        // })
    }

export const addTaskTC = (todolistID: string, title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await tasksAPI.addTask(todolistID, title)
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(todolistID, res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TaskResponseType }>(dispatch, res.data)
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
            //         dispatch(addTaskAC(todolistID, res.data.data.item))
            //         dispatch(setAppStatusAC('succeeded'))
            //     } else {
            //         handleServerAppError<{ item: TaskResponseType }>(dispatch, res.data)
            //     }
            // })
            // .catch((e: AxiosError<ErrorType>) => {
            //     const error = e.response?.data ? e.response?.data.message : e.message
            //     handleServerNetworkError(dispatch, error)
            // })
    }


export const updateTaskTC = (todolistID: string, taskID: string, domainModel: TaskModelDomainType) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        const task = getState().tasks[todolistID].find(el => el.id === taskID)
        if (!task) {
            console.warn('Task not found in the state!')
            return;
        }
        const apiModel: TaskModelAPIType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel,
        }
        try {
            const res = await tasksAPI.updateTask(todolistID, taskID, apiModel)
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC(todolistID, taskID, apiModel))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TaskResponseType }>(dispatch, res.data)
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
        //         dispatch(updateTaskAC(todolistID, taskID, apiModel))
        //         dispatch(setAppStatusAC('succeeded'))
        //     } else {
        //         handleServerAppError<{ item: TaskResponseType }>(dispatch, res.data)
        //     }
        // })
        // .catch(e => {
        //     handleServerNetworkError(dispatch, e.message)
        // })
    }


// TYPES

type GeneralACType = RemoveTaskACType
    | AddTaskACType
    | updateTaskACType
    | AddTodolistACType
    | SetTodolistsACType
    | SetTasksACType
// | AppActionsType
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type updateTaskACType = ReturnType<typeof updateTaskAC>
type SetTasksACType = ReturnType<typeof setTasksAC>
// type addTasksInTodolistACType = ReturnType<typeof addTasksInTodolistAC>


export type TaskModelDomainType = {
    title?: string
    description?: string,
    status?: TaskStatuses,
    priority?: TaskPriorities,
    startDate?: string,
    deadline?: string,
}

type ErrorType = {
    message: string
}