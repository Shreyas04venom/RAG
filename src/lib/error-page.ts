export function renderErrorPage(error?: unknown): string {
  const details =
    error instanceof Error
      ? `${error.name}: ${error.message}\n\n${error.stack || ""}`
      : typeof error === "string"
      ? error
      : error
      ? JSON.stringify(error, null, 2)
      : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Edith — Voice Evidence Assistant</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #080b14; color: #f3f4f6; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 34rem; width: 100%; text-align: center; padding: 2.5rem; background: rgba(17, 24, 39, 0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); backdrop-filter: blur(16px); }
      h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; color: #fff; }
      p { color: #9ca3af; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
      a, button { padding: 0.625rem 1.25rem; border-radius: 9999px; font: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: all 0.2s; }
      .primary { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff; border: none; }
      .primary:hover { opacity: 0.9; transform: translateY(-1px); }
      .secondary { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.15); }
      .secondary:hover { background: rgba(255,255,255,0.15); }
      pre { text-align: left; background: rgba(0,0,0,0.6); padding: 1rem; border-radius: 0.75rem; font-size: 11px; overflow-x: auto; color: #ef4444; border: 1px solid rgba(239,68,68,0.2); font-family: monospace; white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Edith Application Startup</h1>
      <p>The server encountered an issue initializing this request.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reload Application</button>
        <a class="secondary" href="/">Back to Home</a>
      </div>
      ${details ? `<pre><code>${details.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>` : ""}
    </div>
  </body>
</html>`;
}
