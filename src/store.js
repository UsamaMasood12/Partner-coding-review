const TOGGLE = 'action/toggle';
const LOAD_TODOS = 'action/load_todos';
const SWAP_TODOS = 'action/swap';
const ADD_TODO = 'action/add_todo';
const EDIT_TODO = 'action/edit_description';
const DELETE_TODO = 'action/delete_todo';
const CLEAR_COMPLETED = 'action/clear_completed';

export {
  TOGGLE,
  LOAD_TODOS,
  SWAP_TODOS,
  ADD_TODO,
  EDIT_TODO,
  DELETE_TODO,
  CLEAR_COMPLETED,
};

export default function createStore() {
  let state = [];
  const subscribers = [];

  const getState = () => state;

  const subscribe = (subscriber) => subscribers.push(subscriber);

  const dispatch = (action) => {
    switch (action.type) {
      case TOGGLE: {
        const todo = state.find((item) => item.index === action.index);
        todo.completed = !todo.completed;
        break;
      }
      case LOAD_TODOS: {
        state = action.items;
        break;
      }
      case SWAP_TODOS: {
        // Get values
        const src = state[action.source];
        const dest = state[action.dest];

        // Swap positions
        state[action.source] = dest;
        state[action.dest] = src;

        // Update indexes
        dest.index = action.source;
        src.index = action.dest;
        break;
      }
      case ADD_TODO: {
        if (action.text.trim()) {
          const todo = {
            index: state.length,
            description: action.text,
            completed: false,
          };
          state.push(todo);
        }
        break;
      }
      case EDIT_TODO: {
        const todo = state[action.index];
        if (todo && action.text.trim()) {
          todo.description = action.text;
        }
        break;
      }
      case DELETE_TODO: {
        state = state.filter((todo) => todo.index !== action.index)
          .map((item, index) => ({ ...item, index }));
        break;
      }
      case CLEAR_COMPLETED: {
        state = state.filter((todo) => !todo.completed).map((item, index) => ({ ...item, index }));
        break;
      }
      default:
        break;
    }

    subscribers.forEach((subscriber) => subscriber());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}