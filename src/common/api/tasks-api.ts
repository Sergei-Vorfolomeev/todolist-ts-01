import axios from "axios";
import {RequestStatusType} from "app/appReducer";
import {TaskModelDomainType} from "features/Task/tasksReducer";
import {TaskPriorities, TaskStatuses} from "common/enums/common.enums";
import {TaskResponseType, ResponseType} from "common/types/common.types";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'd72a289b-3051-456d-82d6-68881a29ae5a',
    }
})

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
            .then(res => res)
    },
    addTask(arg: AddTaskArgType) {
        return instance.post<ResponseType<{ item: TaskResponseType }>>(`/todo-lists/${arg.todolistID}/tasks`, {title: arg.title})
            .then(res => res)
    },
    deleteTask(arg: RemoveTaskArgType) {
        return instance.delete<ResponseType>(`/todo-lists/${arg.todolistID}/tasks/${arg.taskID}`)
            .then(res => res)
    },

    updateTask(todolistId: string, taskId: string, model: TaskModelAPIType) {
        return instance.put<ResponseType<{ item: TaskResponseType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
            .then(res => res)
    },
}

// TYPES
export type TaskModelAPIType = {
    title: string
    description: string,
    status: TaskStatuses,
    priority: TaskPriorities,
    startDate: string,
    deadline: string,
}

export type GetTasksResponseType = {
    error: null | string
    items: TaskResponseType[]
    totalCount: number
}

export type AddTaskArgType = {
    todolistID: string
    title: string
}
export type UpdateTaskArgType = {
    todolistID: string,
    taskID: string,
    domainModel: TaskModelDomainType
}
export type RemoveTaskArgType = {
    todolistID: string,
    taskID: string
}

