import { ReactNode } from 'react';

import { ProfileSection } from '@/types/navigation';

interface ProfileSettingsProps {
  activeSection: ProfileSection;
}

const profileSectionLayouts: Partial<Record<ProfileSection, () => ReactNode>> = {};

export function ProfileSettings({ activeSection }: ProfileSettingsProps) {
  const ActiveLayout = profileSectionLayouts[activeSection];
  return ActiveLayout ? <>{ActiveLayout()}</> : null;
}
