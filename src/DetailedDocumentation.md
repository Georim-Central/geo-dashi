# Georim - Comprehensive Event Management Platform

## Overview
Georim is a full-featured Eventbrite clone with an enhanced Community section for event-native communication and engagement. The platform includes 6 major sections: Event Creation & Setup, Ticketing Strategy, Order Options & Registration, Marketing & Growth, Reporting & Analytics, and On-Site & Team Management, plus a comprehensive Community section.

---

## Brand Identity

### Colors
- **Primary Purple**: `#7626c6` (main actions, highlights, active states)
- **Dark Purple**: `#5f1fa3` (hover states, emphasis)
- **Channel Accent Colors**:
  - Orange: Announcements
  - Blue: Updates, Info/FAQ, Analytics
  - Green: Event Chat
  - Purple: Event Market, Host Team
  - Red: Safety & Reports
  - Yellow: Moderation

### Typography
- **Font**: SF Pro (system default)
- Tailwind CSS v4 for styling

---

## Navigation & Architecture

### Sidebar Navigation
- **Collapsible**: Click to expand/collapse
- **Context Switching**: Toggle between Organization and Event views
- **Live Mode Toggle**: Purple when active, dims non-critical channels
- **Activity Log Button**: Direct access to chronological event log

### Channel Structure

#### Public Channels (6)
1. **Announcements** 📣
   - Critical event updates
   - Push notifications
   - Severity levels (normal, important, emergency)
   - Targeting options (all, VIP, staff, early birds)
   - Read statistics tracking

2. **Updates** 🔄
   - Real-time operational changes
   - Auto-update triggers
   - Impact tracking
   - System-generated notifications

3. **Event Chat** 💬
   - Free-form attendee communication
   - Tagged replies functionality
   - Reply indicators and chains
   - Moderation controls (slow mode, auto-ban)
   - Activity insights (messages/min, peak time, reply rate)

4. **Info / FAQ** ℹ️
   - 4 categories: General, Tickets, Venue, Safety, Accessibility
   - Category filtering
   - View count tracking
   - Last updated timestamps
   - Top searches sidebar
   - Total views statistics

5. **Event Market** 🛍️
   - Merchandise sales
   - Real product images (via Unsplash)
   - Stock management (available, low-stock, paused, sold-out)
   - Interest tracking
   - Claim fulfillment
   - Vendor integration
   - Auto-close timing

6. **Safety & Reports** 🚨
   - Incident reporting
   - Severity levels (high, medium, low)
   - Status tracking (Under Review, Resolved)
   - Assignment system
   - Emergency contacts
   - Response time metrics
   - Resolution rate tracking

#### Private Channels (4)
Owner-only access with purple lock badge:

1. **Host Team** 💼
   - Internal task management
   - Priority levels (high, medium, low)
   - Assignment tracking
   - Due dates
   - Completion status

2. **Moderation** 🛡️
   - Action log (warned, removed, banned)
   - Rule configuration
   - Auto-ban on spam
   - Slow mode settings
   - Blocked words management

3. **Engagement Analytics** 📊
   - Total messages count
   - Active users tracking
   - Engagement rate percentage
   - Top engaged attendees
   - Growth trends

4. **Community Settings** ⚙️
   - General settings (name, description, status)
   - Channel permissions (enable/disable channels)
   - Moderation settings (auto-moderate, slow mode, blocked words)
   - Notification preferences
   - Danger zone (archive, delete)

5. **Activity Log** 📋
   - Chronological timeline
   - All community actions
   - Color-coded by category
   - Actor tracking
   - Impact metrics
   - Filter and export options

---

## Operational UI Enhancements

### 1. Live Event Mode
**Purpose**: Focus on critical channels during live events

**Features**:
- Purple toggle switch in sidebar
- Pulsing lightning icon when active
- Non-critical channels dim to 40% opacity
- Critical channels highlighted with:
  - Purple ring border (`ring-2 ring-[#7626c6]`)
  - Pulse animation
  - Emphasized background

**Critical Channels**:
- Safety & Reports
- Updates
- Event Chat
- Event Market

**Interaction**:
- Click toggle to enable/disable
- Instant visual feedback
- Smooth transitions

---

### 2. Cross-Channel Alert Strip
**Purpose**: Surface urgent issues without channel switching

**Location**: Top of center panel (below header)

**Alert Types**:
1. **Safety** 🚨
   - Red icon and badge
   - "New safety report requires attention"
   
2. **Market** 🛍️
   - Purple icon and badge
   - "AfroFest Hat is low on stock (5 remaining)"
   
3. **Chat** 💬
   - Blue icon and badge
   - "Message spike detected: 47 messages in last 5 minutes"

**Features**:
- Gradient background (red-50 to orange-50)
- White cards with shadow
- Timestamp display
- "View" button → navigates to channel
- "X" button → dismisses alert
- State persisted during session

**Visual Design**:
```css
Background: from-red-50 to-orange-50
Cards: bg-white, rounded-lg, shadow-sm
Icons: color-coded (red/purple/blue)
```

---

### 3. Suggested Actions Panel
**Purpose**: Provide contextual guidance to event owners

**Location**: Right sidebar (bottom section)

**Channel-Specific Suggestions**:

**Announcements**:
- "Send a thank you announcement" → Create
- "Notify VIP attendees about exclusive content" → Send

**Event Chat**:
- "Enable slow mode during peak hours" → Enable
- "Pin important messages to the top" → Pin

**Info / FAQ**:
- "Update FAQ based on recent questions" → Update
- "Add accessibility information" → Add

**Event Market**:
- "Restock low inventory items" → Restock
- "Promote popular merchandise" → Promote

**Safety & Reports**:
- "Assign pending reports to team" → Assign
- "Notify attendees of safety updates" → Notify

**Visual Design**:
- Blue-50 background
- Blue-200 border
- Lightbulb icon
- White suggestion cards
- Purple action links
- Hover shadow effect

---

### 4. Event Activity Log
**Purpose**: Provide audit trail of all community actions

**Access**: Dedicated button in sidebar

**Sample Activities** (6 entries):

1. **Gates Open Time Announcement Sent** 📣
   - Category: Announcement (orange)
   - Actor: Sarah Johnson
   - Time: 2 hours ago
   - Impact: 847 users

2. **New Merchandise Item Added** 🛍️
   - Category: Market (purple)
   - Actor: Mike Chen
   - Time: 3 hours ago

3. **Safety Report Resolved** 🚨
   - Category: Safety (red)
   - Actor: Medical Team Lead
   - Time: 4 hours ago
   - Impact: 1 user

4. **Chat Slow Mode Enabled** 🛡️
   - Category: Moderation (yellow)
   - Actor: Alex Rodriguez
   - Time: 5 hours ago
   - Impact: 89 users

5. **Parking Lot B Status Update** 🔄
   - Category: Update (blue)
   - Actor: System
   - Time: 6 hours ago
   - Impact: 142 users

6. **Welcome Announcement Sent** 📣
   - Category: Announcement (orange)
   - Actor: Sarah Johnson
   - Time: 1 day ago
   - Impact: 823 users

**Features**:
- Timeline view with vertical connector lines
- Color-coded circular badges
- Category tags
- Actor and timestamp
- Impact count
- Filter button (narrow by category)
- Export button (download full log)
- Read-only access

---

### 5. Event Wrap-Up Card
**Purpose**: Streamline post-event closure

**Trigger**: Only shows when event status = "Ended"

**Location**: Top of center panel (blue banner)

**Actions** (6 buttons):

1. **Lock Chat** 🔒
   - Prevents new messages after event ends
   
2. **Archive Community** 📦
   - Moves community to archived state
   
3. **Keep Market Open (24h)** ⏰
   - Allows post-event merchandise sales
   
4. **Send Recap** 📧
   - Sends thank you + summary to attendees
   
5. **Export All Reports** ⬇️ (Primary Action)
   - Downloads safety reports, analytics, activity logs
   - Purple background button

**Demo Controls**:
- Yellow banner in sidebar
- Toggle buttons: Upcoming / Live / Ended
- Updates event badge and shows/hides wrap-up card

**Visual Design**:
```css
Background: bg-blue-50, border-blue-200
Card: bg-white, border-2 border-blue-300
Icon: CheckCircle in blue-100 circle
Grid: 2 columns
Export: Full-width purple button
```

---

## Mock Data

### Announcements (2)
1. Gates Open Time Changed (important, 2 hours ago, 87.3% seen)
2. Welcome to AfroFest 2026! (normal, 1 day ago, 94.1% seen)

### Updates (2)
1. Parking Lot B Now Full (system, 15 mins ago, 142 impacted)
2. Stage 2 Performance Delayed (schedule, 1 hour ago, 823 impacted)

### Chat Messages (3)
1. Sarah M.: "Is there a water refill station near Stage 3?" (2m ago)
2. Mike J.: Reply to Sarah - "Yes! There are two stations..." (1m ago)
3. Emily R.: "What time does the headliner go on? So excited! 🎵" (Just now)

### FAQ (4)
1. **General**: "What time does the event start?" (247 views)
2. **Tickets**: "Can I transfer my ticket to someone else?" (189 views)
3. **Venue**: "Is parking available?" (156 views)
4. **Safety**: "What items are prohibited?" (134 views)

### Market Items (4 with real images)
1. **AfroFest T-Shirt** - $20 (Available, 150 interested, 75 claimed)
   - Image: Festival t-shirt merchandise
2. **AfroFest Hat** - $15 (Low Stock, 120 interested, 50 claimed)
   - Image: Baseball cap
3. **AfroFest Poster** - $10 (Paused, 80 interested, 30 claimed)
   - Image: Festival poster art
4. **AfroFest Mug** - $12 (Available, 100 interested, 40 claimed)
   - Image: Coffee mug

### Safety Reports (2)
1. **Lost Item** (Low, Under Review, 15 min ago)
   - "Lost phone near main stage, black iPhone with blue case"
   - Reporter: Anonymous
   
2. **Medical** (High, Resolved, 1 hour ago)
   - "Attendee feeling unwell near food court, requested first aid"
   - Reporter: John D.
   - Assigned: Medical Team Lead
   - Resolution: "First aid provided, attendee stable and resting"

### Team Tasks (3)
1. **Set up VIP check-in booth** (High, Today 1:00 PM, Alex R., Incomplete)
2. **Restock merchandise booth** (Medium, Today 3:00 PM, Mike C., Incomplete)
3. **Test sound system Stage 2** (High, Today 5:00 PM, Sarah J., Complete)

### Moderation Actions (3)
1. **Warned** - user_3421 (Posting promotional links, 15 min ago)
2. **Removed** - user_8765 (Inappropriate language, 1 hour ago, by System)
3. **Banned** - spam_bot_123 (Automated spam, 2 hours ago, by System)

### Top Engagers (5)
1. Sarah Mitchell - 47 messages, 23 replies
2. Mike Johnson - 38 messages, 19 replies
3. Emily Rodriguez - 34 messages, 17 replies
4. James Chen - 29 messages, 14 replies
5. Lisa Anderson - 25 messages, 12 replies

### Cross-Channel Alerts (3)
1. **Safety**: "New safety report requires attention" (2 min ago)
2. **Market**: "AfroFest Hat is low on stock (5 remaining)" (8 min ago)
3. **Chat**: "Message spike detected: 47 messages in last 5 minutes" (12 min ago)

---

## Technical Implementation

### State Management
```typescript
const [activeChannel, setActiveChannel] = useState<ChannelType>('announcements');
const [isLiveMode, setIsLiveMode] = useState(false);
const [eventStatus, setEventStatus] = useState<'upcoming' | 'live' | 'ended'>('live');
const [showActivityLog, setShowActivityLog] = useState(false);
const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
```

### Channel Types
```typescript
type ChannelType = 
  | 'announcements' 
  | 'updates' 
  | 'chat' 
  | 'faq' 
  | 'market' 
  | 'safety'
  | 'team'
  | 'moderation'
  | 'analytics'
  | 'settings'
  | 'activity-log';
```

### Components

#### Main Components
- `CommunitySection`: Main container
- `ChannelButton`: Sidebar navigation buttons with Live Mode support
- `SuggestedActionsPanel`: Contextual action recommendations

#### Channel Components
- `AnnouncementsChannel`
- `UpdatesChannel`
- `ChatChannel`
- `FAQChannel`
- `MarketChannel`
- `SafetyChannel`
- `TeamChannel`
- `ModerationChannel`
- `AnalyticsChannel`
- `SettingsChannel`
- `ActivityLogChannel`

#### Modal Components
- `AddItemModal`: For marketplace item creation

### Key Features

#### Live Mode Logic
```typescript
const criticalChannels: ChannelType[] = ['safety', 'updates', 'chat', 'market'];
const isCriticalChannel = (channel: ChannelType) => criticalChannels.includes(channel);
const isDimmed = isLiveMode && !critical && !active;
const isHighlighted = isLiveMode && critical;
```

#### Alert Dismissal
```typescript
const activeAlerts = mockAlerts.filter(alert => !dismissedAlerts.includes(alert.id));
const dismissAlert = (id: string) => {
  setDismissedAlerts([...dismissedAlerts, id]);
};
```

---

## User Experience

### Workflow Examples

#### During Live Event
1. Event owner enables **Live Mode**
2. Safety, Updates, Chat, Market channels are highlighted
3. **Alert Strip** shows: "New safety report requires attention"
4. Owner clicks "View" → navigates to Safety channel
5. Reviews report, assigns to Medical Team
6. **Activity Log** records: "Safety Report Assigned" action
7. **Suggested Actions** panel suggests: "Notify attendees of safety updates"

#### Post-Event Wrap-Up
1. Event status changes to "Ended"
2. **Wrap-Up Card** appears with 6 actions
3. Owner clicks "Lock Chat" → prevents new messages
4. Owner clicks "Send Recap" → announcement sent to all attendees
5. Owner clicks "Export All Reports" → downloads CSV/PDF
6. Owner clicks "Archive Community" → community archived
7. **Activity Log** records all wrap-up actions

#### Chat Engagement
1. Attendee posts: "Where are the water stations?"
2. Another attendee clicks **reply button** (↩)
3. Reply composer appears with quoted message
4. Response sent with visual reply indicator
5. **Reply Rate** statistic updates in sidebar
6. If message spike occurs → **Alert Strip** shows notification

---

## Design System

### Color Palette
```css
Primary Purple: #7626c6
Dark Purple: #5f1fa3
Light Purple: #e9d5ff (backgrounds)

Channel Colors:
- Orange: #f97316 (Announcements)
- Blue: #3b82f6 (Updates, FAQ, Analytics)
- Green: #22c55e (Chat)
- Red: #ef4444 (Safety)
- Yellow: #facc15 (Moderation)
```

### Spacing
- Card padding: `p-4` to `p-6`
- Section spacing: `space-y-4` to `space-y-6`
- Gap between elements: `gap-2` to `gap-4`

### Border Radius
- Small: `rounded` (4px)
- Medium: `rounded-lg` (8px)
- Large: `rounded-xl` (12px)
- Full: `rounded-full`

### Shadows
- Small: `shadow-sm`
- Medium: `shadow-md`
- Large: `shadow-lg`
- Hover: `hover:shadow-md transition-shadow`

### Typography
- Headings: `text-xl`, `text-lg`, `font-semibold`
- Body: `text-sm`, `text-gray-700`
- Meta: `text-xs`, `text-gray-500`
- Links: `text-[#7626c6] hover:underline`

---

## Testing Checklist

### Navigation
- [x] Sidebar toggles expand/collapse
- [x] All channel buttons navigate correctly
- [x] Active channel highlighted properly
- [x] Private channels show lock badge

### Live Mode
- [x] Toggle switches state
- [x] Critical channels highlighted
- [x] Non-critical channels dimmed
- [x] Pulse animation works
- [x] Ring border appears

### Alerts
- [x] 3 alerts display on load
- [x] Color-coded correctly
- [x] "View" button navigates
- [x] "X" button dismisses
- [x] Dismissed alerts don't reappear

### Channels
- [x] Announcements shows 2 items
- [x] Updates shows 2 items
- [x] Chat shows 3 messages with 1 reply
- [x] FAQ shows 4 questions with filtering
- [x] Market shows 4 items with images
- [x] Safety shows 2 reports
- [x] Team shows 3 tasks
- [x] Moderation shows 3 actions
- [x] Analytics shows metrics
- [x] Settings shows all sections
- [x] Activity Log shows 6 timeline items

### Suggested Actions
- [x] Panel appears in 5 channels
- [x] Context-specific suggestions
- [x] Action links work
- [x] Hover effects active

### Wrap-Up Card
- [x] Shows when status = "ended"
- [x] Hides when status = "live"
- [x] 6 action buttons present
- [x] Export button emphasized

### Demo Controls
- [x] Event status toggles
- [x] Badge updates
- [x] Wrap-up card shows/hides

---

## Future Enhancements

### Phase 1 - Persistence
- [ ] Save dismissed alerts to localStorage
- [ ] Persist Live Mode state
- [ ] Remember last active channel

### Phase 2 - Filters & Search
- [ ] Activity Log date filtering
- [ ] Activity Log category filtering
- [ ] FAQ search functionality
- [ ] Market item filtering

### Phase 3 - Notifications
- [ ] Browser push notifications
- [ ] Email digest for safety reports
- [ ] Slack/Discord integrations

### Phase 4 - Automation
- [ ] Auto-lock chat X hours after event
- [ ] Scheduled announcements
- [ ] Auto-restock market items
- [ ] Sentiment analysis on chat

### Phase 5 - Analytics
- [ ] Track which suggested actions used
- [ ] A/B test announcement formats
- [ ] Heat maps of engagement
- [ ] Attendee journey mapping

### Phase 6 - Export & Reporting
- [ ] PDF export for Activity Log
- [ ] CSV export for analytics
- [ ] Custom report builder
- [ ] Scheduled report emails

---

## Performance Considerations

### Optimization Strategies
1. **Virtual Scrolling**: For large chat/activity log lists
2. **Lazy Loading**: Load channel content on-demand
3. **Image Optimization**: Use responsive images, WebP format
4. **Debouncing**: Search and filter inputs
5. **Memoization**: React.memo for channel components
6. **Code Splitting**: Separate bundles per channel

### Accessibility
- Keyboard navigation for all buttons
- ARIA labels for icons
- Focus indicators visible
- Color contrast meets WCAG AA
- Screen reader announcements for alerts
- Skip links for main content

---

## Deployment Notes

### Environment Variables
```
VITE_UNSPLASH_API_KEY=your_key_here
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Build Command
```bash
npm run build
```

### Deploy to Production
- Platform: Vercel, Netlify, or AWS Amplify
- Auto-deploy on main branch push
- Preview deployments for PRs

---

## Support & Documentation

### For Event Owners
- In-app tooltips on hover
- Contextual help in Suggested Actions
- Video tutorials (future)
- FAQ section

### For Developers
- Component documentation
- Mock data schemas
- API integration guides
- Testing guidelines

---

## Version History

### v1.0.0 - Initial Release
- 6 public channels
- 4 private channels
- Basic moderation
- Simple marketplace

### v1.1.0 - Enhanced Engagement (Current)
- Live Mode toggle
- Cross-Channel Alert Strip
- Suggested Actions Panel
- Event Activity Log
- Event Wrap-Up Card
- Tagged replies in chat
- Real images in marketplace
- Comprehensive settings

### v1.2.0 - Planned
- Persistence layer
- Advanced filtering
- Push notifications
- Automation rules

---

## Credits

**Design**: Georim Product Team
**Framework**: React + TypeScript + Tailwind CSS v4
**Icons**: Lucide React
**Images**: Unsplash API
**State Management**: React Hooks

---

## License

Proprietary - Georim Platform
All rights reserved © 2026

---

**Last Updated**: January 2026
**Status**: ✅ Production Ready

For questions or support, contact the Georim development team.
