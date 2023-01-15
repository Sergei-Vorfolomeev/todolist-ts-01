import React, {memo, useCallback, useEffect} from 'react';
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {InputComp} from "./InputComp";
import {useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "../state/store";
import {
    changeFilterAC, changeTodolistTitleTC,
    FilterType,
    removeTodolistTC,
    TodolistsDomainType
} from "../state/todolistsReducer";
import {
    addTaskTC,
    changeCheckBoxAC,
    changeTitleTaskAC,
    removeTaskTC,
    setTasksTC
} from "../state/tasksReducer";
import {ButtonWithMemo} from "./ButtonWithMemo";
import {TaskResponseType, TaskStatuses} from "../api/tasks-api";
import {Task} from "./Task";
import {EditableSpan} from "./EditableSpan";

type TodolistWithReduxPropsType = {
    todolist: TodolistsDomainType
}

export const TodolistWithRedux = memo(({todolist}: TodolistWithReduxPropsType) => {
    const {id, title, filter} = todolist
    let tasks = useSelector<AppRootStateType, TaskResponseType[]>(state => state.tasks[id])
    const dispatch = AppDispatch()

    let allFilteredTasks = tasks

    if (filter === 'active') {
        allFilteredTasks = tasks.filter(el => el.status === TaskStatuses.New)
        // console.log(tasks)
    }
    if (filter === 'completed') {
        allFilteredTasks = tasks.filter(el => el.status === TaskStatuses.Completed)
    }

    const removeTodolist = () => {
        dispatch(removeTodolistTC(id))
    }
    const addTask = useCallback((newTitle: string) => {
        dispatch(addTaskTC(id, newTitle))
    }, [dispatch, id]);

    const changeFilter = useCallback((filterValue: FilterType) => {
        dispatch(changeFilterAC(id, filterValue))
    }, [id, dispatch])

    const changeCheckBox = (taskID: string, status: TaskStatuses) => {
        dispatch(changeCheckBoxAC(id, taskID, status))
    };
    const changeTaskTitle =(taskID: string, newTitle: string) => {
        dispatch(changeTitleTaskAC(id, taskID, newTitle))
    };
    const removeTask =(taskID: string) => {
        dispatch(removeTaskTC(id, taskID))
    };
    const changeTodolistTitle = (newTitle: string) => {
        dispatch(changeTodolistTitleTC(id, newTitle))
    };

    useEffect(() => {
        dispatch(setTasksTC(id))
    }, [])

    return (
        <div>
            <h3>
                <EditableSpan title={title} changeTitleTask={changeTodolistTitle}/>
                <IconButton aria-label="delete" onClick={removeTodolist}>
                    <Delete/>
                </IconButton>
            </h3>
            <div>
                <InputComp callBack={(newTitle) => addTask(newTitle)}
                           label={'Type new task'}/>
            </div>
            <ul>
                {allFilteredTasks.map((el) => {
                    return (
                        <Task key={el.id}
                              changeCheckBox={changeCheckBox}
                              changeTaskTitle={changeTaskTitle}
                              removeTask={removeTask}
                              task={el}
                        />
                    )
                })}
            </ul>
            <div>
                <ButtonWithMemo title={'All'} color={'primary'} variant={filter === 'all' ? 'contained' : "outlined"}
                                callback={() => changeFilter('all')}/>
                <ButtonWithMemo title={'Active'} color={'secondary'}
                                variant={filter === 'active' ? 'contained' : "outlined"}
                                callback={() => changeFilter('active')}/>
                <ButtonWithMemo title={'Completed'} color={'error'}
                                variant={filter === 'completed' ? 'contained' : "outlined"}
                                callback={() => changeFilter('completed')}/>
            </div>
        </div>
    );
});

