import React, {memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {changeCheckBoxAC, changeTitleTaskAC, removeTaskAC} from "../state/tasksReducer";
import {TaskResponseType, TaskStatuses} from "../api/tasks-api";

type TaskWithReduxPropsType = {
    todolistID: string
    taskIndex: number
}

export type TasksStateType = {
    [key: string]: TaskResponseType[]
}

export const TaskWithRedux = memo(({todolistID, taskIndex}:TaskWithReduxPropsType) => {

    let task = useSelector<AppRootStateType, TaskResponseType>(
        state => state.tasks[todolistID][taskIndex]
    )
    const dispatch = useDispatch()

    const changeCheckBox = (taskID: string, status: TaskStatuses) => {
        dispatch(changeCheckBoxAC(todolistID, taskID, status))
    };
    const changeTitleTask =(taskID: string, newTitle: string) => {
        dispatch(changeTitleTaskAC(todolistID, taskID, newTitle))
    };
    const removeTask =(taskID: string) => {
        dispatch(removeTaskAC(todolistID, taskID))
    };

    return (
        <li>
            <Checkbox checked={task.status === TaskStatuses.Completed}
                      onChange={(event) => changeCheckBox(task.id, event.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)}/>
            <EditableSpan title={task.title}
                          changeTitleTask={(newTitle: string) => changeTitleTask(task.id, newTitle)}/>
            <IconButton aria-label="delete" onClick={() => removeTask(task.id)}>
                <Delete/>
            </IconButton>
        </li>
    );
});

