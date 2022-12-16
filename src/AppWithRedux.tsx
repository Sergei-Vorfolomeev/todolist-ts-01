import React, {useReducer} from 'react';
import './App.css';
import {v1} from "uuid";
import {Todolist} from "./components/Todolist";
import {InputComp} from "./components/InputComp";
import {
    addTaskAC,
    addTasksInTodolistAC,
    changeCheckBoxAC,
    changeTitleTaskAC,
    removeTaskAC,
    tasksReducer
} from "./state/tasksReducer";
import {addTodolistAC, changeFilterAC, removeTodolistAC, todolistsReducer} from "./state/todolistsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TodolistWithRedux} from "./components/TodolistWithRedux";

export type TodolistsType = {
    id: string
    title: string
    filter: FilterType
}
export type FilterType = 'all' | 'active' | 'completed'

export type TasksStateType = {
    [key: string]: TasksType[]
}
export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

function AppWithRedux() {
    // let todolistsID1 = v1()
    // let todolistsID2 = v1()

    let todolists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todolists);
    // let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const dispatch = useDispatch()

    // const changeFilter = (todolistID: string, filterValue: FilterType) => {
    //     dispatch(changeFilterAC(todolistID, filterValue))
    // }
    // const removeTask = (todolistID: string, taskID: string) => {
    //     dispatch(removeTaskAC(todolistID, taskID))
    // }
    // const addTask = (todolistID: string, newTitle: string) => {
    //     dispatch(addTaskAC(todolistID, newTitle))
    // }
    // const changeCheckBox = (todolistID: string, taskID: string, checkBoxValue: boolean) => {
    //     dispatch(changeCheckBoxAC(todolistID, taskID, checkBoxValue))
    // }
    const addTodolist = (newTitle: string) => {
        const newID = v1()
        // const newTodolist: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
        dispatch(addTodolistAC(newTitle, newID))
        // dispatch(addTasksInTodolistAC(newID))
    }
    // const removeTodolist = (todolistID: string) => {
    //     dispatch(removeTodolistAC(todolistID))
    // }
    // const changeTitleTask = (todolistID: string, taskID: string, newTitle: string) => {
    //     dispatch(changeTitleTaskAC(todolistID, taskID, newTitle))
    // }
    return (
        <div className="App">
            <InputComp callBack={addTodolist}
                       label={'Type new title'}/>
            {todolists.map(el => {
                 // if (el.filter === 'active')
                //     allTasksForTodolist = tasks[el.id].filter(el => !el.isDone)
                // if (el.filter === 'completed')
                //     allTasksForTodolist = tasks[el.id].filter(el => el.isDone)
                return (
                    <TodolistWithRedux
                        key={el.id}
                        todolist={el}
                    />
                )
            })}
        </div>
    );
}

export default AppWithRedux;
