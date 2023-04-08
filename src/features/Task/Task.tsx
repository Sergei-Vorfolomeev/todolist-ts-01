import React, {memo} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {TaskDomainType} from "common/api/tasks-api";
import {TaskStatuses} from "common/enums/common.enums";

type TaskType = {
    task: TaskDomainType
    changeCheckBox: (taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (taskID: string, newTitle: string) => void
    removeTask: (taskID: string) => void
}

export const Task = memo((props: TaskType) => {
    return (
        <li>
            <Checkbox checked={props.task.status === TaskStatuses.Completed}
                      onChange={(event) => props.changeCheckBox(props.task.id, event.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)}/>
            <EditableSpan title={props.task.title}
                          changeTitle={(newTitle: string) => props.changeTaskTitle(props.task.id, newTitle)}/>
            <IconButton aria-label="delete" onClick={() => props.removeTask(props.task.id)} disabled={props.task.entityTaskStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </li>
    );
});

