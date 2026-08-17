#!/usr/bin/env bash

set -Eeuo pipefail

readonly DEPLOY_HOST='sanctum-prod'
readonly REMOTE_REPOSITORY='/var/www/nakedtech.au'
readonly DEPLOY_BRANCH='main'

printf 'Deploying origin/%s to %s:%s\n' \
  "${DEPLOY_BRANCH}" \
  "${DEPLOY_HOST}" \
  "${REMOTE_REPOSITORY}"

ssh -o BatchMode=yes "${DEPLOY_HOST}" bash -s -- "${REMOTE_REPOSITORY}" "${DEPLOY_BRANCH}" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

readonly repository_path="$1"
readonly deploy_branch="$2"

if [[ ! -d "${repository_path}/.git" ]]; then
  printf 'Production repository not found at %s\n' "${repository_path}" >&2
  exit 1
fi

cd "${repository_path}"

exec 9>"${repository_path}/.git/nakedtech-deploy.lock"
if ! flock -n 9; then
  printf 'Another Naked Tech deployment is already running.\n' >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  printf 'Production checkout has uncommitted changes; refusing to deploy.\n' >&2
  git status --short >&2
  exit 1
fi

current_branch="$(git branch --show-current)"
if [[ "${current_branch}" != "${deploy_branch}" ]]; then
  printf 'Expected branch %s, found %s; refusing to deploy.\n' \
    "${deploy_branch}" \
    "${current_branch}" >&2
  exit 1
fi

git pull --ff-only origin "${deploy_branch}"
readonly target_commit="$(git rev-parse HEAD)"
readonly deploy_workspace="$(mktemp -d "${repository_path}/.nakedtech-deploy.XXXXXX")"
readonly build_checkout="${deploy_workspace}/checkout"
readonly previous_site="${deploy_workspace}/previous-site"
readonly failed_site="${deploy_workspace}/failed-site"
readonly nginx_backup="${deploy_workspace}/nginx-backup"
readonly nginx_apex_target='/etc/nginx/sites-available/nakedtech.au.conf'
readonly nginx_www_target='/etc/nginx/sites-available/nakedtech-www-redirect.conf'
readonly nginx_www_link='/etc/nginx/sites-enabled/nakedtech-www-redirect.conf'
worktree_added=false
previous_site_saved=false
site_installed=false
nginx_staged=false
deployment_complete=false

restore_site() {
  if [[ "${site_installed}" == true && -d "${repository_path}/_site" ]]; then
    mv "${repository_path}/_site" "${failed_site}"
    site_installed=false
  fi
  if [[ "${previous_site_saved}" == true && -d "${previous_site}" ]]; then
    mv "${previous_site}" "${repository_path}/_site"
    previous_site_saved=false
  fi
}

restore_nginx() {
  if [[ "${nginx_staged}" != true ]]; then
    return
  fi

  sudo install -m 0644 "${nginx_backup}/nakedtech.au.conf" "${nginx_apex_target}"
  if [[ -f "${nginx_backup}/www-target-existed" ]]; then
    sudo install -m 0644 "${nginx_backup}/nakedtech-www-redirect.conf" "${nginx_www_target}"
  else
    sudo rm -f "${nginx_www_target}"
  fi

  if [[ -f "${nginx_backup}/www-link-target" ]]; then
    sudo ln -sfn "$(<"${nginx_backup}/www-link-target")" "${nginx_www_link}"
  else
    sudo rm -f "${nginx_www_link}"
  fi
  nginx_staged=false
}

cleanup() {
  readonly exit_status="$?"
  trap - EXIT
  set +e

  if [[ "${deployment_complete}" != true ]]; then
    restore_site
    if [[ "${nginx_staged}" == true ]]; then
      restore_nginx
      if ! sudo nginx -t || ! sudo systemctl reload nginx; then
        printf 'Automatic Nginx rollback validation failed; inspect the server immediately.\n' >&2
      fi
    fi
  fi
  if [[ "${worktree_added}" == true ]]; then
    git -C "${repository_path}" worktree remove --force "${build_checkout}" >/dev/null 2>&1 || true
  fi
  case "${deploy_workspace}" in
    "${repository_path}"/.nakedtech-deploy.*) rm -rf -- "${deploy_workspace}" ;;
    *) printf 'Refusing to remove unexpected deployment workspace: %s\n' "${deploy_workspace}" >&2 ;;
  esac

  exit "${exit_status}"
}
trap cleanup EXIT

git worktree add --detach "${build_checkout}" "${target_commit}"
worktree_added=true

cd "${build_checkout}"
npm ci
npm test

if [[ ! -d "${build_checkout}/_site" ]]; then
  printf 'Validated build did not produce _site; refusing to replace the live site.\n' >&2
  exit 1
fi

readonly nginx_apex_source="${build_checkout}/deploy/nginx/nakedtech.au.conf"
readonly nginx_www_source="${build_checkout}/deploy/nginx/nakedtech-www-redirect.conf"
if [[ ! -f "${nginx_apex_source}" || ! -f "${nginx_www_source}" ]]; then
  printf 'Validated checkout is missing a tracked Nginx configuration; refusing to deploy.\n' >&2
  exit 1
fi

mkdir -m 700 "${nginx_backup}"
sudo cat "${nginx_apex_target}" > "${nginx_backup}/nakedtech.au.conf"
if sudo test -f "${nginx_www_target}"; then
  sudo cat "${nginx_www_target}" > "${nginx_backup}/nakedtech-www-redirect.conf"
  touch "${nginx_backup}/www-target-existed"
fi
if sudo test -L "${nginx_www_link}"; then
  sudo readlink "${nginx_www_link}" > "${nginx_backup}/www-link-target"
fi

nginx_staged=true
sudo install -m 0644 "${nginx_apex_source}" "${nginx_apex_target}"
sudo install -m 0644 "${nginx_www_source}" "${nginx_www_target}"
sudo ln -sfn "${nginx_www_target}" "${nginx_www_link}"
sudo nginx -t

if [[ -d "${repository_path}/_site" ]]; then
  previous_site_saved=true
  if ! mv "${repository_path}/_site" "${previous_site}"; then
    previous_site_saved=false
    printf 'Could not preserve the previous site output; refusing to continue.\n' >&2
    exit 1
  fi
fi

if ! mv "${build_checkout}/_site" "${repository_path}/_site"; then
  printf 'Could not install the validated site; restoring the previous output.\n' >&2
  if [[ -d "${previous_site}" ]]; then
    mv "${previous_site}" "${repository_path}/_site"
    previous_site_saved=false
  fi
  exit 1
fi
site_installed=true

sudo systemctl reload nginx
deployment_complete=true

printf 'Deployed Naked Tech at commit %s\n' "${target_commit}"
REMOTE_SCRIPT
