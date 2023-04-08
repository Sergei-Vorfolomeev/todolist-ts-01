import {tasksReducer} from 'features/Task/tasksReducer'
import {todolistsReducer} from 'features/TodolistList/todolistsReducer'
import {AnyAction, combineReducers} from 'redux'
import thunkMiddleWare, {ThunkDispatch} from 'redux-thunk'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "app/appReducer";
import {authReducer} from "features/auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    auth: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})
// создаём store
//export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleWare)
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>


//создание типа для диспатча, чтобы он мог принимать thunk
export type AppThunkDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
