import React, {memo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {TasksType} from "../AppWithRedux";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {changeCheckBoxAC, changeTitleTaskAC, removeTaskAC} from "../state/tasksReducer";

type TaskWithReduxPropsType = {
    todolistID: string
    taskIndex: number
}

export const TaskWithRedux = memo(({todolistID, taskIndex}:TaskWithReduxPropsType) => {

    let task = useSelector<AppRootStateType, TasksType>(
        state => state.tasks[todolistID][taskIndex]
    )
    const dispatch = useDispatch()

    const changeCheckBox = (taskID: string, checkBoxValue: boolean) => {
        dispatch(changeCheckBoxAC(todolistID, taskID, checkBoxValue))
    };
    const changeTitleTask =(taskID: string, newTitle: string) => {
        dispatch(changeTitleTaskAC(todolistID, taskID, newTitle))
    };
    const removeTask =(taskID: string) => {
        dispatch(removeTaskAC(todolistID, taskID))
    };

    return (
        <li>
            <Checkbox checked={task.isDone}
                      onChange={(event) => changeCheckBox(task.id, event.currentTarget.checked)}/>
            <EditableSpan title={task.title}
                          changeTitleTask={(newTitle: string) => changeTitleTask(task.id, newTitle)}/>
            <IconButton aria-label="delete" onClick={() => removeTask(task.id)}>
                <Delete/>
            </IconButton>
        </li>
    );
});

