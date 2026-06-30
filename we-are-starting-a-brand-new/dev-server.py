from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
import argparse
import json
import mimetypes
import socket
import sys
import time

DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 4174
ROOT = Path(__file__).resolve().parent
WATCH_EXTENSIONS = {".html", ".css", ".js", ".md"}

RELOAD_CLIENT = """
<script>
(() => {
  if ("EventSource" in window) {
    const source = new EventSource("/__ahead_reload");
    source.addEventListener("reload", () => window.location.reload());
    source.onerror = () => console.info("Ahead dev reload connection is retrying.");
    return;
  }

  let lastVersion = null;
  setInterval(async () => {
    try {
      const response = await fetch("/__ahead_version", { cache: "no-store" });
      const data = await response.json();
      if (lastVersion === null) {
        lastVersion = data.version;
        return;
      }
      if (data.version !== lastVersion) window.location.reload();
    } catch {
      console.info("Ahead dev reload polling is retrying.");
    }
  }, 1000);
})();
</script>
"""


def latest_mtime():
  latest = 0.0
  for path in ROOT.rglob("*"):
    if path.is_file() and path.suffix.lower() in WATCH_EXTENSIONS:
      latest = max(latest, path.stat().st_mtime)
  return latest


def local_ips():
  ips = set()
  try:
    hostname = socket.gethostname()
    for ip in socket.gethostbyname_ex(hostname)[2]:
      if not ip.startswith("127."):
        ips.add(ip)
  except OSError:
    pass
  return sorted(ips)


class AheadDevHandler(SimpleHTTPRequestHandler):
  server_version = "AheadDevServer/1.0"

  def translate_path(self, path):
    parsed = urlparse(path)
    clean_path = unquote(parsed.path).lstrip("/")
    if not clean_path:
      clean_path = "index.html"
    resolved = (ROOT / clean_path).resolve()
    if ROOT not in resolved.parents and resolved != ROOT:
      return str(ROOT / "index.html")
    return str(resolved)

  def end_headers(self):
    self.send_header("Cache-Control", "no-store")
    self.send_header("X-Content-Type-Options", "nosniff")
    super().end_headers()

  def do_GET(self):
    path = urlparse(self.path).path
    if path == "/__ahead_reload":
      self.handle_reload_stream()
      return
    if path == "/__ahead_version":
      self.handle_reload_version()
      return
    if path in {"", "/"}:
      self.path = "/index.html"
    if path.endswith(".html") or path in {"", "/"}:
      self.serve_html_with_reload()
      return
    super().do_GET()

  def serve_html_with_reload(self):
    file_path = Path(self.translate_path(self.path))
    if not file_path.exists() or not file_path.is_file():
      self.send_error(404, "File not found")
      return
    content = file_path.read_text(encoding="utf-8")
    content = content.replace("</body>", f"{RELOAD_CLIENT}</body>")
    body = content.encode("utf-8")
    self.send_response(200)
    self.send_header("Content-Type", "text/html; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def handle_reload_stream(self):
    self.send_response(200)
    self.send_header("Content-Type", "text/event-stream")
    self.send_header("Connection", "keep-alive")
    self.end_headers()
    last_seen = latest_mtime()
    self.wfile.write(b"event: connected\ndata: ready\n\n")
    self.wfile.flush()
    while True:
      time.sleep(1)
      current = latest_mtime()
      if current > last_seen:
        last_seen = current
        self.wfile.write(b"event: reload\ndata: changed\n\n")
      else:
        self.wfile.write(b": heartbeat\n\n")
      self.wfile.flush()

  def handle_reload_version(self):
    body = json.dumps({"version": latest_mtime()}).encode("utf-8")
    self.send_response(200)
    self.send_header("Content-Type", "application/json")
    self.send_header("Content-Length", str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def guess_type(self, path):
    guessed, _ = mimetypes.guess_type(path)
    return guessed or "application/octet-stream"


def parse_args():
  parser = argparse.ArgumentParser(description="Run the Ahead local network development server.")
  parser.add_argument("--host", default=DEFAULT_HOST, help="Host interface to bind. Use 0.0.0.0 for LAN access.")
  parser.add_argument("--port", default=DEFAULT_PORT, type=int, help="Port to serve Ahead on.")
  return parser.parse_args()


def main():
  args = parse_args()
  try:
    server = ThreadingHTTPServer((args.host, args.port), AheadDevHandler)
  except OSError as exc:
    print(f"Could not start Ahead dev server on {args.host}:{args.port}: {exc}", file=sys.stderr)
    sys.exit(1)

  print(f"Ahead dev server running at http://127.0.0.1:{args.port}", flush=True)
  for ip in local_ips():
    print(f"Local network: http://{ip}:{args.port}", flush=True)
  print(f"Network binding: {args.host}, intended for local network development only.", flush=True)
  print("Hot reload: enabled for .html, .css, .js, and .md changes.", flush=True)
  server.serve_forever()


if __name__ == "__main__":
  main()
