// ============================================
// MINECRAFT - WebGPU RENDERER (Full Updated)
// GPU-accelerated replacement for Canvas 2D
// ============================================
console.log("WebGPU script loaded - canvas ID check:", document.getElementById("gameCanvas") ? "found" : "MISSING");
var canvas = document.getElementById("gameCanvas");

var gpuDevice = null;
var gpuAdapter = null;
var gpuContext = null;
var gpuFormat = null;
var usingWebGPU = false;

// Pipeline + buffers
var blockPipeline = null;
var cameraBuffer = null;
var vertexBuffer = null;

// ============ INIT WebGPU ============
async function initWebGPU() {
    if (!navigator.gpu) {
        console.log("WebGPU not supported - using Canvas 2D");
        return false;
    }

    try {
        var adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.log("No WebGPU adapter - using Canvas 2D");
            return false;
        }

        gpuDevice = await adapter.requestDevice({
            requiredLimits: {
                maxTextureDimension2D: 4096,
                maxBufferSize: 268435456
            }
        });

        // Create a SEPARATE canvas for WebGPU (fixes the 2D conflict)
        webgpuCanvas = document.createElement("canvas");
        webgpuCanvas.width = canvas.width;
        webgpuCanvas.height = canvas.height;
        webgpuCanvas.style.cssText = "display:block;position:absolute;top:0;left:0;";
        canvas.parentNode.insertBefore(webgpuCanvas, canvas);
        canvas.style.display = "none";

        gpuContext = webgpuCanvas.getContext("webgpu");
        if (!gpuContext) {
            console.log("Could not get WebGPU context - using Canvas 2D");
            webgpuCanvas.remove();
            canvas.style.display = "block";
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
        if (webgpuCanvas) { webgpuCanvas.remove(); canvas.style.display = "block"; }
        return false;
    }
}

// ============ PIPELINE SETUP ============
async function createPipeline() {
    if (!gpuDevice) return;

    const shaderCode = `
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
        fn vertexMain(
            @location(0) pos: vec3f,
            @location(1) col: vec3f
        ) -> VertexOutput {
            var output: VertexOutput;
            // Simple projection for testing
            var worldPos = pos - camera.position;
            output.position = vec4f(worldPos.x * 0.1, worldPos.y * 0.1, worldPos.z * 0.1, 1.0);
            output.color = col;
            return output;
        }

        @fragment
        fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
            return vec4f(input.color, 1.0);
        }
    `;

    const shaderModule = gpuDevice.createShaderModule({ code: shaderCode });

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
        fragment: {
            module: shaderModule,
            entryPoint: "fragmentMain",
            targets: [{ format: gpuFormat }]
        },
        primitive: { topology: "triangle-list" }
    });

    // Camera buffer
    cameraBuffer = gpuDevice.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    console.log("Pipeline created");
}

// ============ RENDER ============
function renderWebGPU() {
    if (!usingWebGPU || !gpuDevice || !blockPipeline) {
        render(); // fallback
        return;
    }

    try {
        const commandEncoder = gpuDevice.createCommandEncoder();
        const textureView = gpuContext.getCurrentTexture().createView();

        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.53, g: 0.81, b: 0.92, a: 1.0 },
                loadOp: "clear",
                storeOp: "store"
            }]
        });

        renderPass.setPipeline(blockPipeline);
        // Add vertex buffer and draw calls here when you have geometry
        renderPass.end();

        gpuDevice.queue.submit([commandEncoder.finish()]);
    } catch (e) {
        console.error("WebGPU render error:", e);
        usingWebGPU = false; // fallback
    }
}

// Auto-init
setTimeout(() => {
    initWebGPU();
}, 800);

console.log("WebGPU renderer module loaded");
