import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('rendering a blog', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'title 100',
      author: 'first last',
      url: 'www.idonotexist.com',
    }

    container = render(<Blog blog={blog} />).container
  })

  test('renders it\'s title and author', () => {
    expect(container).toHaveTextContent('title 100')
    expect(container).toHaveTextContent('first last')
  })

  test('does not render it\'s url', () => {
    expect(container).not.toHaveTextContent('www.idonotexist.com')
    expect(container).not.toHaveTextContent('likes')
  })

  describe('and clicking on the view button', () => {
    test('renders the url and likes', () => {
      const button = screen.getByText('view')
      userEvent.click(button)

      expect(container).toHaveTextContent('www.idonotexist.com')
      expect(container).toHaveTextContent('likes')
    })
  })
})