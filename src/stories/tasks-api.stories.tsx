import React, {useEffect, useState} from 'react'
import {GetTasksResponseType, tasksAPI, ResponseType, TaskStatuses, TaskPriorities} from "../api/tasks-api";

export default {
    title: 'API'
}

export const GetTasks = () => {
    const [state, setState] = useState<GetTasksResponseType | null>(null)
    useEffect(() => {
        tasksAPI.getTasks('9d420aae-1dec-4862-a526-c45925534f26')
            .then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const AddTask = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    useEffect( () => {
        tasksAPI.addTask('9d420aae-1dec-4862-a526-c45925534f26', 'Sergey')
            .then(res => setState(res.data.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    useEffect( () => {
       tasksAPI.deleteTask('9d420aae-1dec-4862-a526-c45925534f26', '69e03972-b73c-4802-a5a1-aaad716db504')
           .then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTitleTask = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    useEffect( () => {
        tasksAPI.updateTask(
            '9d420aae-1dec-4862-a526-c45925534f26',
            '7a8a9692-7120-456c-9d10-e4561b734f17',
            {
                title: '',
                description: '',
                status: TaskStatuses.New,
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: ''
            })
            .then(res => setState(res.data.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
