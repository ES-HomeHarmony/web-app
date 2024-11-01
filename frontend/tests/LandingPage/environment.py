from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def before_all(context):
    # Setup WebDriver
    print("Initializing WebDriver...")
    context.browser = webdriver.Chrome()  # Adjust path if necessary
    context.browser.implicitly_wait(10)
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    context.browser = webdriver.Chrome(options=chrome_options)

def after_all(context):
    # Teardown WebDriver
    context.browser.quit()
