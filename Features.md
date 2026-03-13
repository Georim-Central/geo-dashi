# Georim Features

This file is based on what currently exists in this repository right now.

How this file is organized:
- Features are grouped by pricing tier.
- Inside each tier, features are grouped by the page or workspace where they exist now.
- Each bullet is tagged with its current page.
- Suggested additions are kept at the bottom and are not part of the current MVP.

Important:
- `Premium` and `Business / Enterprise` are paid tiers.
- `Business / Enterprise` includes everything in `Premium`.
- This repo is frontend-only and MVP-oriented.
- Features below describe the current UI, local state, and demo workflows in this codebase.
- Do not assume backend integrations, real sending, real payouts, auth, or persistent production data unless explicitly called out.


## ------- Free Features -------

### App Shell / Navigation

- `[Page: App Shell]` Use a compact icon sidebar for Home, Events, Notification Center, and Settings in the free workspace.
- `[Page: App Shell]` Reveal sidebar item labels through hover/focus tooltips while the rail stays collapsed.
- `[Page: App Shell]` Move between organization-level views in a single-page app shell.
- `[Page: App Shell]` Open the Settings workspace from the sidebar.
- `[Page: App Shell]` Keep the top bar pinned while the main page content scrolls underneath it.
- `[Page: App Shell]` Hand off the main Georim logo to a compact sidebar brand cap after scrolling down in the shell.
- `[Page: App Shell]` Return to Home from the Georim logo.
- `[Page: App Shell]` Return to Home and reset the shell scroll state from the compact sidebar brand cap.

### Home Page

- `[Page: Home]` See the welcome view for the current organizer.
- `[Page: Home]` Start the Create Event flow from the primary CTA.
- `[Page: Home]` Browse organizer resource cards, academy course cards, and help-topic content blocks.
- `[Page: Home]` See mobile-app and profile-setup promotional cards in the right rail.

### Events Page

- `[Page: Events]` Browse all seeded and newly created events in one list.
- `[Page: Events]` View event cards with image, date, location, lifecycle status, ticket sales, and revenue.
- `[Page: Events]` Filter events by All, Published, Draft, Private, and Archived.
- `[Page: Events]` Sort events by Most Recent, Highest Revenue, or Most Tickets Sold.
- `[Page: Events]` Publish an event or move a published event back to draft from quick actions.
- `[Page: Events]` Duplicate an event from quick actions.
- `[Page: Events]` Archive an event from quick actions.

### Create Event Page

- `[Page: Create Event]` Create a new event through a 5-step guided flow.
- `[Page: Create Event]` Add basic info including title, event type, category, and tags.
- `[Page: Create Event]` Set the event location as in-person, online, or TBA.
- `[Page: Create Event]` Add a venue address or online event URL.
- `[Page: Create Event]` Set start and end date/time values.
- `[Page: Create Event]` Toggle recurring-event mode and reveal recurrence inputs in the form.
- `[Page: Create Event]` Choose from preset timezone options.
- `[Page: Create Event]` Upload a main event image.
- `[Page: Create Event]` Upload up to 10 additional event images.
- `[Page: Create Event]` Add an external video URL.
- `[Page: Create Event]` Write a short summary and a longer description.
- `[Page: Create Event]` Insert suggested description sections or add a custom section block.
- `[Page: Create Event]` Auto-save draft progress to local storage while you work.
- `[Page: Create Event]` Restore the saved draft, current step, and form contents after refresh/remount.
- `[Page: Create Event]` Clear the saved draft and reset the flow.
- `[Page: Create Event]` Create an event and add it to the in-app event list.

### Top Bar / Global Controls

- `[Page: Top Bar]` Use the global search input from anywhere in the app.
- `[Page: Top Bar]` See search result visibility limited by the active subscription tier.
- `[Page: Top Bar]` Open a notifications dropdown from the bell icon.
- `[Page: Top Bar]` Mark all visible notifications as read from the dropdown.
- `[Page: Top Bar]` Open the Notification Center from the dropdown.
- `[Page: Top Bar]` Open a profile menu from the top-right account control.
- `[Page: Top Bar]` View the current account name and email inside the profile menu.
- `[Page: Top Bar]` Open Account Settings from the profile menu.
- `[Page: Top Bar]` Use profile-menu shortcuts for placeholder account actions such as `Switch to attending`, `Help Center`, and `Log out`.
- `[Page: Top Bar]` See whether the app is in Organization View or Event View.

### Notification Center Page

- `[Page: Notification Center]` View organizer notifications in a dedicated feed/detail workspace.
- `[Page: Notification Center]` Filter notifications by `All activity` and `Unread`.
- `[Page: Notification Center]` See summary cards for Unread, Urgent, and Today.
- `[Page: Notification Center]` Select a notification to inspect its detail panel.
- `[Page: Notification Center]` Mark notifications read/unread from the page.
- `[Page: Notification Center]` Mark all visible notifications as read.
- `[Page: Notification Center]` Archive notifications.
- `[Page: Notification Center]` Open notification preferences from the page.

### Settings Page

- `[Page: Settings]` Use a sticky top tab bar for Profile, Security, Payments, Notifications, and Subscriptions.
- `[Page: Settings]` See an animated active underline and hover highlight on the tab navigation.
- `[Page: Settings]` Scroll the page workspace back to the top when switching settings tabs.
- `[Page: Settings > Profile]` View and edit profile information.
- `[Page: Settings > Profile]` Upload and preview a profile avatar.
- `[Page: Settings > Profile]` Manage email addresses, phone numbers, and addresses.
- `[Page: Settings > Security]` Update the account password with current/new/confirm fields.
- `[Page: Settings > Payments]` View saved payment methods and recent transactions.
- `[Page: Settings > Payments]` Add a new payment method and make it the selected default.
- `[Page: Settings > Notifications]` Manage delivery channels for email, push, and SMS.
- `[Page: Settings > Notifications]` Manage event-alert toggles and quiet-hours settings.
- `[Page: Settings > Subscriptions]` Switch the active frontend subscription layer between Free, Premium, and Business / Enterprise.
- `[Page: Settings > Subscriptions]` See tier benefit summaries inside the settings UI.
- `[Page: Settings]` Open the floating settings assistant modal.

### Global AI Chat

- `[Page: Global AI Chat]` Open a floating AI assistant shell from anywhere in the app.
- `[Page: Global AI Chat]` See a contextual intro message based on the current page and selected event.
- `[Page: Global AI Chat]` Send text messages to the chat UI.
- `[Page: Global AI Chat]` Attach files in the composer and remove attachments before sending.
- `[Page: Global AI Chat]` Use browser voice input when supported.
- `[Page: Global AI Chat]` Receive frontend placeholder responses that acknowledge the current workspace context.


## ------- Premium Features -------

### App Shell / Navigation

- `[Page: App Shell]` Unlock Analytics and Finance destinations in the sidebar once the workspace is on Premium.

### Events Page

- `[Page: Events]` Open an event row into the event-management workspace.
- `[Page: Events]` Use the `Open Event` quick action from an event card menu.

### Notification Center Page

- `[Page: Notification Center]` Filter notifications by Orders, Tickets, Marketing, and Finance.
- `[Page: Notification Center]` See the Finance summary card and finance notification counts.
- `[Page: Notification Center]` Open premium-linked workflows directly from notifications when allowed.

### Global Search

- `[Page: Top Bar Search]` See event, order, and attendee search results.
- `[Page: Top Bar Search]` Route search results into event details, orders, or checked-in workflows.

### Event Management > Details

- `[Page: Event Management > Details]` Open a dedicated event workspace after selecting an event.
- `[Page: Event Management]` Use a `Back to Organization` action from the event sidebar.
- `[Page: Event Management]` See the selected event name reflected in the event sidebar group label.
- `[Page: Event Management]` Use sticky tab navigation with animated underline and hover states inside the event workspace.
- `[Page: Event Management]` Scroll the page workspace back to the top when switching event-management tabs.
- `[Page: Event Management > Details]` View and edit event information after creation.
- `[Page: Event Management > Details]` Update title, type, category, tags, location type, and location.
- `[Page: Event Management > Details]` Update start and end dates and times.
- `[Page: Event Management > Details]` Toggle recurring status from the details form.
- `[Page: Event Management > Details]` Upload, replace, and remove the main event image.
- `[Page: Event Management > Details]` Upload and remove additional event images.
- `[Page: Event Management > Details]` Add or update the event video URL.
- `[Page: Event Management > Details]` Update event summary and full description.
- `[Page: Event Management > Details]` Save event edits from inside the event workspace.
- `[Page: Event Management > Details]` Preview the attendee-facing mobile event page in a modal.
- `[Page: Event Management > Details]` Change lifecycle status between Draft, Published, Private, and Archived.
- `[Page: Event Management > Details]` Publish or unpublish directly from the header.
- `[Page: Event Management > Details]` Duplicate the event directly from the header.

### Event Management > Ticketing

- `[Page: Event Management > Ticketing]` Create ticket types from a modal flow.
- `[Page: Event Management > Ticketing]` Edit existing ticket types.
- `[Page: Event Management > Ticketing]` Delete ticket types.
- `[Page: Event Management > Ticketing]` Support paid, free, and donation ticket types.
- `[Page: Event Management > Ticketing]` Set price, quantity, min per order, and max per order.
- `[Page: Event Management > Ticketing]` Mark ticket types as Early Bird.
- `[Page: Event Management > Ticketing]` Configure reserved seating and timed-entry flags.
- `[Page: Event Management > Ticketing]` Track sold quantity versus total quantity.
- `[Page: Event Management > Ticketing]` Display seeded ticket add-ons.
- `[Page: Event Management > Ticketing]` Create promo codes from a modal flow.
- `[Page: Event Management > Ticketing]` Configure promo-code access type, discount type, discount value, usage limit, date window, and ticket applicability.
- `[Page: Event Management > Ticketing]` View and delete promo codes.

### Event Management > Orders

- `[Page: Event Management > Orders]` View orders and registrations in a dedicated workspace.
- `[Page: Event Management > Orders]` Search orders.
- `[Page: Event Management > Orders]` Filter orders with selectable status chips.
- `[Page: Event Management > Orders]` Review stats for completed, pending, refunded, and total revenue.
- `[Page: Event Management > Orders]` Select an order to inspect attendee details in a side panel.
- `[Page: Event Management > Orders]` Open a full attendee-and-order details modal.
- `[Page: Event Management > Orders]` Mark pending orders as paid.
- `[Page: Event Management > Orders]` Resend confirmations.
- `[Page: Event Management > Orders]` Edit organizer notes.
- `[Page: Event Management > Orders]` Refund an order with a refund reason.
- `[Page: Event Management > Orders]` Export order data through CSV export states in the UI.
- `[Page: Event Management > Orders]` View waitlist entries and release tickets from the waitlist panel.

### Event Management > Checked-In

- `[Page: Event Management > Checked-In]` Log attendee check-ins using a QR/code input.
- `[Page: Event Management > Checked-In]` Use manual scan fallback by typing or pasting a code.
- `[Page: Event Management > Checked-In]` Track scan source such as gate scanner or phone scanner.
- `[Page: Event Management > Checked-In]` See live success, warning, and error feedback after each scan.
- `[Page: Event Management > Checked-In]` Prevent duplicate check-ins for the same attendee.
- `[Page: Event Management > Checked-In]` View checked-in, pending, and check-in-rate stats.
- `[Page: Event Management > Checked-In]` Search and filter the live check-in log.
- `[Page: Event Management > Checked-In]` Simulate a scan from the UI for workflow testing.

### Event Management > Marketing

- `[Page: Event Management > Marketing]` Manage event listing settings from a modal.
- `[Page: Event Management > Marketing]` Control listing status, category, discovery, geo-radius, and push notifications.
- `[Page: Event Management > Marketing]` Turn listing boost visibility on or off.
- `[Page: Event Management > Marketing]` Create email and SMS campaigns.
- `[Page: Event Management > Marketing]` Save campaigns as draft, scheduled, or sent.
- `[Page: Event Management > Marketing]` Set campaign audience, send time, subject, objective, and message.
- `[Page: Event Management > Marketing]` Target audience segments such as subscribers, ticket holders, VIP guests, waitlist, and dormant fans.
- `[Page: Event Management > Marketing]` Filter campaign history by channel and status.
- `[Page: Event Management > Marketing]` Review campaign delivery, engagement, conversion, and revenue metrics in the UI.

### Event Management > Reports

- `[Page: Event Management > Reports]` View event-report stats such as tickets sold, checked in, check-in rate, and no-shows.
- `[Page: Event Management > Reports]` View categorized attendee issue reports.
- `[Page: Event Management > Reports]` Expand issue groups to inspect report details.
- `[Page: Event Management > Reports]` Mark issue reports as resolved.
- `[Page: Event Management > Reports]` Review resolved report history.
- `[Page: Event Management > Reports]` Export event reports as PDF.

### Event Management > Settings

- `[Page: Event Management > Settings]` Set event visibility to Public, Private, or Draft.
- `[Page: Event Management > Settings]` Generate and regenerate a private event link.
- `[Page: Event Management > Settings]` Copy the private event link.
- `[Page: Event Management > Settings]` Enable or disable the waitlist toggle.
- `[Page: Event Management > Settings]` Create and edit a cancellation policy.

### Analytics Page

- `[Page: Analytics]` View organization analytics when no event is selected.
- `[Page: Analytics]` View event analytics when an event is selected.
- `[Page: Analytics]` Change the analytics date range.
- `[Page: Analytics]` Review KPI cards for revenue, tickets, attendees, and related metrics.
- `[Page: Analytics]` View revenue and sales charts.
- `[Page: Analytics]` View ticket-type breakdown charts.
- `[Page: Analytics]` View event-page traffic charts.
- `[Page: Analytics]` View attendee geography by city and state.
- `[Page: Analytics]` View an event-level conversion funnel.
- `[Page: Analytics]` View revenue attribution data.
- `[Page: Analytics]` View organization-level event comparison and status-distribution cards.
- `[Page: Analytics]` Export analytics reports as PDF.

### Finance Page

- `[Page: Finance]` View a payment-summary card.
- `[Page: Finance]` Review payout history.
- `[Page: Finance]` Review transactions with gross, fees, and net values.
- `[Page: Finance]` Review withdrawal history.
- `[Page: Finance]` Review invoice and billing history.
- `[Page: Finance]` Request a withdrawal from the finance page.
- `[Page: Finance]` Export finance reports as PDF.
- `[Page: Finance]` View payout schedule information.
- `[Page: Finance]` View finance control panels and jump into payment settings.


## ------- Business / Enterprise Features -------

### App Shell / Navigation

- `[Page: App Shell]` Unlock the Team destination in the sidebar once the workspace is on Business / Enterprise.

### Team Management Page

- `[Page: Team Management]` Open a dedicated team workspace.
- `[Page: Team Management]` View role-preset summary cards for Admin, Marketing, Operations, and Custom.
- `[Page: Team Management]` View pending invites and their statuses.
- `[Page: Team Management]` Invite team members from a modal flow.
- `[Page: Team Management]` Assign permission presets including Admin, Marketing, Operations, and Custom.
- `[Page: Team Management]` Create a custom role name.
- `[Page: Team Management]` Choose all-events access or selected-events access for an invite.
- `[Page: Team Management]` Resend pending invites.
- `[Page: Team Management]` Cancel pending invites.
- `[Page: Team Management]` View all team members in a dedicated table.
- `[Page: Team Management]` Select a team member to inspect their current access.
- `[Page: Team Management]` Edit a team member's role preset and event access.
- `[Page: Team Management]` Remove non-owner team members.
- `[Page: Team Management]` Assign special tickets such as VIP and staff-style access.
- `[Page: Team Management]` View on-site tools cards for Organizer App, Guest List Manager, and Coverage Planning.

### Notification Center Page

- `[Page: Notification Center]` Filter notifications by Team.
- `[Page: Notification Center]` Open team-related linked workflows directly from a notification.

### Global Search

- `[Page: Top Bar Search]` See team-member search results.
- `[Page: Top Bar Search]` Route team search results into the Team workspace.


## --- Suggested Additions -----

These are not part of the current live MVP feature list above. They are only suggestions based on what is already hinted at in the repo.

### Suggested Additions for Free

- `[Suggested for Help Center]` Add guided onboarding checklists for first-time organizers.
- `[Suggested for Global AI Chat]` Connect the chat shell to a real assistant backend.

### Suggested Additions for Premium

- `[Suggested for Event Management > Orders]` Add real downloadable CSV exports instead of UI export states only.
- `[Suggested for Event Management > Checked-In]` Add camera-based QR scanning instead of code-entry and simulation only.
- `[Suggested for Event Management > Marketing]` Add real campaign delivery integrations.
- `[Suggested for Finance]` Add real payout scheduling and finance backend syncing.

### Suggested Additions for Business / Enterprise

- `[Suggested for Team Management]` Add approval workflows, audit trails, and richer access controls for role changes.
- `[Suggested for Settings > Security]` Add two-factor authentication, active sessions, and login history.
