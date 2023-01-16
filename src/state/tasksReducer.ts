import {AddTodolistACType, SetTodolistsACType} from "./todolistsReducer";
import {Dispatch} from "redux";
import {TaskModelAPIType, TaskPriorities, TaskResponseType, tasksAPI, TaskStatuses} from "../api/tasks-api";
import {TasksStateType} from "../components/TaskWithRedux";
import {AppRootStateType} from "./store";

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

type GeneralACType = RemoveTaskACType
    | AddTaskACType
    | updateTaskACType
    | AddTodolistACType
    | SetTodolistsACType
    | SetTasksACType
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type updateTaskACType = ReturnType<typeof updateTaskAC>
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

export const setTasksTC = (todolistID: string) =>
    (dispatch: Dispatch) => {
        tasksAPI.getTasks(todolistID)
            .then(res => dispatch(setTasksAC(res.items, todolistID)))
    }

export const removeTaskTC = (todolistID: string, taskID: string) =>
    (dispatch: Dispatch) => {
        tasksAPI.deleteTask(todolistID, taskID)
            .then(res => dispatch(removeTaskAC(todolistID, taskID)))
    }

export const addTaskTC = (todolistID: string, title: string) =>
    (dispatch: Dispatch) => {
        tasksAPI.addTask(todolistID, title)
            .then(res => dispatch(addTaskAC(todolistID, res.data.item)))
    }


export type TaskModelDomainType = {
    title?: string
    description?: string,
    status?: TaskStatuses,
    priority?: TaskPriorities,
    startDate?: string,
    deadline?: string,
}

export const updateTaskTC = (todolistID: string, taskID: string, domainModel: TaskModelDomainType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
        tasksAPI.updateTask(todolistID, taskID, apiModel)
            .then(res => dispatch(updateTaskAC(todolistID, taskID, apiModel)))
    }