// ============================================
// MINECRAFT - SKY SHADER (WGSL)
// Dynamic sky with day/night colors
// ============================================

struct SkyUniforms {
    timeOfDay: f32,
    screenWidth: f32,
    screenHeight: f32,
    dimension: i32,  // 0=Overworld, -1=Nether, 1=End
}

@group(0) @binding(0) var<uniform> sky: SkyUniforms;

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
}

// ============ VERTEX SHADER ============

@vertex
fn vertexMain(
    @builtin(vertex_index) vertexIndex: u32,
) -> VertexOutput {
    var output: VertexOutput;
    
    // Full screen quad
    var x = f32(vertexIndex % 2) * 2.0 - 1.0;
    var y = 1.0 - f32(vertexIndex / 2) * 2.0;
    
    output.position = vec4f(x, y, 0.0, 1.0);
    output.uv = vec2f(
        (x + 1.0) / 2.0,
        (y + 1.0) / 2.0
    );
    
    return output;
}

// ============ FRAGMENT SHADER ============

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var t = sky.timeOfDay;
    var topColor: vec3f;
    var bottomColor: vec3f;
    var horizonColor: vec3f;
    
    // Determine dimension
    if (sky.dimension == -1) {
        // Nether
        topColor = vec3f(0.16, 0.04, 0.04);
        bottomColor = vec3f(0.10, 0.00, 0.00);
        horizonColor = vec3f(0.23, 0.10, 0.10);
    } else if (sky.dimension == 1) {
        // End
        topColor = vec3f(0.04, 0.04, 0.10);
        bottomColor = vec3f(0.04, 0.04, 0.04);
        horizonColor = vec3f(0.10, 0.10, 0.16);
    } else {
        // Overworld
        var isNight = (t < 2000.0 || t > 22000.0);
        
        if (isNight) {
            topColor = vec3f(0.04, 0.04, 0.18);
            bottomColor = vec3f(0.10, 0.10, 0.24);
            horizonColor = vec3f(0.10, 0.16, 0.10);
        } else {
            topColor = vec3f(0.53, 0.81, 0.92);
            bottomColor = vec3f(0.72, 0.85, 0.94);
            horizonColor = vec3f(0.49, 0.78, 0.31);
        }
    }
    
    // Gradient based on UV.y
    var gradient = input.uv.y;
    var skyColor: vec3f;
    
    if (gradient < 0.45) {
        skyColor = mix(topColor, bottomColor, gradient / 0.45);
    } else {
        skyColor = mix(bottomColor, horizonColor, (gradient - 0.45) / 0.55);
    }
    
    return vec4f(skyColor, 1.0);
}
