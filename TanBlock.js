var Coll : BoxCollider;

var Player : GameObject;

var Comp : CharacterComplex;

Player = GameObject.Find("Character");

Comp = Player.GetComponent(CharacterComplex);

private var Trans : Transform;
Trans = transform;
tan.initial = Trans.position;
tan.rotVec = Vector2(Mathf.Cos(Trans.eulerAngles.z*Mathf.Deg2Rad),Mathf.Sin(Trans.eulerAngles.z*Mathf.Deg2Rad));

function Update ()
	{
	if(tan.dying) DIE();
	}

function SendNormal (perceivedNormal : Vector2)
	{
	if(!tan.dying)
		{
		tan.dying = true;
		Case4 (perceivedNormal);
		}	
	if(Vector2.Dot(perceivedNormal,tan.normal) > 0.707)
		{
		Comp.Collide(-tan.speed*tan.normal);
		}
	else Comp.Collide(Vector2(0,0));
	}

function Case4 (normal : Vector2)
	{
	if(Vector2.Dot(-normal,Vector2(tan.rotVec.x,tan.rotVec.y))  > 0.707)
			{
			tan.normal = Vector2(tan.rotVec.x,tan.rotVec.y);
			tan.totalLife = Trans.localScale.x;
			tan.life = Trans.localScale.x;
			tan.dyingX = true;
			}
		if(Vector2.Dot(-normal,Vector2(-tan.rotVec.y,tan.rotVec.x))  > 0.707)
			{
			tan.normal = Vector2(-tan.rotVec.y,tan.rotVec.x);
			tan.totalLife = Trans.localScale.y;
			tan.life = Trans.localScale.y;
			tan.dyingY = true;	
			}
		if(Vector2.Dot(-normal,Vector2(-tan.rotVec.x,-tan.rotVec.y))  > 0.707)
			{
			tan.normal = Vector2(-tan.rotVec.x,-tan.rotVec.y);
			tan.totalLife = Trans.localScale.x;
			tan.life = Trans.localScale.x;
			tan.dyingX = true;
			}
		if(Vector2.Dot(-normal,Vector2(tan.rotVec.y,-tan.rotVec.x))  > 0.707)
			{
			tan.normal = Vector2(tan.rotVec.y,-tan.rotVec.x);
			tan.totalLife = Trans.localScale.y;
			tan.life = Trans.localScale.y;
			tan.dyingY = true;
			}
	}

function DIE()
	{
	tan.life -= Time.deltaTime*tan.speed;
	
	
	if(tan.life < 0)
		{
		//When I add a particle emitter, this should not happen immediately.
		Destroy(Coll.gameObject);
		}
	else if(tan.dyingX)
		{
		Trans.localScale = Vector3(tan.life,Trans.localScale.y,Trans.localScale.z);
		}
	else if(tan.dyingY)
		{
		Trans.localScale = Vector3(Trans.localScale.x,tan.life,Trans.localScale.z);
		}
			
			
	Trans.position = tan.initial - tan.normal*(tan.totalLife - tan.life)/2;
	}
		
class Tan
	{
	var rotVec : Vector2;
	var initial : Vector3;
	var dying : boolean = false;
	var dyingX : boolean = false;
	var dyingY : boolean = false;
	var angle : float = 0;
	var remainder : float = 0;
	var normal : Vector2 = Vector2(0,0);
	var speed : float = 2; // m/s
	var totalLife : float = 1;
	var life : float = 1;
	}

var tan : Tan = Tan();