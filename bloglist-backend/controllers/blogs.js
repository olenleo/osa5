const router = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response) => {
  const notes = await Blog
    .find({})
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

router.post('/', async (request, response) => {
  console.log('Got a post!')
  if (!request.user) {
    console.log('!request.user')
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user
  console.log('Add by', user)
  const blog = new Blog({ ...request.body, user: user.id })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

router.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)
  console.log('user', request.user.toString())
  console.log('\nblogtoDelete', blogToDelete.toString())
  if (!blogToDelete ) {
    return response.status(204).end()
  } else if (request.user.id.toString() !== blogToDelete.id.toString()) {
    console.log(request.user.id.toString(), " - ", blogToDelete.user.toString(), request.user.id.toString()=== blogToDelete.user.toString())
    console.log('No match. Returning error:')
    return response.status(401).json({error: 'only the creator can delete a blog'})
  } else {
    console.log('Remove operation:')
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    console.log('\nDelete done.')
  }
})

router.put('/:id', async (request, response) => {
  
  const blog = request.body
  console.log(blog)
  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id, 
      blog, 
      { new: true, runValidators: true, context: 'query' }
    )
      
  response.json(updatedBlog)
})

module.exports = router