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

export type ChangeTodolistTitleArgType = { todolistID: string, title: string }

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
            .then( res => res)
    },
    createTodolist (title: string) {
        return  instance.post<ResponseType<{item: TodolistResponseType}>>('/todo-lists', {title: title})
            .then(res => res)
    },
    deleteTodolist (todolistId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
            .then(res => res)
    },
    updateTodolist (arg: ChangeTodolistTitleArgType) {
        return instance.put<ResponseType>(`/todo-lists/${arg.todolistID}`, {title: arg.title})
            .then(res => res)
    },
}

