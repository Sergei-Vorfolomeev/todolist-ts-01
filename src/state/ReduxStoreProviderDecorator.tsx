import {Provider} from "react-redux";
import {store} from "./store";
import React, {ReactNode} from 'react'

export const ReduxStoreProviderDecorator = (storyFn: ReactNode) => {
    return <Provider store={store}>{storyFn()}</Provider>
}