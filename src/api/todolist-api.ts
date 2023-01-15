import axios from "axios";


export type TodolistResponseType = {
    addedDate: string
    id: string
    order: number
    title: string
}
export type ResponseType<D = {}> = {
    data: D
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'd72a289b-3051-456d-82d6-68881a29ae5a',
    }
})

export const todolistAPI = {
    getTodolists () {
        return instance.get<TodolistResponseType[]>('/todo-lists')
            .then( res => res.data )
    },
    createTodolist (title: string) {
        return  instance.post<ResponseType<{item: TodolistResponseType}>>('/todo-lists', {title: title})
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

