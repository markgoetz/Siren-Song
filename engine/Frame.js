function Frame(rect, duration, hitbox) {
	this.rect = rect;
	this.duration = duration;
	this.hitbox = hitbox;
}

Frame.prototype.getHitbox = function() {
	return this.hitbox;
};
