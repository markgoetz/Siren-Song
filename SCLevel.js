SCLevel.prototype = Object.create(Level.prototype);
SCLevel.parent = Level.prototype;

SCLevel.TILE_SIZE = 32;

function SCLevel(folder_name) {
	this.constructor();
	this.folder_name = folder_name;
	this.load();
}

SCLevel.prototype.initObjects = function() {
	this.background_image_name = this.object_initializer.background;
	this.initBackground();
};

SCLevel.prototype.initGeometry = function() {
	this.geometry = new TileGeometry(SCLevel.TILE_SIZE, game.WINDOW_WIDTH, game.WINDOW_HEIGHT, this.geometry_initializer, 'wall');
};

SCLevel.prototype.reset = function() {

};

SCLevel.prototype.getEnemyCount = function() {

};

SCLevel.prototype.getPlayerStart = function() {
	return {x: this.player_start_x, y: this.player_start_y };
};

SCLevel.prototype.load = function() {
	var geometry_xhr = new XMLHttpRequest();
	geometry_xhr.open("GET", "levels/" + this.folder_name + "/geometry.csv", true);
	geometry_xhr.level = this;
	geometry_xhr.responseType = 'text';
	geometry_xhr.onload = function() {
		this.level.geometry_initializer = this.responseText;
		//this.level.initGeometry();
	};
	geometry_xhr.send();

	var objects_xhr = new XMLHttpRequest();
	objects_xhr.open("GET", "levels/" + this.folder_name + "/objects.txt", true);
	objects_xhr.level = this;
	objects_xhr.responseType = 'text';
	objects_xhr.onload = function() {
		this.level.object_initializer = eval('(' + this.response + ')');
		this.level.initObjects();
	};
	objects_xhr.send();
};

SCLevel.prototype.isLoaded = function() {
	return (this.object_initializer && this.geometry_initializer);
};

SCLevel.prototype.getPlayerStartPoint = function() {
	return {x:(game.WINDOW_WIDTH - Player.WIDTH) / 2,y:200};
};

