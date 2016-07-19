SplashEffect.prototype = Object.create(Effect.prototype);
SplashEffect.parent = Effect.prototype;

SplashEffect.TIME = .6;
SplashEffect.VELOCITY = 100;
SplashEffect.SIZE = 4;
SplashEffect.GRAVITY = 200;

function SplashEffect(x, angle, x_velocity) {
	var y = game.game_state.getWater().y;
	this.constructor(x, y, SplashEffect.TIME);
	this.size = SplashEffect.SIZE;
	this.x_velocity = SplashEffect.VELOCITY * Math.cos(angle) + x_velocity;
	this.y_velocity = SplashEffect.VELOCITY * Math.sin(angle);
}

SplashEffect.prototype.think = function(delta) {
	this.size -= (SplashEffect.SIZE * delta / SplashEffect.TIME);
	this.y_velocity += SplashEffect.GRAVITY * delta;
	
	this.x += this.x_velocity * delta;
	this.y += this.y_velocity * delta;
	
};

SplashEffect.prototype.display = function(context) {
	context.fillStyle = '#0F4CB7';
	context.strokeStyle = '#90AFBD';
	context.lineWidth = 1;
	context.beginPath();
	context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
};
