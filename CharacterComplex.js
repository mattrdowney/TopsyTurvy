private var Trans : Transform;
Trans = transform;

private var Cam : GameObject;
Cam = gameObject.Find("Camera");

private var Rigid : Rigidbody;
Rigid = gameObject.GetComponent(Rigidbody);

private var Coll : SphereCollider;
Coll = GetComponent.<Collider>();

function OnCollisionEnter (collision : Collision)
	{
	UltimateIterationArray(collision.contacts[0].point - Trans.position,0.02);
	}

function OnCollisionStay (collision : Collision)
	{
	UltimateIterationArray(collision.contacts[0].point - Trans.position,0.02);
	}

function FixedUpdate()
	{
	controller.canMove = false;
	
	//Ignore these, they make sure nothing wacky happens//
	Rigid.velocity = Vector3.zero;
	Trans.position.z = 0;
	
	//This either adds to velocityY (airborne) or adds a projection to velocityX (grounded)
	Gravitate();
	
	//reset gravity
	controller.useGravity = true;
	
	//reset projection
	controller.canProj = false;
	
	if(!controller.jumped)
		{
		//Check for a ground
		UltimateIterationArray(-controller.perceivedNormal,0.35);
		//Check for imminent collisions
		UltimateIterationArray(controller.velocityX + controller.velocityY,0.02);
		//Make sure the player can call Push() in the direction he wants
		UltimateIterationArray(controller.moveDir*Input.GetAxis("Horizontal"),0.02);
		}
	
	//find direction
	Cross(controller.perceivedNormal);
	
	//move the player when grounded by adding a small component to velocityX
	if(controller.canMove) Push();

	//Make jump button more responsive
	if(Input.GetButtonDown("Jump")) controller.lastButtonDownTime = Time.time;

	//if the player has not jumped and wants to, jump
	if(!controller.jumped && Time.time - controller.lastButtonDownTime < 0.2)  Jump();
	
	//rotate the camera
	CameraShift();
	
	//move the body in the "X" and "Y" directions
	Trans.Translate((controller.velocityX + controller.velocityY)*Time.deltaTime);
	}

function Angle(original : Vector2, deviant : Vector2)
	{
	return Atan3(original.y,original.x) - Atan3(deviant.y,deviant.x);
	}

function Atan3(y : float, x : float)
	{
	if(x == 0)
		{
		if(y >= 0)
			{
			return Mathf.PI/2;
			}
		else
			{
			return -Mathf.PI/2;
			}
		}
	else return Mathf.Atan2(y,x);
	}

function CameraShift ()
	{
	controller.lastAngle = Cam.transform.eulerAngles.z;
	controller.targetAngle = Mathf.Atan2(controller.normal.y,controller.normal.x)*Mathf.Rad2Deg - 90;
	controller.time = Mathf.Abs(Mathf.DeltaAngle(controller.lastAngle,controller.targetAngle)/controller.cameraSpeed);
	controller.lerp = 0;

	if(Cam.transform.eulerAngles.z != controller.targetAngle)
		{
		controller.lerp += Time.deltaTime/controller.time;
		Cam.transform.eulerAngles.z = Mathf.LerpAngle(controller.lastAngle,controller.targetAngle,controller.lerp);
		}
	}

function Collide (relVel : Vector2)
	{
	Cross(controller.perceivedNormal);
	if(Vector2.Dot(controller.perceivedNormal,Vector3(controller.velocityX.x + controller.velocityY.x - relVel.x,controller.velocityX.y + controller.velocityY.y -relVel.y,0)) < 0)
		{
		controller.velocityX = relVel + Vector3.Project(Vector3(controller.velocityX.x + controller.velocityY.x - relVel.x,controller.velocityX.y + controller.velocityY.y - relVel.y,0),Vector3(controller.moveDir.x,controller.moveDir.y,0));
		controller.velocityY = Vector2(0,0);
		}
	}

function CollideGray ()
	{
	if(controller.hit.distance < 0.01)
		{
		controller.perceivedNormal = controller.hit.normal;
		controller.jumped = false;
		Collide(Vector2(0,0));
		}
	else if(controller.hit.distance < 0.02)
		{
		controller.perceivedNormal = controller.hit.normal;
		controller.jumped = false;
		}
	if(Vector2.Dot(controller.perceivedNormal,controller.normal) >= 0)
		{
		if(controller.hit.distance < 0.01)
			{
			controller.canMove = true;
			controller.useGravity = false;
			}
		else if(controller.hit.distance < 0.02)
			{
			controller.canMove = true;
			}
		}
	}

function CollideBlack ()
	{
	controller.canProj = true;
	controller.canMove = true;
	controller.jumped = false;
	controller.perceivedNormal = controller.hit.normal;
	controller.normal = controller.hit.normal;
	Cross(controller.normal);
	Project();
	if(controller.hit.distance < 0.01)
		{
		controller.useGravity = false;
		controller.velocityY = Vector2(0,0);
		}
	}

function CollideTan ()
	{
	if(controller.hit.distance < 0.02)
		{
		controller.perceivedNormal = controller.hit.normal;
		controller.jumped = false;
		controller.hit.collider.gameObject.SendMessage("SendNormal",controller.perceivedNormal);
		}
	if(Vector2.Dot(controller.perceivedNormal,controller.normal) >= 0)
		{
		if(controller.hit.distance < 0.01)
			{
			controller.canMove = true;
			controller.useGravity = false;
			}
		else if(controller.hit.distance < 0.02)
			{
			controller.canMove = true;
			}
		}
	}
	
function Cross(normal : Vector2)
	{
	controller.moveDir = Vector2(normal.y,-normal.x);
	}

function Gravitate ()
	{
	if(!controller.canProj)
		{
		if(controller.useGravity)
			{
			controller.velocityX -= controller.normal*controller.gravity*Time.deltaTime;
			}
		else
			{
			controller.velocityX += controller.moveDir*Time.deltaTime*controller.gravity*Mathf.Sin(Angle(controller.normal,controller.perceivedNormal));
			}
		}
	else
		{
		if(controller.useGravity)
			{
			controller.velocityY -= controller.normal*controller.gravity*Time.deltaTime;
			}
		else
			{
			controller.velocityX += controller.moveDir*Time.deltaTime*controller.gravity*Mathf.Sin(Angle(controller.normal,controller.perceivedNormal));
			}
		}
	}

function Jump ()
	{
	controller.velocityX += controller.jumpSpeed*controller.perceivedNormal;
	controller.jumped = true;
	controller.canMove = false;
	controller.velocityX += controller.velocityY;
	controller.velocityY = Vector2(0,0);
	controller.lastButtonDownTime = -100;
	}

function Project ()
	{
	//2D Vector Projection (A . B / B^2 * B)
	controller.velocityX = (controller.moveDir.x*controller.velocityX.x + controller.moveDir.y*controller.velocityX.y)/(controller.moveDir.x*controller.moveDir.x+controller.moveDir.y*controller.moveDir.y)*controller.moveDir;
	controller.velocityY = -controller.velocityY.magnitude*controller.normal;
	}

function Push ()
	{
	controller.normalFloat = Time.deltaTime*controller.gravity*Mathf.Cos(Angle(controller.normal,controller.perceivedNormal));
	if(controller.normalFloat < 0) controller.normalFloat = 0;
	controller.velocityX += controller.moveDir*Input.GetAxis("Horizontal")*controller.normalFloat;
	}

function SurfaceSift ()
	{
	     if(controller.hit.collider.tag == "00")   CollideGray();
	else if(controller.hit.collider.tag == "01")   CollideBlack();
//	else if(controller.hit.collider.tag == "02")   CollideWhite();
//	else if(controller.hit.collider.tag == "03")   CollideOrange();
//	else if(controller.hit.collider.tag == "04")   CollideBlue();
//	else if(controller.hit.collider.tag == "05")   CollideGreen();
//	else if(controller.hit.collider.tag == "06")   CollideYellow();
//	else if(controller.hit.collider.tag == "07")   CollideBrown();
//	else if(controller.hit.collider.tag == "08")   CollidePurple();
//	else if(controller.hit.collider.tag == "09")   CollideRed();
//	else if(controller.hit.collider.tag == "10")   CollideCyan();
//	else if(controller.hit.collider.tag == "11")   CollideSilver();
//	else if(controller.hit.collider.tag == "12")   CollideClear();
	else                                           CollideTan();
	}

function UltimateIterationArray (movDir : Vector2, distance : float)
	{
	if(Physics.CheckCapsule(Trans.position, Trans.position + movDir*(distance + 0.05),Coll.radius - 0.05, ~(1 << 8)))
		{
		if(Physics.Raycast(Trans.position,movDir,controller.hit,Mathf.Infinity,~(1 << 8)))
			{
			if(Physics.Raycast(Trans.position,-controller.hit.normal,controller.hit,Coll.radius + distance, ~(1 << 8)))
				{
				controller.hit.distance -= Coll.radius;
				SurfaceSift();
				}
			else if(Physics.SphereCast(Trans.position,Coll.radius - 0.05,movDir,controller.hit,distance + 0.05,~(1 << 8)))
				{
				SurfaceSift();
				}
			}
		else if(Physics.SphereCast(Trans.position,Coll.radius - 0.05,movDir,controller.hit,distance + 0.05,~(1 << 8)))
			{
			SurfaceSift();
			}
		}
	}

class Controller
	{
	var lastButtonDownTime : float = -100;
	var normalFloat : float = 0;
	var hit : RaycastHit;
	var fractionTranslation : float = .50;
	var perceivedNormal : Vector2 = Vector2(0,1);
	var normal : Vector2 = Vector2(0,1);
	var oldNormal : Vector2 = Vector2(0,1);
	var moveSpeed : float = 6;
	var jumpSpeed : float = 6;
	var moveDir : Vector2 = Vector2(1,0);
	var velocityX : Vector2 = Vector2(0,0);
	var velocityY : Vector2 = Vector2(0,0);
	var push : float = 0;
	var gravity : float = 4.9;
	var useGravity : boolean = true;
	var jumped : boolean = true;
	var canMove : boolean = false;
	var canProj : boolean = false;
	var canTorq : boolean = false; //purple blocks
	var lastAngle : float = 0;
	var targetAngle : float = 0;
	var lerp : float = 0;
	var time : float = 0;
	var cameraSpeed : float = 180; //degrees per second
	}
	
var controller : Controller = Controller();