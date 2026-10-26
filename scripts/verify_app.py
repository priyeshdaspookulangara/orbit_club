from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()

        # Login as Admin
        page.goto("http://localhost:3000/login")
        page.wait_for_timeout(1000)

        page.get_by_placeholder("e.g. ORB00000 or user@domain.com").fill("ORB00000")
        page.get_by_placeholder("••••••••").fill("Admin@123")
        page.get_by_role("button", name="Sign In to Portal").click()
        page.wait_for_timeout(2500)

        # Screenshot Admin Suite with Sidebar
        page.screenshot(path="/home/jules/verification/screenshots/verification.png")
        page.wait_for_timeout(1000)

        context.close()
        browser.close()

if __name__ == "__main__":
    run_verification()
