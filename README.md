# Multibot Monorepo

This repository contains the services that make up the multibot platform. Each service lives in its own directory and can be run individually during development. A docker compose file in each directory describes how that service should be started.

## Services

- **supabase/** – Database and authentication layer using [Supabase](https://supabase.com/).
- **rasa/** – Core Rasa bot project defining intents and stories.
- **action-server/** – Custom action server for the Rasa bot.
- **gateway/** – API gateway that connects the front‑end to the underlying services.
- **panel/** – Administration web panel for managing bots and settings.
- **bot-ui/** – Stand‑alone user interface for interacting with the bot.

Each service provides an example `.env` file and a bare `docker-compose.yml` to illustrate configuration. The services can be combined using a top‑level compose file (not yet included) to run the whole stack.
