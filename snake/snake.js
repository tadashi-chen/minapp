/**
 * 原生js贪吃蛇 
 * chrome版本: 55.0.2883.95 (64-bit)
 */
(function() {
	var Snake = {
	    rows: 0,
	    columns: 0,
	    divs: null,
	    foodX: 0,
	    foodY: 0,
	    direction: null,
	    body: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
	    intervalID: 0,
	    addDom: function(arg) {
	        var count = Snake.rows * Snake.columns;
	        var html = '';

	        for (var i = 0; i < count; i++) {
	            html += '<div></div>'
	        }
	        Snake.container.innerHTML = html;
	    },
	    init: function() {
	        Snake.reset();

	        document.onkeydown = function(event) {

	            if (event.keyCode === 37 && Snake.direction !== 'right') {
	                Snake.setDirection('left');
	            } else if (event.keyCode === 38 && Snake.direction !== 'down') {
	                Snake.setDirection('up');
	            } else if (event.keyCode === 39 && Snake.direction !== 'left') {
	                Snake.setDirection('right');
	            } else if (event.keyCode === 40 && Snake.direction !== 'up') {
	                Snake.setDirection('down');
	            }

	        }
	    },
	    reset: function(arg) {
	        Snake.container = document.getElementById('snake');
	        Snake.rows = Snake.container.clientHeight / 10;
	        Snake.columns = Snake.container.clientWidth / 10;
	        Snake.divs = Snake.container.getElementsByTagName('div');
	        Snake.direction = 'right';
	        Snake.addDom();
	        Snake.setBackground({ x: 1, y: 1 }, 'black');
	        Snake.setBackground({ x: 2, y: 1 }, 'black');
	        Snake.setBackground({ x: 3, y: 1 }, 'red');

	        Snake.setFood();

	        Snake.intervalID = setInterval(function() {
	            Snake.move();
	        }, 200);
	    },
	    setBackground: function(arg, color) {
	        var index = (arg.y - 1) * Snake.columns - 1 + arg.x;

	        Snake.divs[index].style.background = color || '';
	    },
	    move: function() {

	        Snake.setBackground(Snake.body[0], 'black');
	        Snake.setBackground(Snake.body[Snake.body.length - 1]);

	        switch (Snake.direction) {
            case 'up':
                Snake.body.unshift({ x: Snake.body[0].x, y: Snake.body[0].y - 1 });
            	if (Snake.body[0].y < 1) {
            		Snake.gameover();
            		return;
            	}
                break;
            case 'down':
                Snake.body.unshift({ x: Snake.body[0].x, y: Snake.body[0].y + 1 });
            	if (Snake.body[0].y > Snake.rows) {
            		Snake.gameover();
            		return;
            	}
                break;
            case 'left':
                Snake.body.unshift({ x: Snake.body[0].x - 1, y: Snake.body[0].y });
            	if (Snake.body[0].x < 1) {
            		Snake.gameover();
            		return;
            	}
                break;
            case 'right':
                Snake.body.unshift({ x: Snake.body[0].x + 1, y: Snake.body[0].y });
            	if (Snake.body[0].x > Snake.columns) {
            		Snake.gameover();
            		return;
            	}
                break;
	        }

	        var isInBody = false;
	        for (var i = 1; i < Snake.body.length; i++) {
	        	if (Snake.body[i].x === Snake.body[0].x && Snake.body[i].y === Snake.body[0].y) {
	        		isInBody = true;
	        		break;
	        	} 
	        }
	        if (isInBody) {
	        	Snake.gameover();
	        	return;
	        }

	        Snake.setBackground(Snake.body[0], 'red');

	        if (Snake.foodX === Snake.body[0].x && Snake.foodY === Snake.body[0].y) {
	            Snake.setFood();
	        } else {
		        Snake.body.pop();
	        }

	    },
	    gameover: function() {
	        Snake.container.innerHTML = 'Game over';
	        clearInterval(Snake.intervalID);
	    },
	    setDirection: function(direction) {
	        Snake.direction = direction;
	    },
	    eatFood: function() {
	        if (Snake.foodX === Snake.body[0].x && Snake.foodY === Snake.body[0].y) {
	            Snake.setFood();
	        }
	    },
	    setFood: function() {
	        Snake.foodX = Math.floor(Math.random() * Snake.columns);
	        Snake.foodY = Math.floor(Math.random() * Snake.rows);
	        var isInBody = false;

	        if (Snake.foodX === 0 || Snake.foodY === 0) {
	        	isInBody = true;
	        } else {
		        for (var i = 0; i < Snake.body.length; i++) {
		        	if (Snake.body[i].x === Snake.foodX && Snake.body[i].y === Snake.foodY) {
		        		isInBody = true;
		        		break;
		        	} 
		        }
	        }

	        if (isInBody) {
	        	Snake.setFood();
	        } else {
		        Snake.setBackground({ x: Snake.foodX, y: Snake.foodY }, 'blue');
	        }

	    }
	}
	Snake.init();
}());
