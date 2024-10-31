from selenium import webdriver

def before_all(context):
    # Setup WebDriver
    print("Initializing WebDriver...")
    context.browser = webdriver.Chrome()  # Adjust path if necessary
    context.browser.implicitly_wait(10)

def after_all(context):
    # Teardown WebDriver
    context.browser.quit()
