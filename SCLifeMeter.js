SCLifeMeter.prototype = Object.create(MeterUIElement.prototype);
SCLifeMeter.parent = MeterUIElement.prototype;

SCLifeMeter.VALUE_PER_SECOND = .7;

function SCLifeMeter() {
	MeterUIElement.call(this, 320, 24, '#990000', '#ffffff');
	this.value = 1;
};

SCLifeMeter.prototype.getValue = function() {
	return this.value;
};

SCLifeMeter.prototype.step = function(delta) {
	var health_pct = game.game_state.getPlayer().health / Player.HEALTH;
	
	if (this.value < health_pct) {
		this.value += SCLifeMeter.VALUE_PER_SECOND * delta;
		if (this.value > health_pct) this.value = health_pct;
	}
	else if (this.value > health_pct) {
		this.value -= SCLifeMeter.VALUE_PER_SECOND * delta;
		if (this.value < health_pct) this.value = health_pct;		
	}
};

SCLifeMeter.prototype.postdisplay = function(context) {
	context.fillStyle = '#ffffff';
	context.font = '22px Trade Winds';
	context.textAlign = 'left';
	context.fillText('health', this.x + 5, this.y - 4);
};