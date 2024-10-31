from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests

# Base URL for the profile page
PROFILE_PAGE_URL = "http://localhost:3000/profile"

@given("I am at the profile page")
def step_impl(context):
    # Open the profile page
    context.browser.get(PROFILE_PAGE_URL)

@when("I see my personal information on the page")
def step_impl(context):
    # Wait for profile fields to load
    WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.NAME, "fullName"))
    )

@then("I should see a button to edit my information")
def step_impl(context):
    # Check for the visibility of the "Edit" button
    edit_button = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Edit')]"))
    )
    assert edit_button.is_displayed(), "Edit button is not visible"

@given("I am on my profile page")
def step_impl(context):
    # Ensure we are on the profile page
    context.browser.get(PROFILE_PAGE_URL)
    WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.NAME, "fullName"))
    )

@when("I update my profile")
def step_impl(context):
    # Update profile fields with valid data
    name_field = context.browser.find_element(By.NAME, "fullName")
    name_field.clear()
    name_field.send_keys("New Name")

    email_field = context.browser.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys("new.email@example.com")

    # Click the "Save Changes" button
    save_changes = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located(((By.XPATH, "//button[contains(text(), 'Save Changes')]")))
    )
    assert save_changes.click(), "Save changes button is not clicable"

@then("I should see a confirmation message")
def step_impl(context):
    # Wait for and check the presence of the success Snackbar message
    success_snackbar = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(text(), 'Profile updated successfully!')]"))
    )
    assert success_snackbar.is_displayed(), "Success message not visible"

# @when("I attempt to update my profile with invalid data")
# def step_impl(context):
#     # Attempt to update profile fields with invalid data
#     email_field = context.browser.find_element(By.NAME, "email")
#     email_field.clear()
#     email_field.send_keys("invalid-email")  # Invalid email format

#     # Click the "Save Changes" button
#     save_button = context.browser.find_element(By.XPATH, "//button[contains(text(), 'Save Changes')]")
#     save_button.click()

# @then("I should see an error message")
# def step_impl(context):
#     # Wait for and check the presence of the error Snackbar message
#     error_snackbar = WebDriverWait(context.browser, 10).until(
#         EC.visibility_of_element_located((By.XPATH, "//div[contains(text(), 'Failed to update profile.')]"))
#     )
#     assert error_snackbar.is_displayed(), "Error message not visible"
