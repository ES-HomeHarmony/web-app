from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@given("the landlord is on the contract upload page")
def step_open_contract_upload_page(context):
    context.driver = webdriver.Chrome()
    context.driver.get("http://localhost:3000/dashboard")
    context.driver.set_window_size(1920, 1080)
    context.driver.find_element(By.CSS_SELECTOR, "a:nth-child(4) .MuiBox-root").click()


@when("they select a house from the dropdown")
def step_select_house(context):
    dropdown = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".Mui-focused .notranslate"))
    )
    dropdown.click()
    context.driver.find_element(By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(1)").click()


@then("they see the tenants associated with that house")
def step_verify_tenants(context):
    tenants = WebDriverWait(context.driver, 10).until(
        lambda d: d.find_elements(By.CSS_SELECTOR, ".tenants-section .MuiTypography-root")
    )
    assert len(tenants) > 0, "No tenants displayed for the selected house"
    print(f"Tenants displayed: {[tenant.text for tenant in tenants]}")


@when("they see the file upload section")
def step_verify_file_upload_section(context):
    upload_section = WebDriverWait(context.driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".file-upload-info"))
    )
    assert upload_section, "File upload section is not visible"


@then('they should see the acceptable file formats "{formats}" and size "{size}"')
def step_verify_file_formats_and_size(context, formats, size):
    upload_section_text = context.driver.find_element(By.CSS_SELECTOR, ".file-upload-info").text
    assert formats in upload_section_text, f"Expected formats '{formats}' not found"
    assert size in upload_section_text, f"Expected size '{size}' not found"


@when('they upload a valid file with format "{format}" and size less than "{size}"')
def step_upload_valid_file(context, format, size):
    # Select a tenant
    context.driver.find_element(By.CSS_SELECTOR, "#tenant-select .notranslate").click()
    context.driver.find_element(By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(1)").click()

    # Upload the file
    context.driver.find_element(By.ID, "upload-button-file").send_keys("C:\\path\\to\\valid_file.pdf")
    context.driver.find_element(By.ID, "save").click()


@then('they see a success message "{message}"')
def step_verify_success_message(context, message):
    success_message = WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".toast-success"))
    ).text
    assert message in success_message, f"Expected success message '{message}' not displayed"


@when('they upload an invalid file with format "{format}" or size greater than "{size}"')
def step_upload_invalid_file(context, format, size):
    # Select a tenant
    context.driver.find_element(By.CSS_SELECTOR, "#tenant-select .notranslate").click()
    context.driver.find_element(By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(1)").click()

    # Upload the file
    context.driver.find_element(By.ID, "upload-button-file").send_keys("C:\\path\\to\\invalid_file.txt")
    context.driver.find_element(By.ID, "save").click()


@then('they see an error message "{message}"')
def step_verify_error_message(context, message):
    error_message = WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".toast-error"))
    ).text
    assert message in error_message, f"Expected error message '{message}' not displayed"


def after_scenario(context, scenario):
    context.driver.quit()
