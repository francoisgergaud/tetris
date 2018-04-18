/**
 * the size of a grid element in pixels
 */
var gridBlockSize = 20;
var gridWidth = 10;
var gridHeight = 20;
var refreshPeriod = 500;

function moveFigureDown(figure){
	figure.y++;
}

function moveFigureLeft(figure){
	figure.x--;
}

function moveFigureRight(figure){
	figure.x++;
}

function getFigureGrid(figure){
	return figure.grids[figure.gridIndex];
}

function rotateFigure(figure){
	figure.gridIndex++;
	if(figure.gridIndex == figure.grids.length){
		figure.gridIndex = 0;
	}
}

function initializeGrid(width, height){
	var grid = [];
	for( i=0; i < width; i++){
		grid.push([]);
		for(j=0; j < height; j++){
			grid[i].push(0);
		}
	}
	return grid;
}


/**
 * create the buffer canvas from the size of the original canvas used for display
 */
function createBufferCanvasFronDisplayCanvas(displayCanvas){
	var backgroundCanvas = document.createElement('canvas');
	backgroundCanvas.width = displayCanvas.width;
	backgroundCanvas.height = displayCanvas.height;
	backgroundCanvas.getContext("2d").fillStyle = "rgb(255,255,255)";
	backgroundCanvas.getContext("2d").fillRect (0,0,backgroundCanvas.width,backgroundCanvas.height );
	return backgroundCanvas;
}

function tick(canvas, backgroundCavas, grid, figure, listFigures, timer){
	if(detectColisionDown(grid, figure)){
		fixFigureInGrid(grid, figure, backgroundCavas);
		removeLines(grid, figure, backgroundCavas);
		if(!checkLose(grid, figure, canvas, timer)){
			dropNewFigure(figure, listFigures, grid.length);
		}
	}else{
		moveFigureDown(figure);
	}
	draw(canvas, backgroundCavas, figure);
	return figure;
}

function checkLose(grid, figure, canvas, timer){
	var result = false;
	if(figure.y == 0){
		var ctx=canvas.getContext("2d");
		ctx.font="20px Georgia";
		ctx.fillText("Hello World!",10,50);
		ctx.font="30px Verdana";
		// Create gradient
		var gradient=ctx.createLinearGradient(0,0,c.width,0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		// Fill with gradient
		ctx.fillStyle=gradient;
		ctx.fillText("you fucking looser!",10,90);
		window.clearTimeout(timer);
		result = true;
	}
	return result;
}

function removeLines(grid, figure, backgroundCanvas){
	var figureGrid = getFigureGrid(figure);
	for(y= figure.y; y < (figure.y + figureGrid[0].length); y++){
		var emptyBlockFound = false;
		for(x = 0; x < grid.length; x++){
			if(grid[x][y] == 0){
				emptyBlockFound=true;
				break;
			}
		}
		if(!emptyBlockFound){
			for(x = 0; x < grid.length; x++){
				grid[x].splice(y,1);
				grid[x].splice(0,0,0);
			}
			backgroundCanvas.getContext("2d").drawImage(backgroundCanvas,0, 0, backgroundCanvas.width, y * gridBlockSize, 0, gridBlockSize, backgroundCanvas.width, y * gridBlockSize);
		}
	}
}

function userInput(canvas, backgroundCavas, grid, figure, keyCode){
	if(keyCode == 40){
		if(!detectColisionDown(grid, figure)){
			moveFigureDown(figure);
		}
	}else if(keyCode == 37){
		if(!detectColisionLeft(grid, figure)){
			moveFigureLeft(figure);
		}
	}else if(keyCode == 39){
		if(!detectColisionRight(grid, figure)){
			moveFigureRight(figure);
		}
	}else if(keyCode == 32){
		rotateFigure(figure);
	}
	draw(canvas, backgroundCavas, figure);
	return figure;
}

function detectColisionDown(grid, figure){
	var result = false;
	var figureGrid = getFigureGrid(figure);
	var fictiveY = figure.y+ 1;
	if((fictiveY + figureGrid[0].length) > grid[0].length){
		//detect the bottom
		result = true;
	}else {
		for(i = 0; i < figureGrid.length; i++){
			for(j = 0; j < figureGrid[i].length; j++){
				if(figureGrid[i][j] == 1){
					//detect other figures
					if(grid[figure.x + i][fictiveY + j] == 1){
						result = true;
						break;
					}
				}
			}
			if(result){
				break;
			}
		}
	}
	return result; 
}

function detectColisionLeft(grid, figure){
	var result = false;
	var figureGrid = getFigureGrid(figure);
	var fictiveX = figure.x -1;
	if(fictiveX < 0){
		//detect the bottom
		result = true;
	}else{
		for(i = 0; i < figureGrid.length; i++){
			for(j = 0; j < figureGrid[i].length; j++){
				if(figureGrid[i][j] == 1){
					//detect other figures
					if(grid[fictiveX + i][figure.y + j] == 1){
						result = true;
						break;
					}
				}
			}
			if(result){
				break;
			}
		}
	}
	return result; 
}

function detectColisionRight(grid, figure){
	var result = false;
	var figureGrid = getFigureGrid(figure);
	var fictiveX = figure.x + 1;
	if((fictiveX + figureGrid.length) > grid.length){
		//detect the bottom
		result = true;
	}else{
		for(i = 0; i < figureGrid.length; i++){
			for(j = 0; j < figureGrid[i].length; j++){
				if(figureGrid[i][j] == 1){
					//detect other figures
					if(grid[fictiveX + i][figure.y + j] == 1){
						result = true;
						break;
					}
				}
			}
			if(result){
				break;
			}
		}
	}
	return result; 
}

function fixFigureInGrid(grid, figure, backgroundCavas){
	var figureGrid = getFigureGrid(figure);
	for(i = 0; i < figureGrid.length; i++){
		for(j = 0; j < figureGrid[i].length; j++){
			if(figureGrid[i][j] == 1){
				//refresh the grid
				grid[figure.x + i][figure.y + j] = 1;
				//refresh the background canvas
				backgroundCavas.getContext("2d").fillStyle = "rgb(255,0,233)";
				backgroundCavas.getContext("2d").fillRect ((figure.x + i)*gridBlockSize,(figure.y + j)*gridBlockSize,gridBlockSize,gridBlockSize );
			}
		}
	}

}
	
function draw(canvas, backgroundCanvas, figure){
	//draw the environment
	canvas.getContext("2d").drawImage(backgroundCanvas,0,0,canvas.width,canvas.height);
	var figureGrid = getFigureGrid(figure);
	for(i = 0; i < figureGrid.length; i++){
		for(j = 0; j < figureGrid[i].length; j++){
			if(figureGrid[i][j] == 1){
				canvas.getContext("2d").fillStyle = "rgb(255,0,233)";
				canvas.getContext("2d").fillRect ((figure.x + i)*gridBlockSize,(figure.y + j)*gridBlockSize,gridBlockSize,gridBlockSize );
			}
		}
	}
}

function dropNewFigure(figure, listFigures, gridWith){
	figure.grids = listFigures[Math.floor(Math.random()*listFigures.length)];
	figure.gridIndex = 0;
	figure.x = 0;
	figure.y = Math.floor(gridWith / 2 );
}

function game(canvas){
	var timer;
	var grid = initializeGrid(gridWidth, gridHeight);
	canvas.width = gridWidth * gridBlockSize;
	canvas.height = gridHeight * gridBlockSize;
	var backgroundCanvas = createBufferCanvasFronDisplayCanvas(canvas);
	figure = {};
	dropNewFigure(figure,listFigures,gridWidth);
	window.addEventListener("keydown", function(e){
		userInput(canvas, backgroundCanvas, grid, figure, e.keyCode);}
	,false);
	timer=setInterval(function(){figure = tick(canvas, backgroundCanvas, grid, figure, listFigures,timer);},refreshPeriod);
}