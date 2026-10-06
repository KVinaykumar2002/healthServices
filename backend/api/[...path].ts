import { createApp } from "../src/app";

// Vercel serverless entry: every /api/* request is handled by the same Express app as the Node server.
export default createApp();
