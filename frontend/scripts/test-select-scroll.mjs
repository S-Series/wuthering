import { chromium } from "playwright";
import assert from "node:assert/strict";

const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5173/test");
  await page.evaluate(async () => {
    const { default: React } = await import("/node_modules/.vite/deps/react.js");
    const { default: ReactDOM } = await import("/node_modules/.vite/deps/react-dom_client.js");
    const { default: Select } = await import("/node_modules/.vite/deps/react-select.js");
    const { ResetScrollMenuList } = await import("/src/components/common/ResetScrollMenuList.tsx");
    const host = document.createElement("div");
    host.id = "scroll-regression";
    host.style.cssText = "position:fixed;inset:0;background:white;color:black;padding:20px;z-index:99999";
    document.body.append(host);
    const options = Array.from({ length: 60 }, (_, value) => ({ value, label: `Option ${value}` }));
    ReactDOM.createRoot(host).render(React.createElement(React.StrictMode, null,
      React.createElement(Select, { options, defaultValue: options[40], maxMenuHeight: 180,
        components: { MenuList: ResetScrollMenuList } })));
  });
  const input = page.locator("#scroll-regression input");
  const list = page.getByRole("listbox");
  await input.click();
  await page.waitForTimeout(100);
  assert.equal(await list.evaluate(node => node.scrollTop), 0);
  await list.hover();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  const before = await list.evaluate(node => node.scrollTop);
  assert.ok(before > 100, "Wheel must scroll the menu");
  const visible = await list.getByRole("option").evaluateAll(nodes => {
    const menu = nodes[0].parentElement.getBoundingClientRect();
    return nodes.find(node => {
      const box = node.getBoundingClientRect();
      return box.top > menu.top + 10 && box.bottom < menu.bottom - 10;
    }).textContent;
  });
  await page.getByRole("option", { name: visible, exact: true }).hover();
  await page.waitForTimeout(100);
  assert.equal(await list.evaluate(node => node.scrollTop), before, "Hover must preserve scroll");
  await page.getByRole("option", { name: visible, exact: true }).click();
  await list.waitFor({ state: "detached" });
  assert.ok((await page.locator("#scroll-regression").textContent()).includes(visible));
  await input.click();
  await page.waitForTimeout(100);
  assert.equal(await list.evaluate(node => node.scrollTop), 0, "Reopening resets to the top");
  await input.press("End");
  await page.waitForTimeout(100);
  assert.ok(await list.evaluate(node => node.scrollTop > 100), "Keyboard navigation must scroll");
  console.log("PASS: open, wheel, hover, select, reopen, keyboard navigation (StrictMode)");
} finally {
  await browser.close();
}
