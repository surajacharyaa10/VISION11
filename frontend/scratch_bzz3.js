require('dotenv').config();
async function test() {
  const apiKey = process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY;
  const res = await fetch("https://sports.bzzoiro.com/api/v2/players/15504/career/", {
    headers: { 'Authorization': `Token ${apiKey}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data).substring(0, 800));
}
test();
