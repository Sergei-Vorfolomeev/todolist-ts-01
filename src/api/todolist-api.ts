import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'a055d478-d0d0-4bac-81f0-e978291ab143',
    }
}

export const todolistAPI = {
    getTodolists () {
        return axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
            .then( res => res.data )
    },
    postTodolist (title: string) {
        return  axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: title}, settings)
            .then(res => res.data)
    },
    deleteTodolist (todolistId: string) {
        return axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, settings)
            .then(res => res.data)
    },
    putTodolist (todolistId: string, title: string) {
        return axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, {title: title}, settings)
            .then(res => res.data)
    }
}