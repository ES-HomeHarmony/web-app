from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

@given("a landlord is on the dashboard page")
def step_impl(context):
    context.browser.get("http://localhost:3000/dashboard")
    context.browser.set_window_size(1749, 961)

@when('they click on the card to create a new house')
def step_impl(context):
    context.browser.find_element(By.ID, "createHouse").click()

@when('they fill in the form with valid house details')
def step_impl(context):
    wait = WebDriverWait(context.browser, 10)

    try:
        wait.until(EC.presence_of_element_located((By.ID, ":r1:")))
        context.browser.find_element(By.ID, ":r1:").send_keys("Casa Mario Sacramento")
        
        wait.until(EC.presence_of_element_located((By.ID, ":r2:")))
        context.browser.find_element(By.ID, ":r2:").send_keys("string")
        
        wait.until(EC.presence_of_element_located((By.ID, ":r3:")))
        context.browser.find_element(By.ID, ":r3:").send_keys("Rua Mario Sacramento")
        
        wait.until(EC.presence_of_element_located((By.ID, ":r4:")))
        context.browser.find_element(By.ID, ":r4:").send_keys("Gloria")
        
        wait.until(EC.presence_of_element_located((By.ID, ":r5:")))
        context.browser.find_element(By.ID, ":r5:").send_keys("Aveiro")
        
        # Zipcode field
        element = wait.until(EC.presence_of_element_located((By.ID, ":r6:")))
        actions = ActionChains(context.browser)
        actions.move_to_element(element).click().perform()
        element.send_keys("123456789")
    
    except Exception as e:
        print(f"Error locating element: {e}")
        print("Page source:", context.browser.page_source)
        raise

@when('they submit the form by clicking the Create House button')
def step_impl(context):
    context.browser.find_element(By.CSS_SELECTOR, ".css-iu1ahk-MuiButtonBase-root-MuiButton-root").click()

@then('they should see a confirmation that the house has been created')
def step_impl(context):
    # Verify that the new house appears on the dashboard
    new_house = context.browser.find_element(By.XPATH, "//*[contains(text(), 'Casa Mario Sacramento')]")
    assert new_house is not None

