from playwright.sync_api import sync_playwright

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()

        # 1. Homepage
        page.goto("http://localhost:3000")
        page.wait_for_timeout(1000)

        # 2. Go to Register Page
        page.get_by_role("link", name="Join Network").click()
        page.wait_for_timeout(1500)

        # Fill Register Form
        page.get_by_placeholder("e.g. ORB00000").fill("ORB00000")
        page.wait_for_timeout(500)

        page.get_by_placeholder("e.g. Vikram Verma").fill("Rahul Dravid")
        page.wait_for_timeout(500)

        page.get_by_placeholder("vikram@example.com").fill("rahul.dravid@example.com")
        page.wait_for_timeout(500)

        page.get_by_placeholder("Minimum 6 characters").fill("Password123!")
        page.wait_for_timeout(500)

        page.get_by_role("button", name="🍦 French Vanilla").click()
        page.wait_for_timeout(500)

        page.get_by_placeholder("Full street address, city, state, pincode...").fill("15 Sports Complex Road, Bangalore")
        page.wait_for_timeout(500)

        # Submit registration
        page.get_by_role("button", name="Complete ₹6,000 Package Registration").click()
        page.wait_for_timeout(2500)

        # 3. Go to Member Dashboard
        page.get_by_role("link", name="Go to Member Dashboard").click()
        page.wait_for_timeout(2000)

        # Capture Dashboard Screenshot
        page.screenshot(path="/home/jules/verification/screenshots/verification.png")
        page.wait_for_timeout(1000)

        context.close()
        browser.close()

if __name__ == "__main__":
    run_verification()
