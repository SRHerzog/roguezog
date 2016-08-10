// Board variables
const height = 60;
const width = 80;
const maxRoomHeight = 7;
const maxRoomWidth = 8;
const stuffDensity = 280; //default to a little over 10% of height * width
const experienceDamageCoefficient = 9; // number of experience points until you hit harder

// Initial game data
var gameData = { playerLocation: 1,
	weapon: { type: "armor",
		slot: "default",
		name: "Headbutt",
		name2: "headbutt",
		damageMin: 1,
		damageMax: 2 },
	armor: { type: "armor",
		slot: "default",
		name: "pants",
		name2: "pants",
		defense: 1 },
	otherItem: {},
	experience: 0,
	HP: 20,
	killedBy: null,
	monsters: [],
	treasure: [],
	food: [],
	boss: [],
	objectMap: [],
	darkness: [],
	message: [],
	turnCount: 0,
	foundTreasure: false };
const commonMonsterTypes = [{ type: "monster", name: "slime mold", HP: 1, damage: 0, value: 2, move: 0, loc: 0 }, { type: "monster", name: "gnome", HP: 5, damage: 2, value: 2, move: 1, loc: 0 }, { type: "monster", name: "dwarf", HP: 8, damage: 3, value: 3, move: 1, loc: 0 }, { type: "bigmonster", name: "orc", HP: 12, damage: 4, value: 5, move: 1, loc: 0 }, { type: "bigmonster", name: "troll", HP: 18, damage: 6, value: 7, move: 1, loc: 0 }];
const rareMonsterTypes = [{ type: "bigmonster", name: "golem", HP: 30, damage: 2, value: 5, move: 0.5, loc: 0 }, { type: "monster", name: "leprechaun", HP: 10, damage: 1, value: 7, move: 2, loc: 0 }, { type: "monster", name: "floating eye", HP: 3, damage: 1, value: 0, move: 0, loc: 0 }];
const commonTreasureTypes = [{ type: "treasure", slot: "weapon", name: "heavy rock", name2: "a heavy rock", damageMin: 2, damageMax: 3 }, { type: "treasure", slot: "weapon", name: "spear", name2: "a spear", damageMin: 2, damageMax: 4 }, { type: "treasure", slot: "weapon", name: "longsword", name2: "a longsword", damageMin: 4, damageMax: 5 }, { type: "treasure", slot: "weapon", name: "club", name2: "a club", damageMin: 2, damageMax: 3 }, { type: "treasure", slot: "weapon", name: "spiked mace", name2: "a spiked mace", damageMin: 3, damageMax: 4 }, { type: "treasure", slot: "armor", name: "leather armor", name2: "a suit of leather armor", defense: 2 }, { type: "treasure", slot: "armor", name: "brigandine armor", name2: "a suit of brigandine armor", defense: 4 }, { type: "treasure", slot: "armor", name: "mail armor", name2: "a suit of mail armor", defense: 3 }, { type: "treasure", slot: "armor", name: "breastplate", name2: "a breastplate", defense: 3 }, { type: "treasure", slot: "other", name: "an amulet of reflection that doesn't do anything", name2: "an amulet of reflection that doesn't do anything" }];
const rareTreasureTypes = [{ type: "treasure", slot: "armor", name: "silver dragon scales", name2: "silver dragon scales", defense: 6 }, { type: "treasure", slot: "armor", name: "full plate armor", name2: "a suit of full plate armor", defense: 5 }, { type: "treasure", slot: "weapon", name: "flaming sword", name2: "a flaming sword", damageMin: 5, damageMax: 7 }, { type: "treasure", slot: "weapon", name: "giant axe", name2: "a giant axe", damageMin: 6, damageMax: 6 }, { type: "treasure", slot: "other", name: "an amulet of healing that doesn't do anything", name2: "an amulet of healing that doesn't do anything" }];
const moveDirections = { 87: -width, 83: width, 65: -1, 68: 1, 69: 0 };

var board = [];
var boardOne = [];
var boardTwo = [];
var boardThree = [];

// This group creates a random dungeon map for the first two levels with an empty object layer
function generateDungeon() {
	board = [];
	for (let i = 0; i < height * width; i++) {
		if (i < width + 1 || i > width * (height - 1) - 1 || i % width == 0 || (i + 1) % width == 0) board.push("boundary");else board.push("wall");
		gameData.objectMap.push("");
		gameData.darkness.push(true);
	}
	createRoom(Math.floor(width * height / 2.67), 5, 5);
	for (let i = 0; i < width * 2; i++) tryToCreateRoom();
	return board;
}
function designRoom(origin) {
	var roomWidth = Math.floor(Math.random() * 4 + (maxRoomWidth - 3));
	var roomHeight = Math.floor(Math.random() * 4 + (maxRoomHeight - 3));
	var topLeftCorner;
	if (board[origin - 1] == "open") {
		topLeftCorner = origin + 1 - Math.floor(Math.random() * roomHeight) * width;
	}
	if (board[origin + 1] == "open") {
		topLeftCorner = origin - roomWidth - Math.floor(Math.random() * roomHeight) * width;
	}
	if (board[origin + width] == "open") {
		topLeftCorner = origin - Math.floor(Math.random() * roomWidth) - roomHeight * width;
	}
	if (board[origin - width] == "open") {
		topLeftCorner = origin + width - Math.floor(Math.random() * roomWidth);
	}
	return createRoom(topLeftCorner, roomWidth, roomHeight);
}
function createRoom(corner, roomWidth, roomHeight) {
	for (var i = 0; i < roomHeight; i++) {
		for (var j = 0; j < roomWidth; j++) {
			if (board[corner + j + i * width] != "wall") return false;
		}
	}
	for (let i = 0; i < roomHeight; i++) {
		for (let j = 0; j < roomWidth; j++) {
			board[corner + j + i * width] = "open";
		}
	}
	return true;
}
function createCorridor(length) {}
function tryToCreateRoom() {
	var origin = 0;
	var clearScore = 0;
	while (!(board[origin] == "wall" && clearScore == 1)) {
		origin = Math.floor(Math.random() * width * height);
		clearScore = 0;
		if (board[origin - 1] == "open") clearScore++;
		if (board[origin + 1] == "open") clearScore++;
		if (board[origin - width] == "open") clearScore++;
		if (board[origin + width] == "open") clearScore++;
	}
	if (designRoom(origin)) board[origin] = "open";
}

// This group creates a random cave map for the final level
var generations = 0;
var filledCells = 0;
var newBoard = [];
function randomizeBoard() {
	board = [];
	for (var i = 0; i < height * width; i++) {
		if (Math.random() * 10 < 4) board.push("wall");else board.push("dead");
	}
}
function firstPass(cell) {
	var liveNeighbors = 0;
	var neighbors = [];
	if (cell < width + 1 || cell > width * (height - 1) - 2 || cell % width == "0" || (cell + 1) % width == 0) {
		return "wall";
	} else {
		neighbors.push(cell - width + 1);
		neighbors.push(cell - width);
		neighbors.push(cell - width - 1);
		neighbors.push(cell - 1);
		neighbors.push(cell + 1);
		neighbors.push(cell + width);
		neighbors.push(cell + width - 1);
		neighbors.push(cell + width + 1);
	}
	for (var j = 0; j < 8; j++) {
		if (board[neighbors[j]] == "wall") {
			liveNeighbors++;
		}
	}
	switch (liveNeighbors) {
		case 0:
		case 1:
		case 2:
		case 5:
		case 6:
		case 7:
		case 8:
			return "wall";
		default:
			return "dead";
	}
}
function secondPass(cell) {
	var liveNeighbors = 0;
	var neighbors = [];
	if (cell < width + 1 || cell > width * (height - 1) - 2 || cell % width == "0" || (cell + 1) % width == 0) {
		return "wall";
	} else {
		neighbors.push(cell - width + 1);
		neighbors.push(cell - width);
		neighbors.push(cell - width - 1);
		neighbors.push(cell - 1);
		neighbors.push(cell + 1);
		neighbors.push(cell + width);
		neighbors.push(cell + width - 1);
		neighbors.push(cell + width + 1);
	}
	for (var j = 0; j < 8; j++) {
		if (board[neighbors[j]] == "wall") {
			liveNeighbors++;
		}
	}
	switch (liveNeighbors) {
		case 5:
		case 6:
		case 7:
		case 8:
			return "wall";
		default:
			return "dead";
	}
}
function thirdPass(cell) {
	if (cell < width + 1 || cell > width * (height - 1) - 2 || cell % width == "0" || (cell + 1) % width == 0) {
		return "wall";
	} else if (board[cell - 1] == "dead" && board[cell + 1] == "dead" && board[cell] == "wall" || board[cell - width] == "dead" && board[cell + width] == "dead" && board[cell] == "wall") {
		return "dead";
	} else return board[cell];
}
function checkBoard() {
	var fillTarget = 0;
	while (board[fillTarget] != "dead") {
		fillTarget = Math.floor(Math.random() * height * (width - 1));
	}
	floodFill(fillTarget);
	console.log(filledCells);
	if (filledCells > height * width * 2 / 5) return true;else {
		filledCells = 0;
		generations = 0;
		return false;
	}
}
function floodFill(cell) {
	if (board[cell] != "dead") return null;else {
		board[cell] = "open";
		floodFill(cell - width);
		floodFill(cell - 1);
		floodFill(cell + 1);
		floodFill(cell + width);
		filledCells++;
	}
}
function generateBoardThree() {
	if (generations < 1) randomizeBoard();
	if (generations < 3) {
		for (let i = 0; i < height * width; i++) newBoard.push(firstPass(i));
	} else {
		for (let i = 0; i < height * width; i++) newBoard.push(secondPass(i));
	}
	generations++;
	board = newBoard;
	newBoard = [];
	if (generations > 7) {
		for (let i = 0; i < height * width; i++) newBoard.push(thirdPass(i));
		board = newBoard;
		newBoard = [];
		if (checkBoard()) {
			boardThree = board;
			clearInterval(running);
			initializeLevel(boardThree, "react-box");
		} else generations = 0;
	}
}

function initializeLevel(level, target) {
	var spaceFinder = 0;
	while (board[spaceFinder] != "open") {
		spaceFinder = Math.floor(Math.random() * width * height);
	}
	gameData.playerLocation = spaceFinder;
	gameData.objectMap[spaceFinder] = { type: "player" };
	createStuff(level);
	createBossMonster(level);
	ReactDOM.render(React.createElement(Universe, { data: gameData, board: level }), document.getElementById(target));
}

// load up the board
function createStuff(level) {
	var placeStuff = 0;
	var randomType = 0;
	for (var i = 0; i < stuffDensity; i++) {
		placeStuff = Math.floor(Math.random() * width * height);
		if (level[placeStuff] == "open" && gameData.objectMap[placeStuff] == "") {
			gameData.objectMap[placeStuff] = {};
			switch (placeStuff % 12) {
				case 0:
					switch (placeStuff % 8) {
						case 0:
							randomType = Math.floor(Math.random() * 5);
							gameData.objectMap[placeStuff] = {
								type: rareTreasureTypes[randomType].type,
								slot: rareTreasureTypes[randomType].slot,
								name: rareTreasureTypes[randomType].name,
								name2: rareTreasureTypes[randomType].name2,
								damageMin: 0,
								damageMax: 0,
								defense: 0
							};
							if (rareTreasureTypes[randomType].slot == "weapon") {
								gameData.objectMap[placeStuff].damageMin = rareTreasureTypes[randomType].damageMin;
								gameData.objectMap[placeStuff].damageMax = rareTreasureTypes[randomType].damageMax;
							}
							if (rareTreasureTypes[randomType].slot == "armor") {
								gameData.objectMap[placeStuff].defense = rareTreasureTypes[randomType].defense;
							}
							break;
						default:
							randomType = Math.floor(Math.random() * 10);
							gameData.objectMap[placeStuff] = {
								type: commonTreasureTypes[randomType].type,
								slot: commonTreasureTypes[randomType].slot,
								name: commonTreasureTypes[randomType].name,
								name2: commonTreasureTypes[randomType].name2,
								damageMin: 0,
								damageMax: 0,
								defense: 0
							};
							if (commonTreasureTypes[randomType].slot == "weapon") {
								gameData.objectMap[placeStuff].damageMin = commonTreasureTypes[randomType].damageMin;
								gameData.objectMap[placeStuff].damageMax = commonTreasureTypes[randomType].damageMax;
							}
							if (commonTreasureTypes[randomType].slot == "armor") {
								gameData.objectMap[placeStuff].defense = commonTreasureTypes[randomType].defense;
							}
					}
					break;
				case 1:
				case 2:
				case 3:
				case 4:
					gameData.objectMap[placeStuff] = { type: "food" };
					break;
				case 5:
					randomType = Math.floor(Math.random() * 3);
					gameData.objectMap[placeStuff] = {
						type: rareMonsterTypes[randomType].type,
						name: rareMonsterTypes[randomType].name,
						HP: rareMonsterTypes[randomType].HP,
						damage: rareMonsterTypes[randomType].damage,
						value: rareMonsterTypes[randomType].value,
						move: rareMonsterTypes[randomType].move,
						loc: placeStuff };
					gameData.monsters.push(gameData.objectMap[placeStuff]);
					break;
				default:
					randomType = Math.floor(Math.random() * 5);
					gameData.objectMap[placeStuff] = {
						type: commonMonsterTypes[randomType].type,
						name: commonMonsterTypes[randomType].name,
						HP: commonMonsterTypes[randomType].HP,
						damage: commonMonsterTypes[randomType].damage,
						value: commonMonsterTypes[randomType].value,
						move: commonMonsterTypes[randomType].move,
						loc: placeStuff };
					gameData.monsters.push(gameData.objectMap[placeStuff]);
			}
		}
	}
}
function createBossMonster(level) {
	var placeStuff = 0;
	do {
		placeStuff = Math.floor(Math.random() * width * height);
	} while (!(level[placeStuff] == "open" && gameData.objectMap[placeStuff] == ""));
	gameData.objectMap[placeStuff] = { type: "bossmonster", name: "gnome with a wand of death", HP: 100, damage: 10, value: 100, move: 2, loc: placeStuff };
	gameData.monsters.push(gameData.objectMap[placeStuff]);
	console.log("Spawned boss at " + [placeStuff]);
}
function createStairs(level) {}

var Universe = React.createClass({
	displayName: "Universe",

	getInitialState() {
		return { board: this.props.board,
			data: this.props.data };
	},
	componentDidMount() {
		window.addEventListener('keydown', this.handleKeypress);
		this.setState({ data: this.updateLighting(this.state.data) });
	},
	handleKeypress(e) {
		if (e.target.nodeName == "INPUT") return;
		if (e.which == 71) this.pickUpTreasure();
		if (moveDirections[e.which] !== undefined) {
			if (this.state.data.HP <= 0) {
				return;
			}
			var updateData = this.state.data;
			var targetCell = this.state.data.playerLocation + moveDirections[e.which];
			switch (this.state.board[targetCell]) {
				case "open":
					updateData.turnCount++;
					switch (this.state.data.objectMap[targetCell].type) {
						case "monster":
						case "bigmonster":
						case "bossmonster":
							/* console.log("You have encountered an angry "
       					+ this.state.data.objectMap[targetCell].name +
       					"!"); */
							updateData = this.hitMonster(targetCell);
							break;
						case "treasure":
							updateData.message = "You found a treasure chest! It contains " + this.state.data.objectMap[targetCell].name2 + "! Press G if you want to pick it up.";
							updateData.foundTreasure = targetCell;
							break;
						case "player":
							break;
						case "food":
							updateData.HP = Math.min(updateData.HP + 6, Math.floor(updateData.experience / 5) + 20);
							updateData.message = "You found food! You eat to recover your strength.";
						default:
							updateData.objectMap[targetCell] = { type: "player" };
							updateData.objectMap[this.state.data.playerLocation] = "";
							updateData.playerLocation += moveDirections[e.which];
							updateData = this.updateLighting(updateData);
							updateData.foundTreasure = 0;
					}
					updateData = this.monstersMove(updateData);
					this.setState({ data: updateData });
					if (updateData.HP <= 0) {
						alert("You died. Reload the page to play again.");
						$.post("logger.php", { log: " died to a " + updateData.killedBy + " after earning " + updateData.experience + " experience.\nPlayer was wielding " + updateData.weapon.name2 + " and wearing " + updateData.armor.name2 + "." }).done(function (res) {
							console.log("PHP response: " + res);
						});
					}
					break;
				default:
					console.log("Bumped wall!");
			}
		}
	},
	hitMonster(cell) {
		var updateData = this.state.data;
		var damageToMonster = this.state.data.weapon.damageMin + Math.floor(this.state.data.experience / 9) + Math.floor(Math.random() * (this.state.data.weapon.damageMax - this.state.data.weapon.damageMin + 1));
		console.log("Previous monster HP: " + updateData.objectMap[cell].HP);
		updateData.objectMap[cell].HP -= damageToMonster;
		if (this.state.data.objectMap[cell].HP <= 0) {
			updateData.message = "You strike the " + this.state.data.objectMap[cell].name + " with your " + this.state.data.weapon.name + " for " + damageToMonster + " damage! You have slain the monster!";
			updateData.experience += this.state.data.objectMap[cell].value;
			updateData.HP += Math.floor(Math.random() * 3);
			updateData.objectMap[cell] = "";
		} else {
			updateData.message = "You strike the " + this.state.data.objectMap[cell].name + " with your " + this.state.data.weapon.name + " for " + damageToMonster + " damage!";
		}
		console.log("New monster HP = " + updateData.objectMap[cell].HP);
		return updateData;
	},
	monstersMove(data) {
		for (var i = 0; i < this.state.data.monsters.length; i++) {
			if (data.monsters[i].HP <= 0) continue;
			if (data.monsters[i].loc == data.playerLocation + 1 || data.monsters[i].loc == data.playerLocation - 1 || data.monsters[i].loc == data.playerLocation - width || data.monsters[i].loc == data.playerLocation + width) {
				data = this.monsterHitYou(i, data);
			} else if (Math.floor(Math.random() * 2 * data.monsters[i].move) > 0) {
				var clearMoves = [];
				if (data.objectMap[data.monsters[i].loc - 1] == "" && this.state.board[data.monsters[i].loc - 1] == "open") clearMoves.push(data.monsters[i].loc - 1);
				if (data.objectMap[data.monsters[i].loc + 1] == "" && this.state.board[data.monsters[i].loc + 1] == "open") clearMoves.push(data.monsters[i].loc + 1);
				if (data.objectMap[data.monsters[i].loc - width] == "" && this.state.board[data.monsters[i].loc - width] == "open") clearMoves.push(data.monsters[i].loc - width);
				if (data.objectMap[data.monsters[i].loc + width] == "" && this.state.board[data.monsters[i].loc + width] == "open") clearMoves.push(data.monsters[i].loc + width);
				if (clearMoves.length == 0) continue;else {
					data.objectMap[data.monsters[i].loc] = "";
					data.monsters[i].loc = clearMoves[Math.floor(Math.random() * clearMoves.length)];
					data.objectMap[data.monsters[i].loc] = data.monsters[i];
				}
			}
		}
		return data;
	},
	monsterHitYou(index, data) {
		var damageToPlayer = Math.max(0, data.monsters[index].damage + Math.ceil(Math.random() * 3 - 2));
		var hitRoll = Math.random() * 20;
		console.log("Hit roll: " + hitRoll + ", Armor class: " + data.armor.defense);
		if (hitRoll < data.armor.defense) {
			data.message = data.message + "\nThe " + data.monsters[index].name + " swings at you, but its attack is deflected by your " + data.armor.name + "!";
		} else {
			data.HP -= damageToPlayer;
			data.message = data.message + "\nThe " + data.monsters[index].name + " strikes you for " + damageToPlayer + " damage!";
			if (data.HP <= 0) {
				data.message = data.message + " You have been slain!";
				data.killedBy = data.monsters[index].name;
			}
		}
		return data;
	},
	pickUpTreasure() {
		var updateData = {};
		if (!this.state.data.foundTreasure) return false;else updateData = this.state.data;
		var slot = updateData.objectMap[updateData.foundTreasure].slot;
		switch (slot) {
			case "armor":
			case "weapon":
				if (updateData[slot].slot != "default") {
					updateData.objectMap[0] = updateData[slot];
					updateData[slot] = updateData.objectMap[updateData.foundTreasure];
					console.log(slot);
					console.log(updateData[slot]);
					updateData.objectMap[updateData.foundTreasure] = updateData.objectMap[0];
					updateData.message = "You find " + updateData[slot].name2 + " in the chest! You pick it up and leave your " + updateData.objectMap[0].name + " behind.";
					updateData.objectMap[0] = "";
				} else {
					updateData[slot] = updateData.objectMap[updateData.foundTreasure];
					console.log(slot);
					console.log(updateData[slot]);
					updateData.message = "You find " + updateData[slot].name2 + " in the chest! You pick it up.";
					updateData.objectMap[updateData.foundTreasure].slot = "empty";
				}
				console.log("Your armor class is " + updateData.armor.defense);
				break;
			default:
		}
		this.setState({ data: updateData });
	},
	updateLighting(data) {
		function getX(cell) {
			return cell % width;
		}
		function getY(cell) {
			return Math.floor(cell / width);
		}
		var p = data.playerLocation;
		for (let i = p - 3 - width * 3; i <= p + 3 + width * 3; i++) {
			if (getX(i) - getX(p) <= 3 && getX(i) - getX(p) >= -3 && getY(i) - getY(p) <= 3 && getY(i) - getY(p) >= -3) data.darkness[i] = false;
		}
		return data;
	},
	clickHandler(index) {
		console.log(this.state.data.objectMap[index]);
	},
	render: function () {
		var cells = [];
		for (let i = 0; i < height * width; i++) {
			if (i % width == 0) cells.push(React.createElement("br", null));
			if (this.state.data.darkness[i]) {
				cells.push(React.createElement(Cell, { type: "dark", index: i, key: i }));
			} else if (this.state.data.objectMap[i] != "") {
				cells.push(React.createElement(Cell, { type: this.state.data.objectMap[i].type, index: i, key: i, clicked: this.clickHandler.bind(null, i) }));
			} else {
				cells.push(React.createElement(Cell, { type: this.state.board[i], index: i, key: i }));
			}
		}
		return React.createElement(
			"div",
			null,
			cells,
			React.createElement("br", null),
			React.createElement(Status, { status: this.state.data }),
			React.createElement("br", null)
		);
	}
});

function Cell(props) {
	if (props.init == "player") return React.createElement(
		"span",
		{ className: "cell " + props.type },
		React.createElement("span", { className: "highlight" })
	);else return React.createElement("span", { className: "cell " + props.type, onClick: props.clicked });
}

function Status(props) {
	return React.createElement(
		"div",
		{ className: "status" },
		"Current HP: " + props.status.HP + "/" + (20 + Math.floor(parseInt(props.status.experience) / 5)) + " Level: " + Math.floor(parseInt(props.status.experience) / 5) + " Experience: " + props.status.experience + " Equipped weapon: " + props.status.weapon.name,
		React.createElement(
			"p",
			null,
			props.status.message
		)
	);
}

boardOne = generateDungeon();
initializeLevel(boardOne, "react-box");

// var running=setInterval(generateBoardThree,20);

/* TODO list:
V0.4
	Fix treasure in doorway bug
	Implement stairs for 9 levels
	Fill monster and treasure tables for 9 levels

V0.5
 	Implement darkness
	Implement monster aggro

v1.0
	Balance test

v1.1+
	Implement missile weapons
	Implement scrolling
	Implement line of sight
	Add interesting room types

*/
