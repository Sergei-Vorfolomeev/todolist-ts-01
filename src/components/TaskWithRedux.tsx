import React, {memo} from 'react';
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../state/store";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {removeTaskAC, updateTaskTC} from "../state/tasksReducer";
import {TaskDomainType, TaskResponseType, TaskStatuses} from "../api/tasks-api";
import {RequestStatusType} from "../state/appReducer";

type TaskWithReduxPropsType = {
    todolistID: string
    taskIndex: number
}

export type TasksStateType = {
    [key: string]: TaskDomainType[]
        //& {entityTaskStatus: RequestStatusType}
}

export const TaskWithRedux = memo(({todolistID, taskIndex}:TaskWithReduxPropsType) => {

    let task = useSelector<AppRootStateType, TaskResponseType>(
        state => state.tasks[todolistID][taskIndex]
    )
    const dispatch = useAppDispatch()

    const changeCheckBox = (taskID: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistID, taskID, {status}))
    };
    const changeTitleTask =(taskID: string, newTitle: string) => {
        dispatch(updateTaskTC(todolistID, taskID, {title: newTitle}))
    };
    const removeTask =(taskID: string) => {
        dispatch(removeTaskAC(todolistID, taskID))
    };

    return (
        <li>
            <Checkbox checked={task.status === TaskStatuses.Completed}
                      onChange={(event) => changeCheckBox(task.id, event.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)}/>
            <EditableSpan title={task.title}
                          changeTitle={(newTitle: string) => changeTitleTask(task.id, newTitle)}/>
            <IconButton aria-label="delete" onClick={() => removeTask(task.id)}>
                <Delete/>
            </IconButton>
        </li>
    );
});

