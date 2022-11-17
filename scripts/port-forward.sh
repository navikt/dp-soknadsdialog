#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
  # script cleanup here
}

msg() {
  echo >&2 -e "${1-}"
}

die() {
  local msg=$1
  local code=${2-1} # default exit status 1
  msg "$msg"
  exit "$code"
}

cluster=$(kubectx -c)
env_file="$script_dir/../.env.local"

if [[ $cluster != "dev-gcp" ]]
then
  die "Støtter kun dev-gcp som cluster, kjør kubectx dev-gcp for å bytte"
fi

echo "API_BASE_URL=http://localhost:8081/arbeid/dagpenger/soknadapi" >> $env_file
kubectl port-forward svc/dp-soknad 8081:80
