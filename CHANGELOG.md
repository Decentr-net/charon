# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.2

### Added

- Loader during initialization of Charon.
- Login page: autofocus for password input.
- dPortal: auto-update for activity chart.
- dHub: label for TOP 24 hours message if no posts.
- dHub: tooltips for charts.
- dHub: ngx-quill for post editor. Remove formatting and images when pasting in a post editor.

### Changed

- Reduce of balance/stats requests.
- Post's rating is not auto-updated in the real time when like/dislike post and then close it.
- Cookie domain regexp adjusted.
- Line chart refactored.
- Copy wallet address directive: implement Angular CDK Clipboard.

### Fixed

- Fix visibility of underscore for inputs.
- Fix Create profile page: email validation.
- Fix dPortal, dHub: catch errors during getting PDV balance/stats.
- Fix dPortal assets: micro-value pipe for undefined.
- Fix dPortal activity-list: hide "No activity" label during first loading.

## 1.1.1

### Fixed

- Fix dPortal: navigate to dPortal if unlock Charon in mini-view.
- Fix disabled checking REST when Charon UI start.
- Fix getting config.

## 1.1.0

### Added

- dHub: auto-save post draft.
- dHub: save post draft for specified user.
- dHub: load 20 posts on "Load more".
- dPortal assets: add copy wallet address for transfers.
- Get config.
- Check min supported Charon version.
- Auto-select REST network during Charon initialization.
- Package.json scripts: auto-naming for build packs.

### Fixed

- Fix disabled config caching.
- Fix dPortal assets: adjusted amount regexp.
- Fix dPortal assets: remove comma for thousands figures.
- Fix dPortal assets: navigation after successful transfer.
- Fix Import/restore pages: trim trailing spaces for mnemonic.
- Fix date-ago pipe adjust minutes/hours timings.
- Fix dHub: remove draft only after it successful posted.

## 1.0.8
## 1.0.7
## 1.0.6
## 1.0.5
## 1.0.4
## 1.0.3
## 1.0.2
## 1.0.1
## 1.0.0
