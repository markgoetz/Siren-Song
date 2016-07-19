Cannonball.prototype = Object.create(Actor.prototype);
Cannonball.parent = Actor.prototype;

Cannonball.HEIGHT = 24;
Cannonball.WIDTH = 24;
Cannonball.VELOCITY = 300;
Cannonball.GRAVITY = 380;
Cannonball.UNDERWATER_VELOCITY_RATIO = .3; 
Cannonball.UNDERWATER_GRAVITY = 100;
Cannonball.MAX_SINKING_VELOCITY = 90;

Cannonball.SURFACE_DAMAGE = 20;
Cannonball.UNDERWATER_DAMAGE = 20;

function Cannonball(x, y, velocity, angle, boat_velocity) {
	this.constructor(new Rectangle(0, 0, Cannonball.WIDTH, Cannonball.HEIGHT), 'cannonball');
	this.start_x = x;
	this.start_y = y;
	this.start_velocity = velocity;
	this.start_angle = angle;
	this.boat_velocity = boat_velocity;
}

Cannonball.prototype.init = function() {
	Cannonball.parent.init.call(this, this.start_x, this.start_y);
	this.setVelocityByAngle(this.start_velocity, this.start_angle);
	this.x_velocity += this.boat_velocity;
	this.y_acceleration = Cannonball.GRAVITY;
	this.underwater = false;
	this.reset();
};

Cannonball.prototype.reset = function() {

};

Cannonball.prototype.think = function(delta) {
	if (!this.underwater && this.y_velocity > 0 && this.getHitbox().bottom_y() > game.game_state.getWater().y) {
		this.underwater = true;
		this.y_acceleration = Cannonball.UNDERWATER_GRAVITY;
		this.y_velocity *= Cannonball.UNDERWATER_VELOCITY_RATIO;
		this.x_velocity *= Cannonball.UNDERWATER_VELOCITY_RATIO;
		
		/*game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.05, this.x_velocity);
		game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.20, this.x_velocity);
		game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.35, this.x_velocity);
		game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.50, this.x_velocity);
		game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.65, this.x_velocity);		
		game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.75, this.x_velocity);		
		game.game_state.addSplashEffect(this.x + (this.getHitbox().width / 2), Math.PI * 1.95, this.x_velocity);*/
		
	}
	
	if (this.underwater && game.game_state.bombActive()) {
		var hitbox = this.getHitbox();
		var middle_x = hitbox.x + hitbox.width / 2;
		var x_distance = (game.WINDOW_WIDTH / 2) - middle_x;
		var y_distance = game.WINDOW_HEIGHT - hitbox.bottom_y();
	
		this.x_velocity = this.y_velocity * (x_distance / y_distance); 
	};
	
	if (this.y > game.WINDOW_HEIGHT || this.x < 0 || this.x > game.WINDOW_WIDTH) {
		game.game_state.removeActor(this);
	}
};

Cannonball.prototype.premove = function() {
	if (this.underwater && this.y_velocity > Cannonball.MAX_SINKING_VELOCITY) {
		this.y_acceleration = 0;
		this.y_velocity = Cannonball.MAX_SINKING_VELOCITY;
	}
};

Cannonball.prototype.oncollide = function(other_actor, side) {
	if (other_actor instanceof Player && !other_actor.isInvulnerable()) {
		var damage = (this.underwater) ? Cannonball.SURFACE_DAMAGE : Cannonball.UNDERWATER_DAMAGE;
		game.sound_map.getSound('hit').play();	
		other_actor.damage(damage, true);
	}
};