BonusEffect.prototype = Object.create(Effect.prototype);
BonusEffect.parent = Effect.prototype;

BonusEffect.FONT = 'Trade Winds';
BonusEffect.MIN_TIME = .6;
BonusEffect.EXTRA_TIME = .2;
BonusEffect.VELOCITY_BASE = 12;
BonusEffect.STROKE_RGB = '31,15,0';
BonusEffect.FILL_RGB = '255,127,0';

function BonusEffect(x, y, value) {
	this.value = value;	
	this.constructor(x, y, this.getTime());	
	this.alpha = 1;
}

BonusEffect.prototype.think = function(delta) {
	this.alpha -= (delta / this.getTime());
	if (this.alpha < .001) this.alpha = 0; // fun with floating point
	
	this.y -= (delta * BonusEffect.VELOCITY_BASE * this.value);
};

BonusEffect.prototype.display = function(context) {
	context.textAlign = 'center';	
	context.font = this.getFontSize() + ' ' + BonusEffect.FONT;
	
	context.lineWidth = 2;
	context.strokeStyle = 'rgba('+ BonusEffect.STROKE_RGB + ',' + this.alpha  +')';	
	context.strokeText('x' + this.value, this.x, this.y);
	context.fillStyle = 'rgba('+ BonusEffect.FILL_RGB + ',' + this.alpha  +')';
	context.fillText('x' + this.value, this.x, this.y);
};

BonusEffect.prototype.getTime = function() {
	return BonusEffect.MIN_TIME + BonusEffect.EXTRA_TIME * this.value;
};

BonusEffect.prototype.getFontSize = function() {
	if (this.value < 4)
		return '24px';
	else if (this.value < 6)
		return '28px';
	else if (this.value < 8)
		return '36px';
	else if (this.value < 10)
		return '48px';
};
