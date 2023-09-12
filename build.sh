#!/bin/sh
cd `dirname $0` 
spago build && purs-backend-es bundle-module --no-build --to server/docs/main.js