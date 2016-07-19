SmallBoat.prototype = Object.create(Boat.prototype);
SmallBoat.parent = Boat.prototype;

SmallBoat.HEIGHT = 194;
SmallBoat.WIDTH = 190;

SmallBoat.MAX_VELOCITY = 90;
SmallBoat.MIN_VELOCITY = 60;

SmallBoat.SINK_VELOCITY = 55;

SmallBoat.CANNONS = [14,173];
SmallBoat.CANNON_HEIGHT = 120;

SmallBoat.prototype.getVelocity = function() {
	return Math.random() * (SmallBoat.MAX_VELOCITY - SmallBoat.MIN_VELOCITY) + SmallBoat.MIN_VELOCITY;
};

function SmallBoat(left_side, sailor_count) {
	Boat.call(this, 'smallboat', SmallBoat.WIDTH, SmallBoat.HEIGHT, left_side, sailor_count, SmallBoat.CANNONS, SmallBoat.CANNON_HEIGHT);
}

