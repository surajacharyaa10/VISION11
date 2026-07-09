export type apiOptions = {
    next: any,
    headers: {
        "X-Auth-Token": string
        "Content-Type": string
    }
}

export type matchesType = {
    area: matchesArea,
    competition: matchesCompetiton,
    id:number,
    utcDate: string,
    status: string,
    matchday?: number,
    homeTeam?: matchesTeam,
    awayTeam?: matchesTeam,
    score?: scores
}

export type matchesArea = {
    id?: number,
    name: string,
    code: string,
    flag: string
}

export type matchesCompetiton = {
    id?: number,
    name: string,
    code: string,
    type: string,
    emblem: string
}

export type matchesTeam = {
    id: number,
    name: string,
    shortName: string,
    tla: string,
    crest: string
}


export type scores = {
    fullTime: {
        home: number,
        away: number
    },
    halfTime: {
        home: number,
        away: number
    }
}

/**
 *
{
  status: 'ok',
  totalResults: 4918,
  articles: [
    {
      source: [Object],
      author: 'Kris Holt',
      title: 'Apple TV will stream every MLS game for free this weekend',
      description: "If you happen to find yourself at a loose end this weekend, it might not be a bad idea to
fire up the Apple TV app and check out some Major League Soccer action. All 14 of this weekend's games will be available to watch for free in English and Spanish, so you…",
      url: 'https://www.engadget.com/apple-tv-will-stream-every-mls-game-for-free-this-weekend-170045330.html',
      urlToImage: 'https://s.yimg.com/os/creatr-uploaded-images/2022-06/bb155570-ec02-11ec-83fb-c6c11ad20cf4',      publishedAt: '2024-03-14T17:00:45Z',
      content: "If you happen to find yourself at a loose end this weekend, it might not be a bad idea to fire up the Apple TV app and check out some Major League Soccer action. All 14 of this weekend's games will b… [+923 chars]"
    },
    {
      source: [Object],
      author: 'Eli Blumenthal',
      title: 'MLS Season Pass on Apple TV: How to Watch and Stream Major League Soccer in 2024 - CNET',
      description: "America's top soccer league is back. Here's how to watch the likes of Messi, Puig and Hernandez in action.",
      url: 'https://www.cnet.com/tech/services-and-software/mls-season-pass-on-apple-tv-how-to-watch-and-stream-major-league-soccer-in-2024/',
      urlToImage: 'https://www.cnet.com/a/img/resize/b7fdc431c8fdf1da2fd3449d687d74beb520c416/hub/2022/06/14/4a7cc388-05fd-4b9b-9d10-7366284da980/apple-mls-partnership-june-2022-big-jpg-large-2x.jpg?auto=webp&fit=crop&height=675&width=1200',
      publishedAt: '2024-02-19T23:30:01Z',
      content: "The start of the 2024 MLS season is almost upon us, and Apple TV's soccer service MLS Season Pass is once again the only way to catch all the soccer
action live.\r\n" +
        'Free-scoring Columbus Crew enter the… [+7415 chars]'
    },
    {
      source: [Object],
      author: 'Kevin Lynch',
      title: 'Arsenal vs. Brentford Livestream: How to
Watch English Premier League Soccer From Anywhere - CNET',
      description: 'The Gunners could go top of the table with a win against the Bees.',
      url: 'https://www.cnet.com/tech/services-and-software/arsenal-vs-brentford-livestream-how-to-watch-english-premier-league-soccer-from-anywhere/',
      urlToImage: 'https://www.cnet.com/a/img/resize/245718d6a235f70efffa2a629217fc4698c97640/hub/2024/03/08/9f69deed-ae35-4c18-a06b-76c6df642984/gettyimages-1818229229.jpg?auto=webp&fit=crop&height=675&width=1200',
      publishedAt: '2024-03-09T14:30:05Z',
      content: 'In-form Arsenal host London rivals Brentford on Saturday, knowing that a win will send them top of the English Premier League. \r\n' +
        'The Gunners will be aiming to extend an impressive streak of seven str… [+5311 chars]'
    },
    {
      source: [Object],
      author: 'Kevin Lynch',
      title: 'Watch Champions League Soccer: Livestream Barcelona vs. Napoli From Anywhere - CNET',
      description: 'Catalan giants take on the Neapolitans after the two sides played out a 1-1 draw last month.',
      url: 'https://www.cnet.com/tech/services-and-software/watch-champions-league-soccer-livestream-barcelona-vs-napoli-from-anywhere/',
      urlToImage: 'https://www.cnet.com/a/img/resize/db3ce0302ff69bf63fd986541031f3eb5a30fd6b/hub/2024/03/12/fb7c23b3-6eb3-42cb-a71b-8041626dc77c/gettyimages-2003456938.jpg?auto=webp&fit=crop&height=675&width=1200',
      publishedAt: '2024-03-12T17:00:50Z',
      content: 'Barcelona host Napoli in this finely poised Champions League last-16, second-leg clash at the
Lluís Companys Olympic Stadium. \r\n' +
        "Last month's first leg at the Stadio Diego Armando Maradona saw Victor … [+4801 chars]"
    },
    {
      source: [Object],
      author: 'Boone Ashworth',
      title: "It’s Apparently Easy to Crack the Apple Vision Pro's Front Screen",
      description: 'Plus: Apple launches a Sports app for the iPhone, Sony is testing its PlayStation VR headset on PC games, and Hamilton has a fancy new watch to celebrate the arrival of Dune: Part Two.',
      url: 'https://www.wired.com/story/apple-vision-pro-crack-in-front-screen/',
      urlToImage: 'https://media.wired.com/photos/65d93d967507e5f7e3e9be3b/191:100/w_1280,c_limit/Apple-Vision-Pro-Cracked-Screen-02-Gear.jpg',
      publishedAt: '2024-02-24T14:30:00Z',
      content: 'Apples mixed-reality headset is selling well, but its embroiled in a new mystery thats proving tough to crack.\r\n' +
        'As first reported by MacRumors, some customers have discovered a mysterious crack appea… [+4569 chars]'
    }
  ]
}
 */

export type newsType = {
    source: [Object],
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string
  }