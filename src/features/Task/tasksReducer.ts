import {
    AddTaskArgType,
    RemoveTaskArgType,
    TaskModelAPIType,
    tasksAPI,
    UpdateTaskArgType
} from "common/api/tasks-api";
import {appActions, RequestStatusType} from "app/appReducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsThunks} from "features/TodolistList/todolistsReducer";
import {clearTodolistsAndTasks} from "common/actions/common.actions";
import {TaskPriorities, TaskStatuses} from "common/enums/common.enums";
import {TaskDomainType, TaskResponseType} from "common/types/common.types";

export type TasksStateType = {
    [key: string]: TaskDomainType[]
}

const initialState: TasksStateType = {}

// THUNKS
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskResponseType[], todolistID: string }, string>
('tasks/fetchTasks', async (todolistID: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await tasksAPI.getTasks(todolistID)
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks: res.data.items, todolistID}
    } catch (e) {
        handleServerNetworkError(dispatch, e)
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
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})
export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    const task = getState().tasks[arg.todolistID].find(el => el.id === arg.taskID)
    if (!task) {
        dispatch(appActions.setError({error: 'Task not found in the state!'}))
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
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})
export const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>('tasks/removeTask', async (arg: {todolistID: string, taskID: string}, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    const {todolistID, taskID} = arg
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'loading'}))
    try {
        const res = await tasksAPI.deleteTask(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'succeeded'}))
            return{todolistID, taskID}

        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        dispatch(tasksActions.changeEntityTaskStatus({todolistID, taskID, entityTaskStatus: 'failed'}))
        return rejectWithValue(null)
    }
})

//SLICE
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
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
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const index = state[action.payload.todolistID].findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) state[action.payload.todolistID].splice(index, 1)
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const task = state[action.payload.todolistID]
            const index = task.findIndex(el => el.id === action.payload.taskID)
            if (index !== -1) task[index] = {...task[index], ...action.payload.domainModel}
        })
        builder.addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.todolistID]
        })
        builder.addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
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
export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}

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