import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchRegisterUser, fetchLoginUser} from "./userAPI";

interface userThunk{
    username: string;
    password: string;
}

type user ={
    token: string;
}

type userState = {
    user: user | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: userState = {
    user: null,
    status: "idle",
    error: null,
}

export const fetchRegisterUserThunk = createAsyncThunk("user/fetchRegisterUser", async ({username, password}: userThunk, {rejectWithValue}) => {
    const response = await fetchRegisterUser(username, password);
    const responseJson = await response.json();
    if (!response.ok) {
        return rejectWithValue("Failed to register user");
    } else if (responseJson.message.toString() === "User registered") {
        return responseJson.message;
    } else {
        return rejectWithValue(responseJson.message);
    }
});

export const fetchLoginUserThunk = createAsyncThunk("user/fetchLoginUser", async ({username, password}: userThunk, {rejectWithValue}) => {
    const response = await fetchLoginUser(username, password);
    const responseJson = await response.json();
    if (!response.ok) {
        return rejectWithValue("Failed to login user");
    } else if (responseJson.message.toString() === "User logged in") {
        return responseJson.message;
    } else {
        return rejectWithValue(responseJson.message);
    }
});

const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        } 
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchRegisterUserThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = null;
                state.error = action.payload as string;
                alert("User registered successfully. Please login."); 
            })
            .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.error = action.payload as string;
                alert("User registration failed. Please try again.");
            })
            .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user =  null;
                state.error = action.payload as string;
            })
            .addCase(fetchLoginUserThunk.rejected, (state, action) => {
                state.status = "failed";
                state.user = null;
                state.error = action.payload as string;
                alert("User login failed. Please try again.");
            });
    }
});

export const {addUser} = userSlice.actions;
export default userSlice.reducer;
export type {user, userState};