SCPreloader.prototype = Object.create(Preloader.prototype);
SCPreloader.parent = Preloader.prototype;

function SCPreloader(width, height) {
	this.constructor(width, height);
}

SCPreloader.prototype.renderPreloader = function(context) {
	var loaded_count = this.getLoadedCount();
	var total_count = this.getTotalCount();
	
	var bar_height = 32;
	var bar_width = this.width - 2 * 32;
	
	var x = 32;
	var y = (this.height - bar_height) / 2;
	
	context.strokeStyle = '#000000';
	context.lineWidth = 5;
	context.strokeRect(x, y, bar_width, bar_height);
	
	context.fillStyle = '#ff7f00';
	context.fillRect(x, y, bar_width * (loaded_count / total_count), bar_height);
};