SCBombMeter.prototype = Object.create(MeterUIElement.prototype);
SCBombMeter.parent = MeterUIElement.prototype;

SCBombMeter.WIDTH = 320;
SCBombMeter.HEIGHT = 24;

SCBombMeter.BLINK_TIME = .5;

SCBombMeter.VALUE_PER_SECOND = .4;

function SCBombMeter() {
	MeterUIElement.call(this, SCBombMeter.WIDTH, SCBombMeter.HEIGHT, '#ff7700', '#ffffff');
	this.text_alpha = 0;
	this.blink_direction = 'up';
	this.value = 0;
};

SCBombMeter.prototype.getValue = function() {
	return this.value;
};

SCBombMeter.prototype.step = function(delta) {
	var bomb_pct = game.game_state.getPlayer().bomb_power / Player.MAX_BOMB_POWER;
	
	if (this.value < bomb_pct) {
		this.value += SCBombMeter.VALUE_PER_SECOND * delta;
		if (this.value > bomb_pct) this.value = bomb_pct;
	}
	else if (this.value > bomb_pct) {
		this.value -= SCBombMeter.VALUE_PER_SECOND * delta;
		if (this.value < bomb_pct) this.value = bomb_pct;		
	}
	
	if (this.getValue() == 1) {
		stroke_value_delta = delta / SCBombMeter.BLINK_TIME;
		if (this.blink_direction == 'down') {
			this.text_alpha -= stroke_value_delta;
			if (this.text_alpha < 0) {
				this.text_alpha = 0;
				this.blink_direction = 'up';
			}
		}
		else {
			this.text_alpha += stroke_value_delta;
			if (this.text_alpha > 1) {
				this.text_alpha = 1;
				this.blink_direction = 'down';
			}
		}
	}
	else {
		this.text_alpha = 1;
	}
};

SCBombMeter.prototype.predisplay = function(context) {
	var bomb_pct = game.game_state.getPlayer().bomb_power / Player.MAX_BOMB_POWER;
	
	context.strokeStyle = this.color;
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(this.x + (SCBombMeter.WIDTH) * bomb_pct, this.y + 1);
	context.lineTo(this.x + (SCBombMeter.WIDTH) * bomb_pct, this.y + SCBombMeter.HEIGHT - 1);
	context.stroke();
	
	this.stroke_color = (bomb_pct < 1) ? '#cccccc' : '#ffffff';
};

SCBombMeter.prototype.postdisplay = function(context) {
	var bomb_pct = game.game_state.getPlayer().bomb_power / Player.MAX_BOMB_POWER;	
	
	if (bomb_pct == 1) {
		context.fillStyle = 'rgba(255,255,255,' + this.text_alpha + ')';
		context.font = '22px Trade Winds';
		context.textAlign = 'left';
		context.fillText('Press C for Charybdis', this.x + 5, this.y - 4);
	}
	else {
		context.fillStyle = 'rgba(95,95,95,.8)';
		context.font = '22px Trade Winds';
		context.textAlign = 'left';
		context.fillText('Charybdis', this.x + 5, this.y - 4);
	}
};
