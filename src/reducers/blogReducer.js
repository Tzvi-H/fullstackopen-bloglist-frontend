const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "ADD_BLOG":
      return state.concat(action.data);
    default:
      return state
  }
};

export const blogsInit = blogs => {
  return {
    type: "INIT_BLOGS",
    data: blogs,
  };
}

export const blogsAdd = blog => {
  return {
    type: "ADD_BLOG",
    data: blog,
  };
}

export default blogReducer;
