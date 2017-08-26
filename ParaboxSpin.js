var Trans : Transform;
Trans = transform;

function Update ()
	{
	Trans.Rotate(Vector3(90*Time.deltaTime,180*Time.deltaTime,90*Time.deltaTime),Space.World);
	}