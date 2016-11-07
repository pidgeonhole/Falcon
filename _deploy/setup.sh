#!/usr/bin/env bash


APP_ENV="${APP_ENV:-production}"
SERVER_IP="${SERVER_IP:-128.199.120.230}"
SSH_USER="${SSH_USER:-$(whoami | awk '{print tolower($0)}')}"
KEY_USER="${KEY_USER:-$(whoami | awk '{print tolower($0)}')}"
SSH_SERVER="${SSH_USER}@${SERVER_IP}"
DOCKER_VERSION="${DOCKER_VERSION:-1.12.3}"
APP_NAME="${APP_NAME:-CodeQuiz}"


function install_docker () {
  echo "Configuring Docker v${DOCKER_VERSION}..."
  ssh -t "${SSH_SERVER}" bash -c "'
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo \"deb https://apt.dockerproject.org/repo ubuntu-xenial main\" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker
sudo usermod -aG docker $(whoami | awk '{print tolower($0)}')
  '"
  echo "Done!"
}

function git_init () {
  DIRECTORY="/var/www/${APP_NAME}"
  echo "Initialize git repo and hooks..."
  scp "post-receive/${APP_NAME}" "${SSH_SERVER}:/tmp/${APP_NAME}"
  ssh -t "${SSH_SERVER}" bash -c "'
sudo apt-get update && sudo apt-get install -y -q git
sudo rm -rf ${DIRECTORY}.git ${DIRECTORY}
sudo mkdir -p ${DIRECTORY}.git ${DIRECTORY}
sudo git --git-dir=${DIRECTORY}.git --bare init

sudo mv /tmp/${APP_NAME} ${DIRECTORY}.git/hooks/post-receive
sudo chmod +x ${DIRECTORY}.git/hooks/post-receive
sudo chown -R ${KEY_USER}:${KEY_USER} ${DIRECTORY}.git
sudo chown -R ${KEY_USER}:${KEY_USER} ${DIRECTORY}
  '"
  echo "Done!"
}

function git_remote_add () {
  echo "Setting up git remotes..."
  local REMOTE="ssh://${KEY_USER}@${SERVER_IP}:/var/www/${APP_NAME}.git"
  (cd CodeQuiz ; git remote remove ${APP_ENV})
  (cd ../CodeQuiz ; git remote add ${APP_ENV} ${REMOTE})
  echo "Done!"
}

function read_or_default () {
  if [[ ${#2} -eq 0 ]]; then
    echo "${1}"
  fi
  echo "${2}"
}

function setup () {
  echo -n "Environment (${APP_ENV}): "
  read TEMP
  APP_ENV=$(read_or_default ${APP_ENV} ${TEMP})
  echo -n "Server IP (${SERVER_IP}): "
  read TEMP
  SERVER_IP=$(read_or_default ${SERVER_IP} ${TEMP})
  echo -n "SSH User ID (${SSH_USER}): "
  read TEMP
  SSH_USER=$(read_or_default ${SSH_USER} ${TEMP})
  echo -n "Key User ID (${KEY_USER}): "
  read TEMP
  KEY_USER=$(read_or_default ${KEY_USER} ${TEMP})
  echo -n "Docker Version (${DOCKER_VERSION}): "
  read TEMP
  DOCKER_VERSION=$(read_or_default ${DOCKER_VERSION} ${TEMP})
  echo -n "Application name (${APP_NAME}): "
  read TEMP
  APP_NAME=$(read_or_default ${APP_NAME} ${TEMP})

  SSH_SERVER="${SSH_USER}@${SERVER_IP}"
  echo "${APP_ENV} ${APP_NAME} ${SSH_SERVER}"

  install_docker
  git_init
  git_remote_add
}

function help_menu () {
cat << EOF
Usage: deploy -s (-h)

ENVIRONMENT VARIABLES:
   APP_ENV          Environment that is being deployed to, 'staging' or 'production'
                    Defaulting to ${APP_ENV}

   SERVER_IP        IP address to work on, ie. staging or production
                    Defaulting to ${SERVER_IP}

   SSH_USER         User account to ssh and scp in as
                    Defaulting to ${SSH_USER}

   SSH_SERVER       Sugar for SSH_USER@SERVER_IP

   KEY_USER         User account linked to the SSH key
                    Defaulting to ${KEY_USER}

   DOCKER_VERSION   Docker version to install
                    Defaulting to ${DOCKER_VERSION}

OPTIONS:
   -h|--help                 Show this message

EXAMPLES:
  Set up server. Installs all necessary components and sets up necessary git hooks for git commits:
       $ deploy -s

  Show help message for setup command:
       $ deploy -s -h
EOF
}

if (( ${#} == 0 )); then
  setup
  exit
fi

if [[ ${1} == '-h' ]] || [[ ${1} == '--help' ]]; then
  help_menu
else
  echo "Unrecognized command ${1}. Use deploy -s -h for more information"
fi
