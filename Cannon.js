Cannon.prototype = Object.create(Actor.prototype);
Cannon.parent = Actor.prototype;

Cannon.HEIGHT = 1;
Cannon.WIDTH = 1;


Cannon.MIN_FIRE_TIME = 2;
Cannon.MAX_FIRE_TIME = 3.5;


function Cannon(boat, x_offset, height) {
	this.constructor(new Rectangle(0, 0, Cannon.WIDTH, Cannon.HEIGHT), 'cannon');
	this.boat = boat;
	this.x_offset = x_offset;
	this.y_offset = height;
}

Cannon.prototype.init = function() {
	Cannon.parent.init.call(this, this.boat.x + this.x_offset, this.boat.y + this.y_offset);
	this.reset();
};

Cannon.prototype.reset = function() {
	this.setTimer(this.getFireTime(), 'fire');
	// EPIC HACK so you don't get a full salvo every time
	this.timer = Math.random() * this.timer;
};

Cannon.prototype.think = function(delta) {
	this.x = this.boat.x + this.x_offset;
	this.y = this.boat.y + this.y_offset;
	
	if (game.game_state.getPlayer().underwater || this.boat.getSailorCount(false) == 0) {
		this.clearTimer();
	}
	else if (!this.timer && !game.game_state.getPlayer().underwater && this.boat.getSailorCount(false) > 0) {
		this.setTimer(this.getFireTime(), 'fire');
		// EPIC HACK so you don't get a full salvo every time
		this.timer = Math.random() * this.timer;
	}
};

Cannon.prototype.fire = function() {
	if (game.game_state.getPlayer().alive == false) return;
	var angle = this.getFireAngle();

	var cannonball = new Cannonball(
		this.x + (Cannon.WIDTH - Cannonball.WIDTH) / 2,
		this.y + (Cannon.HEIGHT - Cannonball.HEIGHT) / 2,
		Cannonball.VELOCITY,
		angle,
		this.boat.x_velocity);
		
	game.game_state.registerActor(cannonball);
	game.sound_map.getSound('cannonball').play();
	
	game.game_state.addSmokeEffect(this.x, this.y, angle - .2);
	//game.game_state.addSmokeEffect(this.x, this.y, angle);
	game.game_state.addSmokeEffect(this.x, this.y, angle + .2);	
	
	this.setTimer(this.getFireTime(), 'fire');
};

Cannon.prototype.getFireTime = function() {
	return Math.random() * (Cannon.MAX_FIRE_TIME - Cannon.MIN_FIRE_TIME) + Cannon.MIN_FIRE_TIME;
};

Cannon.prototype.getFireAngle = function() {
	var player = game.game_state.getPlayer();
	
	if (this.x > player.x)
		angle = Math.random() * Math.PI / 4 + (Math.PI * 1.25);
	else
		angle = Math.random() * Math.PI / 4 + (Math.PI * 1.5);
		
	return angle;
};

Cannon.prototype.postdisplay = function(context) {
	/*var angle = this.getFireAngle();
	context.strokeStyle = '#ff0000';
	context.moveTo(this.x, this.y);
	context.lineTo(this.x + Math.cos(angle) * 100, this.y + Math.sin(angle) * 100);
	context.stroke();*/
};
