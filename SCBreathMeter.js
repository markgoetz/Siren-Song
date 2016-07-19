SCBreathMeter.prototype = Object.create(MeterUIElement.prototype);
SCBreathMeter.parent = MeterUIElement.prototype;

SCBreathMeter.BLINK_TIME = .5;

function SCBreathMeter() {
	MeterUIElement.call(this, 320, 24, '#006600', '#ffffff');
	this.blink_direction = 'down';
	this.stroke_value = 255;
};

SCBreathMeter.prototype.getValue = function() {
	return game.game_state.getPlayer().breath / Player.BREATH;
};

SCBreathMeter.prototype.step = function(delta) {
	if (this.getValue() == 0) {
		stroke_value_delta = 255 * delta / SCBreathMeter.BLINK_TIME;
		if (this.blink_direction == 'down') {
			this.stroke_value -= stroke_value_delta;
			if (this.stroke_value < 0) {
				this.stroke_value = 0;
				this.blink_direction = 'up';
			}
		}
		else {
			this.stroke_value += stroke_value_delta;
			if (this.stroke_value > 255) {
				this.stroke_value = 255;
				this.blink_direction = 'down';
			}
		}
	}
	else {
		this.stroke_value = 255;
	}
	
	this.border_color = 'rgb(255,' + Math.floor(this.stroke_value) + ',' + Math.floor(this.stroke_value) + ')';
};

SCBreathMeter.prototype.predisplay = function(context) {
	var value = this.getValue();
	
	if (value > .4) {
		this.color = '#006600';
	}
	else if (value > .2) {
		this.color = 'rgb(' + Math.floor(255 * (.4 - value) / .2) + ',' + Math.floor(102 * (value - .2) / .2) +  ',0)';
	}
	else {
		this.color = '#ff0000';
	}
};


SCBreathMeter.prototype.postdisplay = function(context) {
	context.fillStyle = '#ffffff';
	
	if (this.getValue() == 0)
		context.fillStyle = '#ff0000';
	
	context.font = '22px Trade Winds';
	context.textAlign = 'left';
	context.fillText('breath', this.x + 5, this.y - 4);
};