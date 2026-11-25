const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PawFinder API",
            version: "1.0.0",
            description: "API for PawFinder.",
        },
        servers: [{ url: "/", description: "Current server" }],
    },
    apis: ["./src/app/api/**/route.ts"],
    failOnErrors: true,
};

async function generateDocumentation() {
    const { writeFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { default: swaggerJsdoc } = await import("swagger-jsdoc");

    process.chdir(__dirname);
    const spec = swaggerJsdoc(options);
    writeFileSync(
        join(__dirname, "public", "swagger.json"),
        `${JSON.stringify(spec, null, 2)}\n`,
    );
    console.log("Swagger documentation generated at public/swagger.json.");
}

generateDocumentation().catch((error) => {
    console.error("Failed to generate Swagger documentation:", error);
    process.exitCode = 1;
});
