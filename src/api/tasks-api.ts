import axios from "axios";

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4,
}


export type TaskResponseType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todolistId: string
}
export type GetTasksResponseType = {
    error: null | string
    items: TaskResponseType[]
    totalCount: number
}
export type ResponseType<T = {}> = {
    data: T
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'a055d478-d0d0-4bac-81f0-e978291ab143',
    }
})

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
            .then(res => res.data)
    },
    addTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskResponseType}>>(`/todo-lists/${todolistId}/tasks`, {title})
            .then(res => res.data)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
            .then(res => res.data)
    },
    updateTitleTask(todolistId: string,
                    taskId: string,
                    title: string,
                    description: string | null,
                    completed: boolean,
                    status: number,
                    priority: number,
                    startDate: string | null,
                    deadline: string | null,
    ) {
        return instance.put<ResponseType<{item: TaskResponseType}>>(`/todo-lists/${todolistId}/tasks/${taskId}`, {
            title,
            description: null,
            completed: false,
            status: 0,
            priority: 1,
            startDate: null,
            deadline: null
        })
            .then(res => res.data)
    },
}

