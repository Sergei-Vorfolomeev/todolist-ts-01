import React, {useReducer} from 'react';
import './App.css';
import {v1} from "uuid";
import {Todolist} from "./components/Todolist";
import {InputComp} from "./components/InputComp";
import {
    addTaskAC,
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

    let todolists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todolists);

    const dispatch = useDispatch()

    const addTodolist = (newTitle: string) => {
        const newID = v1()
        // const newTodolist: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
        dispatch(addTodolistAC(newTitle, newID))
        // dispatch(addTasksInTodolistAC(newID))
    }

    return (
        <div className="App">
            <InputComp callBack={addTodolist}
                       label={'Type new title'}/>
            {todolists.map(el => {
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
