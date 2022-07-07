import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
const mockHandler = jest.fn()
  const blog = {
    title: 'Initial test for blog rendering',
    author: 'Leo Niemi',
    toggleVisible : mockHandler
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Initial test for blog rendering')
  const likes = screen.queryByText('Likes')
  const author = screen.queryByText('Author')
  
  expect(likes).toBeNull()
  expect(author).toBeNull()
  
})