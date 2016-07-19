function SC() {
	this.constructor('SCPreloader');
}

SC.prototype = Object.create(Game.prototype);
SC.parent = Game.prototype;

function init() {
	game = new SC();
	game.init();
}

Game.prototype.initResolution = function() {
	this.WINDOW_HEIGHT = 640;
	this.WINDOW_WIDTH = 1024;
	this.FRAME_RATE = 60;
	
	this.play_area_width = this.WINDOW_WIDTH;
	this.play_area_height = this.WINDOW_HEIGHT - SCUIContainer.HEIGHT;
};

SC.prototype.initLevelMap = function() {
	this.level_map = new SCLevelMap();
};

SC.prototype.initUI = function() {
	this.ui_container = new SCUIContainer();
};

SC.prototype.initGamePhases = function() {
	this.game_phase_map.addPhase('title', 'TitlePhase', ['tutorial']);
	this.game_phase_map.addPhase('tutorial', 'TutorialPhase', ['run']);
	this.game_phase_map.addPhase('run', 'GameRunPhase', ['pause','gameover']);
	this.game_phase_map.addPhase('pause', 'PausePhase', ['run']);
	this.game_phase_map.addPhase('gameover', 'GameOverPhase', ['run']);
	
	this.initPhase('title');
};

SC.prototype.initSpriteSheets = function() {
	var player_sprite_sheet = new SpriteSheet('player.png', Player.WIDTH, Player.HEIGHT);
	player_sprite_sheet.addAnimation('surfaceleft', [{x:0,y:0,hitbox:Player.LEFT_HITBOX},{x:1,y:0,hitbox:Player.LEFT_HITBOX}], .4);
	player_sprite_sheet.addAnimation('underwaterleft', [{x:0,y:1,hitbox:Player.LEFT_HITBOX},{x:1,y:1,hitbox:Player.LEFT_HITBOX}], .4);
	player_sprite_sheet.addAnimation('singleft', [{x:0,y:2,hitbox:Player.LEFT_HITBOX}], 1);
	player_sprite_sheet.addAnimation('grableft', [{x:0,y:3,hitbox:Player.LEFT_HITBOX}], Player.GRAB_DELAY, false);
	
	player_sprite_sheet.addAnimation('surfaceright', [{x:2,y:0,hitbox:Player.RIGHT_HITBOX},{x:3,y:0,hitbox:Player.RIGHT_HITBOX}], .4);
	player_sprite_sheet.addAnimation('underwaterright', [{x:2,y:1,hitbox:Player.RIGHT_HITBOX},{x:3,y:1,hitbox:Player.RIGHT_HITBOX}], .4);
	player_sprite_sheet.addAnimation('singright', [{x:3,y:2,hitbox:Player.RIGHT_HITBOX}], 1);	
	player_sprite_sheet.addAnimation('grabright', [{x:3,y:3,hitbox:Player.RIGHT_HITBOX}], Player.GRAB_DELAY, false);
	
	this.sprite_sheet_map.addSpriteSheet('player', player_sprite_sheet);
	
	var water_sprite_sheet = new SpriteSheet('water.png', Water.WIDTH, Water.HEIGHT);
	water_sprite_sheet.addAnimation('static', [{x:0,y:0}], 1);
	this.sprite_sheet_map.addSpriteSheet('water', water_sprite_sheet);	
	
	var dm_sprite_sheet = new SpriteSheet('dm.png', DifficultyManager.WIDTH, DifficultyManager.HEIGHT);
	dm_sprite_sheet.addAnimation('static', [{x:0,y:0}], 1);
	this.sprite_sheet_map.addSpriteSheet('dm', dm_sprite_sheet);
	
	var bigboat_sprite_sheet = new SpriteSheet('boat.png', BigBoat.WIDTH, BigBoat.HEIGHT);
	bigboat_sprite_sheet.addAnimation('boat', [{x:0,y:0,hitbox:[48,173,245,44]}], 1);
	bigboat_sprite_sheet.addAnimation('sinkleft', [{x:0,y:1,w:302,h:272}], 1);
	bigboat_sprite_sheet.addAnimation('sinkright', [{px:302,y:1,w:302,h:272}], 1);	
	this.sprite_sheet_map.addSpriteSheet('bigboat', bigboat_sprite_sheet);	
	
	var smallboat_sprite_sheet = new SpriteSheet('boat2.png', SmallBoat.WIDTH, SmallBoat.HEIGHT);
	smallboat_sprite_sheet.addAnimation('boat', [{x:0,y:0,hitbox:[21,146,148,36]}], 1);
	smallboat_sprite_sheet.addAnimation('sinkleft', [{x:0,y:1,h:220}], 1);
	smallboat_sprite_sheet.addAnimation('sinkright', [{x:1,y:1,h:220}], 1);
	this.sprite_sheet_map.addSpriteSheet('smallboat', smallboat_sprite_sheet);
	
	var sailor_sprite_sheet = new SpriteSheet('sailor.png', Sailor.WIDTH, Sailor.HEIGHT);
	sailor_sprite_sheet.addAnimation('angry', [{x:0,y:0}], 1);
	sailor_sprite_sheet.addAnimation('docile', [{x:0,y:1}], 1);
	sailor_sprite_sheet.addAnimation('stunned', [{x:0,y:2}], 1);
	sailor_sprite_sheet.addAnimation('deadleft', [{x:0,y:3,h:128}], 1);
	sailor_sprite_sheet.addAnimation('deadright',[{x:1,y:3,h:128}], 1);
	this.sprite_sheet_map.addSpriteSheet('sailor', sailor_sprite_sheet);
	
	var cannon_sprite_sheet = new SpriteSheet('cannon.png', Cannon.WIDTH, Cannon.HEIGHT);
	cannon_sprite_sheet.addAnimation('cannon', [{x:0,y:0}], 1);
	this.sprite_sheet_map.addSpriteSheet('cannon', cannon_sprite_sheet);
	
	var cannonball_sprite_sheet = new SpriteSheet('cannonball.png', Cannonball.WIDTH, Cannonball.HEIGHT);
	cannonball_sprite_sheet.addAnimation('cannonball', [{x:0,y:0}], 1);
	this.sprite_sheet_map.addSpriteSheet('cannonball', cannonball_sprite_sheet);
	
	var fish_sprite_sheet = new SpriteSheet('fish.png', Fish.WIDTH, Fish.HEIGHT);
	fish_sprite_sheet.addAnimation('left', [{x:0,y:0}], 1);
	fish_sprite_sheet.addAnimation('right', [{x:1,y:0}], 1);
	this.sprite_sheet_map.addSpriteSheet('fish', fish_sprite_sheet);	
	
	var charybdis_sprite_sheet = new SpriteSheet('charybdis.png', Charybdis.WIDTH, Charybdis.HEIGHT);
	charybdis_sprite_sheet.addAnimation('charybdis', [{x:0,y:0}], 1);
	this.sprite_sheet_map.addSpriteSheet('charybdis', charybdis_sprite_sheet);
};

SC.prototype.initTiles = function() {
	var wall_tile_set = new TileSet('wall.png', SCLevel.TILE_SIZE);
	wall_tile_set.addTileType('0', 0, 0, []);
	this.tile_map.addTileSet('wall', wall_tile_set);
};

SC.prototype.initBackgroundImages = function() {
	this.background_image_map.addBackgroundImage('black', new BackgroundImage('black.png'));
};

SC.prototype.initFonts = function() {
	this.game_engine.initFont('Trade Winds', 'TradeWinds-Regular.ttf', 'truetype');
};

SC.prototype.initKeys = function() {
	this.game_engine.key_handler.registerKey('LEFT_ARROW', 37, true);
	this.game_engine.key_handler.registerKey('RIGHT_ARROW', 39, true);
	this.game_engine.key_handler.registerKey('UP_ARROW', 38, true);
	this.game_engine.key_handler.registerKey('DOWN_ARROW', 40, true);	
	
	this.game_engine.key_handler.registerKey('PAUSE', 32, false);
	
	this.game_engine.key_handler.registerKey('GRAB', 88, false);
	this.game_engine.key_handler.registerKey('SING', 90, true);
	this.game_engine.key_handler.registerKey('BOMB', 67, false);

	this.game_engine.key_handler.registerKey('VOLUME_UP', 187, false);
	this.game_engine.key_handler.registerKey('VOLUME_DOWN', 189, false);
};

SC.prototype.initSounds = function() {
	this.sound_map.addSound('bomb', new Sound('bomb.wav'));
	this.sound_map.addSound('cannonball', new Sound('cannonball.wav'));
	this.sound_map.addSound('fish', new Sound('fish.wav'));
	this.sound_map.addSound('grab', new Sound('grab.wav'));
	this.sound_map.addSound('hit', new Sound('hit.wav'));
	this.sound_map.addSound('sailorkilled', new Sound('sailorkilled.wav'));
	this.sound_map.addSound('sing', new Sound('sing.wav'));	
};

SC.prototype.showVolume = function() {
	this.ui_container.showVolume();
};

