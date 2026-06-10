import Fastify from "fastify";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = "0.0.0.0";

const app = Fastify({
  logger: true,
});

// Test endpoint — confirms the server is up and reachable.
app.get("/health", async () => {
  return {
    status: "ok",
    service: "aira-fde-interview",
    time: new Date().toISOString(),
  };
});

async function main() {
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`listening on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
