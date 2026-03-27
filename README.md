# GYC Sierra Leone Website

Production-oriented MVC scaffold for the Global Youth Counterpart for Sustainable Development Sierra Leone website and CMS.

## Implementation Notes Applied

- SDG-inspired accents are used across both the public UI and admin dashboard while keeping a neutral, readable base.
- The admin dashboard is treated as required product scope and already includes dedicated entry points for pages, sections, contact block, SEO, and media.
- Contact email, phone, address, and map are intentionally centered around one reusable contact/map content block to prevent duplication.
- Sections support a primary image via `page_sections.image_id` and multiple related images via `section_media`.
- Initial seed content is mapped from `GYC_Website_Content_Document DAV 2026.pdf`.

## Recommended Folder Structure

```text
config/
controllers/
controllers/admin/
database/
middleware/
models/
public/
public/css/
public/js/
public/uploads/
routes/
scripts/
views/
views/admin/
views/layouts/
views/pages/
views/partials/
```

## Database Schema Plan

Core content:

- `pages`
- `page_sections`
- `section_items`
- `section_media`
- `site_settings`
- `seo_meta`
- `media_library`

Organisation modules:

- `programs`
- `projects`
- `partners`
- `team_members`
- `board_members`
- `district_coordinators`

Publishing and engagement:

- `news_posts`
- `resources`
- `gallery_items`
- `newsletter_subscribers`
- `donations_info`

Forms and admin:

- `admin_users`
- `contact_messages`
- `volunteer_applications`
- `partnership_inquiries`

## Public Route Map

- `/`
- `/about`
- `/about/our-story`
- `/about/vision-mission`
- `/about/team`
- `/about/partners`
- `/programs`
- `/programs/climate-action`
- `/programs/sdg-advocacy`
- `/programs/gender-equality`
- `/programs/youth-employment`
- `/programs/governance`
- `/projects`
- `/projects/:slug`
- `/get-involved`
- `/get-involved/volunteer`
- `/get-involved/partner`
- `/donate`
- `/news`
- `/news/:slug`
- `/resources`
- `/gallery`
- `/contact`

## Admin Dashboard Plan

Initial admin routes included:

- `/admin/login`
- `/admin/logout`
- `/admin`
- `/admin/content`
- `/admin/pages`
- `/admin/contact-block`
- `/admin/seo`
- `/admin/media`

Planned module expansion:

- homepage sections
- about content
- programs
- projects
- news/events
- resources
- gallery
- partners
- team members
- board members
- district coordinators
- CTA buttons
- footer content
- SEO fields
- reusable contact/map block
- media library

## SDG-Inspired Theme Plan

- Neutral white and soft-slate base to preserve readability
- SDG-inspired gradients for hero sections, buttons, dividers, badges, and counters
- Program-specific accents ready to map to SDG colors later
- Bold heading system with `Manrope` and readable body text with `Source Sans 3`
- Reusable card, stat, CTA, and admin widget styles for a consistent design system

## Assumptions and Gaps

- The source content document is not yet present in the workspace.
- Phase 1 seeds placeholder content where the document is still missing.
- Contact details are intentionally centralized around the reusable contact/map CMS block to avoid duplication.
- Image handling is scaffolded with `multer`, with schema support for both single-image and multi-image section layouts.

## Setup

1. Copy `.env.example` to `.env`.
2. Create the MySQL database named in `.env`.
3. Install dependencies with `npm install`.
4. Apply schema and seed data with `npm run seed`.
5. Start the development server with `npm run dev`.

## Default Admin Credentials

- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`

## Phase 1 Delivered

- Express + EJS + Bootstrap 5 MVC scaffold
- Public route map and base page templates
- Admin authentication skeleton with session support
- MySQL schema for CMS, media, forms, and SEO modules
- Seed pipeline with one super admin and document-based page/SEO/program/project/contact seed data
- SDG-inspired public and admin design foundations
- Admin foundations for page editing, section editing, contact block editing, and media uploads/reuse
