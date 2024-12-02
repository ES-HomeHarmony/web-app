from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@given('the landlord is logged into the system')
def step_impl(context):
    context.browser.get("http://localhost:3000/dashboard")
    context.browser.set_window_size(1920, 976)
    try:
        # Wait for the login button to be visible and click it
        WebDriverWait(context.browser, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-1jpt7oq-MuiButtonBase-root-MuiButton-root"))
        ).click()
        
        # Enter credentials
        WebDriverWait(context.browser, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf #signInFormUsername"))
        ).send_keys("sct.saraalmeida@gmail.com")
        context.browser.find_element(By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf #signInFormPassword").send_keys("12345678_As")
        
        # Click submit button
        context.browser.find_element(By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf > .btn").click()

        # Ensure the dashboard is loaded
        WebDriverWait(context.browser, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".MuiGrid-root:nth-child(1) > .MuiBox-root > .MuiPaper-root > .MuiBox-root > .MuiTypography-root"))
        )
    except Exception as e:
        print(f"Error during login: {e}")
        raise e

@when('the landlord navigates to the dashboard')
def step_impl(context):
    context.browser.get("http://localhost:3000/dashboard")

@when('selects a house with pending expenses')
def step_impl(context):
    context.browser.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(1) > .MuiBox-root > .MuiPaper-root > .MuiBox-root > .MuiTypography-root").click()

@then('they should see a list of pending expenses')
def step_impl(context):
    pending_expenses = context.browser.find_elements(By.CSS_SELECTOR, ".css-inmv69")
    assert len(pending_expenses) > 0, "No pending expenses are displayed."

@given('the landlord is viewing the list of pending payments')
def step_impl(context):
    context.execute_steps("When the landlord navigates to the dashboard")
    context.execute_steps("When selects a house with pending expenses")

@when('the landlord clicks on details of a pending expense')
def step_impl(context):
    context.browser.find_element(By.CSS_SELECTOR, ".css-inmv69:nth-child(1)").click()

@then('the system should display the tenants name and payment status')
def step_impl(context):
    tenant_names = context.browser.find_elements(By.CSS_SELECTOR, ".MuiTypography-subtitle2")
    assert len(tenant_names) > 0, "No tenant names are displayed."
    for tenant in tenant_names:
        assert tenant.text != "", "Tenant name is missing."