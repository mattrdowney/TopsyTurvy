Shader "Parabox"
	{
    Properties
    	{
        _Color ("Main Color", Color) = (1,1,1,1)
        _Color2 ("Color2",Color) = (1,0,1,1)
    	}

    SubShader
    	{
    	Tags {"Queue" = "Geometry"}
        Pass
        	{
        	Material
    			{
    			Diffuse [_Color]
    			Ambient [_Color2]
    			}
    		Lighting On
    		ZTest Greater
        	}
        
        }
    }