const initialState = () => ({})

export default {
  namespace: 'app',
  state: {
    ...initialState(),
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    reset(state, { payload }) {
      return {
        ...state,
        ...initialState()
      }
    },
  },
  effects: {},
}