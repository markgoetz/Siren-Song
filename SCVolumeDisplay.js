SCVolumeDisplay.prototype = Object.create(UIElement.prototype);
SCVolumeDisplay.parent = UIElement.prototype;

SCVolumeDisplay.RGB = '0,255,0';
SCVolumeDisplay.VISIBLE = .8;
SCVolumeDisplay.FADEOUT = .7;
SCVolumeDisplay.HEIGHT = 32;
SCVolumeDisplay.BAR_WIDTH = 16;

function SCVolumeDisplay() {
	UIElement.call(this);
	this.fade_delay = 0;
}

SCVolumeDisplay.prototype.step = function(delta) {
	if (this.fade_delay > 0) {
		this.fade_delay -= delta;
		
		if (this.fade_delay < 0) this.fade_delay = 0; 
	}
};

SCVolumeDisplay.prototype.display = function(context) {
	if (this.fade_delay == 0) return;
	
	var alpha;
	
	if (this.fade_delay > SCVolumeDisplay.FADEOUT)
		alpha = 1;
	else
		alpha = (this.fade_delay * SCVolumeDisplay.FADEOUT);
	
	var volume = game.game_engine.getVolume();
	
	var x = 0;
	var rgba_color = 'rgba(' + SCVolumeDisplay.RGB + ',' + alpha + ')';
	context.fillStyle = rgba_color;

	for (var i = 0; i < volume; i++) {
		context.fillRect(this.x + x, this.y, SCVolumeDisplay.BAR_WIDTH, SCVolumeDisplay.HEIGHT);
		x += SCVolumeDisplay.BAR_WIDTH * 2;
	}
};

SCVolumeDisplay.prototype.turnOn = function() {
	this.fade_delay = SCVolumeDisplay.VISIBLE + SCVolumeDisplay.FADEOUT;
};
