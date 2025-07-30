Feature: logout to Visitcloud page

    Scenario: @C167925 User Logout Visitcloud page
    Given user open the Visitcloud Login Page
    When user click on the Book Demo Button
    And user enters first name and last name
    And user enters email address
    And user enters phone number 
    And user selects Country Name
    And user enters event name and venu
    And user enters number of attendees
    And user enters text message in how can we help textbox
    Then user clicks on submit form
    Then user should see the "Thank you for reaching out"