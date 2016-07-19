function Level(object_initializer, geometry_initializer, background_image_name) {
	this.object_initializer = object_initializer;
	this.geometry_initializer = geometry_initializer;
	this.background_image_name = background_image_name;
}

Level.prototype.renderBackground = function(context) {
	this.background_image.display(0, 0, game.WINDOW_WIDTH, game.WINDOW_HEIGHT, context);
};

Level.prototype.renderGeometry = function(context) {
	this.geometry.display(0, 0, context);
};

Level.prototype.init = function() {
	this.initBackground();
	this.initGeometry(this.geometry_initializer);	
	this.initObjects(this.object_initializer);
};

Level.prototype.initBackground = function() {
	this.background_image = game.background_image_map.getBackgroundImage(this.background_image_name);
};

Level.prototype.initObjects = function() {	
	throw ('initObjects not defined!');
};

Level.prototype.initGeometry = function() {
	throw ('initGeometry not defined!');
};

Level.prototype.geometryCheck = function(actor) {
	this.geometry.collisionCheck(actor);
};