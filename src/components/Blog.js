import { useState } from 'react'

const Blog = ({ blog }) => {
  const [ showDetails, setShowDetails ] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailView = () => (
    <>
    <br/>{blog.url}
    <br/>likes {blog.likes}<button>like</button>
    <br/>{blog.user.name}
    </>
  )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} 
      <button onClick={toggleShowDetails}>
        {showDetails ? 'hide' : 'view'}
      </button>

      {showDetails ?  detailView() : null}
    </div>  
  )
}

export default Blog