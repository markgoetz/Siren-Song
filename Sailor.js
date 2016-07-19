Sailor.prototype = Object.create(Actor.prototype);
Sailor.parent = Actor.prototype;

Sailor.HEIGHT = 64;
Sailor.WIDTH = 64;

Sailor.STUN_BAR = 100;
Sailor.STUN_RECOVERY_TIME = 2.5;

Sailor.STUN_RATE = 850;

Sailor.VELOCITY = 30;
Sailor.FALLING_VELOCITY = 200;
Sailor.SINKING_VELOCITY = 50;

function Sailor(boat, x_offset, y_offset) {
	this.constructor(new Rectangle(0, 0, Sailor.WIDTH, Sailor.HEIGHT), 'sailor');
	this.boat = boat;
	this.x_offset = x_offset;
	this.y_offset = y_offset;
}

Sailor.prototype.init = function() {
	Sailor.parent.init.call(this, this.boat.x + this.x_offset, this.boat.y + this.y_offset - Sailor.HEIGHT);
	this.reset();
};

Sailor.prototype.reset = function() {
	this.alive = true;
	this.stunned = false;
	this.stun_bar = Sailor.STUN_BAR;
	this.direction = (Math.random() > .5) ? 'left' : 'right';
};

Sailor.prototype.think = function(delta) {
	if (this.alive) {
		var player = game.game_state.getPlayer();
		if (player.singing) {
			
			var distance = Math.abs((this.x + Sailor.WIDTH / 2) - (player.x + Player.WIDTH / 2));
			
			var power = 1 / Math.sqrt(distance);
			
			if (player.direction == 'left'  && this.x > player.x)
				power = power / 2;
			if (player.direction == 'right' && this.x < player.x)
				power = power / 2;
			
			this.stun_bar -= power * Sailor.STUN_RATE * delta;
			if (this.stun_bar < 0) {
				this.stunned = true;
				this.stun_bar = 0;
			}
		}
		else if (this.stun_bar < Sailor.STUN_BAR) {
			this.stun_bar += (Sailor.STUN_BAR / Sailor.STUN_RECOVERY_TIME) * delta;
			
			if (this.stun_bar >= Sailor.STUN_BAR) {
				this.stun_bar = Sailor.STUN_BAR;
				this.stunned = false;
			}
		}
		
		var velocity = (this.stunned) ? 0 : Sailor.VELOCITY * this.stun_bar / Sailor.STUN_BAR;
		
		if (this.direction == 'left') {
			this.x_offset -= velocity * delta;
			if (this.x_offset < this.boat._getInternalHitbox().x) {
				this.direction = 'right';
				this.x_offset = this.boat._getInternalHitbox().x;
			}
		}
		else {
			this.x_offset += velocity * delta;
			if (this.x_offset > this.boat._getInternalHitbox().right_x() - Sailor.WIDTH) {
				this.direction = 'left';
				this.x_offset = this.boat._getInternalHitbox().right_x() - Sailor.WIDTH;
			}
		}
		
		this.x = this.boat.x + this.x_offset;
		this.y = this.boat.getHitbox().y - Sailor.HEIGHT;
	}
	else {
		if (this.getHitbox().bottom_y() > game.game_state.getWater().y) {
			this.y_velocity = Sailor.SINKING_VELOCITY;
		}
		if (this.y > game.WINDOW_HEIGHT)
			game.game_state.removeActor(this);		
	}
};

Sailor.prototype.oncollide = function(other_actor, side) {
	if (other_actor instanceof Player && this.stunned == true && this.alive == true && other_actor.isGrabbing()) {
		this.die();
		game.sound_map.getSound('sailorkilled').play();
		other_actor.addScore(this, true);
	}
};

Sailor.prototype.die = function() {
	this.alive = false;
	this.x_velocity = 0;
	this.y_velocity = Sailor.FALLING_VELOCITY;
	
	game.game_state.addBloodEffect(this.x, this.y, Math.PI * 1.5);
	game.game_state.addBloodEffect(this.x, this.y, Math.PI * 1.2);
	game.game_state.addBloodEffect(this.x, this.y, Math.PI * 1.8);
};

Sailor.prototype.predisplay = function(context) {
	this.updateAnimation();
};

Sailor.prototype.updateAnimation = function() {
	var animation_name;

	if (this.alive == false)
		animation_name = 'dead' + this.direction;
	else if (this.stunned)
		animation_name = 'stunned';
	else if (this.stun_bar < Sailor.STUN_BAR * .9)
		animation_name = 'docile';
	else
		animation_name = 'angry';

	if (this.sprite.current_animation.name != animation_name)
		this.sprite.playAnimation(animation_name);
};

Sailor.prototype.postdisplay = function(context) {
	/*if (this.alive) {
		context.fillStyle = (this.stunned) ? '#ff0000' : '#00ff00';
		context.fillRect(this.x, this.y - 4, 64 * (this.stun_bar / Sailor.STUN_BAR), 2);
	}*/
};
