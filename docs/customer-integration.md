# Customer-facing integration

The website never creates or charges bookings itself. Set HTTPS customer-facing URLs only after the platform team confirms them. Use branch-specific staging URLs on develop and production URLs on main. Leave variables unset until ready. No secrets or staff/test endpoints belong in these variables.

| Variable | Purpose |
| --- | --- |
| CRAFTERIS_PYOP_BOOKING_URL | Painting reservations |
| CRAFTERIS_WORKSHOP_BOOKING_URL | Workshop reservations |
| CRAFTERIS_COURSE_BOOKING_URL | Course enrolment |
| CRAFTERIS_MEMBERSHIP_BOOKING_URL | Membership purchase |
| CRAFTERIS_STUDIO_BOOKING_URL | PAYG studio access |
| CRAFTERIS_MEMBER_LOGIN_URL | Customer account login |
| CRAFTERIS_MANAGE_BOOKING_URL | Customer booking management |

Booking links forward plan, session and slug when supplied. These are website selection hints, not trusted identifiers or pricing data. Platform must map and validate them, confirm studio scope, authenticate when needed, and own availability, payments and confirmation. Confirm the exact parameter contract before enabling URLs. Without configuration the site offers contact enquiries only. Existing GlassXpressions booking links remain unchanged. Shop checkout is outside this change.

Acceptance: test each selection in staging, including unavailable sessions, payment success/failure, membership login, cancellation and studio tenancy. Confirm that booking data is not duplicated in the website database. Then configure production separately.
