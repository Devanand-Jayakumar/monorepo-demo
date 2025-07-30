/// <reference types="cypress" />
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../object-model/LoginPage';

const loginPage = new LoginPage()

Given('user open the Visitcloud Login Page',function()
{
    loginPage.getUrl()
})

When('user click on the Book Demo Button',function()
{
    loginPage.getBookDemo().click({force: true})

})


When('user enters first name and last name',function()
{
    loginPage.getFirstName().type('rajamohareddy')
     loginPage.getLastName().type('alavala')

})

When('user enters email address',function()
{
    loginPage.getEmail().type('rajmohana99@gmail.com')
})

When('user enters phone number',function()
{
    loginPage.getPhoneNumber().type('919493929292')
})

When('user selects Country Name',function()
{
    loginPage.selectCountry()
})

When('user enters event name and venu',function()
{
    loginPage.getEvent().type('exhibition')

    loginPage.getVenu().type('hyderabad')

})

When('user enters number of attendees',function()
{
    loginPage.getAttendees().type('7')
})

When('user enters text message in how can we help textbox',function()
{
    loginPage.getTextBox().type('informa conduct events')
})

Then('user clicks on submit form',function()
{
    loginPage.getSubmitForm().click()
})

Then('user should see the {string}',function(expectedmessage:string)
{
    loginPage.getSucess(expectedmessage)
})

