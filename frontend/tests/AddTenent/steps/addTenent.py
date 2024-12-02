from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# URLs for the application
APP_URL = "http://localhost:3000"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("the landlord is logged in and on the dashboard")
def step_impl(context):
    context.browser.get(DASHBOARD_URL)
    context.browser.set_window_size(1472, 774)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#createHouse"))
    )

@when("the landlord selects a house from the dropdown menu")
def step_impl(context):
    select_house = WebDriverWait(context.browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".MuiSelect-select"))
    )
    select_house.click()
    house_option = WebDriverWait(context.browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".MuiMenuItem-root"))
    )
    house_option.click()

@when("the landlord clicks on \"Add Tenants\"")
def step_impl(context):
    add_tenants_button = WebDriverWait(context.browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='Add Tenants']"))
    )
    add_tenants_button.click()

@then("a modal form appears")
def step_impl(context):
    modal_form = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "form[aria-label='Add Tenant Form']"))
    )
    assert modal_form is not None

@when("the landlord fills in the tenant's name \"Roberto\"")
def step_impl(context):
    name_field = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.NAME, "name"))
    )
    name_field.send_keys("Roberto")

@when("the landlord fills in the tenant's email \"teste2@teste.com\"")
def step_impl(context):
    email_field = context.browser.find_element(By.NAME, "email")
    email_field.send_keys("teste2@teste.com")

@when("the landlord fills in the monthly rent \"350\"")
def step_impl(context):
    rent_field = context.browser.find_element(By.NAME, "rent")
    rent_field.send_keys("350")

@when("the landlord clicks the \"Submit\" button")
def step_impl(context):
    submit_button = context.browser.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_button.click()

@then("the tenant is added successfully")
def step_impl(context):
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.MuiAlert-message"))
    )
    success_message = context.browser.find_element(By.CSS_SELECTOR, "div.MuiAlert-message").text
    assert "Tenant added successfully!" in success_message

@then("a success notification is shown")
def step_impl(context):
    success_notification = context.browser.find_element(By.CSS_SELECTOR, "div.MuiAlert-message")
    assert success_notification.is_displayed()
