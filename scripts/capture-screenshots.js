const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const BASE_URL = 'http://localhost:5173';
const EMAIL = 'screenshot@test.com';
const PASSWORD = 'Screenshot@123';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function screenshot(page, name, description) {
  const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`📸 Saved: ${name}.png — ${description}`);
}

async function main() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();
  console.log('\n🚀 EventEase Auth Screenshot Capture\n');

  // === LOGIN PAGE ===
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await sleep(2000);
  await screenshot(page, 'ss_01_login', 'Login page — clean form with EventEase branding');

  // === REGISTER PAGE ===
  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle', timeout: 10000 });
  await sleep(1500);
  await screenshot(page, 'ss_02_register', 'Registration page');

  // === PERFORM LOGIN ===
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 10000 });
  await sleep(1500);
  
  // Fill form — email input has type=text with name=email
  await page.locator('input[name="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await sleep(500);
  await page.locator('button[type="submit"], button:has-text("Login")').click();
  await sleep(4000); // wait for auth redirect

  const postLoginUrl = page.url();
  console.log(`Post-login URL: ${postLoginUrl}`);
  await screenshot(page, 'ss_03_post_login', 'Post-login redirect / home page');

  // === DISCOVERY PAGE ===
  await page.goto(`${BASE_URL}/discovery`, { waitUntil: 'networkidle', timeout: 12000 });
  await sleep(3000);
  await screenshot(page, 'ss_05_discovery', 'Discovery / event feed — hero section with search');

  // Scroll to see event cards
  await page.evaluate(() => window.scrollBy(0, 380));
  await sleep(1200);
  await screenshot(page, 'ss_06_discovery_cards', 'Discovery — event grid cards with categories');

  // === STUDENT DASHBOARD ===
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 12000 });
  await sleep(3000);
  await screenshot(page, 'ss_07_dashboard', 'Student dashboard — AI recommendations & registered events');

  // === ORGANIZER DASHBOARD ===
  await page.goto(`${BASE_URL}/organizer-dashboard`, { waitUntil: 'networkidle', timeout: 12000 });
  await sleep(3000);
  await screenshot(page, 'ss_08_organizer_dashboard', 'Organizer dashboard — event management with Close Event');

  // Hover over first card to show action icons
  try {
    const card = page.locator('[class*="group"]').first();
    if (await card.isVisible({ timeout: 3000 })) {
      await card.hover();
      await sleep(800);
      await screenshot(page, 'ss_09_organizer_card_hover', 'Organizer event card hover — action buttons visible');
    }
  } catch {}

  // === PROFILE PAGE ===
  await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle', timeout: 12000 });
  await sleep(3000);
  await screenshot(page, 'ss_10_profile', 'User profile — social stats, interests, posted events');

  // === CHAT PAGE ===
  await page.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle', timeout: 12000 });
  await sleep(3000);
  await screenshot(page, 'ss_11_chat', 'Real-time chat — channel list and message area');

  // === EVENT DETAIL PAGE ===
  await page.goto(`${BASE_URL}/discovery`, { waitUntil: 'networkidle', timeout: 10000 });
  await sleep(2000);
  await page.evaluate(() => window.scrollBy(0, 380));
  await sleep(1000);

  try {
    // Try clicking on an event card image or title
    const eventLink = page.locator('a[href*="/events/"]').first();
    if (await eventLink.isVisible({ timeout: 3000 })) {
      await eventLink.click();
      await sleep(3000);
      await screenshot(page, 'ss_12_event_detail', 'Event detail page — AI match score, registration, attendees');
    } else {
      // Try clicking any card
      await page.locator('img[alt]').first().click();
      await sleep(3000);
      await screenshot(page, 'ss_12_event_detail', 'Event detail page');
    }
  } catch (e) {
    console.log('  ⚠️ Could not open event detail:', e.message.slice(0,60));
  }

  // === HOME PAGE (logged in) ===
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 10000 });
  await sleep(2500);
  await screenshot(page, 'ss_04_home', 'Home page — EventEase landing with category search');

  await browser.close();
  console.log('\n✅ All authenticated screenshots captured!');
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith('ss_'));
  console.log(`📁 ${files.length} screenshots total:`);
  files.sort().forEach(f => console.log(`   ${f}`));
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
