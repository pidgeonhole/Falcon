#!/usr/bin/env bash


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
Usage: deploy (-h | -s | -r)

OPTIONS:
   -h|--help                  Show this message
   -s|--setup                 Setup environment for server and development
   -r|--run                   Commits application production and runs it

EXAMPLES:
  Set up server. Installs all necessary components and sets up necessary git hooks for git commits:
       $ deploy -s

  Show help message for setup command:
       $ deploy -s -h

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

while [[ $# > 0 ]]
do
case "${1}" in
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
    ./deploy/setup.sh -h
  else
    help_menu
  fi
else
  if (( ${SETUP_FLAG} == 1 )); then
    ./deploy/setup.sh
  fi
  if (( ${RUN_FLAG} == 1 )); then
    run_application
  fi
fi
