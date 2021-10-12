![supaflare_white_bg](https://user-images.githubusercontent.com/26413686/136743018-6f8923a6-8a3c-44f0-b6ec-b970a9f30b94.png)

##

Launch your own personal URL shortener / redirection service using free tiers of [Supabase](https://supabase.io), [Cloudflare Workers](https://workers.cloudflare.com) and [Cloudflare Pages](https://pages.cloudflare.com).

## Features

- Redirection based on device type (Default / Android / iOS)
- Support various URL protocols
- Front-end web application for link management

## Demo

1. Visit [https://supaflare.licit.dev](https://supaflare.licit.dev). Also accessible through [https://supaflare.pages.dev](https://supaflare.pages.dev).
2. Use Magic Link to login or sign in with GitHub.
3. Create and manage your links!

   > URLs have to start with a protocol such as `https://`, `ftp://`
   > 
   > Custom protocols are supported (eg: `tg://` opens the [Telegram](https://telegram.org) app).

5. Test your links at [https://out.licit.dev/](https://out.licit.dev/)`slug`

## Supabase Features Used

### Auth

Provide authentication and segretation of data between different users.

### Database

Store redirection links and metadata.

### JS Library

Convenient access to access the above Supabase features used.

## Cloudflare Features Used

### Cloudflare Workers

Perform URL redirection and to update link data.

### Workers KV

Read and store link data used when redirecting web requests.

### Cloudflare Pages

Host the front-end [Vue 3](https://v3.vuejs.org) web application.

## Installation Guide

Coming soon!

## Upcoming Features

- Search & Filtering of Links
- QR Code Display
- Link Expiry Datetime
- Password Protection
- Country Redirect

## TODO

- [ ] Intallation Guide
- [ ] Set up GitHub Actions

##

Developed by [@licitdev](https://github.com/licitdev)
