![supaflare_white_bg](https://user-images.githubusercontent.com/26413686/136743018-6f8923a6-8a3c-44f0-b6ec-b970a9f30b94.png)

##

Launch your own personal URL shortener / redirector service using free tiers of [Supabase](https://supabase.io) and [Cloudflare Workers](https://workers.cloudflare.com).

## Features

- Redirection based on device type (Default / Android / iOS)
- Support various URL protocols

## Demo

1. Visit [https://supaflare.licit.dev](https://supaflare.licit.dev).
2. Use Magic Link to login or sign in with GitHub.
3. Create and manage your links!

   > URLs have to start with a protocol such as `https://`, `ftp://`
   > 
   > Custom protocols are supported (eg: `tg://` opens the [Telegram](https://telegram.org) app).

5. Test your links at [https://out.licit.dev/](https://out.licit.dev/)`slug`

## Supabase Features Used

### Auth

To provide authentication and segretation of data between different users.

### Database

To store redirection links and metadata.

### JS Library

Convenient access to access the above Supabase features used.

## Cloudflare Features Used

### Cloudflare Workers

To perform URL redirection and to update link data.

### Workers KV

To read and store link data used when redirecting web requests.

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
