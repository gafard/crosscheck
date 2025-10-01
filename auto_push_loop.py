#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, sys, time, subprocess, datetime

repo = sys.argv[1] if len(sys.argv) > 1 else '.'
remote = os.environ.get('REMOTE', 'origin')
branch = os.environ.get('BRANCH', 'main')

def run(cmd):
    p = subprocess.Popen(cmd, cwd=repo, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = p.communicate()
    return p.returncode, out.strip(), err.strip()

print(f"Auto-push ON -> {os.path.abspath(repo)} vers {remote}/{branch} (scan toutes les 5s)")
while True:
    rc, out, err = run(["git", "status", "--porcelain"])
    if rc != 0:
        print("Ce dossier n'est pas un dépôt git. Place-toi dans le bon dossier.")
        time.sleep(5); continue
    if out:  # il y a des modifications
        run(["git", "add", "-A"])
        ts = datetime.datetime.now().isoformat(timespec='seconds')
        run(["git", "commit", "-m", f"auto: sync {ts}"])
        rc2, out2, err2 = run(["git", "push", remote, branch])
        if rc2 != 0:
            print(f"[{ts}] push a échoué : {err2 or out2}")
        else:
            print(f"[{ts}] poussé sur {remote}/{branch}")
    time.sleep(5)
