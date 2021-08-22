export default function renderScoreboard(scoreboard, game, requestAnimationFrame, currentPlayerId) {

    let score = "";
    const playersArray = [];

    for(const playerId in game.state.players){
        const player = game.state.players[playerId];

        let color = '#000000';
        let currentPlayer = '';
        if(playerId === currentPlayerId){
            color = '#0a00f0';
            currentPlayer = 'You -> '
        }

        playersArray.push({
            playerId: playerId,
            score: player.score,
            color: color,
            currentPlayer: currentPlayer
        });
    }

    playersArray.sort(function(a,b) {
        return a.score < b.score ? 1 : a.score > b.score ? -1 : 0;
    });

    for(const sortPlayerId in playersArray){
        const player = playersArray[sortPlayerId];

        score +=
            "<tr>\n" +
            "    <td style='color: "+ player.color+"'>"+ player.currentPlayer + player.playerId +"</td>\n" +
            "    <td>"+ player.score +"</td>\n" +
            "</tr>"
        ;
    }

    scoreboard.innerHTML = score;

    requestAnimationFrame( () => {
        renderScoreboard(scoreboard, game, requestAnimationFrame, currentPlayerId)
    });
}