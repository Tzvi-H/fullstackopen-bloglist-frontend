let blogs = {};

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', (blog) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  }).then(({ body }) => {
    blogs[blog.title] = body.id
  })
  cy.visit('http://localhost:3000')
})

Cypress.Commands.add('likeBlog', (blogTitle, likes) => {
  cy.request({
    url: `http://localhost:3003/api/blogs/${blogs[blogTitle]}`,
    method: 'PUT',
    body: { likes },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })
})