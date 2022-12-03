import React from 'react';
import {InputComp} from "./InputComp";
import {FilterType, TasksType} from "../App";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {EditableSpan} from "./EditableSpan";

type TodolistPropsType = {
    title: string
    tasks: TasksType[]
    todolistID: string
    changeFilter: (todolistID: string, filterValue: FilterType) => void
    filter: FilterType
    removeTask: (todolistID: string, taskID: string) => void
    addTask: (todolistID: string, newTitle: string) => void
    changeCheckBox: (todolistID: string, taskID: string, checkBoxValue: boolean) => void
    removeTodolist: (todolistID: string) => void
    changeTitleTask: (todolistID: string, taskID: string, newTitle: string) => void
}

export const Todolist: React.FC<TodolistPropsType> = (props) => {

    const changeFilterHandler = (filterValue: FilterType) => {
        props.changeFilter(props.todolistID, filterValue)
    }
    const removeTaskHandler = (taskID: string) => {
        props.removeTask(props.todolistID, taskID)
    }
    const onChangeCheckBoxHandler = (checkBoxValue: boolean, taskID: string) => {
        props.changeCheckBox(props.todolistID, taskID, checkBoxValue)
    }
    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistID)
    }

    return (
        <div>
            <h3>
                {props.title}
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <Delete />
                </IconButton>
            </h3>
            <div>
                <InputComp callBack={(newTitle) => props.addTask(props.todolistID, newTitle)}
                           label={'Type new task'}/>
            </div>
            <ul>
                {props.tasks.map(el => {
                    return (
                        <li key={el.id}>
                            <Checkbox checked={el.isDone}
                                      onChange={(event) => onChangeCheckBoxHandler(event.currentTarget.checked, el.id)}/>
                            <EditableSpan title={el.title}
                                          changeTitleTask={(newTitle: string) => props.changeTitleTask(props.todolistID, el.id, newTitle)}/>
                            <IconButton aria-label="delete" onClick={() => removeTaskHandler(el.id)}>
                                <Delete />
                            </IconButton>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button variant={props.filter === 'all' ? 'contained' : "outlined"} color="secondary"
                        onClick={() => changeFilterHandler('all')}>All</Button>
                <Button variant={props.filter === 'active' ? 'contained' : "outlined"} color="success"
                        onClick={() => changeFilterHandler('active')}>Active</Button>
                <Button variant={props.filter === 'completed' ? 'contained' : "outlined"} color="error"
                        onClick={() => changeFilterHandler('completed')}>Completed</Button>
            </div>
        </div>
    );
};
