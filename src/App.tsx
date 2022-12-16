import React, {useReducer} from 'react';
import './App.css';
import {v1} from "uuid";
import {Todolist} from "./components/Todolist";
import {InputComp} from "./components/InputComp";
import {
    addTaskAC,
    addTasksInTodolistAC,
    changeCheckBoxAC,
    changeTitleTaskAC,
    removeTaskAC,
    tasksReducer
} from "./state/tasksReducer";
import {addTodolistAC, changeFilterAC, removeTodolistAC, todolistsReducer} from "./state/todolistsReducer";

export type TodolistsType = {
    id: string
    title: string
    filter: FilterType
}
export type FilterType = 'all' | 'active' | 'completed'

export type TasksStateType = {
    [key: string]: TasksType[]
}
export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

function App() {
    let todolistsID1 = v1()
    let todolistsID2 = v1()


    const [todolists, dispatchTodolists] = useReducer(todolistsReducer, [
        {id: todolistsID1, title: 'What to learn?', filter: 'all'},
        {id: todolistsID2, title: 'What to buy?', filter: 'all'},
    ])

    const [tasks, dispatchTasks] = useReducer(tasksReducer, {
        [todolistsID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
            {id: v1(), title: "Typescript", isDone: false},
            {id: v1(), title: "Angular", isDone: false},
        ],
        [todolistsID2]: [
            {id: v1(), title: "Water", isDone: true},
            {id: v1(), title: "Apples", isDone: true},
            {id: v1(), title: "Oranges", isDone: false},
            {id: v1(), title: "Kiwis", isDone: false},
            {id: v1(), title: "Bananas", isDone: false},
            {id: v1(), title: "Limes", isDone: false},
        ],
    })

    const changeFilter = (todolistID: string, filterValue: FilterType) => {
        dispatchTodolists(changeFilterAC(todolistID, filterValue))
    }
    const removeTask = (todolistID: string, taskID: string) => {
        dispatchTasks(removeTaskAC(todolistID, taskID))
    }
    const addTask = (todolistID: string, newTitle: string) => {
        dispatchTasks(addTaskAC(todolistID, newTitle))
    }
    const changeCheckBox = (todolistID: string, taskID: string, checkBoxValue: boolean) => {
        dispatchTasks(changeCheckBoxAC(todolistID, taskID, checkBoxValue))
    }
    const addTodolist = (newTitle: string) => {
        const newID = v1()
        const newTodolist: TodolistsType = {id: newID, title: newTitle, filter: 'all'}
        // dispatchTodolists(addTodolistAC(newTitle, newTodolist))
        dispatchTasks(addTasksInTodolistAC(newID))
    }
    const removeTodolist = (todolistID: string) => {
        dispatchTodolists(removeTodolistAC(todolistID))
    }
    const changeTitleTask = (todolistID: string, taskID: string, newTitle: string) => {
        dispatchTasks(changeTitleTaskAC(todolistID, taskID, newTitle))
    }

    return (
        <div className="App">
            <InputComp callBack={addTodolist}
                       label={'Type new title'}/>
            {todolists.map(el => {
                let allTasksForTodolist = tasks[el.id]
                if (el.filter === 'active')
                    allTasksForTodolist = tasks[el.id].filter(el => !el.isDone)
                if (el.filter === 'completed')
                    allTasksForTodolist = tasks[el.id].filter(el => el.isDone)
                return (
                    <Todolist
                        key={el.id}
                        title={el.title}
                        tasks={allTasksForTodolist}
                        todolistID={el.id}
                        changeFilter={changeFilter}
                        filter={el.filter}
                        removeTask={removeTask}
                        addTask={addTask}
                        changeCheckBox={changeCheckBox}
                        removeTodolist={removeTodolist}
                        changeTitleTask={changeTitleTask}
                    />
                )
            })}
        </div>
    );
}

export default App;
