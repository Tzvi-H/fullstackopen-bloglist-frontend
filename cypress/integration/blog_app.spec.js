describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Welcome Matti Luukkainen')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'Welcome Matti Luukkainen')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blogInput').type('a new cypress blog')
      cy.get('#authorInput').type('cypress')
      cy.get('#urlInput').type('cypress.com')
      cy.get('#createBlog').click()
      cy.contains('a new blog "a new cypress blog" by "cypress" added')
      cy.contains('a new cypress blog cypressview')
    })

    describe('and some blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'author 1', url: 'url1.com' })
        cy.createBlog({ title: 'second blog', author: 'author 2', url: 'url2.com' })
        cy.createBlog({ title: 'third blog', author: 'author 3', url: 'url3.com' })
      })

      it('one of those can be made important', function () {
        cy.contains('second blog').as('blog2').contains('view').click()
        cy.get('@blog2').contains('like').click()
        cy.get('@blog2').contains('likes 1')
      })

      it('blog can be deleted by owner', function() {
        cy.contains('third blog').as('blog3').contains('view').click()
        cy.get('@blog3').contains('remove').click()
        cy.get('html').should('not.contain', 'blog3')
        cy.contains('blog successfully deleted')
      })
    })
  })
})