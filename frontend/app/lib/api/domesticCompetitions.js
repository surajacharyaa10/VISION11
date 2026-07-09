import footballDataApi from "./footballDataApi";

// ─── ISO-3166 Alpha-3 → Alpha-2 map (for flagcdn.com) ────────────────────────
// flagcdn.com uses 2-letter codes: https://flagcdn.com/w40/{alpha2}.png
const ISO3_TO_ISO2 = {
  AFG: "af", ALB: "al", DZA: "dz", AND: "ad", AGO: "ao", ATG: "ag", ARG: "ar", ARM: "am",
  AUS: "au", AUT: "at", AZE: "az", BHS: "bs", BHR: "bh", BGD: "bd", BRB: "bb", BLR: "by",
  BEL: "be", BLZ: "bz", BEN: "bj", BTN: "bt", BOL: "bo", BIH: "ba", BWA: "bw", BRA: "br",
  BRN: "bn", BGR: "bg", BFA: "bf", BDI: "bi", CPV: "cv", KHM: "kh", CMR: "cm", CAN: "ca",
  CAF: "cf", TCD: "td", CHL: "cl", CHN: "cn", COL: "co", COM: "km", COD: "cd", COG: "cg",
  CRI: "cr", CIV: "ci", HRV: "hr", CUB: "cu", CYP: "cy", CZE: "cz", DNK: "dk", DJI: "dj",
  DMA: "dm", DOM: "do", ECU: "ec", EGY: "eg", SLV: "sv", GNQ: "gq", ERI: "er", EST: "ee",
  SWZ: "sz", ETH: "et", FJI: "fj", FIN: "fi", FRA: "fr", GAB: "ga", GMB: "gm", GEO: "ge",
  DEU: "de", GHA: "gh", GRC: "gr", GRD: "gd", GTM: "gt", GIN: "gn", GNB: "gw", GUY: "gy",
  HTI: "ht", HND: "hn", HUN: "hu", ISL: "is", IND: "in", IDN: "id", IRN: "ir", IRQ: "iq",
  IRL: "ie", ISR: "il", ITA: "it", JAM: "jm", JPN: "jp", JOR: "jo", KAZ: "kz", KEN: "ke",
  PRK: "kp", KOR: "kr", KWT: "kw", KGZ: "kg", LAO: "la", LVA: "lv", LBN: "lb", LSO: "ls",
  LBR: "lr", LBA: "ly", LIE: "li", LTU: "lt", LUX: "lu", MDG: "mg", MWI: "mw", MYS: "my",
  MDV: "mv", MLI: "ml", MLT: "mt", MRT: "mr", MUS: "mu", MEX: "mx", MDA: "md", MCO: "mc",
  MNG: "mn", MNE: "me", MAR: "ma", MOZ: "mz", MMR: "mm", NAM: "na", NRU: "nr", NPL: "np",
  NLD: "nl", NZL: "nz", NIC: "ni", NER: "ne", NGA: "ng", MKD: "mk", NOR: "no", OMN: "om",
  PAK: "pk", PSE: "ps", PAN: "pa", PNG: "pg", PRY: "py", PER: "pe", PHL: "ph", POL: "pl",
  PRT: "pt", QAT: "qa", ROU: "ro", RUS: "ru", RWA: "rw", KNA: "kn", LCA: "lc", VCT: "vc",
  WSM: "ws", SMR: "sm", STP: "st", SAU: "sa", SEN: "sn", SRB: "rs", SLE: "sl", SGP: "sg",
  SVK: "sk", SVN: "si", SLB: "sb", SOM: "so", ZAF: "za", SSD: "ss", ESP: "es", LKA: "lk",
  SDN: "sd", SUR: "sr", SWE: "se", CHE: "ch", SYR: "sy", TJK: "tj", TZA: "tz", THA: "th",
  TLS: "tl", TGO: "tg", TON: "to", TTO: "tt", TUN: "tn", TUR: "tr", TKM: "tm", TUV: "tv",
  UGA: "ug", UKR: "ua", ARE: "ae", GBR: "gb", USA: "us", URY: "uy", UZB: "uz", VUT: "vu",
  VEN: "ve", VNM: "vn", YEM: "ye", ZMB: "zm", ZWE: "zw", XKX: "xk", MAC: "mo", HKG: "hk",
  NCL: "nc", PYF: "pf", PRI: "pr", FRO: "fo",
  // UK home nations
  ENG: "gb-eng", SCO: "gb-sct", WAL: "gb-wls", NIR: "gb-nir",
};

/**
 * Derive a reliable flag URL.
 * 1. Use the football-data.org flag if provided.
 * 2. Fall back to flagcdn.com using the ISO alpha-3 country code.
 */
function resolveFlag(apiFlag, countryCode) {
  if (apiFlag) return apiFlag;
  if (!countryCode) return null;
  const alpha2 = ISO3_TO_ISO2[countryCode.toUpperCase()];
  if (!alpha2) return null;
  return `https://flagcdn.com/w40/${alpha2}.png`;
}

// ─── Comprehensive baseline: all 211 FIFA member associations ─────────────────
const FIFA_BASELINE = [
  { areaName: "Afghanistan", areaCode: "AFG", leagueName: "Afghan Premier League" },
  { areaName: "Albania", areaCode: "ALB", leagueName: "Superliga" },
  { areaName: "Algeria", areaCode: "DZA", leagueName: "Ligue Professionnelle 1" },
  { areaName: "Andorra", areaCode: "AND", leagueName: "Primera Divisió" },
  { areaName: "Angola", areaCode: "AGO", leagueName: "Girabola" },
  { areaName: "Antigua and Barbuda", areaCode: "ATG", leagueName: "ABFA Premier Division" },
  { areaName: "Argentina", areaCode: "ARG", leagueName: "Primera División" },
  { areaName: "Armenia", areaCode: "ARM", leagueName: "Armenian Premier League" },
  { areaName: "Australia", areaCode: "AUS", leagueName: "A-League Men" },
  { areaName: "Austria", areaCode: "AUT", leagueName: "Bundesliga" },
  { areaName: "Azerbaijan", areaCode: "AZE", leagueName: "Premyer Liqa" },
  { areaName: "Bahamas", areaCode: "BHS", leagueName: "BFA Senior League" },
  { areaName: "Bahrain", areaCode: "BHR", leagueName: "Bahrain Premier League" },
  { areaName: "Bangladesh", areaCode: "BGD", leagueName: "Bangladesh Premier League" },
  { areaName: "Barbados", areaCode: "BRB", leagueName: "Barbados FA League" },
  { areaName: "Belarus", areaCode: "BLR", leagueName: "Vysheyshaya Liga" },
  { areaName: "Belgium", areaCode: "BEL", leagueName: "First Division A" },
  { areaName: "Belize", areaCode: "BLZ", leagueName: "Premier League of Belize" },
  { areaName: "Benin", areaCode: "BEN", leagueName: "Ligue 1" },
  { areaName: "Bhutan", areaCode: "BTN", leagueName: "National League" },
  { areaName: "Bolivia", areaCode: "BOL", leagueName: "División de Fútbol Profesional" },
  { areaName: "Bosnia-Herzegovina", areaCode: "BIH", leagueName: "Premier liga" },
  { areaName: "Botswana", areaCode: "BWA", leagueName: "Botswana Premier League" },
  { areaName: "Brazil", areaCode: "BRA", leagueName: "Campeonato Brasileiro Série A" },
  { areaName: "Brunei Darussalam", areaCode: "BRN", leagueName: "Premier League" },
  { areaName: "Bulgaria", areaCode: "BGR", leagueName: "First Professional Football League" },
  { areaName: "Burkina Faso", areaCode: "BFA", leagueName: "Championnat National" },
  { areaName: "Burundi", areaCode: "BDI", leagueName: "Primus League" },
  { areaName: "Cambodia", areaCode: "KHM", leagueName: "Cambodian League" },
  { areaName: "Cameroon", areaCode: "CMR", leagueName: "Elite One" },
  { areaName: "Canada", areaCode: "CAN", leagueName: "Canadian Premier League" },
  { areaName: "Cape Verde Islands", areaCode: "CPV", leagueName: "Campeonato Nacional" },
  { areaName: "Central African Rep.", areaCode: "CAF", leagueName: "Ligue 1" },
  { areaName: "Chad", areaCode: "TCD", leagueName: "Championnat National" },
  { areaName: "Chile", areaCode: "CHL", leagueName: "Primera División" },
  { areaName: "China PR", areaCode: "CHN", leagueName: "Chinese Super League" },
  { areaName: "Colombia", areaCode: "COL", leagueName: "Categoría Primera A" },
  { areaName: "Comoros", areaCode: "COM", leagueName: "Division Régionale 1" },
  { areaName: "Congo", areaCode: "COG", leagueName: "Ligue 1" },
  { areaName: "Congo DR", areaCode: "COD", leagueName: "Linafoot" },
  { areaName: "Costa Rica", areaCode: "CRI", leagueName: "Primera División" },
  { areaName: "Croatia", areaCode: "HRV", leagueName: "Hrvatska nogometna liga" },
  { areaName: "Cuba", areaCode: "CUB", leagueName: "Liga de Fútbol de Cuba" },
  { areaName: "Cyprus", areaCode: "CYP", leagueName: "First Division" },
  { areaName: "Czech Republic", areaCode: "CZE", leagueName: "Czech Football League" },
  { areaName: "Côte d'Ivoire", areaCode: "CIV", leagueName: "Ligue 1" },
  { areaName: "Denmark", areaCode: "DNK", leagueName: "Superliga" },
  { areaName: "Djibouti", areaCode: "DJI", leagueName: "Djibouti Premier League" },
  { areaName: "Dominica", areaCode: "DMA", leagueName: "DFA League" },
  { areaName: "Dominican Republic", areaCode: "DOM", leagueName: "Liga Dominicana de Fútbol" },
  { areaName: "Ecuador", areaCode: "ECU", leagueName: "Serie A" },
  { areaName: "Egypt", areaCode: "EGY", leagueName: "Egyptian Premier League" },
  { areaName: "El Salvador", areaCode: "SLV", leagueName: "Primera División" },
  { areaName: "England", areaCode: "ENG", leagueName: "Premier League" },
  { areaName: "Equatorial Guinea", areaCode: "GNQ", leagueName: "National League" },
  { areaName: "Eritrea", areaCode: "ERI", leagueName: "Eritrean Premier League" },
  { areaName: "Estonia", areaCode: "EST", leagueName: "Meistriliiga" },
  { areaName: "Eswatini", areaCode: "SWZ", leagueName: "Premier League" },
  { areaName: "Ethiopia", areaCode: "ETH", leagueName: "Ethiopian Premier League" },
  { areaName: "Faroe Islands", areaCode: "FRO", leagueName: "Faroese Premier League" },
  { areaName: "Fiji", areaCode: "FJI", leagueName: "Vodafone Premier League" },
  { areaName: "Finland", areaCode: "FIN", leagueName: "Veikkausliiga" },
  { areaName: "France", areaCode: "FRA", leagueName: "Ligue 1" },
  { areaName: "Gabon", areaCode: "GAB", leagueName: "Championnat National" },
  { areaName: "Gambia", areaCode: "GMB", leagueName: "GFF League" },
  { areaName: "Georgia", areaCode: "GEO", leagueName: "Crystalbet Erovnuli Liga" },
  { areaName: "Germany", areaCode: "DEU", leagueName: "Bundesliga" },
  { areaName: "Ghana", areaCode: "GHA", leagueName: "Ghana Premier League" },
  { areaName: "Greece", areaCode: "GRC", leagueName: "Super League" },
  { areaName: "Grenada", areaCode: "GRD", leagueName: "GFA Super League" },
  { areaName: "Guatemala", areaCode: "GTM", leagueName: "Liga Nacional" },
  { areaName: "Guinea", areaCode: "GIN", leagueName: "Ligue Professionnelle" },
  { areaName: "Guinea-Bissau", areaCode: "GNB", leagueName: "Liga Desportiva" },
  { areaName: "Guyana", areaCode: "GUY", leagueName: "GFF Elite League" },
  { areaName: "Haiti", areaCode: "HTI", leagueName: "Championnat National" },
  { areaName: "Honduras", areaCode: "HND", leagueName: "Liga Nacional" },
  { areaName: "Hong Kong", areaCode: "HKG", leagueName: "Hong Kong Premier League" },
  { areaName: "Hungary", areaCode: "HUN", leagueName: "OTP Bank Liga" },
  { areaName: "Iceland", areaCode: "ISL", leagueName: "Úrvalsdeild" },
  { areaName: "India", areaCode: "IND", leagueName: "Indian Super League" },
  { areaName: "Indonesia", areaCode: "IDN", leagueName: "Liga 1" },
  { areaName: "Iran", areaCode: "IRN", leagueName: "Persian Gulf Pro League" },
  { areaName: "Iraq", areaCode: "IRQ", leagueName: "Iraqi Premier League" },
  { areaName: "Ireland", areaCode: "IRL", leagueName: "League of Ireland Premier Division" },
  { areaName: "Israel", areaCode: "ISR", leagueName: "Ligat ha'Al" },
  { areaName: "Italy", areaCode: "ITA", leagueName: "Serie A" },
  { areaName: "Jamaica", areaCode: "JAM", leagueName: "National Premier League" },
  { areaName: "Japan", areaCode: "JPN", leagueName: "J1 League" },
  { areaName: "Jordan", areaCode: "JOR", leagueName: "Jordan Premier League" },
  { areaName: "Kazakhstan", areaCode: "KAZ", leagueName: "Kazakhstan Premier League" },
  { areaName: "Kenya", areaCode: "KEN", leagueName: "FKF Premier League" },
  { areaName: "Korea DPR", areaCode: "PRK", leagueName: "DPR Korea League" },
  { areaName: "Korea Republic", areaCode: "KOR", leagueName: "K League 1" },
  { areaName: "Kosovo", areaCode: "XKX", leagueName: "Football Superleague of Kosovo" },
  { areaName: "Kuwait", areaCode: "KWT", leagueName: "Kuwait Premier League" },
  { areaName: "Kyrgyzstan", areaCode: "KGZ", leagueName: "Top League" },
  { areaName: "Laos", areaCode: "LAO", leagueName: "Lao League" },
  { areaName: "Latvia", areaCode: "LVA", leagueName: "Virsliga" },
  { areaName: "Lebanon", areaCode: "LBN", leagueName: "Lebanese Premier League" },
  { areaName: "Lesotho", areaCode: "LSO", leagueName: "Vodacom Premier League" },
  { areaName: "Liberia", areaCode: "LBR", leagueName: "LFA First Division" },
  { areaName: "Libya", areaCode: "LBA", leagueName: "Libyan Premier League" },
  { areaName: "Liechtenstein", areaCode: "LIE", leagueName: "Liechtenstein Cup" },
  { areaName: "Lithuania", areaCode: "LTU", leagueName: "A Lyga" },
  { areaName: "Luxembourg", areaCode: "LUX", leagueName: "BGL Ligue" },
  { areaName: "Macau", areaCode: "MAC", leagueName: "Macau Football League" },
  { areaName: "Madagascar", areaCode: "MDG", leagueName: "Championnat National" },
  { areaName: "Malawi", areaCode: "MWI", leagueName: "TNM Super League" },
  { areaName: "Malaysia", areaCode: "MYS", leagueName: "Malaysia Super League" },
  { areaName: "Maldives", areaCode: "MDV", leagueName: "Dhivehi Premier League" },
  { areaName: "Mali", areaCode: "MLI", leagueName: "Ligue 1" },
  { areaName: "Malta", areaCode: "MLT", leagueName: "Malta Premier League" },
  { areaName: "Mauritania", areaCode: "MRT", leagueName: "Mauritanie Première Division" },
  { areaName: "Mauritius", areaCode: "MUS", leagueName: "Mauritius Football League" },
  { areaName: "Mexico", areaCode: "MEX", leagueName: "Liga MX" },
  { areaName: "Moldova", areaCode: "MDA", leagueName: "Moldovan National Division" },
  { areaName: "Mongolia", areaCode: "MNG", leagueName: "MFF Premier League" },
  { areaName: "Montenegro", areaCode: "MNE", leagueName: "Montenegrin First Football League" },
  { areaName: "Morocco", areaCode: "MAR", leagueName: "Botola Pro" },
  { areaName: "Mozambique", areaCode: "MOZ", leagueName: "Moçambola" },
  { areaName: "Myanmar", areaCode: "MMR", leagueName: "Myanmar National League" },
  { areaName: "Namibia", areaCode: "NAM", leagueName: "NFA Namibia Premier League" },
  { areaName: "Nepal", areaCode: "NPL", leagueName: "Martyr's Memorial A Division League" },
  { areaName: "Netherlands", areaCode: "NLD", leagueName: "Eredivisie" },
  { areaName: "New Caledonia", areaCode: "NCL", leagueName: "Championnat de Nouvelle-Calédonie" },
  { areaName: "New Zealand", areaCode: "NZL", leagueName: "National League" },
  { areaName: "Nicaragua", areaCode: "NIC", leagueName: "Primera División" },
  { areaName: "Niger", areaCode: "NER", leagueName: "Championnat du Niger" },
  { areaName: "Nigeria", areaCode: "NGA", leagueName: "Nigeria Premier Football League" },
  { areaName: "North Macedonia", areaCode: "MKD", leagueName: "Prva Makedonska fudbalska liga" },
  { areaName: "Northern Ireland", areaCode: "NIR", leagueName: "NIFL Premiership" },
  { areaName: "Norway", areaCode: "NOR", leagueName: "Eliteserien" },
  { areaName: "Oman", areaCode: "OMN", leagueName: "Oman Professional League" },
  { areaName: "Pakistan", areaCode: "PAK", leagueName: "Premier League" },
  { areaName: "Palestine", areaCode: "PSE", leagueName: "West Bank League" },
  { areaName: "Panama", areaCode: "PAN", leagueName: "Liga Panameña de Fútbol" },
  { areaName: "Papua New Guinea", areaCode: "PNG", leagueName: "NSNL" },
  { areaName: "Paraguay", areaCode: "PRY", leagueName: "División de Honor" },
  { areaName: "Peru", areaCode: "PER", leagueName: "Liga 1" },
  { areaName: "Philippines", areaCode: "PHL", leagueName: "Philippines Football League" },
  { areaName: "Poland", areaCode: "POL", leagueName: "PKO BP Ekstraklasa" },
  { areaName: "Portugal", areaCode: "PRT", leagueName: "Primeira Liga" },
  { areaName: "Puerto Rico", areaCode: "PRI", leagueName: "Puerto Rico Soccer League" },
  { areaName: "Qatar", areaCode: "QAT", leagueName: "Qatar Stars League" },
  { areaName: "Romania", areaCode: "ROU", leagueName: "SuperLiga" },
  { areaName: "Russia", areaCode: "RUS", leagueName: "Premier-liga" },
  { areaName: "Rwanda", areaCode: "RWA", leagueName: "Rwanda Premier League" },
  { areaName: "San Marino", areaCode: "SMR", leagueName: "Campionato Sammarinese" },
  { areaName: "Saudi Arabia", areaCode: "SAU", leagueName: "Saudi Professional League" },
  { areaName: "Scotland", areaCode: "SCO", leagueName: "Scottish Premiership" },
  { areaName: "Senegal", areaCode: "SEN", leagueName: "Ligue 1" },
  { areaName: "Serbia", areaCode: "SRB", leagueName: "SuperLiga" },
  { areaName: "Sierra Leone", areaCode: "SLE", leagueName: "Sierra Leone Premier League" },
  { areaName: "Singapore", areaCode: "SGP", leagueName: "Singapore Premier League" },
  { areaName: "Slovakia", areaCode: "SVK", leagueName: "Fortuna liga" },
  { areaName: "Slovenia", areaCode: "SVN", leagueName: "Prva liga" },
  { areaName: "Solomon Islands", areaCode: "SLB", leagueName: "Solomon Islands National Club Championship" },
  { areaName: "Somalia", areaCode: "SOM", leagueName: "Somali League" },
  { areaName: "South Africa", areaCode: "ZAF", leagueName: "DStv Premiership" },
  { areaName: "South Sudan", areaCode: "SSD", leagueName: "South Sudan National Football League" },
  { areaName: "Spain", areaCode: "ESP", leagueName: "La Liga" },
  { areaName: "Sri Lanka", areaCode: "LKA", leagueName: "Dialog Champions League" },
  { areaName: "St. Kitts and Nevis", areaCode: "KNA", leagueName: "SKNFA Premier League" },
  { areaName: "St. Lucia", areaCode: "LCA", leagueName: "SLFA Premier Division" },
  { areaName: "St. Vincent / Grenadines", areaCode: "VCT", leagueName: "SVG Super League" },
  { areaName: "Sudan", areaCode: "SDN", leagueName: "Sudan Premier League" },
  { areaName: "Suriname", areaCode: "SUR", leagueName: "SVB Eerste Divisie" },
  { areaName: "Sweden", areaCode: "SWE", leagueName: "Allsvenskan" },
  { areaName: "Switzerland", areaCode: "CHE", leagueName: "Super League" },
  { areaName: "Syria", areaCode: "SYR", leagueName: "Syrian Premier League" },
  { areaName: "São Tomé e Príncipe", areaCode: "STP", leagueName: "Campeonato Nacional" },
  { areaName: "Tahiti", areaCode: "PYF", leagueName: "Ligue de Tahiti" },
  { areaName: "Tajikistan", areaCode: "TJK", leagueName: "Vysshaya Liga" },
  { areaName: "Tanzania", areaCode: "TZA", leagueName: "NBC Premier League" },
  { areaName: "Thailand", areaCode: "THA", leagueName: "Thai League 1" },
  { areaName: "Timor-Leste", areaCode: "TLS", leagueName: "Timor-Leste Football League" },
  { areaName: "Togo", areaCode: "TGO", leagueName: "Championnat National" },
  { areaName: "Tonga", areaCode: "TON", leagueName: "Tonga Football League" },
  { areaName: "Trinidad and Tobago", areaCode: "TTO", leagueName: "Trinidad and Tobago Premier Football League" },
  { areaName: "Tunisia", areaCode: "TUN", leagueName: "Ligue Professionnelle 1" },
  { areaName: "Turkey", areaCode: "TUR", leagueName: "Süper Lig" },
  { areaName: "Turkmenistan", areaCode: "TKM", leagueName: "Ýokary Liga" },
  { areaName: "Uganda", areaCode: "UGA", leagueName: "StarTimes Uganda Premier League" },
  { areaName: "Ukraine", areaCode: "UKR", leagueName: "Ukrainian Premier League" },
  { areaName: "United Arab Emirates", areaCode: "ARE", leagueName: "UAE Pro League" },
  { areaName: "United States", areaCode: "USA", leagueName: "Major League Soccer" },
  { areaName: "Uruguay", areaCode: "URY", leagueName: "Primera División" },
  { areaName: "Uzbekistan", areaCode: "UZB", leagueName: "Uzbekistan Super League" },
  { areaName: "Vanuatu", areaCode: "VUT", leagueName: "Vanuatu Premier League" },
  { areaName: "Venezuela", areaCode: "VEN", leagueName: "Primera División Venezolana" },
  { areaName: "Vietnam", areaCode: "VNM", leagueName: "V.League 1" },
  { areaName: "Wales", areaCode: "WAL", leagueName: "Cymru Premier" },
  { areaName: "Yemen", areaCode: "YEM", leagueName: "Yemen League" },
  { areaName: "Zambia", areaCode: "ZMB", leagueName: "FAZ Super Division" },
  { areaName: "Zimbabwe", areaCode: "ZWE", leagueName: "Zimbabwe Premier Soccer League" },
];

/**
 * Fetches all 211 FIFA member associations with their flags and domestic
 * competitions. Strategy:
 *
 *  1. Seed from FIFA_BASELINE (all 211 countries + primary domestic league name).
 *  2. Fetch /areas to overlay official API flags.
 *  3. Fetch /competitions to overlay live competition data (id, emblem, plan).
 *  4. Flags: prefer API flag, fall back to flagcdn.com via ISO3→ISO2 map.
 *  5. Countries not covered by the API still show their league name + flag.
 *
 * Returns: { data: Area[], isDemo: boolean }
 */
export async function getAllCompetitionsByCountry() {
  // Step 1: Seed from baseline
  const grouped = {};
  for (const entry of FIFA_BASELINE) {
    grouped[entry.areaName] = {
      areaName: entry.areaName,
      areaCode: entry.areaCode,
      areaFlag: resolveFlag(null, entry.areaCode),
      competitions: [
        {
          id: null,
          name: entry.leagueName,
          code: null,
          type: "LEAGUE",
          emblem: null,
          plan: null,
          isBaseline: true,
        },
      ],
    };
  }

  let isDemo = false;

  try {
    // Steps 2 & 3: Fetch /areas and /competitions in parallel
    const [areasRes, compsRes] = await Promise.all([
      footballDataApi("/areas"),
      footballDataApi("/competitions"),
    ]);

    // Step 2: Overlay official API flags
    if (areasRes?.areas) {
      for (const area of areasRes.areas) {
        const name = area.name;
        if (grouped[name]) {
          grouped[name].areaFlag = resolveFlag(
            area.flag,
            area.countryCode || grouped[name].areaCode
          );
        }
      }
    }

    // Step 3: Overlay live competition data
    if (compsRes?.competitions) {
      for (const comp of compsRes.competitions) {
        const areaName = comp.area?.name || "International";

        if (!grouped[areaName]) {
          grouped[areaName] = {
            areaName,
            areaCode: comp.area?.code || null,
            areaFlag: resolveFlag(comp.area?.flag, comp.area?.code),
            competitions: [],
          };
        }

        // Remove baseline placeholder so live data takes over
        grouped[areaName].competitions = grouped[areaName].competitions.filter(
          (c) => !c.isBaseline
        );

        grouped[areaName].competitions.push({
          id: comp.id,
          name: comp.name,
          code: comp.code,
          type: comp.type,
          emblem: comp.emblem,
          plan: comp.plan,
          isBaseline: false,
        });
      }
    }
  } catch (error) {
    console.warn(
      "football-data.org fetch failed; showing baseline data with flagcdn.com flags:",
      error.message || error
    );
    isDemo = true;
  }

  const sorted = Object.values(grouped).sort((a, b) =>
    a.areaName.localeCompare(b.areaName)
  );

  return { data: sorted, isDemo };
}

// ─── Fallback for getDomesticCompetitions (backward compat) ──────────────────
const MOCK_LEAGUES = [
  {
    league: { id: 2021, name: "Premier League", type: "League", logo: "https://crests.football-data.org/PL.png" },
    country: { name: "England", code: "ENG", flag: resolveFlag(null, "ENG") },
    seasons: [{ year: 2026, start: "2026-08-15", end: "2027-05-23", current: true, coverage: { standings: true, players: true, top_scorers: true, top_assists: true, predictions: true, odds: true } }],
  },
  {
    league: { id: 2014, name: "Primera Division", type: "League", logo: "https://crests.football-data.org/PD.png" },
    country: { name: "Spain", code: "ESP", flag: resolveFlag(null, "ESP") },
    seasons: [{ year: 2026, start: "2026-08-18", end: "2027-05-26", current: true, coverage: { standings: true, players: true, top_scorers: true, top_assists: true, predictions: true, odds: false } }],
  },
  {
    league: { id: 2019, name: "Serie A", type: "League", logo: "https://crests.football-data.org/SA.png" },
    country: { name: "Italy", code: "ITA", flag: resolveFlag(null, "ITA") },
    seasons: [{ year: 2026, start: "2026-08-19", end: "2027-05-26", current: true, coverage: { standings: true, players: true, top_scorers: true, top_assists: true, predictions: true, odds: true } }],
  },
  {
    league: { id: 2002, name: "Bundesliga", type: "League", logo: "https://crests.football-data.org/BL1.png" },
    country: { name: "Germany", code: "DEU", flag: resolveFlag(null, "DEU") },
    seasons: [{ year: 2026, start: "2026-08-22", end: "2027-05-18", current: true, coverage: { standings: true, players: true, top_scorers: true, top_assists: true, predictions: true, odds: true } }],
  },
  {
    league: { id: 2015, name: "Ligue 1", type: "League", logo: "https://crests.football-data.org/FL1.png" },
    country: { name: "France", code: "FRA", flag: resolveFlag(null, "FRA") },
    seasons: [{ year: 2026, start: "2026-08-11", end: "2027-05-19", current: true, coverage: { standings: false, players: false, top_scorers: false, top_assists: false, predictions: false, odds: false } }],
  },
];

export async function getDomesticCompetitions() {
  const targetIds = [2021, 2014, 2019, 2002, 2015];

  try {
    const response = await footballDataApi("/competitions");

    if (!response || !response.competitions) {
      throw new Error("Invalid response format from competitions API");
    }

    const filtered = response.competitions.filter(comp =>
      targetIds.includes(comp.id)
    );

    if (filtered.length === 0) {
      throw new Error("No targeted competitions found in API response");
    }

    const mapped = filtered.map(comp => {
      const currentSeason = comp.currentSeason || {};
      const year = currentSeason.startDate ? new Date(currentSeason.startDate).getFullYear() : 2026;
      const start = currentSeason.startDate || "2026-08-15";
      const end = currentSeason.endDate || "2027-05-23";

      return {
        league: {
          id: comp.id,
          name: comp.name,
          type: comp.type === "LEAGUE" ? "League" : (comp.type === "CUP" ? "Cup" : comp.type),
          logo: comp.emblem,
        },
        country: {
          name: comp.area ? comp.area.name : "International",
          code: comp.area ? comp.area.code : null,
          flag: resolveFlag(comp.area?.flag, comp.area?.code),
        },
        seasons: [{
          year,
          start,
          end,
          current: true,
          coverage: {
            standings: true,
            players: true,
            top_scorers: true,
            top_assists: true,
            predictions: comp.plan === "TIER_ONE" || comp.plan === "TIER_TWO",
            odds: comp.plan === "TIER_ONE",
          },
        }],
      };
    });

    return { data: mapped, isDemo: false };
  } catch (error) {
    console.warn("Failed to fetch domestic competitions from football-data.org, using fallback:", error.message || error);
    return { data: MOCK_LEAGUES, isDemo: true };
  }
}
