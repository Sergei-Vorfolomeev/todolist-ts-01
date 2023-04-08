import React, {memo, useCallback, useEffect} from 'react';
import 'app/App.css';
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {InputComp} from "common/components/Input/InputComp";
import {useAppDispatch, useAppSelector} from "app/store";
import {
    changeTodolistTitleTC,
    FilterType,
    removeTodolistTC, todolistsActions,
    TodolistsDomainType
} from "features/Todolist/todolistsReducer";
import {removeTaskTC, tasksThunks} from "features/Task/tasksReducer";
import {ButtonWithMemo} from "common/components/Button/ButtonWithMemo";
import {TaskDomainType} from "common/api/tasks-api";
import {Task} from "features/Task/Task";
import {EditableSpan} from "common/components/EditableSpan/EditableSpan";
import {Paper} from "@mui/material";
import {TaskStatuses} from "common/enums/common.enums";

type TodolistWithReduxPropsType = {
    todolist: TodolistsDomainType
}

export const Todolist = memo(({todolist}: TodolistWithReduxPropsType) => {
    const {id, title, filter, entityStatus} = todolist
    let tasks = useAppSelector<TaskDomainType[]>(state => state.tasks[id])
    const dispatch = useAppDispatch()

    if (filter === 'active') {
        tasks = tasks.filter(el => el.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasks = tasks.filter(el => el.status === TaskStatuses.Completed)
    }

    const removeTodolist = () => {
        dispatch(removeTodolistTC(id))
    }
    const addTask = useCallback((newTitle: string) => {
        dispatch(tasksThunks.addTask({todolistID: id, title: newTitle}))
    }, [dispatch, id]);

    const changeFilter = useCallback((filterValue: FilterType) => {
        dispatch(todolistsActions.changeFilter({todolistID: id, filterValue}))
    }, [id, dispatch])

    const changeCheckBox = useCallback((taskID: string, status: TaskStatuses) => {
        dispatch(tasksThunks.updateTask({
            todolistID: id, taskID, domainModel: {status}
        }))
    }, [id, dispatch])
    const changeTaskTitle = useCallback((taskID: string, newTitle: string) => {
            dispatch(tasksThunks.updateTask({
                todolistID: id, taskID, domainModel: {title: newTitle}
            }))
        },
        [id, dispatch])
    const removeTask = useCallback((taskID: string) => {
        dispatch(removeTaskTC(id, taskID))
    }, [id, dispatch]);
    const changeTodolistTitle = (newTitle: string) => {
        dispatch(changeTodolistTitleTC(id, newTitle))
    };

    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(id))
    }, [dispatch, id])

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

