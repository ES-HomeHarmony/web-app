from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@given('I am viewing my profile')
def step_given_viewing_profile(context):
    context.driver = webdriver.Chrome()  # Initialize the Chrome driver
    context.driver.get('http://localhost:3000/profile') 

    # Perform login with WebDriverWait
    # context.driver.find_element(By.ID, 'usernameFieldID').send_keys('your_username')  # Update with the actual username field ID
    # context.driver.find_element(By.ID, 'passwordFieldID').send_keys('your_password')  # Update with the actual password field ID
    # context.driver.find_element(By.ID, 'signInButton').click()  # Click the sign-in button

    # Wait for the profile page to load
    WebDriverWait(context.driver, 21).until(
        EC.url_contains('/profile')  # Wait until the URL contains /profile
    )

@when('I look at the screen')
def step_when_look_at_screen(context):
    # Optional: wait for specific elements to load, if necessary
    pass

@then('I should see a button to edit my information')
def step_then_see_edit_button(context):
    edit_button = context.driver.find_element(By.XPATH, '/html/body/div/div[4]/div[2]/div[2]/div[2]/div/div[1]/form/div[3]/button[1]')
    assert edit_button.is_displayed(), 'Edit button is not visible'

    # Close the browser after the test is done
    context.driver.quit()
