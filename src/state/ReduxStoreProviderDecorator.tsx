import {Provider} from "react-redux";
import {AppRootStateType} from "./store";
import React, {ReactNode} from 'react'
import {combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "./tasksReducer";
import {todolistsReducer} from "./todolistsReducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/tasks-api";
//
// const rootReducer = combineReducers({
//     tasks: tasksReducer,
//     todolists: todolistsReducer
// })
//
// const initialGlobalState = {
//     todolists: [
//         {
//             id: 'todolistId1',
//             title: 'What to learn',
//             filter: 'all',
//             addedDate: '',
//             order: 0,
//         },
//         {
//             id: 'todolistId2',
//             title: 'What to buy',
//             filter: 'all',
//             addedDate: '',
//             order: 0,
//         }
//     ],
//     tasks: {
//         ['todolistId1']: [
//             {
//                 id: v1(),
//                 title: 'HTML&CSS',
//                 status: TaskStatuses.New,
//                 addedDate: '',
//                 deadline: '',
//                 description: '',
//                 order: 0,
//                 priority: TaskPriorities.Middle,
//                 startDate: '',
//                 todoListId: ''
//             },
//             {
//                 id: v1(),
//                 title: 'JS',
//                 status: TaskStatuses.Completed,
//                 addedDate: '',
//                 deadline: '',
//                 description: '',
//                 order: 0,
//                 priority: TaskPriorities.Middle,
//                 startDate: '',
//                 todoListId: ''
//             }
//         ],
//         ['todolistId2']: [
//             {
//                 id: v1(),
//                 title: 'Milk',
//                 status: TaskStatuses.New,
//                 addedDate: '',
//                 deadline: '',
//                 description: '',
//                 order: 0,
//                 priority: TaskPriorities.Middle,
//                 startDate: '',
//                 todoListId: ''
//             },
//             {
//                 id: v1(),
//                 title: 'React Book',
//                 status: TaskStatuses.Completed,
//                 addedDate: '',
//                 deadline: '',
//                 description: '',
//                 order: 0,
//                 priority: TaskPriorities.Middle,
//                 startDate: '',
//                 todoListId: ''
//             }
//         ]
//     }
// }
//
// export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType)
//
// export const ReduxStoreProviderDecorator = (storyFn: () => ReactNode) => {
//     return <Provider store={storyBookStore}>{storyFn()}</Provider>
// }