SCScoreCounter.prototype = Object.create(TextUIElement.prototype);
SCScoreCounter.parent = TextUIElement.prototype;

function SCScoreCounter() {
	TextUIElement.call(this, '32px Trade Winds', '#ffffff');
};

SCScoreCounter.prototype.getValue = function() {
	return game.game_state.score;
};
