# landlord_expense_steps.py
from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

COGNITO_HOSTED_UI_URL = "https://homeharmony-es.auth.eu-north-1.amazoncognito.com/login"
APP_URL = "http://localhost:3000"
MAX_FILE_SIZE_MB = 5  # Tamanho máximo do ficheiro em MB
INVOICE_NAME = "sample_invoice.pdf"

@given("a landlord who wants to upload a file")
def step_impl(context):
    # Acede à página de despesas para o landlord
    context.browser.get(f"{APP_URL}/billing")
    context.browser.set_window_size(1920, 976)

@when('they select a PDF or image file (JPEG, PNG)')
def step_impl(context):
    # Carrega um ficheiro PDF de exemplo
    file_input = context.browser.find_element(By.CSS_SELECTOR, 'input[type="file"]')
    file_path = os.path.join(os.getcwd(), INVOICE_NAME)  # Substituir pelo caminho real do ficheiro
    file_input.send_keys(file_path)

@then("the system should validate the file type and size (e.g., maximum 5MB)")
def step_impl(context):
    # Simula a validação de ficheiro: confere o tamanho e tipo do ficheiro
    file_size_mb = os.path.getsize(INVOICE_NAME) / (1024 * 1024)
    assert file_size_mb <= MAX_FILE_SIZE_MB, "File size exceeds maximum allowed"

@then("the upload of the file is successful")
def step_impl(context):
    # Confirma que o upload foi efetuado com sucesso
    uploaded_file_name = context.browser.find_element(By.CSS_SELECTOR, 'span.uploaded-file-name').text
    assert uploaded_file_name == INVOICE_NAME, "File upload unsuccessful"

@then("the landlord should receive a success notification")
def step_impl(context):
    # Verifica se aparece a notificação de sucesso
    success_notification = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "Toastify__toast--success"))
    )
    assert success_notification is not None, "Success notification not displayed"

@when("they select an invalid file type or a file larger than 5MB")
def step_impl(context):
    # Carrega um ficheiro inválido (não-PDF e maior que 5MB)
    large_invalid_file_path = os.path.join(os.getcwd(), "invalid_file.txt")  # Substituir pelo caminho real do ficheiro
    file_input = context.browser.find_element(By.CSS_SELECTOR, 'input[type="file"]')
    file_input.send_keys(large_invalid_file_path)

@then("the system should fail validation")
def step_impl(context):
    # Confirma que a validação falha devido ao tipo ou tamanho do ficheiro
    error_message = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))
    )
    assert error_message is not None, "Error notification not displayed as expected"

@then("the landlord should receive an error notification")
def step_impl(context):
    # Verifica se aparece a notificação de erro
    error_notification = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "Toastify__toast--error"))
    )
    assert error_notification is not None, "Error notification not displayed"

@given("that the landlord is adding a new expense")
def step_impl(context):
    # Acede à página de despesas para o landlord
    context.browser.get(f"{APP_URL}/billing")
    context.browser.set_window_size(1920, 976)

@when("the landlord inputs details such as amount, category, and payment deadline")
def step_impl(context):
    # Preenche os campos de detalhes da despesa
    category_field = context.browser.find_element(By.XPATH, '//input[@aria-label="Expense Type"]')
    category_field.send_keys("Utilities")
    
    amount_field = context.browser.find_element(By.XPATH, '//input[@aria-label="Price"]')
    amount_field.send_keys("100")
    
    deadline_field = context.browser.find_element(By.XPATH, '//input[@type="date"]')
    deadline_field.send_keys("2024-12-01")

@then("the expense is saved")
def step_impl(context):
    # Confirma que o botão de salvar foi clicado com sucesso
    save_button = context.browser.find_element(By.XPATH, '//button[contains(text(), "Save Changes")]')
    save_button.click()
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "expense-entry"))
    )

@then("feedback is shown")
def step_impl(context):
    # Verifica a presença de feedback visual na página
    feedback_notification = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "Toastify__toast"))
    )
    assert feedback_notification is not None, "Feedback notification not shown"
