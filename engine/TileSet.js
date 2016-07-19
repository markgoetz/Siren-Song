function TileSet(file_name, tile_size) {
	this.file_name = 'tiles/' + file_name;
	this.tiles = {};
	this.tile_size = tile_size;
	
	this.image = new Image();
	
	this.image.onload = function(event) {
		this.loaded = true;
	};
	
	this.image.src = this.file_name;
}

TileSet.prototype.addTileType = function(id, x, y, attributes) {
	var tile_attributes = [];
	
	for (var i = 0; i < attributes.length; i++) {
		tile_attributes[attributes[i]] = 1;
	}
	
	this.tiles[id] = {
		x: x * this.tile_size,
		y: y * this.tile_size,
		attributes: tile_attributes
	};
};

TileSet.prototype.isLoaded = function() {
	return this.image.loaded;
};

TileSet.prototype.display = function(x, y, id, context) {
	var tile = this.tiles[id];
	
	if (!tile) throw "Cannot find tile of type " + id;
		
	var camera_x = game.game_engine.camera_x;
	var camera_y = game.game_engine.camera_y;
	
	context.drawImage(this.image,
		tile.x, tile.y, this.tile_size, this.tile_size,
		x - camera_x, y - camera_y, this.tile_size, this.tile_size
	);
};

TileSet.prototype.getCount = function() {
	return this.tiles.length;
};

TileSet.prototype.getTileType = function(id) {
	return this.tiles[id];
};



function TileSetMap() {
	this.tile_sets = {};
}

TileSetMap.prototype.addTileSet = function(name, tile_set) {
	if (this.tile_sets[name])
		throw 'Duplicate tileset name:' + name;
	
	if (!tile_set instanceof TileSet)
		throw 'tile_set is not a tile_set';
	
	this.tile_sets[name] = tile_set;
	game.game_engine.preloader.registerItem(tile_set);
};

TileSetMap.prototype.getTileSet = function(name) {
	return this.tile_sets[name];
};

TileSetMap.prototype.getTileSetNames = function() {
	return Object.keys(this.tile_sets);
};

TileSetMap.prototype.getCount = function() {
	return Object.keys(this.tile_sets).length;
};
