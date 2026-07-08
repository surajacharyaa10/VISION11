const apiKey = process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY || "";
fetch('https://sports.bzzoiro.com/api/v2/players/?search=messi', { headers: { Authorization: `Token ${apiKey}` } })
  .then(r => r.json())
  .then(data => console.log(data.count, data.results?.length))
  .catch(console.error);
