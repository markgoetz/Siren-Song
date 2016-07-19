function SCLevelMap() {
	this.levels = [];
	this.addLevel('level1');
	//this.addLevel('level2');
}

SCLevelMap.prototype.addLevel = function(level_name) {
	var level = new SCLevel(level_name);
	this.levels.push(level);
	game.game_engine.preloader.registerItem(level);
};

SCLevelMap.prototype.getLevel = function(level_number) {
	return this.levels[level_number];
};