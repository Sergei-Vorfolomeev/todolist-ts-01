import React, {useEffect} from 'react';
import 'app/App.css';
import {useAppDispatch, useAppSelector} from "app/store";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {RequestStatusType} from "app/appReducer";
import {TodolistsList} from "features";
import {Navigate, NavLink, Route, Routes} from "react-router-dom";
import {Login} from "features/auth";
import {ErrorPage404} from "common/components";
import {logoutTC, meTC} from "features/auth/authReducer";
import CircularProgress from '@mui/material/CircularProgress';

function App() {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(meTC())
    }, [dispatch])

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return (
        <div style={{position: 'fixed', width: '100%', textAlign: 'center', top: '45%' }}>
            <CircularProgress />
        </div>
        )
    }

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
                            <NavLink to={'/login'}>
                                {!isLoggedIn && <Button color="inherit" style={{color: 'white'}}>Log in</Button>}
                            </NavLink>
                            {isLoggedIn && <Button color="inherit" style={{color: 'white'}} onClick={logoutHandler}>Log out</Button>}
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

export default App;
