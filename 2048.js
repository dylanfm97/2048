var board = {};
var board_animations = {};
var score = 0;
var score_header = document.querySelector("#score");

/*
board["tile0-0"] = 2;
board["tile1-0"] = 4;
board["tile2-0"] = 8;
board["tile3-0"] = 16;
board["tile0-1"] = 32;
board["tile1-1"] = 64;
board["tile2-1"] = 128;
board["tile3-1"] = 256;
board["tile0-2"] = 512;
board["tile1-2"] = 1024;
board["tile2-2"] = 2048;

*/

var board_div = document.querySelector("#board");

var tile_key = function(x, y){
	return "tile"+x+"-"+y;
}

var combine_row = function(nums){
	var new_nums = [];
	while(nums.length > 0){
		if(nums.length > 1 && nums[0] == nums[1]){
			new_nums.push(nums[0]*2);
			nums.shift();
			nums.shift();
			if(nums[0]){
				score += parseInt(nums[0]*2);
			}
			
		}
		else{//they are not the same
			new_nums.push(nums[0]);
			nums.shift();
		}
	}
	return new_nums;
}
	
var get_numbers_in_row = function(row){
	var nums = [];
	for(col = 0; col < 4; col++){
		var this_key = tile_key(col, row);
		var this_num = board[this_key];
		if(this_num){
			nums.push(this_num);
		}
		
	}
	return nums;
}

var get_numbers_in_row_with_zero = function(row, which_board){
	var nums = [];
	for(col = 0; col < 4; col++){
		var this_key = tile_key(col, row);
		var this_num = which_board[this_key];
		if(this_num){
			nums.push(this_num);
		}
		else{
			nums.push(0);
		}
		
	}
	return nums;
}

var get_numbers_in_col = function(col){
	var nums = [];
	for(row = 0; row < 4; row++){
		var this_key = tile_key(col, row);
		var this_num = board[this_key];
		if(this_num){
			nums.push(this_num);
		}
		
	}
	return nums;
}

var get_numbers_in_col_with_zero = function(col, which_board){
	var nums = [];
	for(row = 0; row < 4; row++){
		var this_key = tile_key(col, row);
		var this_num = which_board[this_key];
		if(this_num){
			nums.push(this_num);
		}
		else{
			nums.push(0);
		}
		
	}
	return nums;
}

var set_numbers_in_row = function(row, nums, is_left){
	if(is_left){
		for(var col = 0; col < 4; col++){
			if(nums[col]){
				insert(col, row, nums[col]);
			}
			else{
				insert(col, row, 0);
			}
		}
	}
	else{
		for(var col = 0; col < 4; col++){
			if(nums[col]){
				insert(3-col, row, nums[col]);
			}
			else{
				insert(3-col, row, 0);
			}
		}
	}
}



var set_numbers_in_col = function(col, nums, is_down){
	if(is_down){
		for(var row = 0; row < 4; row++){
			if(nums[row]){
				insert(col, row, nums[row]);
			}
			else{
				insert(col, row, 0);
			}
		}
	}
	else{
		for(var row = 0; row < 4; row++){
			if(nums[row]){
				insert(col, 3-row, nums[row]);
			}
			else{
				insert(col, 3-row, 0);
			}
		}
	}
}

var create_board = function(){
	for(i = 0; i < 4; i++){
		var row = document.createElement("div");
		row.classList.add("row");
		board_div.appendChild(row);

		for(j = 0; j < 4; j++){
			var tile = document.createElement("div");
			tile.classList.add("tile");
			tile.id = "tile"+String(j)+"-"+String(i);
			row.appendChild(tile);
		}
	}
}

var get_high_scores = function(){
	//standard template for an ajax request
	fetch("https://highscoreapi.herokuapp.com/scores").then(function(response) {
		response.json().then(function (scores) {//my data is an array in this case
			scores.forEach(function (score) {
				//console.log(score.name);
				//console.log(score.score);
			});	
		});
	});
};


/*
var submit_score = function(){
	fetch("https://highscoreapi.herokuapp.com/scores", {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
		body: JSON.stringify(score);
		
	});

};
*/

var update_board = function(){	
	for(i = 0; i < 4; i++){
		for(j = 0; j < 4; j++){
			key = tile_key(j,i);
			this_tile = document.querySelector("#tile"+j+"-"+i);
			if(board[key]){
				this_tile.classList = "";
				this_tile.classList.add("tile");
				this_tile.classList.add("tile-"+board[key]);

				if(board_animations[key] == "appear"){
					this_tile.classList.add("new_tile");
				}
				else if(board_animations[key] == "move_left-1"){
					console.log("I added the class wtf");
					this_tile.classList.add("move_left-one");

					
				}

				this_tile.innerHTML = board[key];
			}
			else{
				
				this_tile.classList = "";
				this_tile.classList.add("tile");
				this_tile.innerHTML = "";
			}

		}
	}
	board_animations = {};
	score_header.innerHTML = "Score: "+score;

}

var get_empty_tiles = function() {
	var empty = [];
	for(var row = 0; row < 4; row++){
		for(var col = 0; col < 4; col++){
			var key = tile_key(col, row);

			var value = board[key];
			if(!value){
				empty.push(key);
			}
		}
	}
	return empty;
}


var add_one_tile = function(){
	var empty_tiles = get_empty_tiles();
	
	var random_index = Math.floor(Math.random() * empty_tiles.length);
	var random_empty_tile = empty_tiles[random_index];
	
	board_animations[random_empty_tile] = "appear";

	var r = Math.random();
	if(r < .8){
		board[random_empty_tile] = 2;
	}
	else{
		board[random_empty_tile] = 4;
	}


}
var insert = function(x, y, value){
	board["tile"+x+"-"+y] = value;
}

var add_animations = function(board_before, board_after, direction){

	if(direction == "left"){
		for(var j = 0; j < 4; j++){ //loop over each row
			this_row_before = get_numbers_in_row_with_zero(j, board_before);
			
			console.log("this row before");
			console.log(this_row_before);
			this_row_after = get_numbers_in_row_with_zero(j, board_after);
			console.log("this row after");
			console.log(this_row_after);
			

			for(var k = 0; k < 4; k++){//loop over each num in the row
				spaces_moved = 0;

				if(this_row_before[k] != 0 && k > 0){
				//if I'm not a zero and I'm not the first number
					for(var z = k-1; z >= 0; z--){
					//loop from this number back to the beginning of the list
						if(this_row_before[z] == 0 || (z == k-1 && this_row_before[z] == this_row_before[k])){
						//if there is a zero to my left OR if there is a duplicate of me adjacent to my left
							spaces_moved++;
						}
					}
					//have: row#, col#
					var key = tile_key(k-1, j);
					console.log(k + ", "+j);
					board_animations[key] = "move_left-"+spaces_moved;

					console.log(this_row_before[k]+": spaces moved "+spaces_moved);
				}

				
			}//end for over single number

			

		}//end outer for	
	}//end if==left
	

}

var initialize_board = function(){
	var x_1 = Math.floor(Math.random()*4);
	var y_1 = Math.floor(Math.random()*4);

	var x_2 = Math.floor(Math.random()*4);
	var y_2 = Math.floor(Math.random()*4);

	while(x_2 == x_1 && y_2 == y_1){
		x_2 = Math.floor(Math.random()*4);
		y_2 = Math.floor(Math.random()*4);
	}

	var r = Math.random()
	if(r < .8){
		insert(x_1, y_1,2);
	}
	else{
		insert(x_1, y_1,2);
	}
	
	r = Math.random()
	if(r < .8){
		insert(x_2, y_2,2);
	}
	else{
		insert(x_2, y_2,4);
	}
	update_board();
}


document.onkeydown = function(event) {
	//get an actual copy of the board, not just a reference
	var board_copy = Object.assign({}, board);

	if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }


	if(event.key == "ArrowUp"){
		for(var col = 0; col < 4; col++){
			var this_col = get_numbers_in_col(col);
			var new_col = combine_row(this_col);
			set_numbers_in_col(col, new_col, true);
			
		}
	}
	else if(event.key == "ArrowRight"){
		for(var row = 0; row < 4; row++){
			var this_row = get_numbers_in_row(row);
			this_row.reverse();
			this_row = combine_row(this_row);
			set_numbers_in_row(row, this_row, false);
			
		}
	}
	else if(event.key == "ArrowDown"){
		for(var col = 0; col < 4; col++){
			var this_col = get_numbers_in_col(col);
			this_col.reverse();
			this_col = combine_row(this_col);
			set_numbers_in_col(col, this_col, false);
			
		}
	}
	else if(event.key == "ArrowLeft"){
		for(var row = 0; row < 4; row++){
			var this_row = get_numbers_in_row(row);

			

			this_row = combine_row(this_row);
			set_numbers_in_row(row, this_row, true);
			

			add_animations(board_copy, board, "left");
		}
	}

	

	if(JSON.stringify(board_copy) != JSON.stringify(board)){
		add_one_tile();
	}
	update_board();
}


document.querySelector("#get_scores").onclick = function(){
	get_high_scores();
}

create_board();
initialize_board();
update_board();
//test_combine_row();







