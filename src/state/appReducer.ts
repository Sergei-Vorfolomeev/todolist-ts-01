
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false as boolean
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType) => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {
                ...state,
                status: action.payload.status
            }
        case "APP/SET-ERROR":
            return {
                ...state,
                error: action.payload.error
            }
        case "INITIALIZE-APP":
            return {
                ...state,
                isInitialized: action.payload.value
            }
        default:
            return state
    }
}


// actions
export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    } as const
}
export const setErrorAC = (error: null | string) => {
    return {
        type: 'APP/SET-ERROR',
        payload: {
            error
        }
    } as const
}
export const initializeAppAC = (value: boolean) => {
    return {
        type: 'INITIALIZE-APP',
        payload: {
            value
        }
    } as const
}





// types
export type AppActionsType = SetAppStatusACType | SetErrorACType | InitializeAppACType
type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
type SetErrorACType = ReturnType<typeof setErrorAC>
type InitializeAppACType = ReturnType<typeof initializeAppAC>