// TODO:

// Handles the Movement of the Snake
var neckX = 0, neckY = 0;
var addBodyFlag = false;
var pauseFlag = true;
var debug = false;

function headMovement()
{
	if (pauseFlag)
	{
		return;
	}

	// move left
	if (Key.isDown(Key.A) || Key.isDown(Key.Left))
	{
		/*var flag = document.getElementById("debug");
		flag.value = "left";*/

		if (headXSpeed != 0)
		{
			if (headXSpeed > 0)
			{
				// from +x to +y
				headXSpeed = 0;
				headYSpeed = STEP;
			}
			else
			{
				// from -x to -y
				headXSpeed = 0;
				headYSpeed = -STEP;
			}
		}
		else
		{
			if (headYSpeed > 0)
			{
				// from +y to -x
				headXSpeed = -STEP;
				headYSpeed = 0;
			}
			else
			{
				// from -y to +x
				headXSpeed = STEP;
				headYSpeed = 0;
			}
		}
	}
	// move right
	else if (Key.isDown(Key.D) || Key.isDown(Key.Right))
	{
		/*var flag = document.getElementById("debug");
		flag.value = "right";*/

		if (headXSpeed != 0)
		{
			if (headXSpeed > 0)
			{
				// from +x to -y
				headXSpeed = 0;
				headYSpeed = -STEP;
			}
			else
			{
				// from -x to +y
				headXSpeed = 0;
				headYSpeed = STEP;
			}
		}
		else
		{
			if (headYSpeed > 0)
			{
				// from +y to +x
				headXSpeed = STEP;
				headYSpeed = 0;
			}
			else
			{
				// from -y to -x
				headXSpeed = -STEP;
				headYSpeed = 0;
			}
		}
	}
	// move forward
	else
	{
		/*var flag = document.getElementById("debug");
		flag.value = "forward";*/
	}

	neckX = head.position.x;
	neckY = head.position.y;
	head.position.x += headXSpeed;
	head.position.y += headYSpeed;

	/*head.geometry.verticesNeedUpdate = true;*/
}

function bodyMovement()
{
	if (pauseFlag)
	{
		return;
	}
	// Not adding the body
	if (!addBodyFlag)
	{
		var tail = body.pop();
		tail.position.x = neckX;
		tail.position.y = neckY;

		body.unshift(tail);
		/*tail.geometry.verticesNeedUpdate = true;*/
	}

	// After adding the body
	addBodyFlag = false;
}

function updateCamera() {
	if (headXSpeed == STEP) {
		camera.position.x = head.position.x - STEP * 4;
		camera.position.y = head.position.y;
		camera.rotation.x = 0;
		camera.rotation.y = -80 * Math.PI/180;
		camera.rotation.z = -90 * Math.PI/180;
	}
	else if (headXSpeed == (-1) * STEP) {
		camera.position.x = head.position.x + STEP * 4;
		camera.position.y = head.position.y;
		camera.rotation.x = 0;
		camera.rotation.y = 80 * Math.PI/180;
		camera.rotation.z = 90 * Math.PI/180;
	}
	else if (headYSpeed == STEP) {
		camera.position.x = head.position.x;
		camera.position.y = head.position.y - STEP * 4;
		camera.rotation.x = 80 * Math.PI/180;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
	}
	else if (headYSpeed == (-1) * STEP) {
		camera.position.x = head.position.x;
		camera.position.y = head.position.y + STEP * 4;
		camera.rotation.x = -80 * Math.PI/180;
		camera.rotation.y = 0;
		camera.rotation.z = 180 * Math.PI/180;
	}
}


function placeDiamond()
{
	if (debug)
	{
		trickDiamond();
		return;
	}

	var x = 0, y = 0, z = STEP/2;
	var isValid = false;
	while (!isValid)
	{
		// Set the random position
		x = getRandomInt(-planeWidth/2, planeWidth/2);
		y = getRandomInt(-planeHeight/2, planeHeight/2);
		x -= x % STEP;
		y -= y % STEP;

		// Check whether it collides with other objects
		if (head.position.x == x && head.position.y == y)
		{
			continue; // Get new random positions
		}
		for (var i=0; i<body.length; i++)
		{
			if (body[i].position.x == x && body[i].position.y == y)
			{
				continue; // Get new random positions
			}
		}

		isValid = true;
	}

	diamond.position.x = x;
	diamond.position.y = y;

}


function trickDiamond()
{
	diamond.position.x = head.position.x + 20*STEP;
	diamond.position.y = head.position.y;
}

function checkDiamond()
{
	if (head.position.x == diamond.position.x && head.position.y == diamond.position.y)
	{
		// replace the diamond
		placeDiamond();

		// increment the score
		score += 1;
		document.getElementById("scores").innerHTML = score;
		addBodyFlag = true;
		addBody();
	}

	var remain = MAX_SCORE - score;
	document.getElementById("winnerBoard").innerHTML = remain + " more diamonds to win";
	document.getElementById("difficulty").innerHTML = "difficulty: " + difficulty;
}


function addBody()
{
	newBodyBlock(neckX, neckY, STEP/2);
	// bodyBlock.receiveShadow = true;
	var newBody = body.pop();
	body.unshift(newBody);
}


function checkEndingCondition()
{
	if (score >= MAX_SCORE)
	{
		WIN = true;
		return;
	}

	var x = head.position.x, y = head.position.y;
	if (x > planeWidth/2 || x < -planeWidth/2)
	{
		LOSE = true;
	}
	if (y > planeHeight/2 || y < -planeHeight/2)
	{
		LOSE = true;
	}
	for (var i=0; i<body.length; i++)
	{
		if (body[i].position.x == x && body[i].position.y == y)
		{
			LOSE = true;
			break;
		}
	}
	for (var i=0; i<poles.length; i++)
	{
		if (poles[i].position.x == x && poles[i].position.y == y)
		{
			LOSE = true;
			break;
		}
	}
}

function gameWin()
{
	document.getElementById("scores").innerHTML = "WIN!!";
	document.getElementById("winnerBoard").innerHTML = "Press 'Enter' to refresh to play again";
}

function gameLose()
{
	document.getElementById("scores").innerHTML = "LOSE!!";
	document.getElementById("winnerBoard").innerHTML = "Press 'Enter' to refresh to play again";
}

function restart()
{
	if (WIN || LOSE)
	{
		if (Key.isDown(Key.Enter))
		{
			window.location.reload();
		}
	}
}
