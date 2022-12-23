import React, {memo} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {TasksType} from "../AppWithRedux";

type TaskType = {
    task: TasksType
    changeCheckBox: (taskID: string, checkBoxValue: boolean) => void
    changeTitleTask: (taskID: string, newTitle: string) => void
    removeTask: (taskID: string) => void
}

export const Task = memo((props: TaskType) => {
    return (
        <li>
            <Checkbox checked={props.task.isDone}
                      onChange={(event) => props.changeCheckBox(props.task.id, event.currentTarget.checked)}/>
            <EditableSpan title={props.task.title}
                          changeTitleTask={(newTitle: string) => props.changeTitleTask(props.task.id, newTitle)}/>
            <IconButton aria-label="delete" onClick={() => props.removeTask(props.task.id)}>
                <Delete/>
            </IconButton>
        </li>
    );
});

