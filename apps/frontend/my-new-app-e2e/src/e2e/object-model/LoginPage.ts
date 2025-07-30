/// <reference types="cypress" />

class LoginPage{

     getUrl(){
       cy.wait(12000);
        return cy.visit('https://visitcloud.com/')
    }

    getBookDemo(){
      cy.wait(12000);
        return cy.contains('Book a demo').first();
    }
    getFirstName(){
       cy.wait(12000);
        return cy.get('[name="mf-listing-fname"]').first();
    }
    getLastName(){
        return cy.get('[name="mf-listing-lname"]').first();
    }
     getEmail(){
        return cy.get('[placeholder="Email Address "]').first();
    }
     getPhoneNumber(){
        return cy.get('[placeholder="Phone "]').first();
    }
    getCountry(){
   return cy.get('[class="mf-input mf-input-select css-2b097c-container"]').first();
    } 

    selectCountry(){
     this.getCountry().click().contains('India').click()
     

    }
    getEvent(){
        return cy.get('[name="mf-eventName"]').first();
    } 
    getVenu(){
        return cy.get('[name="mf-venue"]').first();
    }
     getAttendees(){
        return cy.get('[placeholder="How many people? "]').first();
    }
     getTextBox(){
        return cy.get('[name="mf-message"]').first();
    }
     getSubmitForm(){
        return cy.get('[class="metform-btn metform-submit-btn "]').first();
    }
     getSucess(expectedmessage:string){
        return cy.contains(expectedmessage).should('be.visible');
        cy.log('verified sucessmessage:'+expectedmessage);
    }

}
export default LoginPage;
