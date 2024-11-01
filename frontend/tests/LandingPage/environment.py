from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def before_all(context):
    # Setup WebDriver
    print("Initializing WebDriver...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
    chrome_options.add_argument("--disable-gpu")  # Disable GPU for headless mode
    chrome_options.add_argument("--window-size=1920x1080")  # Set window size if required

    # Initialize browser with options
    context.browser = webdriver.Chrome(options=chrome_options)
    context.browser.implicitly_wait(10)

def after_all(context):
    # Teardown WebDriver
    context.browser.quit()
