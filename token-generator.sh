#!/usr/bin/env bash

# https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
Cyan='\033[0;36m'         # Cyan
Red='\033[0;31m'          # Red
Purple='\033[0;35m'       # Purple
Yellow='\033[0;33m'       # Yellow
BPurple='\033[1;35m'      # Purple bold
UGreen='\033[4;32m'       # Green underline

# Env file 
envFile='.env.development'

# json config 
jsonConfig='token-generator.config.json'

# Check if user has `jq` installed
# https://formulae.brew.sh/formula/jq
verifyJQ() {
  brew list jq > /dev/null 2>&1 || brew install jq 
}

# Main script
init() {
  # Welcome text
  echo -e "${Cyan}::: ${BPurple}dp-soknadsdialog token generator ${Cyan}::: \n"

  # Check if jq package is installed 
  verifyJQ

  # Generate azure-token-generator token
  startTokenGenerator

  # Finished
  sleep 1
  echo -e "🌈 ${Purple}You're good to go! Restart your dev-server."
}

startTokenGenerator() {
  # First azure-token-generator url from json config
  url=$(jq '.' $jsonConfig | jq '.[0].url' | tr -d '"')
  
  # Show link to azureTokenGenerator to user
  echo -e "${Cyan}Visit: ${UGreen}${url}\n"
  echo -e "${Cyan}Find and copy ${Yellow}sso-dev.nav.no ${Cyan}cookie from ${Yellow}DevTools > Application > Cookies"

  # Ask for wonderwall cookie,
  echo -e "${Cyan}Paste in cookie: "
  read cookie
  echo -e "\n"

  configArray=$(jq -r '.[] | @base64' $jsonConfig)

  # Loop through config list and create environment variable
  for config in $configArray;
    do
      _jq() {
        echo ${config} | base64 --decode | jq -r ${1}
      }

      env=$(_jq '.env')
      url=$(_jq '.url')

      generateAndUpdateEnvFile "$env" "$url" "$cookie"
  done

  echo -e "\n"
}


# This function make curl request with `-b` flag to send cookie with the request
# | jq ".access_token" returns access_token string
generateAndUpdateEnvFile() {
  # function parameters
  env=$1
  url=$2 | tr -d '"'
  cookie=$3

  # Store access token in variable
  accessToken=$(curl -s -b "sso-dev.nav.no=${cookie}" ${url}| jq ".access_token") 

  if [ -z $accessToken ]; then
    echo -e "❌ ${Yellow}${env} ${Red} error"
  else
    # Fully generated env string
    generatedEnv="${env}=${accessToken}"

    # Update generated env string to env file
    printf '%s\n' H ",g/^${env}.*/s//${generatedEnv}/" wq | ed -s "$envFile"

    echo -e "✅ ${Yellow}${env} ${Cyan}updated"
  fi
}

# Start script
init