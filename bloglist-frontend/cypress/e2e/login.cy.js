const { func } = require("prop-types")

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

describe('When logged in:', function() {
  beforeEach(function() {
    cy.login({username: 'Jasso Kissa 85', name: 'Leo', password: 'Sekret'})
  })
  after(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/resetBlogs')

  })
  it('A blog can be created', function() {
    cy.get('#togglable-button').click()
    cy.get('#titleField').type('Blog Title')
    cy.get('#urlField').type('url')
    cy.get('#writerField').type('Writer')
    cy.get('#submit-blog').click()
    cy.get("#notification").contains("Blog Title").and('have.css', 'color','rgb(0, 0, 0)')
  })
  it('A blog can be liked', function() {
    cy.contains('Blog Title').parent().find('button').click()
    cy.contains('Likes: 0')
    cy.contains('Like').parent().find('button').click()
    cy.get("#notification").contains("Liked Blog Title").and('have.css', 'color','rgb(0, 0, 0)')
    cy.contains('Likes: 1')

  })
  it('A blog can be deleted', function() {
    cy.contains('Blog Title').parent().find('button').click()
    cy.contains('Remove').click()
    cy.get("#notification").contains("Blog Title deleted").and('have.css', 'color','rgb(0, 0, 0)')

  })

})