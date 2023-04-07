import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppRootStateType, AppThunkDispatchType} from "state/store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppThunkDispatchType
    rejectValue: null
}>()