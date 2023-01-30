import React, {useCallback, useEffect} from 'react';
import {InputComp} from "./InputComp";
import {TodolistWithRedux} from "./TodolistWithRedux";
import {ErrorSnackBar} from "./SnackBar";
import {useAppDispatch, useAppSelector} from "../state/store";
import {addTodolistTC, setTodolistsTC, TodolistsDomainType} from "../state/todolistsReducer";
import {Navigate} from "react-router-dom";

export const TodolistsList = () => {

    let todolists = useAppSelector<Array<TodolistsDomainType>>(state => state.todolists);
    const error = useAppSelector<null | string>(state => state.app.error)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(setTodolistsTC())
    }, [dispatch, isLoggedIn])

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(addTodolistTC(newTitle))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to='/login'/>
    }

    return (
        <div className="todolists">
            <div className="inputComp">
                <InputComp callBack={addTodolist}
                           label={'Type new title'}/>
            </div>
            {todolists.map(el => {
                return (
                    <TodolistWithRedux
                        key={el.id}
                        todolist={el}
                    />
                )
            })}
            {error && <ErrorSnackBar error={error}/>}
        </div>
    );
};
