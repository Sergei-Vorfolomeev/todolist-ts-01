import axios from "axios";
import {ResponseType} from "./todolist-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '9b7bf10d-55fc-4d6e-b69f-50e6002c9999',
    }
})

export type LoginType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}
export type UserType = {
    id: number,
    email: string,
    login: string
}

export const authAPI = {
    login (data: LoginType) {
        return instance.post<ResponseType<{userId: number}>>('/auth/login', data)
    },
    me () {
        return instance.get<ResponseType<UserType>>('/auth/me')
    },
    logout () {
        return instance.delete<ResponseType>('/auth/login')
    }
}