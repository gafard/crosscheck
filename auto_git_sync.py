
    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
import argparse
import os
import subprocess
import sys
import threading
import time
from datetime import datetime
from pathlib import Path

try:
    from watchdog.events import FileSystemEventHandler
    from watchdog.observers import Observer
except ImportError:
    print("Ce script nécessite le paquet 'watchdog'. Installez-le d'abord :")
    print("  pip install watchdog")
    sys.exit(1)

IGNORED_DIRS = {
    ".git", ".idea", ".vscode", ".DS_Store",
    "node_modules", "dist", "build", ".next", ".cache", ".venv", "__pycache__"
}

def run(cmd, cwd):
    """Run a command and return (rc, stdout, stderr)."""
    proc = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = proc.communicate()
    return proc.returncode, out.strip(), err.strip()

def git_branch(cwd):
    rc, out, err = run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd)
    if rc != 0:
        raise RuntimeError(f"Impossible d'obtenir la branche : {err}")
    return out

def has_changes(cwd):
    rc, out, err = run(["git", "status", "--porcelain"], cwd)
    if rc != 0:
        raise RuntimeError(f"git status a échoué : {err}")
    return bool(out.strip())

def do_sync(cwd, remote, branch, allow_empty=False):
    # Ajoute tous les changements (suivis + nouveaux + suppressions)
    rc, out, err = run(["git", "add", "-A"], cwd)
    if rc != 0:
        print(f"[{datetime.now().isoformat()}] git add a échoué : {err}")
        return

    # Vérifie s'il y a quelque chose à committer
    if not allow_empty and not has_changes(cwd):
        print(f"[{datetime.now().isoformat()}] Rien à committer.")
        return

    msg = f"auto: sync {datetime.now().isoformat(timespec='seconds')}"
    rc, out, err = run(["git", "commit", "-m", msg], cwd)
    if rc != 0:
        # S'il n'y a rien à committer, git renvoie un code d'erreur : on ignore proprement
        if "nothing to commit" in (out + err).lower():
            print(f"[{datetime.now().isoformat()}] Rien à committer.")
        else:
            print(f"[{datetime.now().isoformat()}] git commit a échoué : {err or out}")
            return

    # Détermine la branche si non fournie
    target_branch = branch or git_branch(cwd)

    rc, out, err = run(["git", "push", remote, target_branch], cwd)
    if rc != 0:
        print(f"[{datetime.now().isoformat()}] git push a échoué : {err or out}")
    else:
        print(f"[{datetime.now().isoformat()}] Poussé sur {remote}/{target_branch}")

class DebouncedHandler(FileSystemEventHandler):
    def __init__(self, cwd, remote, branch, debounce_seconds):
        super().__init__()
        self.cwd = cwd
        self.remote = remote
        self.branch = branch
        self.debounce_seconds = debounce_seconds
        self.timer = None
        self.lock = threading.Lock()

    def _schedule_sync(self):
        with self.lock:
            if self.timer:
                self.timer.cancel()
            self.timer = threading.Timer(self.debounce_seconds, self._sync)
            self.timer.daemon = True
            self.timer.start()

    def _sync(self):
        # Ignore si le repo n'a pas de changement
        try:
            if has_changes(self.cwd):
                do_sync(self.cwd, self.remote, self.branch)
        except Exception as e:
            print(f"[{datetime.now().isoformat()}] Erreur pendant la synchro : {e}")

    def on_any_event(self, event):
        # Ignore les changements dans les dossiers exclus
        try:
            p = Path(event.src_path).resolve()
            parts = set(p.parts)
            if parts & IGNORED_DIRS:
                return
        except Exception:
            pass
        self._schedule_sync()

def main():
    ap = argparse.ArgumentParser(description="Surveille un dépôt git et pousse automatiquement les changements.")
    ap.add_argument("repo", nargs="?", default=".", help="Chemin du dépôt (par défaut: .)")
    ap.add_argument("--remote", default="origin", help="Remote git à utiliser (defaut: origin)")
    ap.add_argument("--branch", default=None, help="Branche à pousser (defaut: branche courante)")
    ap.add_argument("--debounce", type=float, default=5.0, help="Délai d'agrégation en secondes avant push (defaut: 5s)")
    args = ap.parse_args()

    repo = Path(args.repo).resolve()
    if not (repo / ".git").exists():
        print(f"Erreur: {repo} n'est pas un dépôt git ('.git' manquant)")
        sys.exit(2)

    # Vérifie que le remote existe
    rc, out, err = run(["git", "remote"], repo.as_posix())
    if rc != 0 or args.remote not in out.split():
        print(f"Erreur: le remote '{args.remote}' n'existe pas dans ce dépôt.")
        sys.exit(3)

    # Lancement du watcher
    handler = DebouncedHandler(repo.as_posix(), args.remote, args.branch, args.debounce)
    observer = Observer()
    observer.schedule(handler, repo.as_posix(), recursive=True)
    observer.start()
    print(f"[{datetime.now().isoformat()}] Auto-sync démarré sur {repo} (remote={args.remote}, branch={args.branch or 'courante'}, debounce={args.debounce}s)")
    print("Appuyez sur Ctrl+C pour arrêter.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
