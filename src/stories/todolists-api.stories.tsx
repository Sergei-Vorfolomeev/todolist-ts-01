import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'a055d478-d0d0-4bac-81f0-e978291ab143',
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists().then(res => setState(res))
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.postTodolist('Hello').then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.deleteTodolist('6c906dd5-9b54-44b6-ba5b-bb0e3effcb2e').then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.putTodolist('9d420aae-1dec-4862-a526-c45925534f26', 'World').then(res=> setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

