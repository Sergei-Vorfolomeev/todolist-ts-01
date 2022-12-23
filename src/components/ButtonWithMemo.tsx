import React from 'react';
import Button from "@mui/material/Button";

type ButtonWithMemoPropsType = {
    title: string
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    callback: () => void
}

export const ButtonWithMemo = React.memo((props:ButtonWithMemoPropsType) => {
    return (
        <>
            <Button variant={props.variant}
                    color={props.color}
                    onClick={() => props.callback()}>
                {props.title}
            </Button>
        </>
    );
});

