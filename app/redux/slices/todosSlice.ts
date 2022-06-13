import { createSlice } from '@reduxjs/toolkit';

const initialState = { selectedItems: new Array<number>(), isOnEdit: false };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggleItem(state, action) {
      if (state.selectedItems.includes(action.payload)) {
        state.selectedItems = state.selectedItems.filter(
          (id) => id !== action.payload
        );
      } else {
        state.selectedItems.push(action.payload);
      }
    },
    claearSelection(state) {
      state.selectedItems = [];
    },
  },
});

export const { toggleItem, claearSelection } = todosSlice.actions;
export default todosSlice.reducer;
