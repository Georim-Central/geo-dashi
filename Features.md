# Georim Features

This version is based only on what currently exists in the project right now.

How this file is organized:
- Features are grouped by pricing tier.
- Inside each tier, features are grouped by the page where they exist now.
- Each bullet is tagged with its page.
- Suggested additions are kept at the very bottom.

Important:
- `Premium` and `Business / Enterprise` are paid tiers.
- `Business / Enterprise` should include everything in `Premium`.
- This repo is frontend-focused right now.
- The features below describe the current UI and frontend product experience only.
- Backend integrations, live data sync, and production service behavior should not be assumed unless explicitly noted elsewhere.



## ------- Free Features -------

### Dashboard Page

- `[Page: Dashboard]` View organization-level summary cards for total events, attendees, revenue, and published events.
- `[Page: Dashboard]` See platform activity highlights such as ticket sales, revenue, active events, and attendee growth.
- `[Page: Dashboard]` Browse all events in one place with status, date, location, ticket sales, and revenue.
- `[Page: Dashboard]` Filter events by status and sort events by recent activity, revenue, or tickets sold.
- `[Page: Dashboard]` Open an event directly from the dashboard into event management.
- `[Page: Dashboard]` Duplicate an event from quick actions.
- `[Page: Dashboard]` Archive an event from quick actions.
- `[Page: Dashboard]` Publish or move an event back to draft from quick actions.
- `[Page: Dashboard]` View a recent activity feed for organizer activity.
- `[Page: Dashboard]` View a team collaboration card with quick access to team members and invite flow entry.

### Create Event Page

- `[Page: Create Event]` Create a new event with a 5-step guided flow.
- `[Page: Create Event]` Add event title, event type, category, and tags.
- `[Page: Create Event]` Set the event location as in-person, online, or TBA.
- `[Page: Create Event]` Add venue address or online event URL.
- `[Page: Create Event]` Set start date, end date, start time, and end time.
- `[Page: Create Event]` Enable recurring event mode in the form.
- `[Page: Create Event]` Choose a timezone from preset timezone options.
- `[Page: Create Event]` Upload a main event image.
- `[Page: Create Event]` Upload up to 10 additional event images.
- `[Page: Create Event]` Add an external event video URL.
- `[Page: Create Event]` Add a short summary and long event description.
- `[Page: Create Event]` Use suggested description sections to build event copy faster.
- `[Page: Create Event]` Save draft progress automatically so unfinished event setup is restored after refresh.
- `[Page: Create Event]` Clear the saved draft and restart the form from the beginning.

### Top Bar / Global Navigation

- `[Page: Top Bar]` Search across events, orders, attendees, and team members.
- `[Page: Top Bar]` Open matching search results and jump into the related workflow.
- `[Page: Top Bar]` Open a notifications dropdown from the bell icon.
- `[Page: Top Bar]` Mark all notifications as read from the dropdown.
- `[Page: Top Bar]` Open profile settings from the top-right account control.
- `[Page: Top Bar]` See whether you are in Organization View or Event View.

### Notification Center Page

- `[Page: Notification Center]` View all organizer notifications in a dedicated activity feed.
- `[Page: Notification Center]` Filter notifications by all activity, unread, orders, tickets, marketing, finance, and team.
- `[Page: Notification Center]` See summary cards for unread, urgent, finance, and today counts.
- `[Page: Notification Center]` Open a selected notification in a detail review panel.
- `[Page: Notification Center]` Mark notifications as read.
- `[Page: Notification Center]` Archive notifications.
- `[Page: Notification Center]` Open linked workflows directly from a notification.
- `[Page: Notification Center]` Open notification preferences from the page.

### Settings Page

- `[Page: Settings > Profile]` View and edit profile information.
- `[Page: Settings > Profile]` Upload or change the profile avatar.
- `[Page: Settings > Profile]` Manage emails, phone numbers, and addresses.
- `[Page: Settings > Security]` Change the account password.
- `[Page: Settings > Payments]` View payment methods and choose a default payment method.
- `[Page: Settings > Payments]` See recent transaction history inside settings.
- `[Page: Settings > Notifications]` Manage notification preferences from account settings.

### Help Center Page

- `[Page: Help Center]` Browse FAQ content for common organizer workflows.
- `[Page: Help Center]` View testimonial content on the support page.
- `[Page: Help Center]` Open and submit the in-dashboard support contact form.

### Global AI Chat

- `[Page: Global AI Chat]` Open a floating AI assistant from anywhere in the app.
- `[Page: Global AI Chat]` See a contextual intro message based on the current page or selected event.
- `[Page: Global AI Chat]` Send text messages to the assistant UI.
- `[Page: Global AI Chat]` Attach files in the chat composer.
- `[Page: Global AI Chat]` Use browser voice input when supported.



## ------- Premium Features -------

### Event Management > Details Page

- `[Page: Event Management > Details]` View and edit event information after creation.
- `[Page: Event Management > Details]` Update title, type, category, tags, location type, and location.
- `[Page: Event Management > Details]` Update start and end dates and times.
- `[Page: Event Management > Details]` Upload, replace, and remove the main event image.
- `[Page: Event Management > Details]` Upload and remove additional event images.
- `[Page: Event Management > Details]` Add or update the event video URL.
- `[Page: Event Management > Details]` Update event summary and full description.
- `[Page: Event Management > Details]` Save event edits from inside the event workspace.
- `[Page: Event Management > Details]` Preview the attendee-facing mobile event page.
- `[Page: Event Management > Details]` Change event lifecycle status between draft, published, private, and archived.
- `[Page: Event Management > Details]` Publish or unpublish the event directly from the header.
- `[Page: Event Management > Details]` Duplicate the event directly from the header.

### Event Management > Ticketing Page

- `[Page: Event Management > Ticketing]` Create ticket types.
- `[Page: Event Management > Ticketing]` Edit existing ticket types.
- `[Page: Event Management > Ticketing]` Delete ticket types.
- `[Page: Event Management > Ticketing]` Support paid, free, and donation ticket types.
- `[Page: Event Management > Ticketing]` Set price, quantity, min per order, and max per order.
- `[Page: Event Management > Ticketing]` Mark tickets as early bird.
- `[Page: Event Management > Ticketing]` Configure reserved seating and timed entry flags.
- `[Page: Event Management > Ticketing]` Track sold quantity versus total quantity.
- `[Page: Event Management > Ticketing]` Create promo codes from a modal flow.
- `[Page: Event Management > Ticketing]` Configure promo-code discount type, discount value, usage limits, and validity windows.
- `[Page: Event Management > Ticketing]` View and delete promo codes.

### Event Management > Orders Page

- `[Page: Event Management > Orders]` View orders and registration records in a dedicated workspace.
- `[Page: Event Management > Orders]` Search and filter orders.
- `[Page: Event Management > Orders]` View attendee details and order details.
- `[Page: Event Management > Orders]` Open a full attendee and order details modal.
- `[Page: Event Management > Orders]` Mark pending orders as paid.
- `[Page: Event Management > Orders]` Resend confirmation for an order.
- `[Page: Event Management > Orders]` Edit organizer notes on an order.
- `[Page: Event Management > Orders]` Refund an order with a refund reason.
- `[Page: Event Management > Orders]` View refunded, pending, and completed statuses.
- `[Page: Event Management > Orders]` Export order data with CSV export states.
- `[Page: Event Management > Orders]` View order summary stats including refunded and revenue values.
- `[Page: Event Management > Orders]` View waitlist entries shown in the orders workspace.

### Event Management > Checked-In Page

- `[Page: Event Management > Checked-In]` Log attendee check-ins using a QR or code input.
- `[Page: Event Management > Checked-In]` Use manual scan fallback by typing or pasting a code.
- `[Page: Event Management > Checked-In]` Track scan source such as gate scanner or phone scanner.
- `[Page: Event Management > Checked-In]` See live success, warning, and error feedback after each scan.
- `[Page: Event Management > Checked-In]` Prevent duplicate check-ins for the same attendee.
- `[Page: Event Management > Checked-In]` View check-in stats such as checked-in count, pending count, and check-in rate.
- `[Page: Event Management > Checked-In]` Search and filter the live check-in log.
- `[Page: Event Management > Checked-In]` Simulate scans from the UI for on-site workflow testing.

### Event Management > Marketing Page

- `[Page: Event Management > Marketing]` Manage event listing settings.
- `[Page: Event Management > Marketing]` Control listing status, category, discovery, geo-radius, and push notifications.
- `[Page: Event Management > Marketing]` Turn listing boost visibility on or off.
- `[Page: Event Management > Marketing]` Create email and SMS campaigns.
- `[Page: Event Management > Marketing]` Save campaigns as draft, scheduled, or sent.
- `[Page: Event Management > Marketing]` Set campaign audience, send time, subject, objective, and message.
- `[Page: Event Management > Marketing]` Target audience segments such as subscribers, ticket holders, VIP guests, waitlist, and dormant fans.
- `[Page: Event Management > Marketing]` Connect campaigns to send integrations and sync delivery metrics back into the UI.
- `[Page: Event Management > Marketing]` View campaign history and campaign detail summaries.
- `[Page: Event Management > Marketing]` View delivery, engagement, conversion, and revenue metrics per campaign.

### Event Management > Reports Page

- `[Page: Event Management > Reports]` View event report stats such as tickets sold, checked in, check-in rate, and no-shows.
- `[Page: Event Management > Reports]` View categorized attendee issue reports.
- `[Page: Event Management > Reports]` Expand issue groups to inspect report details.
- `[Page: Event Management > Reports]` Mark issue reports as resolved.
- `[Page: Event Management > Reports]` Review resolved report history.
- `[Page: Event Management > Reports]` Export event reports as PDF.

### Event Management > Settings Page

- `[Page: Event Management > Settings]` Set event visibility to Public, Private, or Draft.
- `[Page: Event Management > Settings]` Generate and regenerate a private event link.
- `[Page: Event Management > Settings]` Copy the private event link.
- `[Page: Event Management > Settings]` Enable or disable the waitlist toggle.
- `[Page: Event Management > Settings]` Create and edit a cancellation policy.

### Analytics Page

- `[Page: Analytics]` View organization analytics when no event is selected.
- `[Page: Analytics]` View event analytics when an event is selected.
- `[Page: Analytics]` Change date range for analytics views.
- `[Page: Analytics]` Review KPI cards for revenue, tickets, attendees, and related metrics.
- `[Page: Analytics]` View revenue and sales charts.
- `[Page: Analytics]` View a conversion funnel for event-level discovery-to-purchase performance.
- `[Page: Analytics]` View a Revenue Attribution card on the left and an Event Comparison card on the right in a shared two-column analytics row.
- `[Page: Analytics]` View ticket-type breakdown charts.
- `[Page: Analytics]` View event page traffic charts.
- `[Page: Analytics]` View attendee geography by city and state.
- `[Page: Analytics]` Export analytics reports as PDF.

### Finance Page

- `[Page: Finance]` View finance summary cards and financial activity.
- `[Page: Finance]` Review payout history.
- `[Page: Finance]` Review transactions with gross, fees, and net values.
- `[Page: Finance]` Review withdrawal history.
- `[Page: Finance]` Review invoice and billing history.
- `[Page: Finance]` Request a withdrawal from the finance page.
- `[Page: Finance]` Export finance reports as PDF.
- `[Page: Finance]` View payout schedule and finance control panels.



## ------- Business / Enterprise Features -------

### Team Management Page

- `[Page: Team Management]` View all team members in a dedicated team workspace.
- `[Page: Team Management]` View pending invites and invite statuses.
- `[Page: Team Management]` Invite new team members from a modal flow.
- `[Page: Team Management]` Assign permission presets including Admin, Marketing, Operations, and Custom.
- `[Page: Team Management]` Create custom role names.
- `[Page: Team Management]` Choose all-events access or selected-events access for a team member.
- `[Page: Team Management]` Route invite acceptance and role assignment changes through approval workflows in the UI.
- `[Page: Team Management]` Resend pending invites.
- `[Page: Team Management]` Cancel pending invites.
- `[Page: Team Management]` Edit an existing team member's permissions and event access.
- `[Page: Team Management]` Remove team members.
- `[Page: Team Management]` Assign special tickets such as VIP Access, All Access Pass, Staff Pass, Media Pass, and Comp Ticket.
- `[Page: Team Management]` View preset role summaries and role counts.
- `[Page: Team Management]` View on-site tools cards for Organizer App, Guest List Manager, and Coverage Planning.


## ---  Suggested Additions -----

These are not part of the current live MVP feature list above. They are only suggestions based on what is already hinted at in the repo.

### Suggested Additions for Free

- `[Suggested for Help Center]` Add guided onboarding checklists for first-time organizers.

### Suggested Additions for Premium

- `[Suggested for Event Management > Orders]` Add real downloadable CSV/PDF exports instead of export states only.
- `[Suggested for Event Management > Checked-In]` Add camera-based QR scanning instead of code-entry simulation only.
- `[Suggested for Finance]` Add real payout scheduling and finance backend syncing.

### Suggested Additions for Business / Enterprise

- `[Suggested for Team Management]` Add stronger approval workflows for invite acceptance and role assignment.
- `[Suggested for Settings > Security]` Add two-factor authentication, active sessions, and login history.
