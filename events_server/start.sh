#!/bin/bash

# This script was copied from hw06-08
export SECRET_KEY_BASE=W68eso5YQOlbtvSNUR50N/HDWj6IaEhAwMR3LtzuBEQAefwYVbX84bvoTA7XtiGi
export MIX_ENV=prod
export PORT=4798

echo "Stopping old copy of app, if any..."

_build/prod/rel/events_server/bin/events_server stop || true

CFGD=$(readlink -f ~/.config/events_server)

if [ ! -e "$CFGD/base" ]; then
    echo "run build first"
    exit 1
fi

SECRET_KEY_BASE=$(cat "$CFGD/base")
DATABASE_URL=$(cat "$CFGD/postgres")
export SECRET_KEY_BASE
export DATABASE_URL

echo "Starting app..."

_build/prod/rel/events_server/bin/events_server start
