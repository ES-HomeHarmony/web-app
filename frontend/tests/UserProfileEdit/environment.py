from selenium import webdriver

def before_all(context):
    # Setup WebDriver
    context.driver = webdriver.Chrome()  # Adjust path if necessary

def after_all(context):
    # Teardown WebDriver
    context.driver.quit()
