import { expect, test, type Page } from '@playwright/test';

const visualScreens = [
  'today',
  'tasks',
  'habits',
  'finance',
  'health',
  'settings',
  'more',
  'dialog',
] as const;

const guardedSelectors = [
  'input',
  'select',
  'textarea',
  'button',
  '[role="dialog"]',
  'main',
  'form',
  'nav',
  'header',
  '[data-visual-container]',
].join(',');

type OverflowReport = {
  htmlOverflow: number;
  bodyOverflow: number;
  offenders: Array<{
    tag: string;
    label: string;
    left: number;
    right: number;
    width: number;
  }>;
};

const assertNoHorizontalOverflow = async (page: Page) => {
  const report = await page.evaluate<OverflowReport>((selector) => {
    const hasScrollableAncestor = (element: Element) => {
      let parent = element.parentElement;

      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        const overflowX = style.overflowX;
        const rect = parent.getBoundingClientRect();

        if (
          (overflowX === 'auto' || overflowX === 'scroll') &&
          rect.left >= -1 &&
          rect.right <= window.innerWidth + 1
        ) {
          return true;
        }

        parent = parent.parentElement;
      }

      return false;
    };

    const offenders = Array.from(document.querySelectorAll(selector))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element,
          rect,
        };
      })
      .filter(({ element, rect }) => {
        const isVisible = rect.width > 0 && rect.height > 0;
        const overflowsViewport = rect.left < -1 || rect.right > window.innerWidth + 1;
        return isVisible && overflowsViewport && !hasScrollableAncestor(element);
      })
      .slice(0, 10)
      .map(({ element, rect }) => ({
        tag: element.tagName.toLowerCase(),
        label:
          element.getAttribute('aria-label') ??
          element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) ??
          '',
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      }));

    return {
      htmlOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
      offenders,
    };
  }, guardedSelectors);

  expect(report.htmlOverflow, JSON.stringify(report, null, 2)).toBeLessThanOrEqual(1);
  expect(report.bodyOverflow, JSON.stringify(report, null, 2)).toBeLessThanOrEqual(1);
  expect(report.offenders, JSON.stringify(report, null, 2)).toEqual([]);
};

test.describe('Visual QA Gate', () => {
  test('auth flow keeps forms inside the viewport', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Entrar no Unio/i })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await page.getByRole('tab', { name: 'Cadastro' }).click();
    await expect(page.getByRole('button', { name: 'Criar conta' })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await page.getByRole('tab', { name: 'Magic link' }).click();
    await expect(page.getByRole('button', { name: 'Enviar link seguro' })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await page.getByRole('tab', { name: 'Senha' }).click();
    await page.getByRole('button', { name: 'Esqueci minha senha' }).click();
    await expect(page.getByRole('button', { name: 'Enviar recuperacao' })).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  for (const screen of visualScreens) {
    test(`logged area ${screen} keeps layout inside the viewport`, async ({ page }) => {
      await page.goto(`/?visual-qa=${screen}`);
      await expect(page.getByTestId('visual-qa-screen')).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});
