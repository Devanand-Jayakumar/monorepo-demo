import { getGreeting } from '../support/app.po';

describe('@org-informa/my-new-app-e2e', () => {
  beforeEach(() => cy.visit('https://visitcloud.com/contact-visit/'));

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.log('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains(/Welcome/);
  });
});
