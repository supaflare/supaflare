![supaflare_white_bg](https://user-images.githubusercontent.com/26413686/136743018-6f8923a6-8a3c-44f0-b6ec-b970a9f30b94.png)

##

[![GitHub license](https://img.shields.io/github/license/supaflare/supaflare.svg)](https://github.com/supaflare/supaflare/blob/master/LICENSE)
![Cloudflare Pages Deployment](https://github.com/supaflare/supaflare/workflows/Cloudflare%20Pages%20Deployment/badge.svg)
![Cloudflare Workers Deployment](https://github.com/supaflare/supaflare/workflows/Cloudflare%20Workers%20Deployment/badge.svg)

## About

Launch your own personal URL shortener / redirection service using free tiers of [Supabase](https://supabase.io), [Cloudflare Workers](https://workers.cloudflare.com), [Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [Cloudflare Pages](https://pages.cloudflare.com).

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

4. Test your links at [https://out.licit.dev/](https://out.licit.dev/)`slug`

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

### Fork Supaflare

Create a [Fork](https://github.com/supaflare/supaflare/fork) of Supaflare as the deployments are pushed via GitHub Actions.

### Set up Cloudflare Workers

1. [Sign up](https://dash.cloudflare.com/sign-up/workers) for a Cloudflare Workers account.
2. Copy the **Account ID** shown in the Workers page somewhere, you will require it later.
3. Copy the **Subdomain** shown in the Workers page somewhere, you will require it later.
4. Head over to KV tab, add a new namespace called **SUPAFLARE**.
5. Update the `id` found in [/worker/wrangler.toml](worker/wrangler.toml) with the one you have just created.
6. Head over to [API Tokens](https://dash.cloudflare.com/profile/api-tokens) and create a new Custom API Token with Permission of "Account/Worker Scripts/Edit".
7. Copy the **API Key** somewhere, you will require it later.

### Set up Supabase

1. [Sign up](https://app.supabase.io) for a Supabase account.
2. Create a new Project.
3. Click SQL on the left menu bar and select `+ New query`.
4. Copy the contents found in [/app/src/database.sql](app/src/database.sql) and run it in.
5. Click Settings on the left menu bar and select `API`.
6. Copy the **Project API key > anon / public** somewhere, you will require it later.
7. Copy the **Config > URL** somewhere, you will require it later.
8. Copy the **Config > JWT Secret** somewhere, you will require it later.

### Set up Cloudflare Pages

1. [Sign up](https://dash.cloudflare.com/sign-up/pages) for a Cloudflare Pages account.
2. Create a new project, selecting the fork of Supaflare in your GitHub account.
3. Set the framework preset as `Vue`.
4. Set the build output directory as `dist`.
5. Set the root directory path as `app`.
6. Create the following environment variables:
   1. `VITE_SUPABASE_KEY` with the **Project API key > anon / public**.
   2. `VITE_SUPABASE_URL` with the **Config > URL**.
   3. `VITE_SUPAFLARE_WORKER_URL` with `https://supaflare-worker.<your workers subdomain>.workers.dev`.
7. After the first build is completed, pause the Automatic git deployments.
8. Add a new deploy hook, copy the **Deploy hook URL** somewhere, you will require it later.

### Configure GitHub Actions

1. Open the forked GitHub project > Settings > Secrets.
2. Create the following repository secrets:
   1. `CLOUDFLARE_ACCOUNT_ID` with the **Account ID**.
   2. `CF_API_TOKEN` with the **API Key**.
   3. `CF_PAGES_MASTER_WEBHOOK_URL` with the **Deploy hook URL**.
   4. `SUPABASE_API_KEY` with the **Project API key > anon / public**.
   5. `SUPABASE_JWT_SECRET` with the **Config > JWT Secret**.
   6. `SUPABASE_URL` with the **Config > URL**.
   7. `SUPAFLARE_ADMIN_KEY` with a random non-empty string, used as secret for manual updates.
   8. `MASK_WORKER_URL` with your worker hostname for masking. Eg: test.workers.dev
3. Click on the Actions tab, manually run the workflows.

### Configure Supabase Auth

Please set the Site URL in `Supabase Settings > Auth settings` to be the URL of your Cloudflare Pages site.
For external OAuth providers, refer to the [auth guide](https://supabase.io/docs/guides/auth) provided by Supabase.

### Restrict Web Application Access

You may restrict the access to your web application using [Cloudflare Access](https://www.cloudflare.com/teams/access/) based on your requirements.

## Upcoming Features

- Search & Filtering of Links
- QR Code Display
- Link Expiry Datetime
- Password Protection
- Country Redirect

##

Developed by [licitdev](https://github.com/licitdev)
