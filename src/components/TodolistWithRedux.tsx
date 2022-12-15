import React from 'react';
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {InputComp} from "./InputComp";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import Button from "@mui/material/Button";
import {FilterType, TasksType, TodolistsType} from "../AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {changeFilterAC, removeTodolistAC} from "../state/todolistsReducer";
import {addTaskAC, changeCheckBoxAC, changeTitleTaskAC, removeTaskAC} from "../state/tasksReducer";

type TodolistWithReduxPropsType = {
    todolist: TodolistsType
}

export const TodolistWithRedux = ({todolist}: TodolistWithReduxPropsType) => {


    const {id, title, filter} = todolist
    let tasks = useSelector<AppRootStateType, TasksType[]>(state => state.tasks[id])
    const dispatch = useDispatch()

    if (filter === 'active')
        tasks = tasks.filter(el => !el.isDone)
    if (filter === 'completed')
        tasks = tasks.filter(el => el.isDone)

    const removeTodolist = () => {
        dispatch(removeTodolistAC(id))
    }
    const addTask = (newTitle: string) => {
        dispatch(addTaskAC(id, newTitle))
    }
    const changeCheckBox = (taskID: string, checkBoxValue: boolean) => {
        dispatch(changeCheckBoxAC(id, taskID, checkBoxValue))
    }
    const changeTitleTask = (taskID: string, newTitle: string) => {
        dispatch(changeTitleTaskAC(id, taskID, newTitle))
    }
    const removeTask = (taskID: string) => {
        dispatch(removeTaskAC(id, taskID))
    }
    const changeFilter = (filterValue: FilterType) => {
        dispatch(changeFilterAC(id, filterValue))
    }

    return (
        <div>
            <h3>
                {title}
                <IconButton aria-label="delete" onClick={removeTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <div>
                <InputComp callBack={(newTitle) => addTask(newTitle)}
                           label={'Type new task'}/>
            </div>
            <ul>
                {tasks.map(el => {
                    return (
                        <li key={el.id}>
                            <Checkbox checked={el.isDone}
                                      onChange={(event) => changeCheckBox(el.id, event.currentTarget.checked)}/>
                            <EditableSpan title={el.title}
                                          changeTitleTask={(newTitle: string) => changeTitleTask(el.id, newTitle)}/>
                            <IconButton aria-label="delete" onClick={() => removeTask(el.id)}>
                                <Delete/>
                            </IconButton>
                        </li>
                    )
                })}
            </ul>
            <div>
                <Button variant={filter === 'all' ? 'contained' : "outlined"} color="secondary"
                        onClick={() => changeFilter('all')}>All</Button>
                <Button variant={filter === 'active' ? 'contained' : "outlined"} color="success"
                        onClick={() => changeFilter('active')}>Active</Button>
                <Button variant={filter === 'completed' ? 'contained' : "outlined"} color="error"
                        onClick={() => changeFilter('completed')}>Completed</Button>
            </div>
        </div>
    );
};

