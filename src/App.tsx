import React, {useState} from 'react';
import './App.css';
import {v1} from "uuid";
import {Todolist} from "./components/Todolist";
import {InputComp} from "./components/InputComp";

type TodolistsType = {
    id: string
    title: string
    filter: FilterType
}
export type FilterType = 'all' | 'active' | 'completed'

type TasksStateType = {
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

    let [todolists, setTodolists] = useState<Array<TodolistsType>>(
        [
            {id: todolistsID1, title: 'What to learn?', filter: 'all'},
            {id: todolistsID2, title: 'What to buy?', filter: 'all'},
        ]
    )

    const [tasks, setTasks] = useState<TasksStateType>({
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
        setTodolists(todolists.map(el => el.id === todolistID ? {...el, filter: filterValue} : el))
    }
    const removeTask = (todolistID: string, taskID: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(el => el.id !== taskID)})
    }
    const addTask = (todolistID: string, newTitle: string) => {
        const newTask = {id: v1(), title: newTitle, isDone: false}
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
    }
    const changeCheckBox = (todolistID: string, taskID: string, checkBoxValue: boolean) => {
        setTasks({
            ...tasks,
            [todolistID]: tasks[todolistID].map(el => el.id === taskID ? {...el, isDone: checkBoxValue} : el)
        })
    }
    const addTodolist = (newTitle: string) => {
        const newID = v1()
        const newTodolist:TodolistsType = {id: newID, title: newTitle, filter: 'all'}
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [newID]: []})
    }
    const removeTodolist = (todolistID: string) => {
        setTodolists(todolists.filter(el => el.id !== todolistID))
    }
    const changeTitleTask = (todolistID: string, taskID: string, newTitle: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(el => el.id === taskID ? {...el, title: newTitle} : el)})
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
