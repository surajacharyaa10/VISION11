const { footballDataApi } = require('./app/lib/api/footballDataApi.js');
async function test() {
  try {
     const res = await footballDataApi('/competitions/PL/teams?limit=8');
     console.log("Teams success, found:", res.teams?.length);
  } catch(e) {
     console.error("Teams failed", e.message);
  }
}
test();
