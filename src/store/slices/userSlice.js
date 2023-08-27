import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async () => {
        const response = await fetch('/edituser', {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        const data = await response.json();
        if (response.status !== 200 || !data) {
            throw new Error('Profile fetching failed');
        }
        return data;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [fetchUserProfile.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchUserProfile.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.profile = action.payload;
        },
        [fetchUserProfile.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        }
    }
});

export default userSlice.reducer;
