import React, {useCallback, useEffect} from 'react';
import './App.css';
import {v1} from "uuid";
import {InputComp} from "./components/InputComp";
import {addTodolistAC, setTodolistsTC} from "./state/todolistsReducer";
import {useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "./state/store";
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

    const dispatch = AppDispatch()

    const addTodolist = useCallback((newTitle: string) => {
        const newID = v1()
        dispatch(addTodolistAC(newTitle, newID))
    },[dispatch])

    useEffect( () => {
        dispatch(setTodolistsTC())
    }, [])

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
