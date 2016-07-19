SCUIContainer.prototype = Object.create(UIElementContainer.prototype);
SCUIContainer.parent = UIElementContainer.prototype;

SCUIContainer.HEIGHT = 72;

function SCUIContainer() {
	this.constructor(new Rectangle(0, 0, game.WINDOW_WIDTH, SCUIContainer.HEIGHT));
	this.addUIElement(new SCLifeMeter(), 16, 16);
	this.addUIElement(new SCBreathMeter(), 16, 48);
	this.addUIElement(new SCBombMeter(), game.WINDOW_WIDTH - 16 - SCBombMeter.WIDTH, 16);
	this.addUIElement(new SCScoreCounter(), game.WINDOW_WIDTH / 2, 16);
	this.addUIElement(new SCVolumeDisplay(), (game.WINDOW_WIDTH - 21 * SCVolumeDisplay.BAR_WIDTH) / 2, 0);
};

SCUIContainer.prototype.displayBackground = function(context) {

};

SCUIContainer.prototype.showVolume = function() {
	this.elements[4].turnOn();
};

SCUIContainer.prototype.step = function(delta) {
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].step(delta);
	}
};