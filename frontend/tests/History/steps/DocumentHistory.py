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

@when('selects a house with payed expenses')
def step_impl(context):
    context.browser.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(1) > .MuiBox-root > .MuiPaper-root > .MuiBox-root > .MuiTypography-root").click()
    pending_expense = WebDriverWait(context.browser, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".css-inmv69:nth-child(1)")))
    pending_expense.click()

@then('they should see an history of payed expenses')
def step_impl(context):
    expense_titles = context.browser.find_elements(By.CSS_SELECTOR, ".MuiBox-root ul li .MuiTypography-button")
    assert len(expense_titles) > 0, "No paid expenses are displayed."
    for expense in expense_titles:
        assert expense.text != "", "Expense title is missing."
        print(f"Expense found: {expense.text}")

@then('they should be able to access the documents')
def step_impl(context):
    pdf_buttons = context.browser.find_elements(By.CSS_SELECTOR, "#app > div.MuiBox-root.css-aim41u > div.MuiBox-root.css-1gyw1f7 > div:nth-child(3) > div > div > div > div.MuiBox-root.css-1415me3 > ul > li:nth-child(1) > div > span.MuiTypography-root.MuiTypography-button.css-1dxplkm-MuiTypography-root > span.MuiTypography-root.MuiTypography-button.css-1qqqysj-MuiTypography-root")
    assert len(pdf_buttons) > 0, "No PDF document buttons found."
    # for button in pdf_buttons:
    #     context.browser.execute_script("arguments[0].scrollIntoView();", button)
    #     button.click()  # Simulate clicking the PDF button to ensure it works
    #     WebDriverWait(context.browser, 5).until(lambda d: len(d.window_handles) > 1)
    #     context.browser.switch_to.window(context.browser.window_handles[-1])
    #     assert "pdf" in context.browser.current_url.lower(), "The document did not open as a PDF."
    #     print(f"PDF document opened successfully: {context.browser.current_url}")
    #     context.browser.close()
    #     context.browser.switch_to.window(context.browser.window_handles[0])