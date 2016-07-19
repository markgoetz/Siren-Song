DifficultyManager.prototype = Object.create(Actor.prototype);
DifficultyManager.parent = Actor.prototype;

DifficultyManager.TIME_BETWEEN_TIERS = 13;
DifficultyManager.WIDTH = 1;
DifficultyManager.HEIGHT = 1;

DifficultyManager.TIERS = [
	{'small_boats':{'max_count':2,'max_time':5.5,'min_time':3,'min_sailors':1,'max_sailors':1}, 'big_boats':{'max_count':0,'max_time':5,'min_time':5,'min_sailors':0,'max_sailors':0},'min_fish_time':5,'max_fish_time':6},
	{'small_boats':{'max_count':2,'max_time':5,'min_time':3,'min_sailors':1,'max_sailors':2}, 'big_boats':{'max_count':0,'max_time':5,'min_time':5,'min_sailors':0,'max_sailors':0},'min_fish_time':5,'max_fish_time':7},
	{'small_boats':{'max_count':2,'max_time':4.5,'min_time':2.5,'min_sailors':1,'max_sailors':2}, 'big_boats':{'max_count':1,'max_time':9,'min_time':11,'min_sailors':1,'max_sailors':1},'min_fish_time':6,'max_fish_time':7},
	{'small_boats':{'max_count':2,'max_time':4,'min_time':2,'min_sailors':2,'max_sailors':3}, 'big_boats':{'max_count':1,'max_time':7,'min_time':9,'min_sailors':1,'max_sailors':2},'min_fish_time':7,'max_fish_time':9},
	{'small_boats':{'max_count':3,'max_time':4,'min_time':1.5,'min_sailors':3,'max_sailors':3}, 'big_boats':{'max_count':1,'max_time':5,'min_time':6,'min_sailors':2,'max_sailors':3},'min_fish_time':8,'max_fish_time':11},
	{'small_boats':{'max_count':3,'max_time':3,'min_time':1.5,'min_sailors':3,'max_sailors':4}, 'big_boats':{'max_count':2,'max_time':4,'min_time':5,'min_sailors':2,'max_sailors':3},'min_fish_time':10,'max_fish_time':12},
	{'small_boats':{'max_count':4,'max_time':3,'min_time':1.5,'min_sailors':3,'max_sailors':4}, 'big_boats':{'max_count':2,'max_time':3,'min_time':4,'min_sailors':2,'max_sailors':3},'min_fish_time':12,'max_fish_time':15},
];


function DifficultyManager() {
	this.constructor(new Rectangle(0, 0, 1, 1), 'dm');
}

DifficultyManager.prototype.init = function() {
	DifficultyManager.parent.init.call(this, -100, -100);
	this.reset();
};

DifficultyManager.prototype.reset = function() {
	this.game_timer = 0;
	this.tier_number = 0;
	this.small_boat_timer = this.getSmallBoatTime();
	this.big_boat_timer = this.getBigBoatTime();
	this.fish_timer = this.getFishTime();
};

DifficultyManager.prototype.think = function(delta) {
	this.game_timer += delta;
	this.tier_number = Math.min(
		Math.floor(this.game_timer / DifficultyManager.TIME_BETWEEN_TIERS),
		DifficultyManager.TIERS.length - 1
	);
	
	this.fish_timer -= delta;
	if (this.fish_timer <= 0) {
		this.addFish();
		this.fish_timer = this.getFishTime();
	}
	
	this.small_boat_timer -= delta;
	if (this.small_boat_timer <= 0) {
		this.addSmallBoat();
		this.small_boat_timer = this.getSmallBoatTime();
	}
	
	this.big_boat_timer -= delta;
	if (this.big_boat_timer <= 0) {
		this.addBigBoat();
		this.big_boat_timer = this.getBigBoatTime();
	}		
};

DifficultyManager.prototype.addSmallBoat = function() {
	if (game.game_state.getBoatCount(false) < DifficultyManager.TIERS[this.tier_number].small_boats.max_count) {
		var left_side = (Math.random() > .5);
		
		var boat = new SmallBoat(left_side, this.getSmallSailorCount());
		game.game_state.registerActor(boat);
	}
	
	this.small_boat_timer = this.getSmallBoatTime();
};

DifficultyManager.prototype.addBigBoat = function() {
	if (game.game_state.getBoatCount(true) < DifficultyManager.TIERS[this.tier_number].big_boats.max_count) {
		var left_side = (Math.random() > .5);
		
		var boat = new BigBoat(left_side, this.getBigSailorCount());
		game.game_state.registerActor(boat);
	}
	
	this.big_boat_timer = this.getBigBoatTime();
};


DifficultyManager.prototype.addFish = function() {
	var left_side = (Math.random() > .5);
	var water = game.game_state.getWater();
	var acceptable_height = Water.HEIGHT - Fish.HEIGHT - 64;
		
	var fish = new Fish(left_side, Math.random() * acceptable_height + water.y);
	game.game_state.registerActor(fish);
};

DifficultyManager.prototype.getSmallBoatTime = function() {
	var tier = DifficultyManager.TIERS[this.tier_number].small_boats;
	return Math.random() * (tier.max_time - tier.min_time) + tier.min_time;
};

DifficultyManager.prototype.getBigBoatTime = function() {
	var tier = DifficultyManager.TIERS[this.tier_number].big_boats;
	return Math.random() * (tier.max_time - tier.min_time) + tier.min_time;
};

DifficultyManager.prototype.getFishTime = function() {
	var tier = DifficultyManager.TIERS[this.tier_number];
	return Math.random() * (tier.max_fish_time - tier.min_fish_time) + tier.min_fish_time;
};

DifficultyManager.prototype.getSmallSailorCount = function() {
	var tier = DifficultyManager.TIERS[this.tier_number];
	return Math.round(Math.random() * (tier.small_boats.max_sailors - tier.small_boats.min_sailors) + tier.small_boats.min_sailors);
};

DifficultyManager.prototype.getBigSailorCount = function() {
	var tier = DifficultyManager.TIERS[this.tier_number];
	return Math.round(Math.random() * (tier.big_boats.max_sailors - tier.big_boats.min_sailors) + tier.big_boats.min_sailors);
};
