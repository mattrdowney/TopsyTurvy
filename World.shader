Shader "World"
	{
	Properties
		{
		_MainTex ("Texture",2D) = "" {TexGen ObjectLinear}
		}
	SubShader
	 	{
    	Tags { "RenderType" = "Opaque" }
     	Cull Off
    	CGPROGRAM
    	#pragma surface surf Lambert
    	struct Input
    		{
        	float2 uv_MainTex;
        	float3 worldPos;
      		};
    	sampler2D _MainTex;
    	void surf (Input IN, inout SurfaceOutput o)
    		{
        	o.Albedo = tex2D (_MainTex, IN.worldPos/10).rgb;
     		}
    	ENDCG
   		} 
    Fallback "Diffuse"
	}