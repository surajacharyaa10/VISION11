const response = await fetch('https://v3.football.api-sports.io/players/profiles?search=neymar', {
    method: 'GET',
    headers: {
        'x-apisports-key': '981cdc47446c04457e289cc66747cf2b',
    },
});

const data = await response.json();
console.log(data);