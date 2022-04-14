import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<Blog /> updates parent state and calls onSubmit', () => {
  const addBlog = jest.fn()

  const { container } = render(<BlogForm addBlog={addBlog} />)

  const input = container.querySelector('#blogInput')
  const sendButton = screen.getByText('create')

  userEvent.type(input, 'testing a blog...' )
  userEvent.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing a blog...' )
})