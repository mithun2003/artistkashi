#!/bin/bash

set -e

pnpm run dev &

node watcher.js

wait