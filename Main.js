var canvas; 
var stage;
var _w = 480;
var _h = 320;

var playerScore;
var cpuScore;

var pl;
var pPaddle;

var cp;
var cPaddle;
var cPaddleSpeed;

var b;
var ball;
var velx;
var vely;

var ceiling;

var beginText;
var update;
var delta;


function Main()
{
	canvas = document.getElementById('PongStage');
	
    stage = new Stage(canvas);
    stage.mouseEventsEnabled = true;
    stage.onMouseUp = stageMouseUp;


	playerScore = new Text('0', 'bold 20px Arial', '#FFF');
    playerScore.x = 211;
    playerScore.y = 20;
    
    cpuScore = new Text('0', 'bold 20px Arial', '#FFF');
    cpuScore.x = 261;
    cpuScore.y = 20;
	
	velx = vely = Math.floor(Math.random() * (3 - (-2) +1)) + (-3); //2;
	vely = Math.floor(Math.random() * (4-2+1)) + 2; //vely = 4;
	//Math.floor(Math.random() * (75-25+1)) + 25;
	
	stage.addChild(playerScore, cpuScore);
    stage.update();
    
    pl = new Graphics();
	pl.setStrokeStyle(1);
	//pl.beginStroke(Graphics.getRGB(0,0,0));
	pl.beginFill(Graphics.getRGB(255,255,255));
	//g.drawCircle(0,0,20);
	pl.drawRect(0, 0, 7, 70);
	playerPaddle = new Shape(pl);
	playerPaddle.x = 30;
	playerPaddle.y = 100;
	playerPaddle.height = 70;
	playerPaddle.width = 6;
	playerPaddle.onPress = pressed;
	
	cp = new Graphics();
	cp.setStrokeStyle(1);
	//cp.beginStroke(Graphics.getRGB(0, 0, 0));
	cp.beginFill(Graphics.getRGB(255, 255, 255));
	cp.drawRect(0, 0, 7, 70);
	cPaddle = new Shape(cp);
	cPaddle.x = 446;
	cPaddle.y = 100;
	cPaddle.height = 70;
	cPaddle.width = 7;
	cPaddle.onPress = pressed;
	
	cPaddleSpeed = 1;
	
	/////////
	ceiling = 30;
	var line = new Graphics();
	line.setStrokeStyle(1);
	line.beginFill(Graphics.getRGB(255, 255, 255));
	line.drawRect(0,ceiling, 480, 1);
	var l = new Shape(line);
	l.x = 0;
	l.y = 0;
	
	var l2 = new Graphics();
	l2.setStrokeStyle(1);
	l2.beginFill(Graphics.getRGB(255, 255, 255));
	line.drawRect(480*0.5, 0, 1, 320);
	var l2l = new Shape(l2);
	l2l.x = 0;
	l2l.y = 0;	
	stage.addChild(l, l2l);
	stage.update();
	////////////
	
	beginText = new Text('Click to Begin', 'bold 30px Arial', '#FFF');
	beginText.x = 135;
	beginText.y = 90;
	beginText.onPress = handleBegin;

	b = new Graphics();
	b.setStrokeStyle(1);
	//b.beginStroke(Graphics.getRGB(0, 0, 0));
	b.beginFill(Graphics.getRGB(255, 255, 255));
	b.drawCircle(0, 0, 5);
	ball = new Shape(b);
	ball.x = 480 * 0.5;
	ball.y = 320 * 0.5;
	ball.radius = 5;
	stage.addChild(ball, playerPaddle, cPaddle, beginText);
	stage.update();
	
	
	Ticker.setFPS(60);
	Ticker.addListener(stage);
	stage.onMouseMove = movePaddle;
	Ticker.addListener(window);
	delta = 1;
	update = false;
}

function handleBegin()
{
	stage.removeChild(beginText);
	update = true;
}

function tick()
{	
	if(update)
	{
		updateBall();
		updateCPU();
		checkCollision();
		checkScore();
		stage.update();
	}
}

function stageMouseUp()
{
	if(!update)
	{
		handleBegin();
	}
}

function checkCollision()
{
	if(ball.x - ball.radius <= playerPaddle.x + playerPaddle.width && ball.y - ball.radius >= playerPaddle.y && ball.y + ball.radius <= playerPaddle.y + playerPaddle.height)
	{	
			velx = velx * -1;
	}
	
	if(ball.x + ball.radius >= cPaddle.x && ball.y + ball.radius >= cPaddle.y && ball.y + ball.radius <= cPaddle.y + cPaddle.height)
	{
			velx = velx * -1;
	}
}

function updateBall()
{
	ball.x += velx * delta;
	ball.y += vely * delta;
	if(ball.x >= 480 - ball.radius)
	{
		velx = velx * -1;
	}
	if(ball.x <= 0 + ball.radius)
	{
		velx = velx * -1;
	}
	if(ball.y >= 320 - ball.radius)
	{
		vely = vely * -1;
	}
	if(ball.y <= ceiling + ball.radius)
	{
		vely = vely * -1;
	}	
}

function updateCPU()
{	
	if(cPaddle.y + cPaddle.height * 0.5 < ball.y)
	{
		cPaddle.y += cPaddleSpeed * delta;
	}
	if(cPaddle.y + cPaddle.height * 0.5 > ball.y)
	{
		cPaddle.y -= cPaddleSpeed * delta;
	}
	
	if(cPaddle.y <= ceiling)
	{
		cPaddle.y = ceiling;
	}
	if(cPaddle.y + cPaddle.height >= 320)
	{
		cPaddle.y = 320 - cPaddle.height;
	}
}

function movePaddle(e)
{
	playerPaddle.y = e.stageY - playerPaddle.height * 0.5;
	if(playerPaddle.y <= ceiling)
	{
		playerPaddle.y = ceiling;
	}
	if(playerPaddle.y + playerPaddle.height >= 320)
	{
		playerPaddle.y = 320 - playerPaddle.height;
	}
}

function checkScore()
{
	if(ball.x  < 15)//playerPaddle.x)
	{
		cpuScore.text = parseInt(cpuScore.text + 1);
		resetBoard();
		//alert("CPU scored a point");
	}
	
	if(ball.x  > 458)//cPaddle.x + cPaddle.width)
	{
		playerScore.text = parseInt(playerScore.text + 1);
		resetBoard();
		//alert("Player scored a point " + ball.x +" "+ cPaddle.x+cPaddle.width);
	}
}

function resetBoard()
{
	update = false;
	stage.addChild(beginText);
	ball.x = 480 * 0.5;
	ball.y = 320 * 0.5;
}

function pressed()
{
	alert("you pressed the a paddle");
}