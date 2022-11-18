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

# gcloud auth login

# Logg inn i browser
URL=$(grep ingress "$script_dir/../.nais/vars-dev.yaml" | awk '{print $2}')
echo "Gå til $URL og logg inn"
echo "Hent token fra $URL/api/internal/token"

read -sp "Paste inn token: " active_token

echo "NEXT_PUBLIC_LOCALHOST=false" > $env_file
echo "LOCAL_TOKEN=$active_token" >> $env_file

pod=$(kubectl -n teamdagpenger get pods -o jsonpath={..metadata.name} -l app=dp-soknadsdialog | awk '{print $1}')
kubectl -n teamdagpenger exec $pod -- env | grep TOKEN_X -i >> $env_file
