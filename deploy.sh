#!/usr/bin/env bash

function get_requirements () {

  local VENV="web3"
  local TEMP

  echo "Printing requirements.txt"
  echo -n "Set environment (${VENV}): "
  read TEMP

  if (( ${#TEMP} > 0)); then
    VENV=${TEMP}
  fi

  source activate ${VENV}

  invalids=( "pypiwin32" "gunicorn")
  array=()

  for item in `pip freeze`; do
    valid=1
    for inv in ${invalids[@]}; do
      if [[ "${item}" =~ ${inv}[=0-9\.]* ]]; then
        valid=0
      fi
    done
    if (( ${valid} == 1 )); then
      array+=("${item}")
    fi
  done

  printf '%s\n' "${array[@]}" > requirements.txt
  echo "Done!"
}

DEVOPS_FOLDER="./_deploy"

function run_application () {
  local COMMENT=""
  local ENV="production"

  while [[ ${#COMMENT} -lt 1 ]]; do
    echo -n "Comment for git commit: "
    read COMMENT
  done

  echo -n "Environment (${ENV}): "
  read TEMP
  if (( ${#TEMP} > 0)); then
    ENV=${TEMP}
  fi
  echo "Working on ${ENV}"

  echo "Preparing static files with Webpack. This may take a while.."
  NODE_ENV=production webpack -p
  echo "Committing to git"
  git commit -am "${COMMENT}"
  echo "Pushing to ${ENV}"
  git push ${ENV} master
  echo "Done!"
}

function help_menu () {
cat << EOF
Usage: deploy (-h | -s | -g | -r)

OPTIONS:
   -h|--help                  Show this message
   -s|--setup                 Setup environment for server and development
   -g|--get-lib               Prints external application dependencies into requirements.txt
   -r|--run                   Commits application production and runs it

EXAMPLES:
  Set up server. Installs all necessary components and sets up necessary git hooks for git commits:
       $ deploy -s

  Show help message for setup command:
       $ deploy -s -h

  Prints external application dependencies into requirements.txt so that the server can install them:
       $ deploy -g

  Commits application to production git and run it:
       $ deploy -r
EOF
}

# If no commands
if (( $# == 0 )); then
  help_menu
  exit
fi

# Flags for action
HELP_FLAG=0
RUN_FLAG=0
SETUP_FLAG=0
GET_LIB_FLAG=0

while [[ $# > 0 ]]
do
case "${1}" in
  -g|--get-lib)
  GET_LIB_FLAG=1
  shift
  ;;
  -r|--run)
  RUN_FLAG=1
  shift
  ;;
  -h|--help)
  HELP_FLAG=1
  shift
  ;;
  -s|--setup)
  SETUP_FLAG=1
  shift
  ;;
  *)
  echo "${1} is not a valid flag, try running: ${0} --help"
  exit
  shift
  ;;
esac
done

if (( ${HELP_FLAG} == 1 )); then
  if (( ${SETUP_FLAG} == 1 )); then
    ${DEVOPS_FOLDER}/setup.sh -h
  else
    help_menu
  fi
else
  if (( ${GET_LIB_FLAG} == 1)); then
    get_requirements
  fi
  if (( ${SETUP_FLAG} == 1 )); then
    ${DEVOPS_FOLDER}/setup.sh
  fi
  if (( ${RUN_FLAG} == 1 )); then
    run_application
  fi
fi
