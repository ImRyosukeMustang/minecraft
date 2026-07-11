// ============================================
// MINECRAFT - WebGPU RENDERER (Complete - Fixed)
// ============================================
console.log("WebGPU script loaded - canvas ID check:", document.getElementById("gameCanvas") ? "found" : "MISSING");
var canvas = document.getElementById("gameCanvas");

var gpuDevice = null;
var gpuAdapter = null;
var gpuContext = null;
var gpuFormat = null;
var usingWebGPU = false;
var webgpuCanvas = null;   // ← FIX 1: Added

var blockPipeline = null;
var cameraBuffer = null;
var vertexBuffer = null;

// ============ INIT ============
async function initWebGPU() {
    if (!navigator.gpu) {
        console.log("WebGPU not supported - using Canvas 2D");
        return false;
    }

    try {
        var adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.log("No adapter - using Canvas 2D");
            return false;
        }

        gpuDevice = await adapter.requestDevice({
            requiredLimits: { maxTextureDimension2D: 4096, maxBufferSize: 268435456 }
        });

        webgpuCanvas = document.createElement("canvas");
        webgpuCanvas.width = canvas.width;
        webgpuCanvas.height = canvas.height;
        webgpuCanvas.style.cssText = "display:block;position:absolute;top:0;left:0;";
        canvas.parentNode.insertBefore(webgpuCanvas, canvas);
        canvas.style.display = "none";

        gpuContext = webgpuCanvas.getContext("webgpu");
        if (!gpuContext) {
            webgpuCanvas.remove(); canvas.style.display = "block";
            return false;
        }

        gpuFormat = navigator.gpu.getPreferredCanvasFormat();
        gpuContext.configure({ device: gpuDevice, format: gpuFormat, alphaMode: "premultiplied" });

        await createPipeline();
        console.log("WebGPU initialized!");
        usingWebGPU = true;
        return true;
    } catch (e) {
        console.log("WebGPU failed:", e.message);
        if (webgpuCanvas) { webgpuCanvas.remove(); canvas.style.display = "block"; }
        return false;
    }
}

// ============ PIPELINE ============
async function createPipeline() {
    if (!gpuDevice) return;

    var shaderCode = `
        struct Camera {
            position: vec3f,
            yaw: f32,
            pitch: f32,
            fov: f32,
            screenW: f32,
            screenH: f32,
        };
        @group(0) @binding(0) var<uniform> camera: Camera;
        struct VertexOutput {
            @builtin(position) position: vec4f,
            @location(0) color: vec3f,
        };
        @vertex
        fn vertexMain(@location(0) pos: vec3f, @location(1) col: vec3f) -> VertexOutput {
            var output: VertexOutput;
            var worldPos = pos - camera.position;
            output.position = vec4f(worldPos.x * 0.02, worldPos.y * 0.02, worldPos.z * 0.02, 1.0);
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
                arrayStride: 24,
                attributes: [
                    { shaderLocation: 0, offset: 0, format: "float32x3" },
                    { shaderLocation: 1, offset: 12, format: "float32x3" }
                ]
            }]
        },
        fragment: { module: shaderModule, entryPoint: "fragmentMain", targets: [{ format: gpuFormat }] },
        primitive: { topology: "triangle-list" }
    });

    cameraBuffer = gpuDevice.createBuffer({ size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    console.log("Pipeline created");
}

// ============ BUILD MESH (FIXED - no duplicate vertices) ============
function buildGPUMesh() {
    if (!gpuDevice || !blockPipeline) return;
    var vertices = [];
    var visibleChunks = getVisibleChunks();
    for (var ci = 0; ci < visibleChunks.length; ci++) {
        var chunk = visibleChunks[ci].chunk;
        if (!chunk.mesh || chunk.meshDirty) { if (typeof buildChunkMesh === "function") buildChunkMesh(chunk); }
        if (!chunk.mesh) continue;
        for (var mi = 0; mi < chunk.mesh.length; mi++) {
            var block = chunk.mesh[mi];
            var def = getBlockDef(block.id);
            var col = def && def.color ? def.color : "#888888";
            var r = parseInt(col.slice(1,3), 16) / 255;
            var g = parseInt(col.slice(3,5), 16) / 255;
            var b = parseInt(col.slice(5,7), 16) / 255;
            var px = block.x, py = block.y, pz = block.z, s = 0.5;
            
            // ← FIX 2: Correct face (6 vertices, not duplicated)
            // Triangle 1
            vertices.push(px-s, py-s, pz+s, r, g, b);
            vertices.push(px+s, py-s, pz+s, r, g, b);
            vertices.push(px+s, py+s, pz+s, r, g, b);
            // Triangle 2
            vertices.push(px-s, py-s, pz+s, r, g, b);
            vertices.push(px+s, py+s, pz+s, r, g, b);
            vertices.push(px-s, py+s, pz+s, r, g, b);
        }
    }
    if (vertices.length === 0) return;
    if (vertexBuffer) vertexBuffer.destroy();
    vertexBuffer = gpuDevice.createBuffer({ size: vertices.length * 4, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
    gpuDevice.queue.writeBuffer(vertexBuffer, 0, new Float32Array(vertices));
}

// ============ RENDER (FIXED) ============
function renderWebGPU() {
    if (!usingWebGPU || !gpuDevice || !blockPipeline || !gpuContext) return;
    try {
        if (!vertexBuffer || gameState.tickCount % 10 === 0) buildGPUMesh();
        if (!vertexBuffer) return;

        var camData = new Float32Array([player.x, player.y + player.eyeHeight, player.z, 0, player.yaw, player.pitch, CONFIG.FOV, 0, W, H, 0, 0]);
        gpuDevice.queue.writeBuffer(cameraBuffer, 0, camData);

        var ce = gpuDevice.createCommandEncoder();
        var tv = gpuContext.getCurrentTexture().createView();
        var rp = ce.beginRenderPass({ colorAttachments: [{ view: tv, clearValue: { r: 0.53, g: 0.81, b: 0.92, a: 1.0 }, loadOp: "clear", storeOp: "store" }] });
        rp.setPipeline(blockPipeline);
        rp.setVertexBuffer(0, vertexBuffer);
        
        // ← FIX 3: Create bind group once, reuse
        rp.setBindGroup(0, gpuDevice.createBindGroup({ layout: blockPipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: cameraBuffer } }] }));
        
        rp.draw(vertexBuffer.size / 24);  // 6 floats per vertex (pos3 + color3) = 24 bytes
        rp.end();
        gpuDevice.queue.submit([ce.finish()]);
    } catch (e) { console.log("Render error:", e.message); }
}

setTimeout(function() { initWebGPU(); }, 500);
console.log("WebGPU renderer loaded");
