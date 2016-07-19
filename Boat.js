Boat.prototype = Object.create(Actor.prototype);
Boat.parent = Actor.prototype;

Boat.SINK_VELOCITY = 55;
Boat.MAX_BOB_VELOCITY = 7;
Boat.BOB_ACCELERATION = 5.5;

Boat.TURNAROUND_ACCELERATION = 60;

function Boat(sprite_name, width, height, left_side, sailor_count, cannons, cannon_height) {
	this.constructor(new Rectangle(0, 0, width, height), sprite_name);
		
	if (left_side) {
		this.start_x = -width;
		this.x_velocity = this.getVelocity();
	}
	else {
		this.start_x = game.WINDOW_WIDTH;
		this.x_velocity = -this.getVelocity();
	}

	this.sailors = [];
	this.sailor_count = sailor_count;
	this.cannons = [];
	this.cannon_init = cannons;
	this.cannon_height = cannon_height;
	
	this.y_velocity = 0;
	this.y_acceleration = Boat.BOB_ACCELERATION;
}

Boat.prototype.init = function() {
	Boat.parent.init.call(this, this.start_x, 0);
	
	var deck = this._getInternalHitbox();
	this.y = game.game_state.getWater().y - deck.bottom_y();


	for (var i = 0; i < this.sailor_count; i++) {
		var sailor = new Sailor(this, Math.random() * (deck.width - Sailor.WIDTH) + deck.x, deck.y);
		this.sailors.push(sailor);
		game.game_state.registerActor(sailor);	
	}
	
	for (i = 0; i < this.cannon_init.length; i++) {
		var cannon = new Cannon(this, this.cannon_init[i], this.cannon_height);
		this.cannons.push(cannon);
		game.game_state.registerActor(cannon);	
	}
	
	this.sinking = false;

	this.reset();
};

Boat.prototype.reset = function() {

};

Boat.prototype.think = function(delta) {
	if (game.game_state.bombActive() && !this.sinking) {
		this.sink();
	}
	
	if (this.getSailorCount(true) == 0) {
		if (this.x_velocity < 0 && this.x < -this.getHitbox().width) {
			this.remove();
		}
		else if (this.x_velocity > 0 && this.x > game.WINDOW_WIDTH) {
			this.remove();
		}
	}
	else {
		if (this.x < 0 && this.x_velocity < 0) {
			this.x_acceleration = Boat.TURNAROUND_ACCELERATION;
			this.target_velocity = this.getVelocity();
		}
		else if (this.getHitbox().right_x() > game.WINDOW_WIDTH && this.x_velocity > 0) {
			this.x_acceleration = -Boat.TURNAROUND_ACCELERATION;
			this.target_velocity = -this.getVelocity();
		}
	}
	
	if (this.y > game.WINDOW_HEIGHT) {
		game.game_state.removeActor(this);
	}
};

Boat.prototype.oncollide = function(other_actor, side) {};

Boat.prototype.getSailorCount = function(count_stunned) {
	var count = 0;
	for (var i = 0; i < this.sailors.length; i++) {
		if (this.sailors[i].alive) {
			if (count_stunned || !this.sailors[i].stunned)
				count++;
		}
	}
	return count;
};

Boat.prototype.premove = function() {
	if (!this.sinking) {
		if (this.y_velocity > Boat.MAX_BOB_VELOCITY) {
			this.y_acceleration = -Boat.BOB_ACCELERATION;
			this.y_velocity = Boat.MAX_BOB_VELOCITY;
		}
		else if (this.y_velocity < -Boat.MAX_BOB_VELOCITY) {
			this.y_acceleration = Boat.BOB_ACCELERATION;
			this.y_velocity = -Boat.MAX_BOB_VELOCITY;
		}
		
		if (this.x_acceleration > 0 && this.x_velocity > this.target_velocity) {
			this.x_velocity = this.target_velocity;
			this.x_acceleration = 0;
		}
		if (this.x_acceleration < 0 && this.x_velocity < this.target_velocity) {
			this.x_velocity = this.target_velocity;
			this.x_acceleration = 0;
		}
	}
};

Boat.prototype.remove = function() {
	for (var i = 0; i < this.sailors.length; i++) {
		game.game_state.removeActor(this.sailors[i]);
	}
	
	for (var i = 0; i < this.cannons.length; i++) {
		game.game_state.removeActor(this.cannons[i]);
	}
	
	game.game_state.removeActor(this);
};

Boat.prototype.sink = function() {
	this.sinking = true;
		
	for (var i = 0; i < this.sailors.length; i++) {
		if (this.sailors[i].alive) {
			this.sailors[i].die();
			game.game_state.getPlayer().addScore();
		}
	}
	
	for (var i = 0; i < this.cannons.length; i++) {
		game.game_state.removeActor(this.cannons[i]);
	} 
	
	this.y_velocity = Boat.SINK_VELOCITY;
	this.y_acceleration = 0;

	var hitbox = this.getHitbox();
	var middle_x = hitbox.x + hitbox.width / 2;
	var x_distance = (game.WINDOW_WIDTH / 2) - middle_x;
	var y_distance = game.WINDOW_HEIGHT - hitbox.bottom_y();
	
	this.x_velocity = this.y_velocity * (x_distance / y_distance); 
	
	this.sprite.playAnimation((this.x_velocity < 0) ? 'sinkleft' : 'sinkright');
};

Boat.prototype.predisplay = function(context) {
	if (this.getSailorCount(true) == 0) {
		context.globalAlpha = .5;
	}
};
Boat.prototype.postdisplay = function(context) {
	context.globalAlpha = 1;
};



;;