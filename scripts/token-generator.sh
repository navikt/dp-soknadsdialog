#!/usr/bin/env bash

# https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
Cyan="\033[0;36m"         # Cyan
Red="\033[0;31m"          # Red
Purple="\033[0;35m"       # Purple
Yellow="\033[0;33m"       # Yellow
BPurple="\033[1;35m"      # Purple bold
UGreen="\033[4;32m"       # Green underline

# Env file 
envFile=".env.development"

# json config 
jsonConfig="./scripts/token-generator.config.json"

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

# Check if user has `jq` installed
# https://formulae.brew.sh/formula/jq
verifyJQ() {
  if brew ls --versions jq > /dev/null; then
    # jq already installed, continue script
    :
  else
    # jq not found
    # ask user to install jq
    echo -e "${Yellow}🟡 jq not found. jq is required for token-generator script."
    echo -e "${Yellow}🟡 Read more about jq: ${UGreen}https://formulae.brew.sh/formula/jq${Cyan}\n"
    
    # ask for user input y or n
    read -r -p "Install jq (y/n)? " answer

    if [ "$answer" = "y" ]; then
      brew install jq 
      echo -e "\n"
    else
      echo -e "🛑 ${Red}Token generator aborted."
      exit 1
    fi
  fi
}

# Start token generation process
startTokenGenerator() {
  # First tokend-token-generator url from json config
  url=$(jq "." $jsonConfig | jq ".environments[0].url" | tr -d '"')
  cookieName=$(jq "." $jsonConfig | jq ".cookieName"  | tr -d '"')
  configArray=$(jq -r ".environments[] | @base64" $jsonConfig)

  # Show link to azureTokenGenerator to user
  echo -e "${Cyan}Visit and sign in with test user: ${UGreen}${url}\n"
  echo -e "${Cyan}Find and copy ${Yellow}${cookieName} ${Cyan}cookie from ${Yellow}DevTools > Application > Cookies"

  # Ask for wonderwall cookie,
  echo -e "${Cyan}Paste in cookie: "
  read -r cookie
  echo -e "\n"

  # Loop through config list and create environment variable
  for config in $configArray;
    do
      _jq() {
        echo "${config}" | base64 --decode | jq -r "${1}"
      }

      env=$(_jq ".env")
      url=$(_jq ".url")

      generateAndUpdateEnvFile "$env" "$url" "$cookie"
  done

  echo -e "\n"
}

# This function make curl request with `-b` flag to send cookie with the request
# | jq ".access_token" returns access_token string
generateAndUpdateEnvFile() {
  # function parameters
  env=$1
  url=$2
  cookie=$3

  cookieName=$(jq "." $jsonConfig | jq ".cookieName" | tr -d '"')

  # Add env key if not exits
  # Example: DP_SOKNAD_TOKEN
  if grep -q "$env" "$envFile"; then
    # env already exits, continue script
    :
  else
    # Add missing env key
    printf "%s\n" '$a' "${env}" . w | ed -s $envFile
  fi

  # Store access token in variable
  accessToken=$(curl -s -b "${cookieName}=${cookie}" "${url}" | jq ".access_token" | tr -d '"')

  # Check if accessToken is empty or null
  if [[ -z "$accessToken" || "$accessToken" == null ]]; then
    echo -e "❌ ${Yellow}${env} ${Red} error"
    exit 1
  else
    # Fully generated env string
    generatedEnv="${env}=${accessToken}"

    # Update generated env string to env file
    printf "%s\n" H ,g/^${env}.*/s//${generatedEnv}/ wq | ed -s $envFile

    echo -e "✅ ${Yellow}${env} ${Cyan}updated"
  fi
}

# Start script
init
