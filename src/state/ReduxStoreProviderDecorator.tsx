import {Provider} from "react-redux";
import {store} from "./store";
import React from 'react'

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
        return <Provider store={store}>{storyFn()}</Provider>
}