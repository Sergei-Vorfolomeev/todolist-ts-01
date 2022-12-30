import React, {useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {Task} from "./Task";
import {TasksType} from "../AppWithRedux";
import {action} from "@storybook/addon-actions";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";



// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'TODOLISTS/Task',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        changeCheckBox: action('changeCheckBox'),
        changeTitleTask: action('changeTitleTask'),
        removeTask: action('removeTask'),
        task: {id: '1', title: 'HTML', isDone: true},
    }
} as ComponentMeta<typeof Task>;

const TemplateWorked: ComponentStory<typeof Task> = (args) => {
    const [task, setTask] = useState(args.task)
    return (
        <li>
            <Checkbox checked={task.isDone}
                      onChange={(event) => setTask({...task, isDone:event.currentTarget.checked})}/>
            <EditableSpan title={task.title}
                          changeTitleTask={(newTitle: string) => setTask({...task, title: newTitle})}/>
            <IconButton aria-label="delete" onClick={() => args.removeTask('id')}>
                <Delete/>
            </IconButton>
        </li>
    );
};

export const TaskIsDoneStory = TemplateWorked.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const TaskIsNotDoneStory = TemplateWorked.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {id: '1', title: 'HTML', isDone: false},
};
