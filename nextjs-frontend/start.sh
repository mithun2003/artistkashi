#!/bin/bash

set -e

pnpm run dev --webpack &

node watcher.js

wait