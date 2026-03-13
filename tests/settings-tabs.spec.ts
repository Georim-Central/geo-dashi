import { expect, test } from "@playwright/test";

test("settings tabs render an active underline and hover highlight", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /^settings$/i }).click();

  const stickyHeader = page.locator(".glass-header");
  const tablist = page.getByRole("tablist");
  const profileTab = page.getByRole("tab", { name: /^profile$/i });
  const securityTab = page.getByRole("tab", { name: /^security$/i });

  await expect(stickyHeader).toBeVisible();
  await expect(tablist).toBeVisible();
  await expect(profileTab).toBeVisible();
  await expect(securityTab).toBeVisible();
  await page.waitForTimeout(350);

  const headerStyles = await stickyHeader.evaluate((element) => {
    const styles = getComputedStyle(element);

    return {
      height: styles.height,
      position: styles.position,
      top: styles.top,
      zIndex: styles.zIndex,
    };
  });

  const stickySubnavStyles = await tablist.evaluate((element) => {
    let current: HTMLElement | null = element.parentElement;

    while (current && !current.className.includes("sticky")) {
      current = current.parentElement;
    }

    if (!current) {
      return null;
    }

    const styles = getComputedStyle(current);

    return {
      position: styles.position,
      top: styles.top,
      zIndex: styles.zIndex,
    };
  });

  const beforeHover = await tablist.evaluate((element) => {
    const hoverLayer = element.children[0] as HTMLElement | undefined;
    const activeLayer = element.children[1] as HTMLElement | undefined;

    return {
      childTags: Array.from(element.children).map((child) => ({
        tag: child.tagName,
        className: (child as HTMLElement).className,
        inlineStyle: (child as HTMLElement).getAttribute("style"),
      })),
      hoverOpacity: hoverLayer ? getComputedStyle(hoverLayer).opacity : null,
      hoverWidth: hoverLayer ? getComputedStyle(hoverLayer).width : null,
      activeWidth: activeLayer ? getComputedStyle(activeLayer).width : null,
      activeHeight: activeLayer ? getComputedStyle(activeLayer).height : null,
      activeBackground: activeLayer ? getComputedStyle(activeLayer).backgroundColor : null,
    };
  });

  await securityTab.hover();
  await page.waitForTimeout(350);

  const afterHover = await tablist.evaluate((element) => {
    const hoverLayer = element.children[0] as HTMLElement | undefined;
    const activeLayer = element.children[1] as HTMLElement | undefined;
    const hoverRect = hoverLayer?.getBoundingClientRect();
    const activeRect = activeLayer?.getBoundingClientRect();

    return {
      hoverOpacity: hoverLayer ? getComputedStyle(hoverLayer).opacity : null,
      hoverWidth: hoverLayer ? getComputedStyle(hoverLayer).width : null,
      hoverBackground: hoverLayer ? getComputedStyle(hoverLayer).backgroundColor : null,
      hoverRectWidth: hoverRect?.width ?? 0,
      activeWidth: activeLayer ? getComputedStyle(activeLayer).width : null,
      activeHeight: activeLayer ? getComputedStyle(activeLayer).height : null,
      activeBackground: activeLayer ? getComputedStyle(activeLayer).backgroundColor : null,
      activeRectWidth: activeRect?.width ?? 0,
      activeRectHeight: activeRect?.height ?? 0,
    };
  });

  expect(Number.parseFloat(beforeHover.activeWidth ?? "0")).toBeGreaterThan(0);
  expect(Number.parseFloat(beforeHover.activeHeight ?? "0")).toBeGreaterThan(0);
  expect(headerStyles.position).toBe("sticky");
  expect(headerStyles.top).toBe("0px");
  expect(headerStyles.height).toBe("64px");
  expect(stickySubnavStyles?.position).toBe("sticky");
  expect(stickySubnavStyles?.top).toBe("0px");
  expect(Number.parseFloat(stickySubnavStyles?.zIndex ?? "0")).toBeLessThan(Number.parseFloat(headerStyles.zIndex ?? "0"));
  expect(afterHover.hoverOpacity).toBe("1");
  expect(Number.parseFloat(afterHover.hoverWidth ?? "0")).toBeGreaterThan(0);
  expect(afterHover.hoverRectWidth).toBeGreaterThan(0);
  expect(afterHover.activeRectWidth).toBeGreaterThan(0);
  expect(afterHover.activeRectHeight).toBeGreaterThan(0);
  expect(afterHover.activeBackground).not.toBe("rgba(0, 0, 0, 0)");
  expect(afterHover.hoverBackground).not.toBe("rgba(0, 0, 0, 0)");
});
