BloodEffect.prototype = Object.create(Effect.prototype);
BloodEffect.parent = Effect.prototype;

BloodEffect.TIME = .4;
BloodEffect.VELOCITY = 90;
BloodEffect.SIZE = 5;

function BloodEffect(x, y, angle) {
	this.constructor(x, y, BloodEffect.TIME);
	this.x = x;
	this.y = y;
	this.size = BloodEffect.SIZE;
	this.x_velocity = BloodEffect.VELOCITY * Math.cos(angle);
	this.y_velocity = BloodEffect.VELOCITY * Math.sin(angle);
}

BloodEffect.prototype.think = function(delta) {
	this.size -= (BloodEffect.SIZE * delta / BloodEffect.TIME);
	this.x += this.x_velocity * delta;
	this.y += this.y_velocity * delta;
};

BloodEffect.prototype.display = function(context) {
	context.fillStyle = '#770000';
	context.beginPath();
	context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
	context.fill();
};
