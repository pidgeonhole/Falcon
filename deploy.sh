#!/usr/bin/env bash

DEVOPS_FOLDER="./_deploy"
APP_NAME="Falcon"

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

function run_application () {
    local COMMENT=""
    local ENV="production"
    local IP="http://139.59.241.214/v3/"

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

    echo -n "Jiayu's API IP (${IP}): "
    read TEMP
    if (( ${#TEMP} > 0)); then
      IP=${TEMP}
    fi

#    echo "Preparing static files with Webpack. This may take a while.."
#    NODE_ENV=production IP="${IP}" webpack
    echo "Committing to git"
    git commit -am "${COMMENT}"
    echo "Pushing to ${ENV}"
    git push ${ENV} master
    echo "Done!"
}

function copy_hook_file () {
    local DIRECTORY="/var/www/${APP_NAME}"
    scp "${DEVOPS_FOLDER}/post-receive/${APP_NAME}" "${SSH_SERVER}:/tmp/${APP_NAME}"
    ssh -t "${SSH_SERVER}" bash -c "'
sudo mv /tmp/${APP_NAME} ${DIRECTORY}.git/hooks/post-receive
sudo chmod +x ${DIRECTORY}.git/hooks/post-receive
'"
    echo "Done!"
}

function help_menu () {
cat << EOF
Usage: deploy (-h | -s | -req | -r)

OPTIONS:
   -h|--help                  Show this message
   -c|--copy-hook             Copy post-receive hook over
   -s|--setup                 Setup environment for server and development
   --req-txt                  Prints external application dependencies into requirements.txt
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
HOOK_FLAG=0

while [[ $# > 0 ]]
do
case "${1}" in
  --req-txt)
  echo "H1"
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
  -c|--copy-hook)
  HOOK_FLAG=1
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
    echo "Getting Requirements"
#    get_requirements
  fi
  if (( ${SETUP_FLAG} == 1 )); then
    ${DEVOPS_FOLDER}/setup.sh
  fi
  if (( ${RUN_FLAG} == 1 )); then
    run_application
  fi
  if (( ${HOOK_FLAG} == 1 )); then
    copy_hook_file
  fi
fi
