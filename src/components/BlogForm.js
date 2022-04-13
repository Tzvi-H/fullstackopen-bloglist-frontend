import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

  const createBlog = event => {
    event.preventDefault()

    const newBlogObject = {
      title,
      author,
      url
    }

    addBlog(newBlogObject)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={createBlog}>

      <div>
          title <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
          author: <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div>
          url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>

      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm