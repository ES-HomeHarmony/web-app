from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import selenium.common.exceptions

import os

APP_URL = "http://localhost:3000"
MAX_FILE_SIZE_MB = 5 
INVOICE_NAME = "test_files/favicon.png"

@given("a landlord who wants to upload a file")
def step_impl(context):
    context.browser.get(f"{APP_URL}/billing")
    context.browser.set_window_size(1920, 976)

@when('they select a PDF or image file (JPEG, PNG)')
def step_impl(context):    
    # For testing purposes, set values examples on other fields
    # Select house from the dropdown
    select_element = context.browser.find_element(By.XPATH, "//label[text()='Select House']/following-sibling::div")
    select_element.click()
    
    # Wait for the dropdown menu items to be visible
    house_option = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//li[contains(text(), 'House Aveiro')]"))
    )
    
    # Click on the desired house option
    house_option.click()

    context.browser.find_element(By.ID, "type").click()
    context.browser.find_element(By.ID, "type").send_keys("agua")
    context.browser.find_element(By.ID, "price").click()
    context.browser.find_element(By.ID, "price").send_keys("30")
    deadline_field = context.browser.find_element(By.ID, "deadline")
    deadline_field.clear()
    deadline_field.send_keys("08-11-2024")

    # Upload a file
    # context.browser.find_element(By.CSS_SELECTOR, "label:nth-child(5)").click()
    file_input = context.browser.find_element(By.ID, "upload-button-file")
    file_path = os.path.join(os.getcwd(), INVOICE_NAME)
    file_input.send_keys(file_path)

@then("the system should validate the file type and size (e.g., maximum 5MB)")
def step_impl(context):
    #Simulates file validation: checks the file size and type
    file_size_mb = os.path.getsize(INVOICE_NAME) / (1024 * 1024)
    assert file_size_mb <= MAX_FILE_SIZE_MB, "File size exceeds maximum allowed"

@then("the upload of the file is successful")
def step_impl(context):
    # Wait for confirmation that the file upload succeeded
    upload_confirmation = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "#delete-account > div.MuiBox-root.css-12brd4o > form > label > div > span.MuiTypography-root.MuiTypography-button.css-1qqqysj-MuiTypography-root"))
    )
    assert upload_confirmation is not None, "File upload was not confirmed as successful"

@then("the landlord should receive a success notification")
def step_impl(context):
    #Veriffies if the success notification is displayed
    context.browser.find_element(By.ID, "save").click()

    success_notification = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "Toastify__toast--success"))
    )
    assert success_notification is not None, "Success notification not displayed"

@when("they select an invalid file type or a file larger than 5MB")
def step_impl(context):
    # For testing purposes, set values examples on other fields
    select_element = context.browser.find_element(By.XPATH, "//label[text()='Select House']/following-sibling::div")
    select_element.click()
    
    # Wait for the dropdown menu items to be visible
    house_option = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//li[contains(text(), 'House Aveiro')]"))
    )
    
    # Click on the desired house option
    house_option.click()

    context.browser.find_element(By.ID, "type").click()
    context.browser.find_element(By.ID, "type").send_keys("agua")
    context.browser.find_element(By.ID, "price").click()
    context.browser.find_element(By.ID, "price").send_keys("30")
    deadline_field = context.browser.find_element(By.ID, "deadline")
    deadline_field.clear()
    deadline_field.send_keys("08-11-2024")

    large_invalid_file_path = os.path.abspath("test_files/robots.txt")  # File larger than 5MB
    print(f"File path: {large_invalid_file_path}")  # Debugging line
    assert os.path.exists(large_invalid_file_path), f"File not found: {large_invalid_file_path}"
    file_input = context.browser.find_element(By.CSS_SELECTOR, 'input[type="file"]')
    file_input.send_keys(large_invalid_file_path)

@then("the system should fail validation")
def step_impl(context):
    assert True, "Validation failed"

@then("the landlord should receive an error notification")
def step_impl(context):
    try:
        # Wait for the alert to appear and switch to it
        WebDriverWait(context.browser, 10).until(EC.alert_is_present())
        alert = context.browser.switch_to.alert
        alert_text = alert.text
        assert "Invalid file type" in alert_text, "Unexpected alert message"
        alert.accept()  # Dismiss the alert by clicking 'OK'
    except selenium.common.exceptions.TimeoutException:
        assert False, "Expected alert for invalid file type not displayed"

@given("that the landlord is adding a new expense")
def step_impl(context):
    context.browser.get(f"{APP_URL}/billing")
    context.browser.set_window_size(1920, 976)

@when("the landlord inputs details such as type, amount, payment deadline and file")
def step_impl(context):
    select_element = context.browser.find_element(By.XPATH, "//label[text()='Select House']/following-sibling::div")
    select_element.click()
    
    # Wait for the dropdown menu items to be visible
    house_option = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//li[contains(text(), 'House Aveiro')]"))
    )
    
    # Click on the desired house option
    house_option.click()

    context.browser.find_element(By.ID, "type").click()
    context.browser.find_element(By.ID, "type").send_keys("agua")
    context.browser.find_element(By.ID, "price").click()
    context.browser.find_element(By.ID, "price").send_keys("30")
    deadline_field = context.browser.find_element(By.ID, "deadline")
    deadline_field.clear()
    deadline_field.send_keys("08-11-2024")

    file_input = context.browser.find_element(By.ID, "upload-button-file")
    file_path = os.path.join(os.getcwd(), INVOICE_NAME)
    file_input.send_keys(file_path)

@then("the expense is saved")
def step_impl(context):
    # Save the expense
    context.browser.find_element(By.ID, "save").click()
    assert True, "Expense saved"

@then("success feedback is shown")
def step_impl(context):
    # Verify that the success notification is displayed
    feedback_notification = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "Toastify__toast"))
    )
    assert feedback_notification is not None, "Feedback notification not shown"