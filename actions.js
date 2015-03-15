var keyUp = 87;
var keyDown = 83;
var keyLeft = 65;
var keyRight = 68;

$(document).on("keyup", function(e) {
    var code = e.which;
	var mapAdjustment = [0,0];
    if(code == keyUp) { //up
		mapAdjustment = [0,-1];
	} else if (code == keyDown) { //down
		mapAdjustment = [0,1];
	} else if (code == keyLeft) { //left
		mapAdjustment = [-1,0];
	} else if (code == keyRight) { //right
		mapAdjustment = [1,0];
	}
	
	if( Movement.CheckSpace(mapAdjustment) ) {
		Movement.ChangeLocation(mapAdjustment);
		Renderer.UpdateHero([Dungeon.heroX - mapAdjustment[0], Dungeon.heroY - mapAdjustment[1]],
		[Dungeon.heroX,Dungeon.heroY]);
	}
});

var Movement = {
	CheckSpace: function(mapAdjustment) {
		if( Dungeon.map[Dungeon.heroX + mapAdjustment[0]][Dungeon.heroY + mapAdjustment[1]] == 1 ) {
			return true;
		} else if( Dungeon.map[Dungeon.heroX + mapAdjustment[0]][Dungeon.heroY + mapAdjustment[1]] == 4 ) {
			alert("You Win");
			Dungeon.Generate();
			Renderer.Initialize();
			Renderer.DrawMap(Dungeon.map);
		}
		return false;
	},
	
	ChangeLocation: function( mapAdjustment ) {
		var newHeroLocationX = Dungeon.heroX + mapAdjustment[0];
		var newHeroLocationY = Dungeon.heroY + mapAdjustment[1];
		
		Dungeon.map[Dungeon.heroX][Dungeon.heroY] = 1;
		Dungeon.map[newHeroLocationX][newHeroLocationY] = 5;
			
		Dungeon.heroX = newHeroLocationX;
		Dungeon.heroY = newHeroLocationY;
	},
	
}