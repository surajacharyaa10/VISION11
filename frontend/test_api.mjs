import fetch from 'node-fetch';

const API_KEY = '981cdc47446c04457e289cc66747cf2b';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function run() {
    console.log("Testing /players?search=messi");
    const r1 = await fetch(`${BASE_URL}/players?search=messi`, { headers });
    const d1 = await r1.json();
    console.log("Errors:", d1.errors);
    console.log("Results count:", d1.results);

    console.log("Testing /players/profiles?search=messi");
    const r2 = await fetch(`${BASE_URL}/players/profiles?search=messi`, { headers });
    const d2 = await r2.json();
    console.log("Errors:", d2.errors);
    console.log("Results count:", d2.results);
}
run();
