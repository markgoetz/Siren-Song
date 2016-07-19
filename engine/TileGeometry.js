function TileGeometry(tile_size, width, height, string, tile_set) {
	this.tile_size = tile_size;
	this.width = width;
	this.height = height;
	this._processString(string);
	this.tiles_wide = Math.ceil(this.width / this.tile_size);
	this.tiles_high = string.length / this.tiles_wide;
	this.tile_set = game.tile_map.getTileSet(tile_set);
}

TileGeometry.prototype._processString = function (string) {
	var rows = string.split(/\r/);
	this._geometry = [];
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i].split(',');
		this._geometry.push(row);
	}
};

TileGeometry.prototype.checkPixel = function(x, y) {
	if (x < 0 || y < 0)
		return null;
	
	var tile_y = Math.floor(y / this.tile_size);
	if (tile_y >= this._geometry.length)
		return null;
	
	var tile_x = Math.floor(x / this.tile_size);
	if (tile_x >= this._geometry[tile_y].length)
		return null;
	
	return this.getTileAt(tile_x, tile_y);
};

TileGeometry.prototype.collisionCheck = function(actor) {
	var hitbox = actor.getHitbox();
	var prev_hitbox = actor.getPreviousHitbox();
	var context = game.game_engine.getGraphicsContext();
	
	for (var loop_x = hitbox.x; loop_x <= hitbox.right_x() + this.tile_size; loop_x += this.tile_size) {
		for (var loop_y = hitbox.y; loop_y <= hitbox.bottom_y() + this.tile_size; loop_y += this.tile_size) {
			var check_x = loop_x;
			var check_y = loop_y;
			
			if (check_x > hitbox.right_x())  check_x = hitbox.right_x();
			if (check_y > hitbox.bottom_y()) check_y = hitbox.bottom_y();
						
			if (tile = this.checkPixel(check_x, check_y)) {		
				var x_offset = check_x - hitbox.x;
				var y_offset = check_y - hitbox.y;
				
				var previous_x = prev_hitbox.x + x_offset;
				var previous_y = prev_hitbox.y + y_offset;
				
				var tile_x = Math.floor(check_x / this.tile_size);
				var tile_y = Math.floor(check_y / this.tile_size);
				var old_tile_x = Math.floor(previous_x / this.tile_size);
				var old_tile_y = Math.floor(previous_y / this.tile_size);
				
				var side = new CollisionSides();
				
				if (tile_y < old_tile_y && !this.checkPixel(check_x, previous_y)) {
					side.setSide(CollisionSides.sides.TOP);
				}
				if (tile_y > old_tile_y && !this.checkPixel(check_x, previous_y)) {
					side.setSide(CollisionSides.sides.BOTTOM);
				}
				if (tile_x < old_tile_x && !this.checkPixel(previous_x, check_y)) {
					side.setSide(CollisionSides.sides.LEFT);
				}
				if (tile_x > old_tile_x && !this.checkPixel(previous_x, check_y)) {
					side.setSide(CollisionSides.sides.RIGHT);
				}
				
				actor.oncollide(tile, side);
			}
		}
	}
};

TileGeometry.prototype.getTileAt = function(tile_x, tile_y) {
	if (tile_y < 0 || tile_x < 0) return null;
	if (tile_y >= this._geometry.length) return null;
	if (tile_x >= this._geometry[tile_y].length) return null;
	
	var tile_id = this._geometry[tile_y][tile_x];
	
	if (tile_id == ' ' || tile_id == '') return null;
	
	return new LevelTile(tile_x * this.tile_size, tile_y * this.tile_size, this.tile_size, tile_id, this.tile_set);
};

TileGeometry.prototype.display = function(x, y, context) {	
	for (var i = 0; i < this._geometry.length; i++) {
		var row = this._geometry[i];
		for (var j = 0; j < row.length; j++) {
			var tile_id = row[j];
			
			if (tile_id != ' ' && tile_id != '')
				this.tile_set.display(x + j * this.tile_size, y + i * this.tile_size, tile_id, context);
		}
	}
};

TileGeometry.prototype.getTileSize = function() {
	return this.tile_size;
};

LevelTile.prototype = Object.create(Actor.prototype);
LevelTile.parent = Actor.prototype;
function LevelTile(x, y, tile_size, id, tile_set) {
	this.constructor(new Rectangle(0, 0, tile_size, tile_size), null);
	this.init(x, y, 'null');
	this.id = id;
	var tile_type = tile_set.getTileType(id);
	
	if (tile_type != null) {
		this.attributes = tile_type.attributes;
	}
}

LevelTile.prototype.init = function(x, y) {
	this.x = x;
	this.y = y;
};
