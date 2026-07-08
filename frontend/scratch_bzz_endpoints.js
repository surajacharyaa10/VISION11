require('dotenv').config();
async function test() {
  const apiKey = process.env.BZZOIRO_API_KEY || process.env.NEXT_PUBLIC_BZZOIRO_API_KEY;
  const id = 15504; // Test ID
  
  const headers = { 'Authorization': `Token ${apiKey}` };
  
  const fetchEndpoint = async (path) => {
     try {
       const res = await fetch(`https://sports.bzzoiro.com/api/v2/players/${id}${path}`, { headers });
       return await res.json();
     } catch (e) { return null; }
  };
  
  console.log("Player:", JSON.stringify(await fetchEndpoint('/')).substring(0, 100));
  console.log("Career:", JSON.stringify(await fetchEndpoint('/career/')).substring(0, 100));
  console.log("National:", JSON.stringify(await fetchEndpoint('/national-team/')).substring(0, 100));
  console.log("Stats:", JSON.stringify(await fetchEndpoint('/stats/')).substring(0, 100));
  console.log("Transfers:", JSON.stringify(await fetchEndpoint('/transfers/')).substring(0, 100));
}
test();
