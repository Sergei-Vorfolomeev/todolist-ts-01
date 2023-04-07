import {Dispatch} from "redux";
import {
    AddTaskArgType,
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
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "state/todolistsReducer";
import {clearTodolistsAndTasks} from "common/actions/common.actions";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";

const initialState: TasksStateType = {}

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskResponseType[], todolistID: string }, string>('tasks/fetchTasks', async (todolistID: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await tasksAPI.getTasks(todolistID)
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks: res.data.items, todolistID}
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response?.data ? e.response?.data.message : e.message
            handleServerNetworkError(dispatch, error)
        } else {
            handleServerNetworkError(dispatch, 'Some Error')
        }
        return rejectWithValue(null)
    }
})

export const addTask = createAppAsyncThunk<{ task: TaskResponseType }, AddTaskArgType>
('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await tasksAPI.addTask(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError<{ item: TaskResponseType }>(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response?.data ? e.response?.data.message : e.message
            handleServerNetworkError(dispatch, error)
        } else {
            handleServerNetworkError(dispatch, 'Some Error')
        }
        return rejectWithValue(null)
    }
})

export type UpdateTaskArgType = {
    todolistID: string,
    taskID: string,
    domainModel: TaskModelDomainType
}

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    const task = getState().tasks[arg.todolistID].find(el => el.id === arg.taskID)
    if (!task) {
        console.warn('Task not found in the state!')
        return rejectWithValue(null)
    }
    const apiModel: TaskModelAPIType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...arg.domainModel,
    }
    try {
        const res = await tasksAPI.updateTask(arg.todolistID, arg.taskID, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError<{ item: TaskResponseType }>(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response?.data ? e.response?.data.message : e.message
            handleServerNetworkError(dispatch, error)
        } else {
            handleServerNetworkError(dispatch, 'Some Error')
        }
        return rejectWithValue(null)
    }
})

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

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistID: string, taskID: string }>) => {
            const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) state[action.payload.todolistID].splice(index, 1)
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
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistID] = action.payload.tasks.map(el => ({...el, entityTaskStatus: 'idle'}))
        })
        builder.addCase(addTask.fulfilled, (state, action) => {
            const newTask: TaskDomainType = {...action.payload.task, entityTaskStatus: 'idle'}
            state[action.payload.task.todoListId].unshift(newTask)
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const task = state[action.payload.todolistID]
            const index = task.findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) task[index] = {...task[index], ...action.payload.domainModel}
        })
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
export const tasksThunks = {fetchTasks, addTask, updateTask}

// THUNKS

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