
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType) => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {
                ...state,
                status: action.payload.status
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





// types
export type AppActionsType = SetAppStatusACType
type SetAppStatusACType = ReturnType<typeof setAppStatusAC>