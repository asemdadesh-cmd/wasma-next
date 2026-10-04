#!/bin/sh
# Stop local Next servers started for verification.
for d in /proc/[0-9]*; do
  c=$(tr '\0' ' ' < "$d/cmdline" 2>/dev/null)
  case "$c" in *next-server*|*"exec next start"*|*"-c next start"*) kill "${d#/proc/}" 2>/dev/null;; esac
done
