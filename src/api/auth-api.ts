import axios, {AxiosResponse} from "axios";
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
export type UserType = {
    id: number,
    email: string,
    login: string
}

export const authAPI = {
    login (data: LoginType) {
        return instance.post<AxiosResponse<ResponseType<{userId: number}>>>('/auth/login', data)
    },
    me () {
        return instance.get<ResponseType<UserType>>('/auth/me')
    }
}