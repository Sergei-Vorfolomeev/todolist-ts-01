import {TaskPriorities, TaskStatuses} from "common/enums/common.enums";
import {RequestStatusType} from "app/appReducer";

export type ResponseType<D = {}> = {
    data: D
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}

export type TodolistResponseType = {
    addedDate: string
    id: string
    order: number
    title: string
}

export type TaskResponseType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}
export type TaskDomainType = TaskResponseType & { entityTaskStatus: RequestStatusType }


