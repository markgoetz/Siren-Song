Water.prototype = Object.create(Actor.prototype);
Water.parent = Actor.prototype;

Water.HEIGHT = 360;
Water.WIDTH = 1024;

function Water() {
	this.constructor(new Rectangle(0, 0, Water.WIDTH, Water.HEIGHT), 'water');
}

Water.prototype.init = function() {
	Water.parent.init.call(this, 0, game.WINDOW_HEIGHT - Water.HEIGHT);
	this.reset();
};

Water.prototype.reset = function() {

};

Water.prototype.think = function(delta) {
	
};