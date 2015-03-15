var room_tile_color = "#64908A";
var wall_tile_color = "#424254";
var void_color = "#351330";
var exit_color = "#0000FF";

var Renderer = {
    canvas: null,
    ctx: null,
    size: 512,
    scale: 0,
    Initialize: function () {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx = canvas.getContext('2d');
        this.scale = this.canvas.width / Dungeon.map_size;
    },
    DrawMap: function () {
	
	//Parse the dungeon map and draw it on the canvas
        for (var y = 0; y < Dungeon.map_size; y++) {
            for (var x = 0; x < Dungeon.map_size; x++) {
                var tile = Dungeon.map[x][y];
                if (tile == 0) this.ctx.fillStyle = void_color;
                else if (tile == 1) this.ctx.fillStyle = room_tile_color;
				else if (tile == 3) this.ctx.fillStyle = '#ffffff';
				else if (tile == 4) this.ctx.fillStyle = exit_color;
				else if (tile == 5) this.ctx.fillStyle = '#000000';
                else this.ctx.fillStyle = wall_tile_color;
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }
    },
	
	UpdateHero: function(oldLoc, newLoc) {
		//Update old location
		this.ctx.fillStyle = room_tile_color;
        this.ctx.fillRect(oldLoc[0] * this.scale, oldLoc[1] * this.scale, this.scale, this.scale);
		
		//update new location
		this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(newLoc[0] * this.scale, newLoc[1] * this.scale, this.scale, this.scale);

	}
};