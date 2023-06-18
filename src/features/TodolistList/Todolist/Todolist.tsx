import React, {memo, useCallback, useEffect} from 'react';
import 'app/App.css';
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {useAppDispatch, useAppSelector} from "app/store";
import {
    FilterType,
    todolistsActions,
    TodolistsDomainType, todolistsThunks
} from "features/TodolistList/todolistsReducer";
import {tasksThunks} from "features/Task/tasksReducer";
import {ButtonWithMemo, EditableSpan, Input} from "common/components";
import {Task} from "features";
import {Paper} from "@mui/material";
import {TaskStatuses} from "common/enums/common.enums";
import {TaskDomainType} from "common/types/common.types";

type TodolistWithReduxPropsType = {
    todolist: TodolistsDomainType
}

export const Todolist = memo(({todolist}: TodolistWithReduxPropsType) => {
    const {id: todolistID, title, filter, entityStatus} = todolist
    let tasks = useAppSelector<TaskDomainType[]>(state => state.tasks[todolistID])
    const dispatch = useAppDispatch()

    if (filter === 'active') {
        tasks = tasks.filter(el => el.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasks = tasks.filter(el => el.status === TaskStatuses.Completed)
    }

    const removeTodolist = () => {
        dispatch(todolistsThunks.removeTodolist(todolistID))
    }
    const addTask = useCallback((newTitle: string) => {
        dispatch(tasksThunks.addTask({todolistID, title: newTitle}))
    }, [dispatch, todolistID]);

    const changeFilter = useCallback((filterValue: FilterType) => {
        dispatch(todolistsActions.changeFilter({todolistID, filterValue}))
    }, [todolistID, dispatch])

    const changeCheckBox = useCallback((taskID: string, status: TaskStatuses) => {
        dispatch(tasksThunks.updateTask({
            todolistID, taskID, domainModel: {status}
        }))
    }, [todolistID, dispatch])
    const changeTaskTitle = useCallback((taskID: string, newTitle: string) => {
            dispatch(tasksThunks.updateTask({
                todolistID: todolistID, taskID, domainModel: {title: newTitle}
            }))
        },
        [todolistID, dispatch])
    const removeTask = useCallback((taskID: string) => {
        dispatch(tasksThunks.removeTask({todolistID, taskID}))
    }, [todolistID, dispatch]);
    const changeTodolistTitle = (title: string) => {
        dispatch(todolistsThunks.changeTodolistTitle({todolistID, title}))
    };

    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(todolistID))
    }, [dispatch, todolistID])

    return (
        <Paper elevation={5} style={{margin: '0 25px 25px 0'}}>
            <div className='todolist'>
                <h3>
                    <EditableSpan title={title} changeTitle={changeTodolistTitle}/>
                    <IconButton aria-label="delete" onClick={removeTodolist} disabled={entityStatus === 'loading'}>
                        <Delete/>
                    </IconButton>
                </h3>
                <div>
                    <Input callBack={(newTitle) => addTask(newTitle)}
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
                    <ButtonWithMemo title={'All'} color={'primary'}
                                    variant={filter === 'all' ? 'contained' : "outlined"}
                                    callback={() => changeFilter('all')}/>
                    <ButtonWithMemo title={'Active'} color={'secondary'}
                                    variant={filter === 'active' ? 'contained' : "outlined"}
                                    callback={() => changeFilter('active')}/>
                    <ButtonWithMemo title={'Completed'} color={'error'}
                                    variant={filter === 'completed' ? 'contained' : "outlined"}
                                    callback={() => changeFilter('completed')}/>
                </div>
            </div>
        </Paper>
    );
});

