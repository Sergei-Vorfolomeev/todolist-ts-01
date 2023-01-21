import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField'
import Button from "@mui/material/Button";

type InputCompPropsType = {
    callBack: (newTitle: string) => void
    label: string
    disabled?: boolean
}

export const InputComp = memo((props: InputCompPropsType) => {

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
                label={error ? error : props.label}
                variant="outlined"
                value={newTitle}
                onChange={onChangeInputHandler}
                error={!!error}
                onKeyDown={onEnterHandler}
                disabled={props.disabled}
            />
            <Button
                variant="contained"
                style={{maxWidth: '40px', minWidth: '40px', maxHeight: '40px', minHeight: '40px', background: 'purple'}}
                onClick={addTaskHandler}
                disabled={props.disabled}>
                +
            </Button>
        </div>
    );
});
