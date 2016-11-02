#!/usr/bin/env bash


APP_ENV="${APP_ENV:-staging}"
SERVER_IP="${SERVER_IP:-192.168.1.99}"
SSH_USER="${SSH_USER:-$(whoami | awk '{print tolower($0)}')}"
KEY_USER="${KEY_USER:-$(whoami | awk '{print tolower($0)}')}"
SSH_SERVER="${SSH_USER}@${SERVER_IP}"
DOCKER_VERSION="${DOCKER_VERSION:-1.12.3}"
APP_NAME="${APP_NAME:-CodeQuiz}"


# DOCKER_PULL_IMAGES=("postgres:9.4.5" "redis:2.8.22")
COPY_UNIT_FILES=("iptables-restore" "swap" "nginx" "CodeQuiz") # "postgres" "redis" "mobydock")
SSL_CERT_BASE_NAME="sslcertexample"

# Flags. Determine what is done
SUDO_FLAG=false
SECURE_SSH_FLAG=false
INSTALL_DOCKER_FLAG=false
GIT_INIT_FLAG=false
FIREWALL_FLAG=false
SYSTEMD_COPY_FLAG=false
SYSTEMD_RUN_FLAG=false
ENV_FILE_COPY_FLAG=false
SSL_COPY_FLAG=false
RUN_FLAG=false

function preseed_production() {
  echo "Preseeding the production server..."
  ssh -t "${SSH_SERVER}" bash -c "'
adduser --disabled-password --gecos \"\" ${KEY_USER}
adduser ${KEY_USER} sudo
  '"
  echo "done!"
}

function configure_sudo () {
  echo "Configuring passwordless sudo..."
  scp "sudo/sudoers" "${SSH_SERVER}:/tmp/sudoers"
  ssh -t "${SSH_SERVER}" bash -c "'
sudo chmod 440 /tmp/sudoers
sudo chown root:root /tmp/sudoers
sudo mv /tmp/sudoers /etc
  '"
  echo "done!"
}

function configure_secure_ssh () {
  echo "Configuring secure SSH..."
  scp "ssh/sshd_config" "${SSH_SERVER}:/tmp/sshd_config"
  ssh -t "${SSH_SERVER}" bash -c "'
sudo chown root:root /tmp/sshd_config
sudo mv /tmp/sshd_config /etc/ssh
sudo systemctl restart ssh
  '"
  echo "done!"
}

function install_docker () {
  if [[ $(docker -v | grep ${DOCKER_VERSION} ; echo :?)==0 ]]; then
    echo "Docker version is ${DOCKER_VERSION}. Proceeding on.."
  else
    echo "Docker version is not ${DOCKER_VERSION}. Proceeding to install."
    echo "Configuring Docker v${1}..."
    ssh -t "${SSH_SERVER}" bash -c "'
sudo apt-get update
sudo apt-get install -y -q libapparmor1 aufs-tools ca-certificates
sudo wget -O "docker.deb" https://apt.dockerproject.org/repo/pool/main/d/docker-engine/docker-engine_${1}-0~jessie_amd64.deb
sudo dpkg -i docker.deb
sudo apt-get install -f -y
rm docker.deb
    '"
  fi
  echo "Done!"
}

function git_init () {
  echo "Initialize git repo and hooks..."
  scp "git/post-receive/${APP_NAME}" "${SSH_SERVER}:/tmp/${APP_NAME}"
  scp "git/post-receive/nginx" "${SSH_SERVER}:/tmp/nginx"
  ssh -t "${SSH_USER}@${SERVER_IP}" bash -c "'
sudo apt-get update && sudo apt-get install -y -q git
sudo rm -rf /var/git/${APP_NAME}.git /var/git/${APP_NAME} /var/git/nginx.git /var/git/nginx
sudo mkdir -p /var/git/${APP_NAME}.git /var/git/${APP_NAME} /var/git/nginx.git /var/git/nginx
sudo git --git-dir=/var/git/${APP_NAME}.git --bare init
sudo git --git-dir=/var/git/nginx.git --bare init

sudo mv /tmp/${APP_NAME} /var/git/${APP_NAME}.git/hooks/post-receive
sudo mv /tmp/nginx /var/git/nginx.git/hooks/post-receive
sudo chmod +x /var/git/${APP_NAME}.git/hooks/post-receive /var/git/nginx.git/hooks/post-receive
  '"
  echo "Done!"
}

function configure_firewall () {
  echo "Configuring iptables firewall..."
  scp "iptables/rules-save" "${SSH_SERVER}:/tmp/rules-save"
  ssh -t "${SSH_SERVER}" bash -c "'
sudo mkdir -p /var/lib/iptables
sudo mv /tmp/rules-save /var/lib/iptables
  '"
  echo "Done!"
}

function copy_units () {
  echo "Copying systemd unit files..."
  for unit in "${COPY_UNIT_FILES[@]}"
  do
    scp "units/${unit}.service" "${SSH_SERVER}:/tmp/${unit}.service"
    ssh -t "${SSH_SERVER}" bash -c "'
sudo mv /tmp/${unit}.service /etc/systemd/system
sudo chown ${SSH_SERVER} /etc/systemd/system/${unit}.service
  '"
  done
  echo "done!"
}

function enable_base_units () {
  echo "Enabling base systemd units..."
  ssh -t "${SSH_SERVER}" bash -c "'
sudo systemctl enable iptables-restore.service
sudo systemctl start iptables-restore.service
sudo systemctl restart docker
sudo systemctl enable swap.service
sudo systemctl start swap.service
  '"
  ssh -t "${SSH_SERVER}" bash -c "'sudo systemctl restart docker'"
  echo "done!"
}

function copy_env_config_files () {
  echo "Copying environment/config files..."
  scp "${APP_ENV}/__init__.py" "${SSH_SERVER}:/tmp/__init__.py"
  scp "${APP_ENV}/settings.py" "${SSH_SERVER}:/tmp/settings.py"
  ssh -t "${SSH_SERVER}" bash -c "'
sudo mkdir -p /home/${KEY_USER}/config
sudo mv /tmp/__init__.py /home/${KEY_USER}/config/__init__.py
sudo mv /tmp/settings.py /home/${KEY_USER}/config/settings.py
sudo chown ${KEY_USER}:${KEY_USER} -R /home/${KEY_USER}/config
  '"
  echo "done!"
}

function copy_ssl_certs () {
  echo "Copying SSL certificates..."
if [[ "${APP_ENV}" == "staging" ]]; then
  scp "nginx/certs/${SSL_CERT_BASE_NAME}.crt" "${SSH_SERVER}:/tmp/${SSL_CERT_BASE_NAME}.crt"
  scp "nginx/certs/${SSL_CERT_BASE_NAME}.key" "${SSH_SERVER}:/tmp/${SSL_CERT_BASE_NAME}.key"
  scp "nginx/certs/dhparam.pem" "${SSH_SERVER}:/tmp/dhparam.pem"
else
  scp "production/certs/${SSL_CERT_BASE_NAME}.crt" "${SSH_SERVER}:/tmp/${SSL_CERT_BASE_NAME}.crt"
  scp "production/certs/${SSL_CERT_BASE_NAME}.key" "${SSH_SERVER}:/tmp/${SSL_CERT_BASE_NAME}.key"
  scp "production/certs/dhparam.pem" "${SSH_SERVER}:/tmp/dhparam.pem"
fi
  ssh -t "${SSH_SERVER}" bash -c "'
sudo mv /tmp/${SSL_CERT_BASE_NAME}.crt /etc/ssl/certs/${SSL_CERT_BASE_NAME}.crt
sudo mv /tmp/${SSL_CERT_BASE_NAME}.key /etc/ssl/private/${SSL_CERT_BASE_NAME}.key
sudo mv /tmp/dhparam.pem /etc/ssl/private/dhparam.pem
sudo chown root:root -R /etc/ssl
  '"
  echo "done!"
}

function provision_server () {
  if [[ ${APP_ENV} = "production" ]]; then
    preseed_production
  fi

  if [[ ${1} = true ]]; then
    configure_sudo
    echo "---"
  fi
  if [[ ${2} = true ]]; then
    configure_secure_ssh
    echo "---"
  fi
  if [[ ${3} = true ]]; then
    install_docker
    echo "---"
  fi
  if [[ ${4} = true ]]; then
    git_init
    echo "---"
  fi
  if [[ ${5} = true ]]; then
    configure_firewall
    echo "---"
  fi
  if [[ ${6} = true ]]; then
    copy_units
    echo "---"
  fi
  if [[ ${7} = true ]]; then
    enable_base_units
    echo "---"
  fi
  if [[ ${8} = true ]]; then
    copy_env_config_files
    echo "---"
  fi
  if [[ ${9} = true ]]; then
    copy_ssl_certs
    echo "---"
  fi
}

function run_application () {
  echo "Running the application..."
  ssh -t "${SSH_SERVER}" bash -c "'
sudo systemctl enable CodeQuiz.service nginx.service
sudo systemctl start CodeQuiz.service nginx.service
  '"
  echo "done!"
}

function help_menu () {
cat << EOF
Usage: ${0} (-h | -u | -s | -d [docker_ver] | -g | -f | -r | -c | -b | -e | -x | -a [docker_ver] | -p | -S)

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
   -u|--sudo                 Configure passwordless sudo
   -s|--ssh                  Configure secure SSH
   -d|--docker-install       Install Docker
   -g|--git-init             Install and initialize git
   -f|--firewall             Configure the iptables firewall
   -c|--copy-units           Copy systemd unit files
   -b|--enable-base-units    Enable base systemd unit files
   -e|--copy--environment    Copy app environment/config files
   -x|--ssl-certs            Copy SSL certificates
   -r|--run-app              Run the application. Note that this runs separately from -a. And should be run after -a
   -a|--all                  Provision everything except preseeding
   -p|--production           Change APP_ENV to "production"
   -S|--staging              Change staging server IP address
   -U|--username             Change SSH_USER name

EXAMPLES:
   Configure passwordless sudo:
        $ deploy -u

   Configure secure SSH:
        $ deploy -s

   Install Docker v${DOCKER_VERSION}:
        $ deploy -d

   Install custom Docker version:
        $ deploy -d ${DOCKER_VERSION}

   Install and initialize git:
        $ deploy -g

   Configure the iptables firewall:
        $ deploy -f

   Copy systemd unit files:
        $ deploy -c

   Enable base systemd unit files:
        $ deploy -b

   Copy app environment/config files:
        $ deploy -e

   Copy SSL certificates:
        $ deploy -x

   Run the application:
        $ deploy -r

   Configure everything together:
        $ deploy -a

   Configure everything together with a custom Docker version:
        $ deploy -a 1.12.3

   Change to production mode. This will override staging mode!
        $ deploy -p

   Change staging server IP address.
        $ deploy -S 192.168.1.99

   Change SSH_USER name
        $ deploy -U jiayu
EOF
}


while [[ $# > 0 ]]; do
  case "${1}" in
    -u|--sudo)
    SUDO_FLAG=true
    shift
    ;;
    -s|--ssh)
    SECURE_SSH_FLAG=true
    shift
    ;;
    -d|--docker-install )
    if [[ "${2}" =~ [0-9]\.[0-9]{1,3}\.[0-9]{1,3} ]]; then
      DOCKER_VERSION="${2}"
      shift
    fi
    DOCKER_FLAG=true
    shift
    ;;
    -g|--git-init)
    GIT_INIT_FLAG=true
    shift
    ;;
    -f|--firewall)
    FIREWALL_FLAG=true
    shift
    ;;
    -c|--copy-units)
    SYSTEMD_COPY_FLAG=true
    shift
    ;;
    -b|--enable-base-units)
    SYSTEMD_RUN_FLAG=true
    shift
    ;;
    -e|--copy--environment)
    ENV_FILE_COPY_FLAG=true
    shift
    ;;
    -x|--ssl-certs)
    SSL_COPY_FLAG=true
    shift
    ;;
    -a|--all)
    SUDO_FLAG=true
    SECURE_SSH_FLAG=true
    DOCKER_FLAG=true
    GIT_INIT_FLAG=true
    FIREWALL_FLAG=true
    SYSTEMD_COPY_FLAG=true
    SYSTEMD_RUN_FLAG=true
    ENV_FILE_COPY_FLAG=true
    SSL_COPY_FLAG=true
    shift
    ;;
    -r|--run-app)
    RUN_FLAG=true
    shift
    ;;
    -h|--help)
    help_menu
    shift
    ;;
    -p|--production)
    APP_ENV="production"
    SSH_USER="root"
    if [[ "${2}" =~ [0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3} ]]; then
      # Allow someone to pass a different IP address as an argument
      SERVER_IP="${2}"
      shift
    else
      # My production IP address on digital ocean
      SERVER_IP="128.199.121.114"
    fi
    SSH_SERVER="${SSH_USER}@${SERVER_IP}"
    shift
    ;;
    -S|--staging)
    if [[ "${2}" =~ [0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3} ]]; then
      # Allow someone to change the IP address"
      SERVER_IP="${2}"
      SSH_SERVER="${SSH_USER}@${SERVER_IP}"
      shift
    fi
    shift
    ;;
    -U|--username)
    if [[ "${2}" =~ [a-z]* ]]; then
      SSH_USER="${2}"
      SSH_SERVER="${SSH_USER}@${SERVER_IP}"
      shift
    else
      echo "Invalid user name entered. Username must be [a-z]*"
    fi
    shift
    ;;
    *)
    echo "${1} is not a valid flag, try running: ${0} --help"
    shift
    ;;
  esac
done

# Flags
provision_server ${SUDO_FLAG} ${SECURE_SSH_FLAG} ${DOCKER_FLAG} ${GIT_INIT_FLAG} ${FIREWALL_FLAG} ${SYSTEMD_COPY_FLAG} ${SYSTEMD_RUN_FLAG} ${ENV_FILE_COPY_FLAG} ${SSL_COPY_FLAG}

if [[ ${RUN_FLAG} = true ]]; then
  run_application
fi
