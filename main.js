const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//field should be a two dimensional array
class Field{
    constructor(field){
        this.field = field;
    }

    print(){
        let strField = '';
        for(let i = 0; i < this.field.length; i++){
            for(let j = 0; j < this.field[i].length; j++){
                strField += `${this.field[i][j]}`;
            }
            strField += '\n';
        }
        console.log(strField);
    }

    static generateField(height, width, display){
        let field = [];
        let box = '';
        let random = 0;
        let hatPos = true;

        for(let i = 0; i < height; i++){
            let inner = [];
            for(let j = 0; j < width; j++){
                if(display == true){
                    random = 80;
                }else{
                    random = Math.round(Math.random() * 99);
                }
                
                if(hatPos && 90 < random && j !== 0 ){
                    box = hat;
                    hatPos = false;
                }else if(random < 20){
                    box = hole;
                }else{
                    box = fieldCharacter;
                }
                inner[j] = box;
            }
            field[i] = inner;
        } 
        field[0][0] = pathCharacter;
        return field;
    }

};

class player{
    constructor(stateGame, posicion){
        this.stateGame = stateGame;
        this.posicion = posicion;
    }
};

const updateGame = (field, player, move) =>{
    // a = left w = up s = down d = rigth
    let x = player.posicion[0];
    let y = player.posicion[1];
    
    //Validate input
    if(move === 'a'){
        y -= 1;
    }else if(move === 'w'){
        x -= 1;
    }else if(move === 's'){
        x += 1;
    }else if(move === 'd'){
        y += 1;
    }else{
        console.log('Invalid input');
        player.stateGame = 'error';
        return player;
    }

    if(x < 0 || y < 0 || y >= field.length ||x >= field.length){
        player.stateGame = 'lose';
    } else if(field[x][y] === hole){
        player.stateGame = 'end';
        player.posicion =[x, y];
    } else if(field[x][y] === hat){
        player.stateGame = 'win';
        player.posicion =[x, y];
    } else{
        player.stateGame = 'progress';
        player.posicion =[x, y];
    }
    //console.log(player);
    return player;   
};

const updateField = (field, player) =>{
    let x = player.posicion[0];
    let y = player.posicion[1];
    
    if(player.stateGame === 'win'){
        field[x][y] = [hat];
    }else if(player.stateGame === 'progress'){
        field[x][y] = [pathCharacter];
    }else if(player.stateGame === 'end'){
        field[x][y] = [hole];
    }

    return field;

};

let playerOne = new player('progress', [0, 0]);


let finish = false;

//thi is the field with the solution
const myField = new Field();

//this is the field show to the user
let playerPath = new Field();



console.log(`Star the game`);
const height = prompt('Height of the field: ');
const width = prompt('Width of the field: ');
myField.field = Field.generateField(height, width, false);
playerPath.field = Field.generateField(height, width, true);
playerPath.print();
console.log('Use AWSD to move.')

while(!finish){
    if (playerOne.stateGame === 'win') {
        console.log('You have win!!!!');
        finish = true;
    } else if (playerOne.stateGame === 'end' || playerOne.stateGame === 'lose') {
        console.log('You have lose!');
        finish = true;
    } else if (playerOne.stateGame === 'progress') {
        const move = prompt('Make a move: ');
        //console.log(`${move}`);
        //actualiza field
        playerOne = updateGame(myField.field, playerOne, move);
        playerPath.field = updateField(playerPath.field, playerOne);
        playerPath.print();
        
    } else {
        console.log('Error!!!');
        finish = true;
    }

};


