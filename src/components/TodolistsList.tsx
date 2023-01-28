import React, {useCallback} from 'react';
import {InputComp} from "./InputComp";
import {TodolistWithRedux} from "./TodolistWithRedux";
import {ErrorSnackBar} from "./SnackBar";
import {useAppDispatch, useAppSelector} from "../state/store";
import {addTodolistTC, TodolistsDomainType} from "../state/todolistsReducer";

export const TodolistsList = () => {

    let todolists = useAppSelector<Array<TodolistsDomainType>>(state => state.todolists);
    const dispatch = useAppDispatch()
    const error = useAppSelector<null | string>(state => state.app.error)

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(addTodolistTC(newTitle))
    }, [dispatch])

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
