require('dotenv').config();
async function test() {
  const apiKey = process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY;
  console.log("Key found:", !!apiKey);
  const res = await fetch("https://sports.bzzoiro.com/api/v2/players/?limit=2", {
    headers: { 'Authorization': `Token ${apiKey}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data).substring(0, 500));
}
test();
