const some = (state = 'Hello from Store', action) => {
  switch (action.type) {
    case 'SOME':
      return action.payload
    default:
      return state
  }
}

export default some
