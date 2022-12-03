import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    changeTitleTask: (newTitle: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [editSpan, setEditSpan] = useState(false)
    const [newEditedTitle, setNewEditedTitle] = useState(props.title)

    const tranformSpan = () => {
        setEditSpan(!editSpan)
    }
    const changeTitleTaskHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNewEditedTitle(event.currentTarget.value)
        props.changeTitleTask(event.currentTarget.value)
    }
    return (
        editSpan
            ? <input
                value={newEditedTitle}
                onChange={changeTitleTaskHandler}
                autoFocus
                onBlur={tranformSpan}/>
            : <span onDoubleClick={tranformSpan}>
                {props.title}
              </span>
    );
};


