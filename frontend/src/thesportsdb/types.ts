export interface TheSportsDBPaging {
  current: number;
  total: number;
}

export interface TheSportsDBResponse<T> {
  get: string;
  parameters: Record<string, string> | unknown[];
  errors: unknown[] | Record<string, string>;
  results: number;
  paging: TheSportsDBPaging;
  response: T;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface LiveMatchTeam {
  name: string;
  logo?: string;
}

export interface LiveMatch {
  id: string;
  name?: string;
  league?: string;
  status?: string;
  startTime?: string;
  home?: LiveMatchTeam;
  away?: LiveMatchTeam;
  raw?: Record<string, unknown>;
}

export interface StreamLink {
  id: string;
  url: string;
  quality?: string;
  language?: string;
  type?: string;
  raw?: Record<string, unknown>;
}

export interface TheSportsDBEvent {
  idEvent: string;
  idAPIfootball: string;
  strTimestamp: string;
  strEvent: string;
  strEventAlternate: string;
  strFilename: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strLeagueBadge: string;
  strSeason: string;
  strDescriptionEN: string | null;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intHomeScoreExtra: string | null;
  intAwayScoreExtra: string | null;
  intRound: string;
  intAwayScore: string | null;
  intSpectators: string | null;
  strOfficial: string;
  strWeather: string | null;
  dateEvent: string;
  dateEventLocal: string | null;
  strTime: string;
  strTimeLocal: string | null;
  strGroup: string | null;
  idHomeTeam: string;
  strHomeTeamBadge: string;
  idAwayTeam: string;
  strAwayTeamBadge: string;
  intScore: string | null;
  strResult: string;
  idVenue: string;
  strVenue: string;
  strCountry: string;
  strCity: string | null;
  strPoster: string;
  strSquare: string;
  strFanart: string | null;
  strThumb: string;
  strBanner: string;
  strMap: string | null;
  strTweet1: string;
  strVideo: string;
  strStatus: string;
  strPostponed: string;
  strLocked: string;
}

export interface TheSportsDBTeam {
  idTeam: string;
  idESPN: string | null;
  idAPIfootball: string;
  intLoved: string | null;
  strTeam: string;
  strTeamAlternate: string;
  strTeamShort: string;
  intFormedYear: string;
  strSport: string;
  strLeague: string;
  idLeague: string;
  strLeague2: string;
  idLeague2: string;
  strLeague3: string;
  idLeague3: string;
  strLeague4: string;
  idLeague4: string;
  strLeague5: string;
  idLeague5: string;
  strLeague6: string;
  idLeague6: string | null;
  strLeague7: string;
  idLeague7: string | null;
  strDivision: string | null;
  strStadium: string;
  strKeywords: string;
  strRSS: string;
  strLocation: string;
  intStadiumCapacity: string;
  strWebsite: string;
  strFacebook: string;
  strTwitter: string;
  strInstagram: string;
  strDescriptionEN: string;
  strGender: string;
  strCountry: string;
  strBadge: string;
  strLogo: string;
  strFanart1: string;
  strFanart2: string;
  strFanart3: string;
  strFanart4: string;
}

export interface TheSportsDBPlayer {
  idPlayer: string;
  idTeam: string;
  idTeam2: string | null;
  idTeamNational: string | null;
  idAPIfootball: string;
  strPlayer: string;
  strTeam: string;
  strSport: string;
  strThumb: string;
  strCutout: string;
  strNationality: string;
  dateBorn: string;
  strStatus: string;
  strPosition: string | null;
  strGender: string;
  relevance: string | null;
}

export interface TheSportsDBVenue {
  idVenue: string;
  strVenue: string;
  strVenueAlternate: string;
  strVenueSponsor: string;
  strSport: string;
  strDescriptionEN: string;
  strArchitect: string;
  intCapacity: string;
  strCost: string;
  strCountry: string;
  strLocation: string;
  strTimezone: string;
  intFormedYear: string;
  strFanart1: string;
  strFanart2: string;
  strFanart3: string;
  strFanart4: string;
  strThumb: string;
  strLogo: string;
}

export interface TheSportsDBLeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
}

export interface TheSportsDBStandingRow {
  idStanding: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strBadge: string;
  idLeague: string;
  strLeague: string;
  strSeason: string;
  strGroup: string;
  strForm: string;
  strDescription: string;
  intPlayed: string;
  intWin: string;
  intLoss: string;
  intDraw: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
  dateUpdated: string;
}

export interface TheSportsDBEventStats {
  idStatistic: string;
  idEvent: string;
  idApiFootball: string;
  strEvent: string;
  strStat: string;
  intHome: string;
  intAway: string;
}

export interface TheSportsDBTimelineItem {
  idTimeline: string;
  idEvent: string;
  strTimeline: string;
  strTimelineDetail: string;
  strHome: string;
  strEvent: string;
  idAPIfootball: string;
  idPlayer: string;
  strPlayer: string;
  strCutout: string;
  idAssist: string;
  strAssist: string;
  intTime: string;
  strPeriod: string | null;
  idTeam: string;
  strTeam: string;
  strComment: string;
  dateEvent: string;
  strSeason: string;
}

export interface TheSportsDBLineupItem {
  idLineup: string;
  idEvent: string;
  strPosition: string;
  strHome: string;
  strSubstitute: string;
  intSquadNumber: string;
  idPlayer: string;
  strPlayer: string;
  idTeam: string;
  strTeam: string;
  strCutout: string;
  strThumb: string;
  strRender: string;
}
