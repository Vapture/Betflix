const fs = require('fs');

const sports = ['soccer', 'basketball', 'tennis', 'esports_csgo', 'esports_lol'];
const teamsData = {
    soccer: ['Real Madrid', 'Barcelona', 'Man City', 'Liverpool', 'Bayern Munich', 'PSG', 'Juventus', 'Inter Milan'],
    basketball: ['Lakers', 'Warriors', 'Nets', 'Bucks', 'Suns', 'Celtics', '76ers', 'Clippers'],
    tennis: ['Player A', 'Player B', 'Player C', 'Player D', 'Player E', 'Player F'],
    esports_csgo: ['Navi', 'FaZe', 'G2', 'Vitality', 'Heroic', 'Cloud9'],
    esports_lol: ['T1', 'Gen.G', 'JDG', 'EDG', 'DRX', 'RNG']
};

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateGames(numGames = 20) {
    const games = [];
    for (let i = 0; i < numGames; i++) {
        const sportKey = getRandomElement(sports);
        let homeTeam, awayTeam;

        if (sportKey === 'tennis') {
            const players = [...teamsData.tennis];
            homeTeam = getRandomElement(players);
            players.splice(players.indexOf(homeTeam), 1);
            awayTeam = getRandomElement(players);
        } else {
            const teams = [...teamsData[sportKey]];
            homeTeam = getRandomElement(teams);
            teams.splice(teams.indexOf(homeTeam), 1);
            awayTeam = getRandomElement(teams);
        }

        const commenceTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();

        games.push({
            id: `game_${Date.now()}_${i}`,
            sportKey: sportKey.replace('_', ' '),
            sportTitle: sportKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            homeTeam,
            awayTeam,
            commenceTime,
            odds: {
                home: (Math.random() * 2 + 1.2).toFixed(2),
                draw: sportKey !== 'tennis' && sportKey !== 'basketball' ? (Math.random() * 1.5 + 2.5).toFixed(2) : undefined,
                away: (Math.random() * 2.5 + 1.5).toFixed(2),
            },
        });
    }
    return games;
}

const dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
dbData.games = generateGames(30);
fs.writeFileSync('db.json', JSON.stringify(dbData, null, 2));

console.log('Generated mock game data and updated db.json');