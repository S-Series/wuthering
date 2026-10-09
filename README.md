# WuWa DEV -- Wuthering Waves Spec Card Generator

Web service that automatically generates **character spec cards** for
the game **Wuthering Waves**.

Users upload a screenshot of their character equipment screen and the
system extracts stat data using OCR, normalizes the result, and
generates a spec card.

🔗 Live Service\
https://www.wuwa.dev/

------------------------------------------------------------------------

# Overview

Many games such as **Genshin Impact** and **Honkai Star Rail** provide
official APIs that allow developers to build spec card services.

However, **Wuthering Waves does not provide a public API**, making it
difficult to create similar tools.

This project solves that problem by using **OCR to extract data directly
from game screenshots**.

Pipeline:

Image Upload → OCR Processing → Text Normalization → Game Data Mapping →
Stat Calculation → Spec Card Generation

------------------------------------------------------------------------

# Features

## Spec Card Generator

Generate a full character spec card based on:

-   Character
-   Weapon
-   Echo equipment
-   Calculated final stats

------------------------------------------------------------------------

## OCR Based Auto Input

Upload an equipment screenshot and the system automatically extracts
stat values.

OCR Pipeline:

Image → PaddleOCR / EasyOCR → Text normalization → Game stat dictionary
matching → Structured stat data

------------------------------------------------------------------------

## Interactive Equipment Editor

Users can manually adjust their build:

-   Drag & Drop Echo slots
-   Stat recalculation
-   Equipment filtering

Final stats update **in real time**.

------------------------------------------------------------------------

## Build Score System

Each stat roll is evaluated and converted into a score.

This allows users to quickly evaluate how optimized their build is.

------------------------------------------------------------------------

## YouTube Integration

Related build videos can be viewed directly inside the site using the
YouTube Data API.

The player opens in a popup iframe so users can watch without leaving
the page.

------------------------------------------------------------------------

# Architecture

```mermaid
sequenceDiagram
  participant User as User
  participant FE as Frontend (Vercel)
  participant GW as Gateway (Railway)
  participant OCR as OCR Server (HuggingFace)
  participant R as Image maker
  participant DB as Firestore

  User->>FE: Paste / Upload screenshot
  FE->>GW: POST /api/ocr (multipart: file + lang)
  GW->>GW: Validate mime/ext/size + rate limit + queue(p-limit)
  GW->>OCR: POST /ocr (timeout 60s)
  OCR->>OCR: preprocess (grayscale/contrast) + crop + OCR
  OCR-->>GW: {texts, full_text, image_base64}
  GW-->>FE: JSON passthrough
  FE->>FE: retouch(regex) + fuzzy mapping + stat calc
  FE->>R: POST /render/card (payload)
  R-->>FE: image/png
  FE->>DB: Save user/build metadata (optional)
  FE-->>User: Render spec card + share/download
 ```

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React 19
-   Vite
-   TypeScript
-   Zustand
-   dnd-kit

## Backend

-   Node.js
-   Railway
-   Express based Gateway server

## AI / OCR

-   PaddleOCR
-   EasyOCR
-   HuggingFace Spaces

## Database / Storage

-   Firebase Firestore
-   Firebase Storage

## DevOps

-   Vercel
-   Railway
-   GitHub Actions

## External APIs

-   YouTube Data API

------------------------------------------------------------------------

# Installation

Clone the repository.

git clone https://github.com/S-Series/wuthering.git

Install frontend dependencies.

cd frontend npm install

Run development server.

npm run dev

------------------------------------------------------------------------

# Environment Variables

Example .env

VITE_GATEWAY_URL= YOUTUBE_API_KEY= FIREBASE_CONFIG=

Gateway server:

OCR_UPSTREAM_URL= RATE_LIMIT=

------------------------------------------------------------------------

# Known Challenges

## OCR Accuracy

Game UI screenshots often cause:

-   number recognition errors
-   decimal loss
-   stat text fragmentation

This project implements a **text normalization pipeline** to correct OCR
output before mapping to game data.

------------------------------------------------------------------------

## Drag & Drop Equipment Ordering

Changing equipment order using drag & drop caused inconsistencies
between UI order and data index.

The solution was to separate equipment data and equipment index mapping
so stat calculations rely on selected indices rather than array order.

------------------------------------------------------------------------

# Deployment

Frontend: Vercel

Gateway server: Railway

OCR server: HuggingFace Spaces

------------------------------------------------------------------------

# Service Status

The service is currently live.

Average traffic: **\~300 daily users**

Search on Google:

WuWa DEV\
띵데브

------------------------------------------------------------------------

# License

MIT License

------------------------------------------------------------------------

# Developer pages

- `/dev` links to the developer tools.
- `/dev/ocr` contains the OCR crop test and raw results for all nine regions (the old `/test` and `/dev/test` URLs redirect here).
- `/dev/analystic` shows public, aggregated Vercel Web Analytics statistics.

Apply [`backend/gateway/sql/dev_analytics_daily.sql`](backend/gateway/sql/dev_analytics_daily.sql) in the Supabase SQL editor before deploying the gateway. The gateway's service-role credentials read and write this table; browser clients do not access it directly.

Set `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` on the gateway server. Set `VERCEL_TEAM_ID` when the token needs it to access a team project. Keep the token server-side; do not use a `VITE_` variable. Enable Web Analytics for the Vercel project.

The gateway collects each completed Asia/Seoul 05:00–05:00 day at 05:10 KST and upserts it by date. On startup it fills missing days from the latest 30 completed days. The scheduled run also refreshes the latest two days to incorporate delayed Vercel data. The public `/api/dev/analytics` endpoint reads Supabase only; it never calls Vercel. The page offers 1, 7, 30, 60, and 90-day views from stored daily records; older views can be incomplete until enough days have been collected. A multi-day visitor total is the sum of daily visitor counts, not a unique count across the full range. The collector needs a continuously running gateway; if the gateway is down at 05:10, startup fills missing days after it restarts. Historical backfill is limited by the Vercel plan's reporting window.
