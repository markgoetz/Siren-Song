BigBoat.prototype = Object.create(Boat.prototype);
BigBoat.parent = Boat.prototype;

BigBoat.HEIGHT = 234;
BigBoat.WIDTH = 340;

BigBoat.MAX_VELOCITY = 80;
BigBoat.MIN_VELOCITY = 50;

BigBoat.SINK_VELOCITY = 55;

BigBoat.CANNONS = [61,151,254];
BigBoat.CANNON_HEIGHT = 185;

BigBoat.prototype.getVelocity = function() {
	return Math.random() * (BigBoat.MAX_VELOCITY - BigBoat.MIN_VELOCITY) + BigBoat.MIN_VELOCITY;
};

function BigBoat(left_side, sailor_count) {
	Boat.call(this, 'bigboat', BigBoat.WIDTH, BigBoat.HEIGHT, left_side, sailor_count, BigBoat.CANNONS, BigBoat.CANNON_HEIGHT);
}

