describe('Blog app login view', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = { username: 'Jasso Kissa 85', name: 'Leo', password: 'Sekret' }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })
  xit('Login form is shown', function() {
    cy.contains("username")
    cy.contains("password")
    cy.contains("login")
    })
  xit('Login works when given correct credentials', function() {
    cy.get("#username").type("Jasso Kissa 85")
    cy.get("#password").type("Sekret")
    cy.get("#login-button").click()
    cy.contains("\"Jasso Kissa 85\" logged in")
  })
  xit('Login with faulty credentials displays error', function() {
    cy.get("#username").type("Nonexistent")
    cy.get("#password").type("null")
    cy.get("#login-button").click()
    cy.get("#notification").contains("wrong credentials").and('have.css', 'color','rgb(255, 0, 0)')
  })

})
function addBlog( title ) {
  cy.get('#togglable-button').click()
  cy.get('#titleField').type(title)
  cy.get('#urlField').type('url')
  cy.get('#writerField').type('writer')
  cy.get('#submit-blog').click()
}
describe('When logged in:', function() {
  beforeEach(function() {
    const user = { username: 'Jasso Kissa 85', name: 'Leo', password: 'Sekret' }
    const anotherUser = { username: 'Test-user', name: 'null', password: 'null' }
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', anotherUser) 
    cy.login({username: 'Jasso Kissa 85', name: 'Leo', password: 'Sekret'})
    addBlog('first blog')
    addBlog('second blog')
  })
  after(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/resetBlogs')
  })
  it('A blog can be created', function() {
    cy.get('#togglable-button').click()
    cy.get('#titleField').type('Unique-title')
    cy.get('#urlField').type('url field')
    cy.get('#writerField').type('writer field')
    cy.get('#submit-blog').click()
    cy.get("#notification").contains('Unique-title').and('have.css', 'color','rgb(0, 0, 0)')
  })

  it('A blog can be liked', function() {
    cy.contains('first blog').parent().find('button').click()
    cy.contains('Likes: 0')
    cy.contains('Like').parent().find('button').click()
	cy.wait(500)
    cy.get("#notification").contains("Liked first blog").and('have.css', 'color','rgb(0, 0, 0)')
    cy.contains('Likes: 1')

  })

  it('Blogs are ordered by likes', function() {
	cy.get('.bloglist').find('div.blogListingField').eq(0).should('contain', 'first blog')
	cy.contains('second blog').parent().find('button').click()
    cy.contains('Like').parent().find('button').click()
	cy.wait(500)
	cy.contains('Like').parent().find('button').click()
	cy.wait(500)
	cy.get('.bloglist').find('div.blogListingField').eq(0).should('contain', 'second blog')
	cy.get('.bloglist').find('div.blogListingField').eq(1).should('contain', 'first blog')
  })

 
  it('Blogs can not be deleted by other users', function() {
    cy.contains('logout').click()
    cy.login({username: 'Test-user', name: 'null', password: 'null'})
    cy.contains('first blog').parent().find('button').click()
    cy.contains('Remove').click()
	cy.get("#notification").contains('first blog already removed from server?').and('have.css', 'color','rgb(255, 0, 0)')
    cy.wait(500)
    cy.contains('first blog')

  })

  it('A blog can be deleted', function() {
    cy.contains('first blog').parent().find('button').click()
    cy.contains('Remove').click()
    cy.get("#notification").contains("first blog deleted").and('have.css', 'color','rgb(0, 0, 0)') 
  })



})