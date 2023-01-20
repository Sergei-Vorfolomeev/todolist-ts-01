import React, {useCallback, useEffect} from 'react';
import './App.css';
import {InputComp} from "./components/InputComp";
import {addTodolistTC, setTodolistsTC, TodolistsDomainType} from "./state/todolistsReducer";
import {useSelector} from "react-redux";
import {useAppDispatch, AppRootStateType, useAppSelector} from "./state/store";
import {TodolistWithRedux} from "./components/TodolistWithRedux";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {RequestStatusType} from "./state/appReducer";
import {ErrorSnackBar} from "./components/SnackBar";

function AppWithRedux() {

    let todolists = useSelector<AppRootStateType, Array<TodolistsDomainType>>(state => state.todolists);
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const error = useAppSelector<null | string>(state => state.app.error)

    const dispatch = useAppDispatch()

    const addTodolist = useCallback((newTitle: string) => {
        dispatch(addTodolistTC(newTitle))
    }, [dispatch])

    useEffect(() => {
        dispatch(setTodolistsTC())
    }, [])

    return (
        <div className="App">
            <div className='appBar'>
                <Box sx={{flexGrow: 1}}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                News
                            </Typography>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                        {status === 'loading' && <LinearProgress color="secondary"/>}
                    </AppBar>
                </Box>
            </div>
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
        </div>
    );
}

export default AppWithRedux;
