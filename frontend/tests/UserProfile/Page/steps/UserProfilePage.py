from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

@given('I am a registered user')
def step_given_registered_user(context):
    context.driver = webdriver.Chrome()  # Initialize the Chrome driver
    context.driver.get('http://localhost:3000/dashboard')  # Go directly to the login page

    # Perform login
    context.driver.find_element(By.ID, 'usernameFieldID').send_keys('your_username')  # Update with the actual username field ID
    context.driver.find_element(By.ID, 'passwordFieldID').send_keys('your_password')  # Update with the actual password field ID
    context.driver.find_element(By.ID, 'signInButton').click()  # Click the sign-in button
    
    time.sleep(20)  # Wait for login to complete (adjust as needed)

@when('I access the profile page')
def step_when_access_profile_page(context):
    context.driver.get('http://localhost:3000/profile')

@then('I should see my name and email')
def step_then_see_name_and_email(context):
    name_element = context.driver.find_element(By.CSS_SELECTOR, 'input[name="fullName"]')
    email_element = context.driver.find_element(By.CSS_SELECTOR, 'input[name="email"]')

    name_value = name_element.get_attribute('value')
    email_value = email_element.get_attribute('value')

    assert name_value != '', 'Name is not displayed'  # Check that the name is displayed
    assert email_value != '', 'Email is not displayed'  # Check that the email is displayed

    # Close the browser after the test is done
    context.driver.quit()
