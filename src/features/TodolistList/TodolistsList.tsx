import React, {useCallback, useEffect} from 'react';
import {Input, ErrorSnackBar} from "common/components";
import {Todolist} from "features/TodolistList";
import {useAppDispatch, useAppSelector} from "app/store";
import {TodolistsDomainType, todolistsThunks} from "features/TodolistList/todolistsReducer";
import {Navigate} from "react-router-dom";

export const TodolistsList = () => {

    let todolists = useAppSelector<Array<TodolistsDomainType>>(state => state.todolists);
    const error = useAppSelector<null | string>(state => state.app.error)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(todolistsThunks.fetchTodolists())
    }, [dispatch, isLoggedIn])

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(todolistsThunks.addTodolist(newTitle))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to='/login'/>
    }

    return (
        <div className="todolists">
            <div className="inputComp">
                <Input callBack={addTodolist}
                       label={'Type new title'}/>
            </div>
            {todolists.map(el => {
                return (
                    <Todolist
                        key={el.id}
                        todolist={el}
                    />
                )
            })}
            {error && <ErrorSnackBar error={error}/>}
        </div>
    );
};
