import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [editSpan, setEditSpan] = useState(false)
    const [newEditedTitle, setNewEditedTitle] = useState(props.title)

    const tranformSpan = () => {
        if (!editSpan) {
            setEditSpan(!editSpan)
        } else {
            setEditSpan(!editSpan)
            props.changeTitle(newEditedTitle)
        }
    }
    const changeTitleTaskHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNewEditedTitle(event.currentTarget.value)
    }
    const onEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            tranformSpan()
        }
    }

    return (
        editSpan
            ? <input
                value={newEditedTitle}
                onChange={changeTitleTaskHandler}
                autoFocus
                onBlur={tranformSpan}
                onKeyDown={onEnterHandler}/>
            : <span onDoubleClick={tranformSpan}>
                {props.title}
              </span>
    );
});


