function GameGraphicsPhase() {}
GameGraphicsPhase.prototype = Object.create(GamePhase.prototype);
GameGraphicsPhase.parent = GamePhase.prototype;

GameGraphicsPhase.prototype._displayGameGraphics = function(game_state, context) {	
	game_state.current_level.renderBackground(context);
	//game_state.current_level.renderGeometry(context);
	
	for (i = 0; i < game_state.actors.length; i++) {
		game_state.actors[i].display(context);
	}
	
	for (i = 0; i < game_state.effects.length; i++)
		game_state.effects[i].display(context);
		
	game_state.getWater().display(context);
	
	game.ui_container.display(context);
};

function TitlePhase() {}

TitlePhase.TRANSITION_TIME = 1;
TitlePhase.BLINK_TIME = .2;
TitlePhase.prototype = Object.create(GamePhase.prototype);
TitlePhase.parent = GamePhase.prototype;

TitlePhase.prototype.updateLogic = function(game_state, delta) {
	if (this.time >= 0) {
		this.time += delta;
		if (this.time > TitlePhase.TRANSITION_TIME)
			game.transition('tutorial');
	}
};
TitlePhase.prototype.renderGraphics = function(game_state, context) {
	game_state.current_level.renderBackground(context);
	game_state.getWater().display(context);
	
	
	var height = game.WINDOW_HEIGHT;
	var width = game.WINDOW_WIDTH;
	
	context.strokeStyle = 'rgb(40,20,0)';
	context.fillStyle = 'rgb(255,127,0)';

	context.textAlign = 'center';
	context.lineWidth = 3;
	
	context.font = '80pt Trade Winds';
	context.strokeText('Siren Song', width / 2, 160);
	context.fillText('Siren Song', width / 2, 160);
		
	context.font = '32px Trade Winds';
	
	if (this.time == -1 || this.time % TitlePhase.BLINK_TIME * 2 > TitlePhase.BLINK_TIME) {
		context.strokeText('Press Space to start', width / 2, height - 80);
		context.fillText('Press Space to start', width / 2, height - 80);	
	}	
	
	context.strokeStyle = '#07090a';
	context.fillStyle = '#60cee3';
	
	context.strokeText("Programming, Design, and Sound by Mark Goetz", width / 2, 340);
	context.fillText("Programming, Design, and Sound by Mark Goetz", width / 2, 340);
	
	context.strokeText('Design and Art by Gerry Swanson', width / 2, 380);
	context.fillText('Design and Art by Gerry Swanson', width / 2, 380);
	
	context.strokeText('Ludum Dare 29', width / 2, 420);
	context.fillText('Ludum Dare 29', width / 2, 420);	
};

TitlePhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.PAUSE) {
		this.time = 0;
	}
};

TitlePhase.prototype.transitionTo = function() {
	this.time = -1;
};

function TutorialPhase() {}
TutorialPhase.prototype = Object.create(GamePhase.prototype);
TutorialPhase.parent = GamePhase.prototype;
TutorialPhase.TRANSITION_TIME = 1;
TutorialPhase.BLINK_TIME = .2;

TutorialPhase.prototype.updateLogic = function(game_state, delta) {
	if (this.time >= 0) {
		this.time += delta;
		if (this.time > TutorialPhase.TRANSITION_TIME)
			game.transition('run');
	}
};
TutorialPhase.prototype.renderGraphics = function(game_state, context) {
	game_state.current_level.renderBackground(context);
	game_state.getWater().display(context);
	
	var height = game.WINDOW_HEIGHT;
	var width = game.WINDOW_WIDTH;
	
	context.strokeStyle = 'rgb(40,20,0)';
	context.fillStyle = 'rgb(255,127,0)';
	
	context.textAlign = 'center';
	context.lineWidth = 3;
	
	context.font = '48pt Trade Winds';
	context.strokeText('How to play', width / 2, 100);
	context.fillText('How to play', width / 2, 100);
	
	context.font = '32px Trade Winds';
		
	if (this.time == -1 || this.time % TutorialPhase.BLINK_TIME * 2 > TutorialPhase.BLINK_TIME) {
		context.strokeText('Press Space to start', width / 2, height - 80);
		context.fillText('Press Space to start', width / 2, height - 80);
	}	
	
	context.strokeStyle = '#07090a';
	context.fillStyle = '#60cee3';
	
	context.strokeText('Hold down Z to sing to sailors', width / 2, 200);
	context.fillText('Hold down Z to sing to sailors', width / 2, 200);
	
	context.strokeText("Press X to attack when they're stunned", width / 2, 240);
	context.fillText("Press X to attack when they're stunned", width / 2, 240);

	context.strokeText("Press C to summon Charybdis when ready", width / 2, 280);
	context.fillText("Press C to summon Charybdis when ready", width / 2, 280);
	
	context.strokeText('Build up combos to charge faster', width / 2, 320);
	context.fillText('Build up combos to charge faster', width / 2, 320);
};

TutorialPhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.PAUSE) {
		this.time = 0;
	}
};
TutorialPhase.prototype.transitionTo = function() {
	this.time = -1;
};



function GameRunPhase() {}
GameRunPhase.prototype = Object.create(GameGraphicsPhase.prototype);
GameRunPhase.parent = GameGraphicsPhase.prototype;

GameRunPhase.prototype.updateLogic = function(game_state, delta) {
	game_state.step(delta);
	game_state.collisionTest();
	game_state.geometryCollisionTest();
	
	for (i = 0; i < game_state.effects.length; i++) {
		game_state.effects[i].step(delta);
	}
	
	game.ui_container.step(delta);
};

GameRunPhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	var player = game_state.getPlayer();
	
	if (key_handler.LEFT_ARROW)
		player.move('left');
	else if (key_handler.RIGHT_ARROW)
		player.move('right');
	else
		player.slowHorizontal();
		
	if (key_handler.UP_ARROW)
		player.move('up');
	else if (key_handler.DOWN_ARROW)
		player.move('down');
	else
		player.slowVertical();
		
	if (key_handler.SING) {
		player.sing();
	}
	else {
		player.stopSinging();
	}
	
	if (key_handler.GRAB) {
		player.grab();
	}
	
	if (key_handler.BOMB) {
		player.bomb();
	}
	
	if (key_handler.PAUSE) {
		game.transition('pause');
	}
	
	if (key_handler.VOLUME_UP) {
		game.game_engine.volumeUp();
		game.showVolume();
	}
	else if (key_handler.VOLUME_DOWN) {
		game.game_engine.volumeDown();
		game.showVolume();
	}
};

GameRunPhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
};

function PausePhase() {}
PausePhase.prototype = Object.create(GameGraphicsPhase.prototype);
PausePhase.parent = GameGraphicsPhase.prototype;

PausePhase.prototype.updateLogic = function(game_state, delta) {
	game.ui_container.step(delta);
};

PausePhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.PAUSE) {
		game.transition('run');
	}
};

PausePhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
	
	var width = game.WINDOW_WIDTH;
	var height = game.WINDOW_HEIGHT;
	context.fillStyle = 'rgba(0, 0, 0, .5)';
	context.fillRect(0, 0, width, height);
	
	context.textAlign = 'center';
	
	context.fillStyle = '#ffffff';
	context.font = '32pt Trade Winds';
	context.fillText('PAUSED', width / 2, height / 2 - 20);
	
	context.font = '16pt Trade Winds';
	context.fillText('Press Space to continue', width / 2, height / 2 + 20);
};


function GameOverPhase() {}
GameOverPhase.prototype = Object.create(GameGraphicsPhase.prototype);
GameOverPhase.parent = GameGraphicsPhase.prototype;
GameOverPhase.SCREEN_FILL_RGB = '235,235,235';
GameOverPhase.TEXT_FILL_RGB = '255,127,0';
GameOverPhase.TEXT_STROKE_RGB = '40,20,0';

GameOverPhase.FADEIN_TIME = .66;
GameOverPhase.FINAL_ALPHA = .6;

GameOverPhase.prototype.updateLogic = function(game_state, delta) {
	if (this.alpha > GameOverPhase.FINAL_ALPHA) {
		this.alpha -= (delta / GameOverPhase.FADEIN_TIME);
		if (this.alpha <= GameOverPhase.FINAL_ALPHA) this.alpha = GameOverPhase.FINAL_ALPHA;
	}
	
	game.ui_container.step(delta);
};

GameOverPhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.PAUSE) {
		game.transition('run');
	}
};

GameOverPhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);

	context.fillStyle = 'rgba(' + GameOverPhase.SCREEN_FILL_RGB + ',' + this.alpha + ')';
	context.fillRect(0, 0, game.WINDOW_WIDTH, game.WINDOW_HEIGHT);
	
	context.lineWidth = 3;
	
	context.strokeStyle = 'rgb(' + GameOverPhase.TEXT_STROKE_RGB + ')';
	context.fillStyle = 'rgb(' + GameOverPhase.TEXT_FILL_RGB + ')';
	context.font = '64px Trade Winds';
	context.textAlign = 'center';
	
	context.strokeText('Game Over', game.WINDOW_WIDTH / 2, 360);	
	context.fillText('Game Over', game.WINDOW_WIDTH / 2, 360);
	context.font = '32px Trade Winds';
	
	context.strokeText('Press space to restart', game.WINDOW_WIDTH / 2, 450);	
	context.fillText('Press space to restart', game.WINDOW_WIDTH / 2, 450);
};

GameOverPhase.prototype.transitionTo = function() {
	this.alpha = 1;
};

GameOverPhase.prototype.transitionFrom = function() {	game.game_state.reset();
};
