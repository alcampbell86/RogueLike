var room_min_size = 5;
var room_max_size = 15;
var max_map_size = 64;

var Dungeon = {
    map: null,
    map_size: max_map_size,
    rooms: [],
	//hero will always start at [1],[0]
	heroX: 1,
	heroY: 1,
    Generate: function () {
        this.map = [];
		
		//Initialize the map space, set the spaces to 0
		//0 = empty space
		//1 = room tile
		//2 = wall
		//3 = entrance
		//4 = exit
		//5 = hero
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }
		
		//total rooms we're going to have + how large the rooms will be
        var room_count = Helpers.GetRandom(10, 20);
        var min_size = room_min_size;
        var max_size = room_max_size;

		//Generate the room, make sure the rooms don't collide with others
        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.y = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.w = Helpers.GetRandom(min_size, max_size);
            room.h = Helpers.GetRandom(min_size, max_size);

            if (this.DoesCollide(room)) {
                i--;
                continue;
            }
			
			//make sure no 2 rooms sit directly on each other.  We want a wall to separate
            room.w--;
            room.h--;
			
			//add the room to the stack
            this.rooms.push(room);
        }

        this.SquashRooms();

		//This bit builds the corridors between rooms that are near each other
        for (i = 0; i < room_count; i++) {
            var roomA = this.rooms[i];
            var roomB = this.FindClosestRoom(roomA);

            pointA = {
                x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
                y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
                y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = 1;
            }
        }

		//Iterate through the matrix and set the room tiles equal to 1
        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = 1;
                }
            }
        }
		
		//this bit builds the walls (tile = 2) outside the rooms
        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                if (this.map[x][y] == 1) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
                        }
                    }
                }
            }
        }
		
		//place the entrance
		this.map[1][0] = 3;
		//place the hero
		this.map[1][1] = 5;
		
		//find the furthest away room that is reachable
		var furthestAwayRoom;
		var furthestAwayRoomLength = 0;
        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
			var mapCopy = jQuery.extend(true, {}, this.map);
			var pathToRoom = findShortestPath([1,1],[room.x, room.y], mapCopy);
			room.reachable = pathToRoom;
			
			if(pathToRoom != false && furthestAwayRoomLength < pathToRoom.length) {
				furthestAwayRoom = room;
				furthestAwayRoomLength = pathToRoom.length;
			}
        }      
		
		//place the exit
		var roomCenterX = furthestAwayRoom.x + furthestAwayRoom.w/2;
		var roomCenterY = furthestAwayRoom.y + furthestAwayRoom.h/2;
		this.map[Math.floor(roomCenterX)][Math.floor(roomCenterY)] = 4;
    },                                                                                      
	                                                                                        
    FindClosestRoom: function (room) {                                                      
        var mid = {                                                                         
            x: room.x + (room.w / 2),                                                       
            y: room.y + (room.h / 2)                                                        
        };                                                                                  
        var closest = null;                                                                 
        var closest_distance = 1000;                                                        
        for (var i = 0; i < this.rooms.length; i++) {                                       
            var check = this.rooms[i];                                                      
            if (check == room) continue;                                                    
            var check_mid = {                                                               
                x: check.x + (check.w / 2),                                                 
                y: check.y + (check.h / 2)                                                  
            };                                                                              
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {                                              
                closest_distance = distance;                                                
                closest = check;                                                            
            }                                                                               
        }                                                                                   
        return closest;                                                                     
    },                                                                                      
	                                                                                        
    SquashRooms: function () {                                                              
        for (var i = 0; i < 10; i++) {                                                      
            for (var j = 0; j < this.rooms.length; j++) {                                   
                var room = this.rooms[j];                                                   
                while (true) {                                                              
                    var old_position = {                                                    
                        x: room.x,                                                          
                        y: room.y                                                           
                    };                                                                      
                    if (room.x > 1) room.x--;                                               
                    if (room.y > 1) room.y--;                                               
                    if ((room.x == 1) && (room.y == 1)) break;                              
                    if (this.DoesCollide(room, j)) {                                        
                        room.x = old_position.x;                                            
                        room.y = old_position.y;                                            
                        break;                                                              
                    }                                                                       
                }                                                                           
            }                                                                               
        }                                                                                   
    },                                                                                      
	                                                                                        
    DoesCollide: function (room, ignore) {                                                  
        for (var i = 0; i < this.rooms.length; i++) {                                       
            if (i == ignore) continue;                                                      
            var check = this.rooms[i];                                                      
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }                                                                                   
                                                                                            
        return false;                                                                       
    }                                                                                       
}                                                                                           
                                                                                            
var Helpers = {                                                                             
    GetRandom: function (low, high) {                                                       
        return~~ (Math.random() * (high - low)) + low;                                      
    },                                                                                      
	                                                                                        
	PrintMapToConsole: function() {                                                         
		for (var y = 0; y < Dungeon.map_size; y++) {                                        
			var xToConsole = "";                                                            
			for (var x = 0; x < Dungeon.map_size; x++) {                                    
				xToConsole += Dungeon.map[x][y];                                            
			}                                                                               
			console.log(xToConsole);                                                        
		}                                                                                   
	}                                                                                       
};                                                                                          