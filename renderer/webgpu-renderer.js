// ============================================
// MINECRAFT - WebGPU RENDERER
// GPU-accelerated drop-in replacement
// ============================================

var gpuDevice = null;
var gpuAdapter = null;
var gpuContext = null;
var gpuFormat = null;
var usingWebGPU = false;

// Pipeline objects
var blockPipeline = null;
var skyPipeline = null;
var bindGroup = null;
var vertexBuffer = null;
var cameraBuffer = null;

// ============ INIT WebGPU ============
async function initWebGPU() {
    if (!navigator.gpu) {
        console.log("WebGPU not supported - using Canvas 2D");
        return false;
    }

    try {
        gpuAdapter = await navigator.gpu.requestAdapter();
        if (!gpuAdapter) {
            console.log("No WebGPU adapter - using Canvas 2D");
            return false;
        }

        gpuDevice = await gpuAdapter.requestDevice({
            requiredLimits: {
                maxTextureDimension2D: 4096,
                maxBufferSize: 268435456
            }
        });

        gpuContext = canvas.getContext("webgpu");
        if (!gpuContext) {
            console.log("Could not get WebGPU context - using Canvas 2D");
            return false;
        }
        gpuFormat = navigator.gpu.getPreferredCanvasFormat();
        gpuContext.configure({
            device: gpuDevice,
            format: gpuFormat,
            alphaMode: "premultiplied"
        });

        await createPipeline();
        console.log("WebGPU initialized!");
        usingWebGPU = true;
        return true;
    } catch (e) {
        console.log("WebGPU init failed - using Canvas 2D:", e.message);
        return false;
    }
}

// ============ CREATE RENDER PIPELINE ============
async function createPipeline() {
    var shaderCode = `
        struct Camera {
            position: vec3f,
            yaw: f32,
            pitch: f32,
            fov: f32,
            screenW: f32,
            screenH: f32,
        };

        struct BlockData {
            worldPos: vec3f,
            texCoord: vec2f,
            color: vec3f,
        };

        @group(0) @binding(0) var<uniform> camera: Camera;

        struct VertexOutput {
            @builtin(position) position: vec4f,
            @location(0) texCoord: vec2f,
            @location(1) color: vec3f,
        };

        @vertex
        fn vertexMain(
            @location(0) pos: vec3f,
            @location(1) uv: vec2f,
            @location(2) col: vec3f
        ) -> VertexOutput {
            var output: VertexOutput;

            var relPos = pos - camera.position;
            var cosY = cos(camera.yaw);
            var sinY = sin(camera.yaw);

            var rx = relPos.x * cosY - relPos.z * sinY;
            var rz = relPos.x * sinY + relPos.z * cosY;

            var scale = camera.screenH / (rz * tan(camera.fov / 2.0));
            var sx = camera.screenW / 2.0 + rx * scale;
            var sy = camera.screenH / 2.0 - relPos.y * scale;

            output.position = vec4f(
                (sx / camera.screenW) * 2.0 - 1.0,
                1.0 - (sy / camera.screenH) * 2.0,
                0.0,
                1.0
            );
            output.texCoord = uv;
            output.color = col;
            return output;
        }

        @fragment
        fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
            return vec4f(input.color, 1.0);
        }
    `;

    var shaderModule = gpuDevice.createShaderModule({ code: shaderCode });

    blockPipeline = gpuDevice.createRenderPipeline({
        layout: "auto",
        vertex: {
            module: shaderModule,
            entryPoint: "vertexMain",
            buffers: [{
                arrayStride: 32,
                attributes: [
                    { shaderLocation: 0, offset: 0, format: "float32x3" },
                    { shaderLocation: 1, offset: 12, format: "float32x2" },
                    { shaderLocation: 2, offset: 20, format: "float32x3" }
                ]
            }]
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragmentMain",
            targets: [{ format: gpuFormat }]
        },
        primitive: { topology: "triangle-list" }
    });

    // Create camera uniform buffer
    cameraBuffer = gpuDevice.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
}

// ============ BUILD MESH BUFFER ============
function buildGPUMesh() {
    if (!gpuDevice || !blockPipeline) return;

    var vertices = [];
    
    var visibleChunks = getVisibleChunks();
    for (var ci = 0; ci < visibleChunks.length; ci++) {
        var chunk = visibleChunks[ci].chunk;
        if (!chunk.mesh || chunk.meshDirty) {
            if (typeof buildChunkMesh === "function") buildChunkMesh(chunk);
        }
        if (!chunk.mesh) continue;

        for (var mi = 0; mi < chunk.mesh.length; mi++) {
            var block = chunk.mesh[mi];
            var def = getBlockDef(block.id);
            var col = def ? (def.color || "#888888") : "#888888";
            var r = parseInt(col.slice(1,3), 16) / 255;
            var g = parseInt(col.slice(3,5), 16) / 255;
            var b = parseInt(col.slice(5,7), 16) / 255;

            var px = block.x, py = block.y, pz = block.z;
            var s = 0.5;

            // Front face
            vertices.push(px-s, py-s, pz+s, 0,0, r,g,b);
            vertices.push(px+s, py-s, pz+s, 1,0, r,g,b);
            vertices.push(px+s, py+s, pz+s, 1,1, r,g,b);
            vertices.push(px-s, py-s, pz+s, 0,0, r,g,b);
            vertices.push(px+s, py+s, pz+s, 1,1, r,g,b);
            vertices.push(px-s, py+s, pz+s, 0,1, r,g,b);
        }
    }

    if (vertices.length === 0) return;

    var buffer = gpuDevice.createBuffer({
        size: vertices.length * 4,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    gpuDevice.queue.writeBuffer(buffer, 0, new Float32Array(vertices));
    vertexBuffer = buffer;
}

// ============ RENDER WebGPU ============
function renderWebGPU() {
    if (!gpuDevice || !gpuContext || !blockPipeline) return;

    // Build mesh if needed
    if (!vertexBuffer || gameState.tickCount % 20 === 0) {
        buildGPUMesh();
    }

    if (!vertexBuffer) return;

    // Update camera
    var camData = new Float32Array([
        player.x, player.y + player.eyeHeight, player.z, 0,
        player.yaw, player.pitch, CONFIG.FOV, 0,
        W, H, 0, 0
    ]);
    gpuDevice.queue.writeBuffer(cameraBuffer, 0, camData);

    var commandEncoder = gpuDevice.createCommandEncoder();
    var textureView = gpuContext.getCurrentTexture().createView();

    var renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.53, g: 0.81, b: 0.92, a: 1.0 },
            loadOp: "clear",
            storeOp: "store"
        }]
    });

    renderPass.setPipeline(blockPipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);

    var bindGroup = gpuDevice.createBindGroup({
        layout: blockPipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: cameraBuffer } }]
    });
    renderPass.setBindGroup(0, bindGroup);

    var vertexCount = vertexBuffer.size / 32;
    renderPass.draw(vertexCount);

    renderPass.end();
    gpuDevice.queue.submit([commandEncoder.finish()]);
}

// ============ SWITCH BETWEEN RENDERERS ============
function enableWebGPU() {
    initWebGPU().then(function(success) {
        if (success) {
            usingWebGPU = true;
            console.log("Switched to WebGPU renderer");
        }
    });
}
// Auto-detect - wait for everything to load
setTimeout(function() {
    if (typeof navigator !== "undefined" && navigator.gpu) {
        console.log("WebGPU detected - initializing...");
        enableWebGPU();
    }
}, 1000);

console.log("WebGPU renderer ready");
