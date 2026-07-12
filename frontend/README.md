Football information site using Next.js, Typescript and tailwind CSS

### Run the development server:

```bash
yarn dev
```
### Environment variables

Create a `.env` file in the `frontend` directory with the following variables. Values shown are placeholders — replace them with your own API keys.

```env
# football-data.org (src/api/index.ts, src/thesportsdb/footballdata.ts)
API_TOKEN=your_football_data_token
FOOTBALLDATA_API_KEY=your_football_data_from_io

# newsapi.org (src/api/index.ts)
API_TOKEN_NEWS=your_newsapi_key

# thesportsdb.com (free/test key is "123")
THESPORTSDB_API_KEY=123
NEXT_PUBLIC_THESPORTSDB_API_KEY=123
NEXT_PUBLIC_THE_SPORTS_DB_API_KEY=123

# live stream / scoreboard (src/thesportsdb/client.ts)
LIVE_STREAM_API_KEY=your_live_stream_key

# pexels (src/app/api/imageapi/route.ts)
PEXELS_API_KEY=your_pexels_key

# sportsrc (src/lib/sportsrc.ts — sent as X-API-KEY)
SPORTSRC_API_KEY=your_sportsrc_key
NEXT_PUBLIC_SPORTSRC_API_KEY=your_sportsrc_key

# supabase (src/app/Livestreamplayer/components/ScoreBoard.tsx)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### API source
API used from following sites:

News: [https://newsapi.org/](https://newsapi.org/)

Football Stats: [https://www.football-data.org](https://www.football-data.org)