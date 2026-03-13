/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type HTMLAttributes } from 'react';
import {
  AlignLeft,
  Bold,
  CalendarDays,
  Check,
  Clock3,
  Globe2,
  ImagePlus,
  Italic,
  Link2,
  List,
  MapPin,
  Repeat2,
  Upload,
  Video,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

import { cn } from './lib/utils';

function createAppleIcon(Icon: LucideIcon) {
  const AppleIcon = forwardRef<SVGSVGElement, LucideProps>(function AppleIcon(
    { absoluteStrokeWidth = true, className, strokeWidth = 1.85, ...props },
    ref,
  ) {
    return (
      <Icon
        ref={ref}
        absoluteStrokeWidth={absoluteStrokeWidth}
        strokeWidth={strokeWidth}
        className={cn('shrink-0', className)}
        {...props}
      />
    );
  });

  AppleIcon.displayName = `Apple${Icon.displayName ?? 'Icon'}`;
  return AppleIcon;
}

export const AppleAlignLeft = createAppleIcon(AlignLeft);
export const AppleBold = createAppleIcon(Bold);
export const AppleCalendar = createAppleIcon(CalendarDays);
export const AppleCheck = createAppleIcon(Check);
export const AppleClock = createAppleIcon(Clock3);
export const AppleClose = createAppleIcon(X);
export const AppleGlobe = createAppleIcon(Globe2);
export const AppleImage = createAppleIcon(ImagePlus);
export const AppleItalic = createAppleIcon(Italic);
export const AppleLink = createAppleIcon(Link2);
export const AppleListBullet = createAppleIcon(List);
export const AppleMapPin = createAppleIcon(MapPin);
export const AppleRepeat = createAppleIcon(Repeat2);
export const AppleUpload = createAppleIcon(Upload);
export const AppleVideo = createAppleIcon(Video);

type AppleIconSurfaceProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'brand' | 'neutral' | 'blue' | 'green';
};

export function AppleIconSurface({
  children,
  className,
  tone = 'neutral',
  ...props
}: AppleIconSurfaceProps) {
  const toneClassName = {
    brand: 'text-[#6b3fb5] bg-[linear-gradient(180deg,#fcf9ff_0%,#f4ebff_100%)] border-[#eadcfb]',
    neutral: 'text-slate-600 bg-[linear-gradient(180deg,#ffffff_0%,#f6f7fb_100%)] border-white/80',
    blue: 'text-sky-700 bg-[linear-gradient(180deg,#f7fbff_0%,#eaf4ff_100%)] border-sky-100',
    green: 'text-emerald-700 bg-[linear-gradient(180deg,#fbfffd_0%,#edf9f3_100%)] border-emerald-100',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[18px] border shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.92),0_18px_38px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm',
        toneClassName,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
