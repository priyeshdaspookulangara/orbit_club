from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.on("console", lambda msg: print("BROWSER CONSOLE:", msg.type, msg.text))
        page.on("pageerror", lambda err: print("PAGE ERROR:", err))

        page.goto("http://localhost:3000/login")
        page.wait_for_timeout(1000)

        page.get_by_placeholder("e.g. ORB00000 or user@domain.com").fill("ORB00000")
        page.get_by_placeholder("••••••••").fill("Admin@123")
        page.get_by_role("button", name="Sign In to Portal").click()
        page.wait_for_timeout(3000)

        context.close()
        browser.close()

if __name__ == "__main__":
    run_verification()
