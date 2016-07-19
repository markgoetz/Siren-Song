SmokeEffect.prototype = Object.create(Effect.prototype);
SmokeEffect.parent = Effect.prototype;

SmokeEffect.TIME = .4;
SmokeEffect.VELOCITY = 30;
SmokeEffect.SIZE = 10;

function SmokeEffect(x, y, angle) {
	this.constructor(x, y, SmokeEffect.TIME);
	this.x = x;
	this.y = y;
	this.size = SmokeEffect.SIZE;
	this.x_velocity = SmokeEffect.VELOCITY * Math.cos(angle);
	this.y_velocity = SmokeEffect.VELOCITY * Math.sin(angle);
}

SmokeEffect.prototype.think = function(delta) {
	this.size -= (SmokeEffect.SIZE * delta / BloodEffect.TIME);
	this.x += this.x_velocity * delta;
	this.y += this.y_velocity * delta;
};

SmokeEffect.prototype.display = function(context) {
	context.fillStyle = 'rgba(200,200,200,.3);';
	context.beginPath();
	context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
	context.fill();
};
