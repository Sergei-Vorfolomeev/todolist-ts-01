import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {todolistAPI} from "../api/todolist-api";
import {tasksApi} from "../api/tasks-api";

export default {
    title: 'API'
}

export const GetTasks = () => {
    const [state, setState] = useState(null)
    useEffect(() => {
        tasksApi.getTasks('9d420aae-1dec-4862-a526-c45925534f26')
            .then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const AddTask = () => {
    const [state, setState] = useState(null)
    useEffect( () => {
        tasksApi.addTask('9d420aae-1dec-4862-a526-c45925534f26', 'Vadim')
            .then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState(null)
    useEffect( () => {
       tasksApi.deleteTask('9d420aae-1dec-4862-a526-c45925534f26', '67b285c4-3abf-4aa4-bdc5-597d622d3d92')
           .then(res => setState(res))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTitleTask = () => {
    const [state, setState] = useState(null)
    useEffect( () => {
        tasksApi.updateTitleTask(
            '9d420aae-1dec-4862-a526-c45925534f26',
            '7a8a9692-7120-456c-9d10-e4561b734f17',
            'Vadim',
            null,
            false,
            0,
            1,
            null,
            null)
            .then(res => setState(res))
    }, [])


    return <div>{JSON.stringify(state)}</div>
}
