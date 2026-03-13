import { useEffect, useRef, useState } from 'react';

import svgPaths from '../imports/svg-z6gcb8l8vr';

interface HomeProps {
  onCreateEvent: () => void;
  firstName: string;
}

const resourceCards = [
  {
    title: 'Digital Growth Guide for Community Events',
    source: 'Georim',
    author: 'Growth Team',
  },
  {
    title: 'Safety Playbook for High-Touch Experiences',
    source: 'Georim',
    author: 'Operations Team',
  },
  {
    title: '10 Proven Ways to Fill Your Next Georim Event',
    source: 'Georim',
    author: 'Organizer Success',
  },
];

const academyCourses = [
  {
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    time: '23 min',
    title: 'Build Your Event Page',
    desc: 'Learn how to structure a high-converting Georim event page with the right title, imagery, and ticket setup.',
  },
  {
    img: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=600&q=80',
    time: '7 min',
    title: 'Connect Payouts',
    desc: 'Set up your payout destination so ticket revenue flows smoothly once your event is live.',
  },
  {
    img: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=600&q=80',
    time: '14 min',
    title: 'Order Confirmation Essentials',
    desc: 'Share arrival details, parking notes, check-in instructions, and what guests should expect.',
  },
  {
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    time: '12 min',
    title: 'Refund Settings',
    desc: 'Create a refund policy that feels clear to attendees and easy for your team to manage.',
  },
  {
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
    time: '5 min',
    title: 'Attendee Messaging',
    desc: 'Send polished updates before, during, and after the event so guests always know what comes next.',
  },
  {
    img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    time: '8 min',
    title: 'Check-In Operations',
    desc: 'Prepare your on-site team for scanning, entry flow, and real-time attendee support in Georim.',
  },
  {
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    time: '20 min',
    title: 'Email Campaign Best Practices',
    desc: 'Use launch, reminder, and last-call sequences to increase attendance without spamming your audience.',
  },
  {
    img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    time: '10 min',
    title: 'Organic Social Strategy',
    desc: 'Turn your event into a content engine with teaser clips, countdowns, and community-driven posts.',
  },
  {
    img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=80',
    time: '15 min',
    title: 'Launch Paid Social Campaigns',
    desc: 'Build focused paid campaigns that reach the right attendees and convert while your budget stays efficient.',
  },
];

const helpTopics = [
  { icon: svgPaths.p6555600, iconExtra: svgPaths.p1536b480, title: 'Creating an event' },
  { icon: svgPaths.p113bfd80, iconExtra: svgPaths.p2e5f7280, title: 'Your account' },
  { icon: svgPaths.p3ed80480, title: 'Marketing an event' },
  { icon: svgPaths.p21939a00, iconExtra: [svgPaths.p1a435880, svgPaths.p47277f0], title: 'Payouts and billing' },
];

const accentViolet = '#7626c6';
const accentVioletTint = '#f4ecfb';
const accentVioletTintSoft = 'rgba(118, 38, 198, 0.08)';
const homeCardRadius = '28px';
const homeSubcardRadius = '22px';

const shellStyle = {
  minHeight: '100vh',
  width: '100%',
  background: 'var(--app-page-background)',
  overflowX: 'hidden',
} as const;

const mainStyle = {
  maxWidth: '1470px',
  margin: '0 auto',
  padding: '60px 122px',
  width: '100%',
  minWidth: 0,
} as const;

const panelStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #eeedf2',
  borderRadius: homeCardRadius,
  padding: '24px',
} as const;

const mutedPanelStyle = {
  backgroundColor: '#f8f7fa',
  borderRadius: homeSubcardRadius,
  padding: '24px',
} as const;

const transparentPanelStyle = {
  background: 'transparent',
  borderRadius: homeCardRadius,
  padding: '24px',
} as const;

const iconTileStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
} as const;

const checklistCircleStyle = {
  border: '1px solid #dbdae3',
  borderRadius: '11px',
  width: '22px',
  height: '22px',
  flexShrink: 0,
  marginTop: '4px',
} as const;

export function Home({ onCreateEvent, firstName }: HomeProps) {
  const academyViewportRef = useRef<HTMLDivElement>(null);
  const [academyCardWidth, setAcademyCardWidth] = useState(0);

  useEffect(() => {
    const viewport = academyViewportRef.current;
    if (!viewport || typeof ResizeObserver === 'undefined') return;

    const updateCardWidth = () => {
      const viewportWidth = viewport.clientWidth;
      const gap = 16;
      const nextWidth = Math.floor((viewportWidth - gap * 2) / 3);

      setAcademyCardWidth(Math.max(180, nextWidth));
    };

    updateCardWidth();

    const resizeObserver = new ResizeObserver(updateCardWidth);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="home-page w-full" style={shellStyle}>
      <main style={mainStyle}>
        <h1 aria-label={`Welcome ${firstName}`} className="ui-page-title ui-type-section mb-12" style={{ color: '#39364f' }}>
          Hello there, {firstName}
        </h1>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'minmax(0, 1.32fr) 230px',
            alignItems: 'start',
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div style={transparentPanelStyle}>
                <div className="flex flex-col items-center text-center">
                  <div style={iconTileStyle}>
                    <svg aria-hidden="true" viewBox="0 0 32 32" style={{ width: '32px', height: '32px' }}>
                      <path d={svgPaths.p1b4d00} fill={accentViolet} />
                    </svg>
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: '20px',
                      lineHeight: '28px',
                      fontWeight: 600,
                      color: '#1e0a3c',
                    }}
                  >
                    Start from scratch
                  </h3>
                  <p className="mb-6" style={{ fontSize: '14px', color: '#39364f' }}>
                    Add your event details, create ticket types, and configure recurring moments from one
                    Georim workflow.
                  </p>
                  <button type="button" onClick={onCreateEvent} className="home-action-button home-action-button--outline">
                    Create event
                  </button>
                </div>
              </div>

              <div style={transparentPanelStyle}>
                <div className="flex flex-col items-center text-center">
                  <div style={iconTileStyle}>
                    <svg aria-hidden="true" viewBox="0 0 32 32" style={{ width: '32px', height: '32px' }}>
                      <path d={svgPaths.p330dac70} fill={accentViolet} />
                    </svg>
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: '20px',
                      lineHeight: '28px',
                      fontWeight: 600,
                      color: '#1e0a3c',
                    }}
                  >
                    Create my event faster with Geo AI
                  </h3>
                  <p className="mb-6" style={{ fontSize: '14px', color: '#39364f' }}>
                    Answer a few quick prompts and generate an event draft you can refine in minutes
                    instead of hours.
                  </p>
                  <button type="button" onClick={onCreateEvent} className="home-action-button home-action-button--outline">
                    Create with Geo AI
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6" style={{ ...panelStyle, minWidth: 0, overflow: 'hidden' }}>
              <h2
                className="mb-4"
                style={{
                  fontSize: '30px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: '#1e0a3c',
                }}
              >
                Your checklist
              </h2>
              <p
                className="mb-8"
                style={{
                  fontSize: '17.4px',
                  lineHeight: '24px',
                  color: '#39364f',
                }}
              >
                We make it easier to launch standout Georim experiences. Here&apos;s how to start.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div style={checklistCircleStyle} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="mb-1" style={{ fontSize: '14px', fontWeight: 500, color: accentViolet }}>
                          Create event
                        </h3>
                        <p style={{ fontSize: '12px', color: '#39364f' }}>
                          Publish an event to reach communities, collaborators, and guests across Georim.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onCreateEvent}
                        className="home-action-button home-action-button--primary flex items-center gap-2"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                          <path clipRule="evenodd" d={svgPaths.p1e20d380} fill="#fff" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPaths.p34eb0e00} fill="#fff" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPaths.p106e6a80} fill="#fff" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPaths.p10355d00} fill="#fff" fillRule="evenodd" />
                          <path clipRule="evenodd" d={svgPaths.p39c4f980} fill="#fff" fillRule="evenodd" />
                        </svg>
                        Start here
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={checklistCircleStyle} />
                  <div>
                    <h3 className="mb-1" style={{ fontSize: '14px', fontWeight: 500, color: accentViolet }}>
                      Set up your organizer profile
                    </h3>
                    <p style={{ fontSize: '12px', color: '#39364f' }}>
                      Highlight your brand with your organizer name, image, bio, and the story behind
                      your events.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div style={checklistCircleStyle} />
                  <div>
                    <h3 className="mb-1" style={{ fontSize: '14px', fontWeight: 500, color: accentViolet }}>
                      Add your payout details
                    </h3>
                    <p style={{ fontSize: '12px', color: '#39364f' }}>
                      Connect your bank account so Georim can route future ticket revenue without delay.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6" style={{ ...panelStyle, minWidth: 0, overflow: 'hidden' }}>
              <div className="mb-6 flex items-center justify-between">
                <h2
                  style={{
                    fontSize: '30px',
                    lineHeight: '40px',
                    fontWeight: 700,
                    color: '#1e0a3c',
                  }}
                >
                  Top resources for you
                </h2>
                <button
                  type="button"
                  className="home-link-button home-link-button--large"
                >
                  Visit Georim Blog
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {resourceCards.map((resource) => (
                  <div key={resource.title} style={mutedPanelStyle}>
                      <div className="mb-4 flex items-start gap-3">
                      <img
                        src="/images/collasible%20logo.svg"
                        alt=""
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px', flexShrink: 0, objectFit: 'contain' }}
                      />
                      <div>
                        <div className="mb-1" style={{ fontSize: '14px', color: '#39364f' }}>
                          {resource.source}
                        </div>
                        <div style={{ fontSize: '12px', color: '#39364f' }}>{resource.author}</div>
                      </div>
                    </div>
                    <h3
                      className="mb-4"
                      style={{
                        fontSize: '20px',
                        lineHeight: '24px',
                        fontWeight: 600,
                        color: '#39364f',
                      }}
                    >
                      {resource.title}
                    </h3>
                    <button
                      type="button"
                      className="home-link-button home-link-button--compact flex items-center gap-1"
                    >
                      <svg aria-hidden="true" viewBox="0 0 10.6667 13.3333" style={{ width: '16px', height: '16px' }}>
                        <path clipRule="evenodd" d={svgPaths.p24c28600} fill={accentViolet} fillRule="evenodd" />
                      </svg>
                      Read article
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6" style={panelStyle}>
              <div className="mb-6 flex items-center justify-between">
                <h2
                  style={{
                    fontSize: '30px',
                    lineHeight: '40px',
                    fontWeight: 700,
                    color: '#1e0a3c',
                  }}
                >
                  Level up your skills at Georim Academy
                </h2>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#6f7287' }}>Scroll to browse more</p>
              </div>

              <div ref={academyViewportRef} style={{ minWidth: 0, overflow: 'hidden', width: '100%' }}>
                <div
                  data-testid="academy-scroller"
                  className="home-academy-scroller flex"
                  style={{
                    display: 'flex',
                    gap: '16px',
                    minWidth: 0,
                    overscrollBehaviorX: 'contain',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    paddingBottom: '8px',
                    scrollSnapType: 'x proximity',
                    scrollbarColor: '#a9a8b3 #f3f1f7',
                    scrollbarGutter: 'stable',
                    scrollbarWidth: 'thin',
                    width: '100%',
                  }}
                >
                  {academyCourses.map((course) => (
                    <div
                      key={course.title}
                      className="overflow-hidden"
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid #eeedf2',
                        borderRadius: homeSubcardRadius,
                        display: 'flex',
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: `${academyCardWidth || 320}px`,
                        flexDirection: 'column',
                        maxWidth: `${academyCardWidth || 320}px`,
                        minWidth: `${academyCardWidth || 320}px`,
                        width: `${academyCardWidth || 320}px`,
                        scrollSnapAlign: 'start',
                      }}
                    >
                      <div style={{ height: '132px', overflow: 'hidden' }}>
                        <img
                          src={course.img}
                          alt={course.title}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg aria-hidden="true" viewBox="0 0 16 16" style={{ width: '16px', height: '16px' }}>
                              <path d={svgPaths.p5d4b800} fill="#39364F" />
                            </svg>
                            <span style={{ fontSize: '12px', color: '#6f7287' }}>COURSE</span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#6f7287' }}>{course.time}</span>
                        </div>
                        <h3
                          className="mb-2"
                          style={{
                            fontSize: '20px',
                            lineHeight: 'normal',
                            fontWeight: 600,
                            color: '#13002d',
                          }}
                        >
                          {course.title}
                        </h3>
                        <p
                          className="mb-3"
                          style={{
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#6f7287',
                          }}
                        >
                          {course.desc}
                        </p>
                        <button
                          type="button"
                          className="home-link-button home-link-button--compact"
                        >
                          View course
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6" style={panelStyle}>
              <h2
                className="mb-6"
                style={{
                  fontSize: '30px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: '#1e0a3c',
                }}
              >
                Community spotlight
              </h2>

              <div className="flex gap-6">
                <div className="shrink-0 overflow-hidden" style={{ width: '240px', height: '275px', borderRadius: homeSubcardRadius }}>
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80"
                    alt="Georim organizer spotlight"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: 600, color: accentViolet }}>
                    Meet Aiden
                  </h3>
                  <p
                    className="mb-3"
                    style={{
                      fontSize: '17.9px',
                      lineHeight: '20px',
                      fontWeight: 600,
                      color: '#39364f',
                    }}
                  >
                    &quot;Georim helps us move faster, tell a stronger story, and turn community momentum
                    into real attendance every single launch.&quot;
                  </p>
                  <p className="mb-6" style={{ fontSize: '12px', color: '#39364f' }}>
                    Aiden Brooks, Founder of Common Table Sessions
                  </p>
                  <button type="button" className="home-action-button home-action-button--outline" style={{ width: 'fit-content' }}>
                    Read article
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6" style={panelStyle}>
              <div className="mb-8 flex items-center">
                <h2
                  style={{
                    fontSize: '30px',
                    lineHeight: '40px',
                    fontWeight: 700,
                    color: '#1e0a3c',
                  }}
                >
                  How can we help?
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {helpTopics.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="home-topic-button cursor-pointer text-center"
                  >
                    <div
                      className="mx-auto mb-4 flex items-center justify-center"
                      style={{
                        backgroundColor: accentVioletTintSoft,
                        borderRadius: '48px',
                        width: '48px',
                        height: '48px',
                      }}
                    >
                      <svg aria-hidden="true" viewBox="0 0 31.2 31.2" style={{ width: '31.2px', height: '31.2px' }}>
                        <path clipRule="evenodd" d={item.icon} fill={accentViolet} fillRule="evenodd" />
                        {item.iconExtra &&
                          (Array.isArray(item.iconExtra) ? (
                            item.iconExtra.map((path) => (
                              <path key={path} clipRule="evenodd" d={path} fill={accentViolet} fillRule="evenodd" />
                            ))
                          ) : (
                            <path clipRule="evenodd" d={item.iconExtra} fill={accentViolet} fillRule="evenodd" />
                          ))}
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#1e0a3c' }}>{item.title}</h3>
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                ...panelStyle,
                background:
                  'radial-gradient(260px 160px at top right, rgba(118, 38, 198, 0.14) 0%, rgba(118, 38, 198, 0) 68%), linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 245, 252, 0.98) 100%)',
              }}
            >
              <div
                className="mb-4 flex items-center gap-2"
                style={{
                  width: 'fit-content',
                  borderRadius: '999px',
                  backgroundColor: accentVioletTint,
                  padding: '6px 12px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#3a3247' }}>Mobile app</span>
              </div>

              <h2
                className="mb-3"
                style={{
                  fontSize: '30px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: '#1e0a3c',
                }}
              >
                Download our Mobile App
              </h2>

              <p
                className="mb-6"
                style={{
                  fontSize: '17px',
                  lineHeight: '24px',
                  color: '#39364f',
                }}
              >
                Take event operations on the go.
              </p>

              <button type="button" className="home-action-button home-action-button--outline" style={{ width: 'fit-content' }}>
                Download
              </button>
            </div>
          </div>

          <div style={{ ...panelStyle, borderColor: '#efedf2' }}>
            <div
              className="mb-6 flex items-center gap-1"
              style={{
                backgroundColor: accentVioletTint,
                borderRadius: '8px',
                height: '24px',
                width: '124px',
                padding: '0 8px',
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" style={{ width: '16px', height: '16px' }}>
                <path d={svgPaths.p2cb97400} fill="#3A3247" />
              </svg>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#3a3247' }}>Get discovered</span>
            </div>

            <h2
              className="mb-4"
              style={{
                fontSize: '20px',
                lineHeight: '24px',
                fontWeight: 600,
                color: '#39364f',
              }}
            >
              Set up profile
            </h2>

            <p
              className="mb-4"
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#39364f',
              }}
            >
              Get discovered and your brand presence
            </p>

            <button
              type="button"
              className="home-link-button flex items-center gap-2"
            >
              Set up your profile
              <svg aria-hidden="true" viewBox="0 0 16 16" style={{ width: '16px', height: '16px' }}>
                <path d={svgPaths.p3d7cda00} fill={accentViolet} />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
