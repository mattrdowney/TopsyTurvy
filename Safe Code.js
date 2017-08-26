//Ultimate Destruction of Booleans?

private var Trans : Transform;
Trans = transform;

private var Cam : GameObject;
Cam = gameObject.Find("Camera");
//
//private var Rigid : Rigidbody;
//Rigid = gameObject.GetComponent(Rigidbody);
//
//private var Coll : SphereCollider;
//Coll = collider;
//
//function FixedUpdate()
//	{
//	controller.canMove = false;
//	
//	//////////////////////////////////////////////////////
//	//Ignore these, they make sure nothing wacky happens//
//	Rigid.velocity = Vector3.zero;
//	Trans.position.z = 0;
//	//////////////////////////////////////////////////////
//	//////////////////////////////////////////////////////
//	
//	//This either adds to velocityY (airborne) or adds a projection to velocityX (grounded)
//	Gravitate();
//
//	//If the player is touching or imminent, then project forward velocity onto the imminent object.
//	RetardedPlayerFix();
//	
//	//reset gravity
//	controller.useGravity = true;
//	
//	if(!controller.jumped)
//		{
//		var hit : RaycastHit;
//		//Check for a ground
//		if(IterationArray(Vector2(-controller.normal.x,-controller.normal.y)))
//			{
//			controller.gravity = controller.gravity;
//			}
//		else if(Physics.SphereCast(Trans.position + controller.perceivedNormal*0.02,Coll.radius,-controller.perceivedNormal,hit,0.35,~(1 << 8)))
//			{
//			hit.distance += Coll.radius;
//			if(hit.collider.tag == "01")
//				{
//				CollideBlack(hit);
//				}
//			}
//		}
//	
//	//move the player when grounded by adding a small component to velocityX
//	if(controller.canMove) Push();
//
//	//if the player has not jumped and wants to, jump
//	if(!controller.jumped && Input.GetButtonDown("Jump"))  Jump();
//	
//	//rotate the camera
//	CameraShift();
//	
//	//move the body in the "X" and "Y" directions
//	Trans.Translate((controller.velocityX + controller.velocityY)*Time.deltaTime);
//	
//	controller.useGravity = true;
//	}
//
//function Angle(original : Vector2, deviant : Vector2)
//	{
//	return Atan3(original.y,original.x) - Atan3(deviant.y,deviant.x);
//	}
//
//function Atan3(y : float, x : float)
//	{
//	if(x == 0)
//		{
//		if(y >= 0)
//			{
//			return Mathf.PI/2;
//			}
//		else
//			{
//			return -Mathf.PI/2;
//			}
//		}
//	else return Mathf.Atan2(y,x);
//	}
//
//function CameraShift ()
//	{
//	controller.lastAngle = Cam.transform.eulerAngles.z;
//	controller.targetAngle = Mathf.Atan2(controller.normal.y,controller.normal.x)*Mathf.Rad2Deg - 90;
//	controller.time = Mathf.Abs(Mathf.DeltaAngle(controller.lastAngle,controller.targetAngle)/controller.cameraSpeed);
//	controller.lerp = 0;
//
//	if(Cam.transform.eulerAngles.z != controller.targetAngle)
//		{
//		controller.lerp += Time.deltaTime/controller.time;
//		Cam.transform.eulerAngles.z = Mathf.LerpAngle(controller.lastAngle,controller.targetAngle,controller.lerp);
//		}
//	}
//
//function Collide ()
//	{
//	Cross(controller.perceivedNormal);
//	if(Vector2.Dot(controller.perceivedNormal,Vector3(controller.velocityX.x + controller.velocityY.x,controller.velocityX.y + controller.velocityY.y,0)) < 0)
//		{
//		controller.velocityX = Vector3.Project(Vector3(controller.velocityX.x + controller.velocityY.x,controller.velocityX.y + controller.velocityY.y,0),Vector3(controller.moveDir.x,controller.moveDir.y,0));
//		controller.velocityY = Vector2(0,0);
//		}
//	}
//
//function CollideGray(ray : RaycastHit)
//	{
//	controller.perceivedNormal = ray.normal;
//	controller.useGravity = true;
//	controller.jumped = false;
//	Collide();
//	if(Vector2.Dot(controller.perceivedNormal,controller.normal) >= 0)
//		{
//		controller.canMove = true;
//		if(ray.distance < 0.01)
//			{
//			controller.useGravity = false;
//			}
//		}
//	}
//
//function CollideBlack(ray : RaycastHit)
//	{
//	controller.canMove = true;
//	controller.jumped = false;
//	controller.perceivedNormal = ray.normal;
//	controller.normal = ray.normal;
//	Cross(controller.normal);
//	Project();
//	if(ray.distance < 0.01 + Coll.radius)
//		{
//		controller.useGravity = false;
//		controller.velocityY = Vector2(0,0);
//		}
//	}
//	
//function Cross(normal : Vector2)
//	{
//	controller.moveDir = Vector2(normal.y,-normal.x);
//	}
//
//function Gravitate ()
//	{
//	if(controller.useGravity) controller.velocityY -= controller.normal*controller.gravity*Time.deltaTime;
//	else controller.velocityX += controller.moveDir*Time.deltaTime*controller.gravity*Mathf.Sin(Angle(controller.normal,controller.perceivedNormal));
//	}
//
//function IterationArray (movDir : Vector2) : boolean
//	{
//	var rayInfo : RaycastHit;
//	if(Physics.Raycast(Trans.position,movDir,rayInfo,Mathf.Infinity,~(1 << 8)))
//		{
//		if(Physics.Raycast(Trans.position,-rayInfo.normal,rayInfo,Coll.radius + 0.05, ~(1 << 8)))
//			{
//				 if(rayInfo.collider.tag == "00")   CollideGray(rayInfo);
//			else if(rayInfo.collider.tag == "01")   CollideBlack(rayInfo);
//			return true;
//			}
//		else return false;
//		}
//	else return false;
//	}
//
//function Jump ()
//	{
//	controller.velocityY = controller.jumpSpeed*controller.perceivedNormal;
//	controller.jumped = true;
//	controller.canMove = false;
//	}
//
//function Project ()
//	{
//	controller.velocityX = Vector3.Project(Vector3(controller.velocityX.x,controller.velocityX.y,0),Vector3(controller.moveDir.x,controller.moveDir.y,0));
//	controller.velocityY = -controller.velocityY.magnitude*controller.normal;
//	}
//
//function Push ()
//	{
//	controller.velocityX += controller.moveDir*Time.deltaTime*controller.moveSpeed*Input.GetAxis("Horizontal");
//	}
//
//function RetardedPlayerFix()
//	{
//	IterationArray(controller.velocityX + controller.velocityY);
//	IterationArray(controller.moveDir*Input.GetAxis("Horizontal"));
//	Cross(controller.perceivedNormal);
//	}
//
//class Controller
//	{
//	var fractionTranslation : float = .50;
//	var perceivedNormal : Vector2 = Vector2(0,1);
//	var normal : Vector2 = Vector2(0,1);
//	var oldNormal : Vector2 = Vector2(0,1);
//	var moveSpeed : float = 6;
//	var jumpSpeed : float = 6;
//	var moveDir : Vector2 = Vector2(1,0);
//	var velocityX : Vector2 = Vector2(0,0);
//	var velocityY : Vector2 = Vector2(0,0);
//	var push : float = 0;
//	var gravity : float = 4.9;
//	var useGravity : boolean = true;
//	var jumped : boolean = true;
//	var canMove : boolean = false;
//	var canTorq : boolean = false; //purple blocks
//	var lastAngle : float = 0;
//	var targetAngle : float = 0;
//	var lerp : float = 0;
//	var time : float = 0;
//	var cameraSpeed : float = 180; //degrees per second
//	}
//	
//var controller : Controller = Controller();