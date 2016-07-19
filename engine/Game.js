var game;

function Game(preloader_class_name) {
	this.game_phase_map = new GamePhaseMap();
	this.tile_map = new TileSetMap();
	this.sprite_sheet_map = new SpriteSheetMap();
	this.background_image_map = new BackgroundImageMap();
	this.game_state = new GameState();
	this.game_engine = new GameEngine();
	this.sound_map = new SoundMap();
	this.preloader_class_name = preloader_class_name;
	this.current_phase = null;
}

Game.prototype.initGamePhases = function() {};
Game.prototype.initSpriteSheets = function() {};
Game.prototype.initBackgroundImages = function() {};
Game.prototype.initSounds = function() {};
Game.prototype.initFonts = function() {};
Game.prototype.initKeys = function() {};
Game.prototype.initLevelMap = function() {};
Game.prototype.initTiles = function() {};
Game.prototype.initUI = function() {};

Game.prototype.init = function() {
	this.initResolution();
	this.game_engine.init(this.WINDOW_WIDTH, this.WINDOW_HEIGHT, this.FRAME_RATE, this.preloader_class_name);
	
	this.initKeys();
	
	this.initSpriteSheets();
	
	this.initTiles();
	
	this.initBackgroundImages();
	
	this.initSounds();
	
	this.initFonts();
	
	this.initLevelMap();
	
	this.initUI();
	
	this.initGamePhases();
};

Game.prototype.initResolution = function() {
	this.WINDOW_HEIGHT = 480;
	this.WINDOW_WIDTH = 480;
	this.FRAME_RATE = 60;
	this.play_area_height = 480;
	this.play_area_width = 480;
};

Game.prototype.playAreaHeight = function() {
	return this.play_area_height;
};

Game.prototype.playAreaWidth = function() {
	return this.play_area_width;
};


Game.prototype.getCurrentPhase = function() {
	if (this.current_phase == null)
		throw 'Current phase has not been defined yet.';
	
	return this.current_phase;
};

Game.prototype.initPhase = function(phase_name) {
	if (this.current_phase != null)
		throw 'initPhase should not be called more than once.';
	
	this.current_phase = this.game_phase_map.getPhase(phase_name);
	this.current_phase.transitionTo();
};

Game.prototype.transition = function(phase) {
	this.current_phase.transitionFrom();
	this.current_phase = this.game_phase_map.getPhase(phase);
	this.current_phase.transitionTo();
};
