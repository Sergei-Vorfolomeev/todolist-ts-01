import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'a055d478-d0d0-4bac-81f0-e978291ab143',
    }
})

export const todolistAPI = {
    getTodolists () {
        return instance.get<TodolistType[]>('/todo-lists')
            .then( res => res.data )
    },
    createTodolist (title: string) {
        return  instance.post<ResponseType<{item: TodolistType}>>('/todo-lists', {title: title})
            .then(res => res.data)
    },
    deleteTodolist (todolistId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
            .then(res => res.data)
    },
    updateTodolist (todolistId: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${todolistId}`, {title: title})
            .then(res => res.data)
    }
}

type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}
type ResponseType<T = {}> = {
    data: T
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}