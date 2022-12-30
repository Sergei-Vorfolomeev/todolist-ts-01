import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {InputComp} from "./InputComp";
import {action} from "@storybook/addon-actions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";



// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'TODOLISTS/InputComp',
    component: InputComp,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    callBack: {
        description: 'Button clicked inside form',
    },
    // label: {
    //     description: 'what'
    // }
} as ComponentMeta<typeof InputComp>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InputComp> = (args) => <InputComp {...args} />;

export const InputCompStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
InputCompStory.args = {
    callBack: action('Button clicked'),
};

const TemplateWithError: ComponentStory<typeof InputComp> = (args) => {

    const [newTitle, setNewTitle] = useState<string>('')
    const [error, setError] = useState<string | null>('Title is required')

    const addTaskHandler = () => {
        if (newTitle !== '') {
            args.callBack(newTitle.trim())
            setNewTitle('')
        } else {
            setError('Title is required')
        }
    }
    const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        setNewTitle(event.currentTarget.value)
    }
    const onEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter')
            addTaskHandler()
    }
    return (
        <div>
            <TextField
                id="outlined-basic"
                label={error ? error : args.label}
                variant="outlined"
                value={newTitle}
                onChange={onChangeInputHandler}
                error={!!error}
                onKeyDown={onEnterHandler}
            />
            <Button
                variant="contained"
                style={{maxWidth: '40px', minWidth: '40px', maxHeight: '40px', minHeight: '40px', background: 'purple'}}
                onClick={addTaskHandler}>
                +
            </Button>
        </div>
    );
};

export const InputCompWithError = TemplateWithError.bind({})


