import '../../support';

describe('Base test', () => {
  it('should have the correct title', () => {
    cy.visit('/')
      .get('h1')
      .should('contain', 'Welcome to demoapp');
  });
});
