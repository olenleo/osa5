import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Initial test for blog rendering',
  author: 'Leo Niemi',
  likes: 3,
  url: 'https://placeholder.fi'
}
const user = userEvent.setup()
test('renders title', () => {

  render(<Blog blog={blog} />)
  const element = screen.getByText('Initial test for blog rendering')
  const likes = screen.queryByText('Likes')
  const author = screen.queryByText('Author')
  const url = screen.queryByText('Link')
  expect(likes).toBeNull()
  expect(author).toBeNull()
  expect(url).toBeNull()
})

test('clicking \'like\' twice calls eventhandler twice', async () => {
  const mockHandler = jest.fn()
  
  render(<Blog blog ={blog} handleLike = {mockHandler}/>)
  const button = screen.getByText('show')
  await user.click(button)  
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('revealed toggleable content includes author, url and likes', async () => {
  render(<Blog blog={blog} />)
  const button = screen.getByText('show')
  await user.click(button)
  const likes = screen.getByText('Likes: 3')
  const url = screen.getByText('https://placeholder.fi')
})