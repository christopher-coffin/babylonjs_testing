// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

varying vec2 vUV;

void main()
{
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
}
