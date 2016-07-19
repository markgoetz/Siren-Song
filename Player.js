Player.prototype = Object.create(Actor.prototype);
Player.parent = Actor.prototype;

function Player() {
	this.constructor(
		new Rectangle(
			Player.HITBOX_GAP,
			Player.HITBOX_GAP,
			Player.WIDTH - Player.HITBOX_GAP * 2,
			Player.HEIGHT - Player.HITBOX_GAP * 2 
		),
		 'player'
	);
}

Player.prototype.init = function() {
	var player_point = game.game_state.current_level.getPlayerStartPoint();
	Player.parent.init.call(this, player_point.x, player_point.y);
	
	this.direction = 'right';
	this.updateAnimation();
	
	this.reset();
};

Player.WIDTH = 128;
Player.HEIGHT = 128;

Player.HITBOX_TOP = 26;
Player.HITBOX_HEIGHT = 83;
Player.HITBOX_WIDTH = 80;

Player.WATERLINE = 60;

Player.LEFT_HITBOX = [0, Player.HITBOX_TOP, Player.HITBOX_WIDTH, Player.HITBOX_HEIGHT];
Player.RIGHT_HITBOX = [Player.WIDTH - Player.HITBOX_WIDTH, Player.HITBOX_TOP, Player.HITBOX_WIDTH, Player.HITBOX_HEIGHT];


Player.COMBO_TIERS = [0,1,1.5,2,2.3,2.6,3,3.2,3.5,3.7,4,4.2,4.5,4.6,4.7,4.9];

Player.HEALTH = 100;
Player.BREATH = 100;

Player.BREATH_UNDERWATER = 6;
Player.BREATH_RECOVERY = 1.5;
Player.BREATH_SINGING = 5;
Player.BREATH_DAMAGE_RATE = 6;

Player.ACCELERATION = 700;
Player.DECELERATION = 700;

Player.GRAVITY = 1500;
Player.BUOYANCY = 200;

Player.SPLASH_VELOCITY_RATIO = .4;

Player.MAX_VELOCITY = 220;

Player.GRAB_DELAY = .3;

Player.INVULNERABILITY_TIME = 1.5;
Player.BLINK_TIME = .1;

Player.MAX_BOMB_POWER = 35;

Player.prototype.reset = function() {
	this.direction = 'right';
	this.alive = true;
	this.underwater = true;
	this.surfaced = false;
	this.slowing = false;
	this.singing = false;
	
	var player_point = game.game_state.current_level.getPlayerStartPoint();
	this.x = player_point.x;
	this.y = player_point.y;
	
	this.grab_delay = 0;
	this.grab_combo = 0;
	
	this.invulnerability_time = 0;
	
	this.bomb_power = 0;

	this.health = Player.HEALTH;
	this.breath = Player.BREATH;
	
	this.stopHorizontal();
	this.stopVertical();
};

Player.prototype.move = function(direction) {	
	if (direction == 'right') {
		this.x_acceleration = this.getAcceleration();
		this.direction = 'right';
	}
	else if (direction == 'left') {
		this.x_acceleration = -this.getAcceleration();
		this.direction = 'left';
	}
	
	if (direction == 'down') {
		this.y_acceleration = this.getAcceleration();
	}
	else if (direction == 'up') {
		this.y_acceleration = -this.getAcceleration();
	}
};

Player.prototype.slowHorizontal = function() {
	if (this.x_velocity > 0) {
		this.x_acceleration = -this.getDeceleration();
	}
	else {
		this.x_acceleration = this.getDeceleration();
	}
};

Player.prototype.slowVertical = function() {
	if (this.y_velocity > 0) {
		this.y_acceleration = -this.getDeceleration();
	}
	else {
		this.y_acceleration = this.getDeceleration();
	}
};

Player.prototype.sing = function() {
	if (this.underwater) return;
	
	if (!this.singing)
		game.sound_map.getSound('sing').play();
	
	this.singing = true;
};

Player.prototype.stopSinging = function() {
	if (this.singing) {
		game.sound_map.getSound('sing').stop();
	}
	
	this.singing = false;
};

Player.prototype.grab = function() {
	if (this.grab_delay > 0) return;
	if (this.underwater) return;
	
	game.sound_map.getSound('grab').play();

	this.grab_delay = Player.GRAB_DELAY;
	//this.sprite.playAnimation('grab');
};

Player.prototype.bomb = function() {
	if (this.bomb_power < Player.MAX_BOMB_POWER)
		return;
		
	this.bomb_power = 0;
	
	var c = new Charybdis();
	game.game_state.registerActor(c);
};


Player.prototype.isInvulnerable = function() {
	if (this.invulnerability_time > 0) return true;
	return false;
};

Player.prototype.damage = function(amount, invulnerability) {
	this.health -= amount;
	if (this.health <= 0) this.die();
	if (invulnerability)
		this.invulnerability_time = Player.INVULNERABILITY_TIME;
};

Player.prototype.addHealth = function(amount) {
	this.health += amount;
	if (this.health > Player.HEALTH) this.health = Player.HEALTH;
};

Player.prototype.prethink = function(delta) {	
	this.was_underwater = this.underwater; 
	
	this.underwater = (this.getHitbox().y > game.game_state.getWater().y);
	this.surfaced = (this.getHitbox().y + Player.WATERLINE < game.game_state.getWater().y);
	
	if (!this.was_underwater && this.underwater) {
		this.y_velocity *= Player.SPLASH_VELOCITY_RATIO;
		game.game_state.addSplashEffect(this.x + (this.width / 2), Math.PI * 1.5);
	}
	
	if (this.underwater)
		this.stopSinging();
};

Player.prototype.think = function(delta) {
	if (this.x < 0) {
		this.x = 0;
		this.x_velocity = 0;
		this.x_acceleration = 0;
	}
	if (this.x > game.playAreaWidth() - Player.WIDTH) {
		this.x = game.playAreaWidth() - Player.WIDTH;
		this.x_velocity = 0;
		this.x_acceleration = 0;
	} 

	if (this.underwater) {
		this.breath -= Player.BREATH / Player.BREATH_UNDERWATER * delta;
	}
	else if (this.singing) {
		this.breath -= Player.BREATH / Player.BREATH_SINGING * delta;
	}	
	else {
		this.breath += Player.BREATH / Player.BREATH_RECOVERY * delta;
	}
	
	if (this.breath < 0) {
		this.breath = 0;
		this.stopSinging();
		this.damage(Player.BREATH_DAMAGE_RATE * delta);
	}
	if (this.breath > Player.BREATH) {
		this.breath = Player.BREATH;
	}
	
	if (this.grab_delay > 0) {
		this.grab_delay = Math.max(this.grab_delay - delta, 0);		
		if (this.grab_delay == 0) this.grab_combo = 0;
	}
	
	if (this.invulnerability_time > 0) {
		this.invulnerability_time = Math.max(this.invulnerability_time - delta, 0);
	}
};

Player.prototype.isGrabbing = function() {
	return this.grab_delay > 0;
};

Player.prototype.addScore = function(sailor, bonus) {
	game.game_state.addScore();
	
	if (bonus) {
		this.grab_combo++;
		
		var bonus = Player.COMBO_TIERS[this.grab_combo];
		this.bomb_power = Math.min(this.bomb_power + bonus, Player.MAX_BOMB_POWER);
		
		if (this.grab_combo > 1) {	
			game.game_state.addBonusEffect(sailor.x, sailor.y, this.grab_combo);
		}
	}
};

Player.prototype.predisplay = function(context) {
	this.updateAnimation();
};

Player.prototype.updateAnimation = function() {
	var animation_name;

	if (this.grab_delay > 0)
		animation_name = 'grab';
	else if (this.underwater)
		animation_name = 'underwater';
	else if (this.singing)
		animation_name = 'sing';
	else
		animation_name = 'surface';

	animation_name = animation_name + this.direction;
	
	if (this.sprite.current_animation.name != animation_name)
		this.sprite.playAnimation(animation_name);
};

Player.prototype.oncollide = function(other_actor, sides) {
	if (other_actor instanceof LevelTile) {			
		this.collideStop(other_actor, sides, .01);
	}
	else if (other_actor instanceof Fish) {
		game.game_state.removeActor(other_actor);
		game.sound_map.getSound('fish').play();

		this.addHealth(Fish.HEALTH_BONUS);
	}
	else if (other_actor instanceof Water) {
		this.underwater = true;
	}
};

Player.prototype.getAcceleration = function() {
	return Player.ACCELERATION;
};

Player.prototype.getDeceleration = function() {
	return Player.DECELERATION;
};

Player.prototype.die = function() {
	this.health = 0;
	this.stopSinging();
	game.transition('gameover');
};

Player.prototype.preaccelerate = function() {
	if (this.surfaced && !this.underwater) {
		this.y_acceleration = Player.GRAVITY;
	}
	else {
		this.y_acceleration - Player.BUOYANCY;
	}
};

Player.prototype.premove = function() {
	if (this.x_velocity > Player.MAX_VELOCITY)  this.x_velocity = Player.MAX_VELOCITY;
	if (this.x_velocity < -Player.MAX_VELOCITY) this.x_velocity = -Player.MAX_VELOCITY;
	if (this.y_velocity > Player.MAX_VELOCITY)  this.y_velocity = Player.MAX_VELOCITY;
	if (this.y_velocity < -Player.MAX_VELOCITY) this.y_velocity = -Player.MAX_VELOCITY;
};

Player.prototype.postdisplay = function(context) {
};

Player.prototype.display = function(context) {
	if (this.invulnerability_time > 0 && this.invulnerability_time % (Player.BLINK_TIME * 2) > Player.BLINK_TIME)
		return;
	
	Player.parent.display.call(this, context);
};
