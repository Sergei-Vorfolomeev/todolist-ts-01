import {Dispatch} from "redux";
import {
    TaskDomainType,
    TaskModelAPIType,
    TaskPriorities,
    TaskResponseType,
    tasksAPI,
    TaskStatuses
} from "api/tasks-api";
import {TasksStateType} from "components/Task/TaskWithRedux";
import {AppRootStateType} from "./store";
import {appActions, RequestStatusType} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "state/todolistsReducer";
import {clearTodolistsAndTasks} from "common/actions/common.actions";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistID: string, taskID: string }>) => {
            const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) state[action.payload.todolistID].splice(index, 1)
        },
        addTask: (state, action: PayloadAction<{ todolistID: string, task: TaskResponseType }>) => {
            const newTask: TaskDomainType = {...action.payload.task, entityTaskStatus: 'idle'}
            state[action.payload.todolistID].unshift(newTask)
        },
        updateTask: (state, action: PayloadAction<{ todolistID: string, taskID: string, apiModel: TaskModelAPIType }>) => {
            const task = state[action.payload.todolistID]
            const index = task.findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) task[index] = {...task[index], ...action.payload.apiModel}
        },
        addTasksInTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
        },
        setTasks: (state, action: PayloadAction<{ tasks: TaskResponseType[], todolistID: string }>) => {
            state[action.payload.todolistID] = action.payload.tasks.map(el => ({...el, entityTaskStatus: 'idle'}))
        },
        changeEntityTaskStatus: (state, action: PayloadAction<{ todolistID: string, taskID: string, entityTaskStatus: RequestStatusType }>) => {
            const task = state[action.payload.todolistID]
            const index = task.findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) task[index].entityTaskStatus = action.payload.entityTaskStatus
        }
    },
    extraReducers: builder => {
        builder.addCase(todolistsActions.addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(todolistsActions.removeTodolist, (state, action) => {
            delete state[action.payload.todolistID]
        })
        builder.addCase(todolistsActions.setTodolists, (state, action) => {
            action.payload.todolists.forEach(el => {
                state[el.id] = []
            })
        })
        builder.addCase(clearTodolistsAndTasks, () => {
            return {}
        })
    }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// export const _tasksReducer = (state = initialState, action: GeneralACType): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {
//                 ...state,
//                 [action.payload.todolistID]: state[action.payload.todolistID].filter(el => el.id !== action.payload.taskID)
//             }
//         case "ADD-TASK":
//             const newTask: TaskDomainType = {...action.payload.task, entityTaskStatus: 'idle'}
//             return {...state, [action.payload.todolistID]: [newTask, ...state[action.payload.todolistID]]}
//         case "UPDATE-TASK":
//             return {
//                 ...state,
//                 [action.payload.todolistID]: state[action.payload.todolistID].map(el =>
//                     el.id === action.payload.taskID
//                         ? {...el, ...action.payload.apiModel}
//                         : el
//                 )
//             }
//         case "ADD-TODOLIST":
//             return {...state, [action.payload.todolist.id]: []}
//         case "SET-TODOLISTS":
//             const copyState: TasksStateType = {...state}
//             action.payload.todolists.forEach(el => copyState[el.id] = [])
//             return copyState
//         case "SET-TASKS":
//             return {
//                 ...state,
//                 [action.payload.todolistID]: action.payload.tasks.map(el => ({...el, entityTaskStatus: 'idle'}))
//             }
//         case "CHANGE-ENTITY-TASK-STATUS":
//             return {
//                 ...state,
//                 [action.payload.todolistID]: state[action.payload.todolistID].map(el =>
//                     el.id === action.payload.taskID
//                         ? {...el, entityTaskStatus: action.payload.entityTaskStatus}
//                         : el)
//             }
//         default:
//             return state
//     }
// }
//
// // ACTIONS
//
// export const removeTaskAC = (todolistID: string, taskID: string) => {
//     return {
//         type: 'REMOVE-TASK',
//         payload: {
//             todolistID, taskID
//         }
//     } as const
// }
// export const addTaskAC = (todolistID: string, task: TaskResponseType) => {
//     return {
//         type: 'ADD-TASK',
//         payload: {
//             todolistID, task
//         }
//     } as const
// }
// export const updateTaskAC = (todolistID: string, taskID: string, apiModel: TaskModelAPIType) => {
//     return {
//         type: 'UPDATE-TASK',
//         payload: {
//             todolistID, taskID, apiModel
//         }
//     } as const
// }
//
// // export const addTasksInTodolistAC = (todolistId: string) => {
// //     return {
// //         type: 'ADD-TODOLIST',
// //         payload: {
// //             todolistId
// //         }
// //     } as const
// // }
//
// export const setTasksAC = (tasks: TaskResponseType[], todolistID: string) => {
//     return {
//         type: 'SET-TASKS',
//         payload: {
//             todolistID, tasks
//         }
//     } as const
// }
//
// export const changeEntityTaskStatusAC = (todolistID: string, taskID: string, entityTaskStatus: RequestStatusType) => {
//     return {
//         type: 'CHANGE-ENTITY-TASK-STATUS',
//         payload: {
//             todolistID, taskID, entityTaskStatus
//         }
//     } as const
// }


// THUNKS

export const setTasksTC = (todolistID: string) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await tasksAPI.getTasks(todolistID)
            dispatch(tasksActions.setTasks({tasks: res.data.items, todolistID}))
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

export const removeTaskTC = (todolistID: string, taskID: string) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'loading'}))
        try {
            const res = await tasksAPI.deleteTask(todolistID, taskID)
            if (res.data.resultCode === 0) {
                dispatch(tasksActions.removeTask({todolistID, taskID}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'succeeded'}))

            } else {
                handleServerAppError(dispatch, res.data)
                dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'failed'}))

            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response?.data ? e.response?.data.message : e.message
                handleServerNetworkError(dispatch, error)
                dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'failed'}))

            } else {
                handleServerNetworkError(dispatch, 'Some Error')
                dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'failed'}))

            }
        }
    }

export const addTaskTC = (todolistID: string, title: string) =>
    async (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await tasksAPI.addTask(todolistID, title)
            if (res.data.resultCode === 0) {
                dispatch(tasksActions.addTask({todolistID, task: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
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
    }


export const updateTaskTC = (todolistID: string, taskID: string, domainModel: TaskModelDomainType) =>
    async (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
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
                dispatch(tasksActions.updateTask({todolistID, taskID, apiModel}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
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
    }


// TYPES

// type GeneralACType = RemoveTaskACType
//     | AddTaskACType
//     | updateTaskACType
//     // | AddTodolistACType
//     //  | SetTodolistsACType
//     | SetTasksACType
//     | ChangeEntityTaskStatusACType
// // | AppActionsType
// type RemoveTaskACType = ReturnType<typeof removeTaskAC>
// type AddTaskACType = ReturnType<typeof addTaskAC>
// type updateTaskACType = ReturnType<typeof updateTaskAC>
// type SetTasksACType = ReturnType<typeof setTasksAC>
// type ChangeEntityTaskStatusACType = ReturnType<typeof changeEntityTaskStatusAC>
// type addTasksInTodolistACType = ReturnType<typeof addTasksInTodolistAC>


export type TaskModelDomainType = {
    title?: string
    description?: string,
    status?: TaskStatuses,
    priority?: TaskPriorities,
    startDate?: string,
    deadline?: string,
}

export type ErrorType = {
    message: string
}