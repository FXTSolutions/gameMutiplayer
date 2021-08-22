export default function createGame(){
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10,
        }
    };

    const observers = [];

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);
        const score = 0;

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            score: score
        };

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY,
            score: score
        });
    }

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function addFruit(command) {
        const fruitId = 'fruit';
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
        };

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }

    function movePlayer(command) {
        notifyAll(command);

        const acceptMoves = {
            ArrowUp(player){
                if(player.y - 1 >= 0){
                    player.y = player.y - 1;
                }
            },
            ArrowDown(player){
                if(player.y + 1 < state.screen.height){
                    player.y = player.y + 1;
                }
            },
            ArrowRight(player){
                if(player.x + 1 < state.screen.width){
                    player.x = player.x + 1;
                }
            },
            ArrowLeft(player){
                if(player.x - 1 >= 0){
                    player.x = player.x - 1;
                }
            },
        };

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[command.playerId];
        const moveFunction = acceptMoves[keyPressed];

        if(player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    function checkForFruitCollision(playerId){

        const player = state.players[playerId];

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId];

            if(player.x === fruit.x && player.y === fruit.y){
                removeFruit({fruitId: fruitId });
                addScore(playerId);
                addFruit();
            }
        }
    }

    function addScore(playerId) {
        const player = state.players[playerId];

        player.score = player.score + 1;
    }

    addFruit();

    return {
        setState,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        subscribe,
    }
}