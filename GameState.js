function GameState() {
	this.score = 0;
	this.level_number = 0;
	this.triggers = [];
	
	this.actors = [];
	this.water = new Water();
		
	this.effects = [];
	this.effect_count = 0;	
	this.current_level = null;
	this.ids = 0;
};

GameState.prototype.init = function() {		
	this.current_level = game.level_map.getLevel(this.level_number);
	this.current_level.init();
	
	var player = new Player();
	this.registerActor(player);
	
	var dm = new DifficultyManager();
	this.registerActor(dm);
	
	this.water.init();
};

GameState.prototype.registerActor = function(actor) {
	this.actors.splice(-1,0,actor);	
	actor.init();
	actor.id = this.ids++;
};

GameState.prototype.step = function(delta) {
	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].step(delta);
	}
};

GameState.prototype.collisionTest = function() {
	for (var i = 0; i < this.actors.length; i++) {
		for (var j = 0; j < this.actors.length; j++) {
			if (i == j) continue;
			this.actors[i].collisionTest(this.actors[j]);
		}
	}
};

GameState.prototype.geometryCollisionTest = function() {
	for (var i = 0; i < this.actors.length; i++) {
		this.current_level.geometry.collisionCheck(this.actors[i]);
	}
};

GameState.prototype.getPlayer = function() {
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i] instanceof Player) return this.actors[i];
	}
};

GameState.prototype.getWater = function() {
	return this.water;
};

GameState.prototype.getBoatCount = function(big) {
	var count = 0;
	for (var i = 0; i < this.actors.length; i++) {
		if ((big && this.actors[i] instanceof BigBoat) || (!big && this.actors[i] instanceof SmallBoat)) {
			if (this.actors[i].getSailorCount(true) > 0)
				count++;
		}
	}
	return count;
};

GameState.prototype.removeActor = function(actor) {
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i].id == actor.id) {
			this.actors.splice(i, 1);
			return;
		}
	}
};

GameState.prototype.nextLevel = function() {
	game.transition('ready');
	this.level_number++;
	this.current_level = game.level_map.getLevel(this.level_number);
	this.current_level.init();
	this.player.reset(this.current_level.getPlayerStart());
};

GameState.prototype.addScore = function() {
	this.score++;
};

GameState.prototype.reset = function() {
	this.removeActorsByType(['bigboat', 'smallboat', 'fish', 'cannon', 'cannonball', 'sailor']);
	
	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].reset();
	}
	
	this.effects = [];
	this.effect_count = 0;
	
	this.score = 0;
		
	this.current_level = game.level_map.getLevel(this.level_number);
	this.current_level.init();
};

GameState.prototype.removeActorsByType = function(type_array) {
	for (var i = 0; i < this.actors.length; i++) {
		for (var j = 0; j < type_array.length; j++) {
			if (this.actors[i].sprite.sprite_name == type_array[j]) {
				this.actors.splice(i, 1);
				i--;
				continue;
			}
		}
	}
};

GameState.prototype.addBonusEffect = function(x, y, value) {
	var effect = new BonusEffect(x, y, value);
	effect.id = this.effect_count++;
	this.effects.push(effect);
};

GameState.prototype.addBloodEffect = function(x, y, angle) {
	var effect = new BloodEffect(x, y, angle);
	effect.id = this.effect_count++;
	this.effects.push(effect);
};

GameState.prototype.addSmokeEffect = function(x, y, angle) {
	var effect = new SmokeEffect(x, y, angle);
	effect.id = this.effect_count++;
	this.effects.push(effect);
};

GameState.prototype.addSplashEffect = function(x, angle, x_velocity) {
	var effect = new SplashEffect(x, angle, x_velocity);
	effect.id = this.effect_count++;
	this.effects.push(effect);
};

GameState.prototype.removeEffect = function(effect) {
	for (var i = 0, x = this.effects.length; i < x; i++) {
		if (this.effects[i].id == effect.id) {
			this.effects.splice(i, 1);
			return;
		}
	}
};

GameState.prototype.bombActive = function() {
	for (var i = 0; i < this.actors.length; i++) {
		if (this.actors[i] instanceof Charybdis) {
			return this.actors[i].isActive();
		}
	}
	return false;
};
