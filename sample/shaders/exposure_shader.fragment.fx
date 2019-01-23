
varying vec2 vUV;

uniform sampler2D textureSampler;
uniform float exposure;

void main()
{
    gl_FragColor = vec4(texture2D(textureSampler, vUV).rgb*exposure, 1);
}
