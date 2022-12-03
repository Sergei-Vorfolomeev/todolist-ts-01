import React, {ChangeEvent, useState} from 'react';
import TextField from '@mui/material/TextField'
import Button from "@mui/material/Button";

type InputCompPropsType = {
    callBack: (newTitle: string) => void
    label: string
}

export const InputComp = (props: InputCompPropsType) => {

    const [newTitle, setNewTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const addTaskHandler = () => {
        if (newTitle !== '') {
            props.callBack(newTitle.trim())
            setNewTitle('')
        } else {
            setError('Title is required')
        }
    }
    const OnChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setNewTitle(event.currentTarget.value)
    }
    return (
        <div>
            <TextField
                id="outlined-basic"
                label={error ? error : props.label}
                variant="outlined"
                value={newTitle}
                onChange={OnChangeInputHandler}
                error={!!error}
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
