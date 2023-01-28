import axios from "axios/index";
import {ResponseType} from "./todolist-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'd72a289b-3051-456d-82d6-68881a29ae5a',
    }
})

export type LoginType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}

export const authAPI = {
    login (data: LoginType) {
        return instance.post<ResponseType<{userId: number}>>('/auth/login', data)
            // .then(res => res)
    }
}