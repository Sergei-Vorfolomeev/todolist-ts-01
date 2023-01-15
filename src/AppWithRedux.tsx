import React, {useCallback, useEffect} from 'react';
import './App.css';
import {v1} from "uuid";
import {InputComp} from "./components/InputComp";
import {addTodolistAC, addTodolistTC, setTodolistsTC, TodolistsDomainType} from "./state/todolistsReducer";
import {useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "./state/store";
import {TodolistWithRedux} from "./components/TodolistWithRedux";

function AppWithRedux() {

    let todolists = useSelector<AppRootStateType, Array<TodolistsDomainType>>(state => state.todolists);

    const dispatch = AppDispatch()

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(addTodolistTC(newTitle))
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
