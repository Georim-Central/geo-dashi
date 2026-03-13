import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Tabs as VercelTabs,
  TabsList as VercelTabsList,
  TabsTrigger as VercelTabsTrigger,
} from '../components/ui/vercel-tabs';

function ScrollTestShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-page-scroll-root data-testid="page-scroll-root" style={{ height: '240px', overflowY: 'auto' }}>
      <div style={{ minHeight: '1200px' }}>
        {children}
      </div>
    </div>
  );
}

describe('tab scroll reset behavior', () => {
  it('scrolls the shared tabs page root to the top when a tab is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ScrollTestShell>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollTestShell>
    );

    const scrollRoot = screen.getByTestId('page-scroll-root');
    const scrollTo = vi.fn();
    Object.defineProperty(scrollRoot, 'scrollTo', { value: scrollTo, configurable: true });

    await user.click(screen.getByRole('tab', { name: /reports/i }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('scrolls the vercel tabs page root to the top when a tab is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ScrollTestShell>
        <VercelTabs defaultValue="profile">
          <VercelTabsList>
            <VercelTabsTrigger value="profile">Profile</VercelTabsTrigger>
            <VercelTabsTrigger value="security">Security</VercelTabsTrigger>
          </VercelTabsList>
        </VercelTabs>
      </ScrollTestShell>
    );

    const scrollRoot = screen.getByTestId('page-scroll-root');
    const scrollTo = vi.fn();
    Object.defineProperty(scrollRoot, 'scrollTo', { value: scrollTo, configurable: true });

    await user.click(screen.getByRole('tab', { name: /security/i }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
