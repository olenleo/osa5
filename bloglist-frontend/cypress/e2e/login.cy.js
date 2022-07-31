
describe('Blog app login view', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = { username: 'Jasso Kissa 85', name: 'Leo', password: 'Sekret' }
    
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains("username")
    cy.contains("password")
    cy.contains("login")
    })
  it('Login works when given correct credentials', function() {
    cy.get("#username").type("Jasso Kissa 85")
    cy.get("#password").type("Sekret")
    cy.get("#login-button").click()
    cy.contains("\"Jasso Kissa 85\" logged in")
  })
  it('Login with faulty credentials', function() {
    cy.get("#username").type("Nonexistent")
    cy.get("#password").type("null")
    cy.get("#login-button").click()
    cy.get("#notification").contains("wrong credentials")
    .and('have.css', 'color','rgb(255, 0, 0)')
  })
})