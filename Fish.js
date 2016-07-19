Fish.prototype = Object.create(Actor.prototype);
Fish.parent = Actor.prototype;

Fish.WIDTH = 64;
Fish.HEIGHT = 64;
Fish.VELOCITY = 60;
Fish.HEALTH_BONUS = 10;

function Fish(left_side, y) {
	this.constructor(new Rectangle(0, 0, Fish.WIDTH, Fish.HEIGHT), 'fish');
	
	if (left_side) {
		this.start_x = -Fish.WIDTH;
		this.x_velocity = Fish.VELOCITY;
	}
	else {
		this.start_x = game.WINDOW_WIDTH;
		this.x_velocity = -Fish.VELOCITY;
	}
	this.start_y = y;
}

Fish.prototype.init = function() {
	Fish.parent.init.call(this, this.start_x, this.start_y);
	this.sprite.playAnimation((this.x_velocity < 0) ? 'left' : 'right');
};

Fish.prototype.think = function() {
	if (this.x_velocity < 0 && this.x < -Fish.WIDTH) {
		game.game_state.removeActor(this);
	}
	else if (this.x_velocity > 0 && this.x > game.WINDOW_WIDTH) {
		game.game_state.removeActor(this);
	}	
};

Fish.prototype.oncollide = function(other_actor, sides) {
	if (other_actor instanceof Player) {
		var other_hitbox = other_actor.getHitbox();
		var other_x = other_hitbox.x + other_hitbox.width / 2;
		var other_y = other_hitbox.y + other_hitbox.height / 2;
		
		var this_x = this.x + Fish.WIDTH / 2;
		var this_y = this.y + Fish.HEIGHT / 2;
		
		var angle = Math.atan2(this_y - other_y, this_x - other_x);
		
		for (var i = 0; i < 3; i++) {
			game.game_state.addBloodEffect(this_x, this_y, angle + Math.random() * .5 - .25);
		}
	}
};

