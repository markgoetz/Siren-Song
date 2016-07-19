Charybdis.prototype = Object.create(Actor.prototype);
Charybdis.parent = Actor.prototype;

Charybdis.WIDTH = 512;
Charybdis.HEIGHT = 307;
Charybdis.VELOCITY = 120;
Charybdis.DELAY = 2;


function Charybdis() {
	this.constructor(new Rectangle(0, 0, Charybdis.WIDTH, Charybdis.HEIGHT), 'charybdis');
	this.start_x = (game.WINDOW_WIDTH - Charybdis.WIDTH) / 2;
	this.start_y = game.WINDOW_HEIGHT;
}

Charybdis.prototype.init = function() {
	Charybdis.parent.init.call(this, this.start_x, this.start_y);
	this.y_velocity = -Charybdis.VELOCITY;
};

Charybdis.prototype.reset = function() {
	this.y = game.WINDOW_HEIGHT + 10;
};

Charybdis.prototype.think = function() {
	if (this.y < game.WINDOW_HEIGHT - Charybdis.HEIGHT && this.y_velocity < 0) {
		this.y_velocity = 0;
		game.sound_map.getSound('bomb').play();
		this.setTimer(Charybdis.DELAY, 'moveDown');
	}
	if (this.y > game.WINDOW_HEIGHT) {
		game.game_state.removeActor(this);
	}
};

Charybdis.prototype.moveDown = function() {
	this.y_velocity = Charybdis.VELOCITY;
};

Charybdis.prototype.isActive = function() {
	return (this.y_velocity == 0);
};

Charybdis.prototype.oncollide = function(other_actor, side) {
	if (other_actor instanceof BigBoat || other_actor instanceof SmallBoat || other_actor instanceof Sailor) {
		game.game_state.removeActor(other_actor);
		//game.game_state.getPlayer().addHealth(1);
	}
};

