import React, {memo, useCallback, useEffect} from 'react';
import '../App.css';
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {InputComp} from "./InputComp";
import {useAppDispatch, useAppSelector} from "../state/store";
import {
    changeFilterAC,
    changeTodolistTitleTC,
    FilterType,
    removeTodolistTC,
    TodolistsDomainType
} from "../state/todolistsReducer";
import {addTaskTC, removeTaskTC, setTasksTC, updateTaskTC} from "../state/tasksReducer";
import {ButtonWithMemo} from "./ButtonWithMemo";
import {TaskResponseType, TaskStatuses} from "../api/tasks-api";
import {Task} from "./Task";
import {EditableSpan} from "./EditableSpan";

type TodolistWithReduxPropsType = {
    todolist: TodolistsDomainType
}

export const TodolistWithRedux = memo(({todolist}: TodolistWithReduxPropsType) => {
    const {id, title, filter, entityStatus} = todolist
    let tasks = useAppSelector<TaskResponseType[]>(state => state.tasks[id])
    const dispatch = useAppDispatch()

    if (filter === 'active') {
        tasks = tasks.filter(el => el.status === TaskStatuses.New)
        // console.log(tasks)
    }
    if (filter === 'completed') {
        tasks = tasks.filter(el => el.status === TaskStatuses.Completed)
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

    const changeCheckBox = useCallback((taskID: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(id, taskID, {status}))
    }, [id, dispatch])
    const changeTaskTitle = useCallback((taskID: string, newTitle: string) => {
        dispatch(updateTaskTC(id, taskID, {title: newTitle}))
    },[id, dispatch]);
    const removeTask = useCallback((taskID: string) => {
        dispatch(removeTaskTC(id, taskID))
    },[id, dispatch]);
    const changeTodolistTitle = (newTitle: string) => {
        dispatch(changeTodolistTitleTC(id, newTitle))
    };

    useEffect(() => {
        dispatch(setTasksTC(id))
    }, [])

    return (
        <div className='todolist'>
            <h3>
                <EditableSpan title={title} changeTitle={changeTodolistTitle}/>
                <IconButton aria-label="delete" onClick={removeTodolist} disabled={entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <div>
                <InputComp callBack={(newTitle) => addTask(newTitle)}
                           label={'Type new task'}
                           disabled={entityStatus === 'loading'}/>
            </div>
            <ul>
                {tasks.map((el) => {
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

