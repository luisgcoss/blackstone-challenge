import React from 'react';

export type MultipleSelectionReducerAction =
  | { type: 'STOP_SELECTION_MODE' }
  | { type: 'TOGGLE_ITEM'; id: number }
  | { type: 'START_SELECTION_MODE'; initialId: number };

export interface MultipleSelectionState {
  isSelectionMode: boolean;
  selectedItems: Set<number>;
}

export function multiSelectionReducer(
  state: MultipleSelectionState,
  action: MultipleSelectionReducerAction
): MultipleSelectionState {
  switch (action.type) {
    case 'STOP_SELECTION_MODE':
      return {
        ...state,
        isSelectionMode: false,
        selectedItems: new Set(),
      };
    case 'START_SELECTION_MODE':
      if (state.isSelectionMode) {
        return state;
      }
      return {
        ...state,
        isSelectionMode: true,
        selectedItems: new Set([action.initialId]),
      };
    case 'TOGGLE_ITEM':
      if (!state.isSelectionMode) {
        return state;
      }

      const newSelectedItems = new Set(state.selectedItems);
      if (newSelectedItems.has(action.id)) {
        newSelectedItems.delete(action.id);
      } else {
        newSelectedItems.add(action.id);
      }

      return {
        isSelectionMode: newSelectedItems.size > 0,
        selectedItems: newSelectedItems,
      };
    default:
      throw new Error('Invalid action type');
  }
}

export function useMultipleSelectionReducer() {
  return React.useReducer(multiSelectionReducer, {
    isSelectionMode: false,
    selectedItems: new Set<number>(),
  });
}
