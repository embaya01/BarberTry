# VirtualBarberAI - Project Specification

## Overview

VirtualBarberAI is a web application that lets users upload photos of themselves and reference haircut images, and returns a 2x2 grid (front, back, left-profile, right-profile) of AI-generated, face-preserving images showing the user with the requested haircut in a studio-cleanup style.

## Goals

- Provide a fast "upload-and-go" UX with minimal friction (no login required).
- Produce photorealistic, identity-preserving haircut edits across four canonical views.
- Allow users to upload multiple self-photos (1-5) and multiple reference photos (1-5) to improve realism.
- Provide safe defaults: block explicit content, preserve eye color and skin tone, optional toggles for beard/glasses.

## Primary Users

- Consumers seeking a preview of a haircut on their own head.
- Barbers/stylists who want to visualize options for clients.

## MVP Scope

**Inputs:**
- Self photos: 1–5 images (recommend at least one front-facing clear photo)
- Reference haircut photos: 1–5 images (any angle)
- Optional toggles: keep beard (auto/on/off), keep glasses (auto/on/off)

**Outputs:**
- 2x2 grid of photorealistic images: front, back, left-profile, right-profile
- Downloadable single images and combined grid (PNG)
- Minimal metadata: confidence score, run id

## High-Level Architecture

**Frontend (Next.js):**
- Upload page (drag/drop + file picker)
- Progress & job polling UI
- Results gallery + download
- Minimal client-side validation and image pre-processing (resize/format checks)

**Backend (Serverless/API):**
- Endpoint `POST /api/generate` accepts multipart form (selfImages[], refImages[], options)
- Job queue (in-memory for MVP or serverless functions + durable queue later)
- Worker(s) execute the generation pipeline and store outputs in object storage (S3/R2)
- `GET /api/jobs/:id` returns status + result URLs

## Processing pipeline (realism-first)

1. Preflight & moderation: reject explicit content
2. Quality scoring: choose best anchor photo(s)
3. Haircut understanding: analyze references to extract haircut spec (length, fade, texture)
4. Identity anchoring: generate a face-preserving edited front image
5. Multi-view synthesis: generate back/left/right leveraging the anchor + haircut spec
6. Postprocess: studio cleanup (lighting, mild smoothing), scale/format outputs

## Model & Tools Recommendations

- Image model stack (starting point):
  - Face-preserving edit model for front view (use best available image-editing model that supports blending and identity preservation)
  - View-synthesis model(s) for side/back views with identity anchor
  - Use higher-fidelity models for realism-first outputs (planning/prompting with gpt-5-mini; image models per chosen provider)

- Supporting tech:
  - Python for workers (Pillow, OpenCV for preprocessing)
  - FastAPI or Next.js serverless API for endpoints
  - Object storage: S3 (or R2)
  - Queue: BullMQ with Redis or simple DB-backed job table for MVP
  - CI: GitHub Actions; Deploy: Vercel for frontend, serverless for API

## Safety & Compliance

- Mandatory image moderation on uploads (block nudity/explicit content)
- Do not store images longer than necessary (policy: auto-delete after 24–72 hours unless user downloads)
- Provide clear user consent / TOS for image processing and retention

## Developer Handoff: required assets & info

- Example public dataset(s) or synthetic examples to tune prompts
- Target latency & cost budget for generation (per-job time and cost limits)
- Preferred model provider(s) + API keys (secure via secrets manager)
- Branding assets (logo, colors) for UI polish

## API Contract (MVP)

**POST /api/generate**
- multipart form-data
  - selfImages[] (file)
  - refImages[] (file)
  - options (JSON string): { "beard": "auto|on|off", "glasses": "auto|on|off" }
- 202 Accepted -> { jobId }

**GET /api/jobs/:id**
- 200 OK -> { status: pending|running|done|error, progress, results: [{view: 'front', url, confidence}] }

## Storage & Retention

- Store outputs in object storage with a TTL (default 24 hours); generate presigned URLs for downloads
- Store only metadata and job logs in DB

## Operational Notes

- Monitor token rate limits for image model provider; throttle worker concurrency to avoid spikes
- Add backoff/retry on 429s; expose metrics (generation_time_seconds, jobs_queued, jobs_failed)

## Milestones

- Week 0: Scaffold frontend & API; simple upload -> placeholder response
- Week 1: Implement face-preserving front edit (single photo path)
- Week 2: Implement multi-view generation; add postprocessing + download
- Week 3: Hardening: moderation, storage TTL, monitoring, and cost controls

## Contact

- Repo: github.com/embaya01/VirtualBarberAI
- Lead: Elisee Mbaya
