import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {todolistAPI} from "../api/todolist-api";
import {tasksAPI} from "../api/tasks-api";

export default {
    title: 'API'
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
        todolistAPI.createTodolist('Hello').then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.deleteTodolist('1891a8b9-2b50-48e4-b40d-146bb21c50e1').then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.updateTodolist('9d420aae-1dec-4862-a526-c45925534f26', 'World').then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

