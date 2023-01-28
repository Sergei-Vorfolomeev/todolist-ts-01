import React, {useEffect} from 'react';
import './App.css';
import {setTodolistsTC} from "./state/todolistsReducer";
import {useAppDispatch, useAppSelector} from "./state/store";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {RequestStatusType} from "./state/appReducer";
import {TodolistsList} from "./components/TodolistsList";
import {Navigate, NavLink, Route, Routes} from "react-router-dom";
import {Login} from "./components/Login";
import {ErrorPage404} from "./components/404";

function AppWithRedux() {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setTodolistsTC())
    }, [dispatch])

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
                            <NavLink to='/login' >
                                <Button color="inherit" style={{color: 'white'}}>Login</Button>
                            </NavLink>
                        </Toolbar>
                        {status === 'loading' && <LinearProgress color="secondary"/>}
                    </AppBar>
                </Box>
            </div>
            <Routes>
                <Route path={'/'} element={<TodolistsList/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/404'} element={<ErrorPage404/>}/>
                <Route path={'*'} element={<Navigate to={'/404'}/>}/>
            </Routes>

        </div>
    );
}

export default AppWithRedux;
