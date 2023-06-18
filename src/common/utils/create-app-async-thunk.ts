import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppRootStateType, AppThunkDispatchType} from "app/store";
import {ResponseType} from 'common/types'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppThunkDispatchType
    rejectValue: null | ResponseType
}>()