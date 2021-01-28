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

- visibility of underscore for inputs.
- Create profile page: email validation.
- dPortal, dHub: catch errors during getting PDV balance/stats.
- dPortal assets: micro-value pipe for undefined.
- dPortal activity-list: hide "No activity" label during first loading.

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

- disabled config caching.
- dPortal assets: adjusted amount regexp.
- dPortal assets: remove comma for thousands figures.
- dPortal assets: navigation after successful transfer.
- Import/restore pages: trim trailing spaces for mnemonic.
- date-ago pipe adjust minutes/hours timings.
- dHub: remove draft only after it successful posted.

## 1.0.8

### Added

- dPortal assets: transfer history.

### Changed

- Updated decentr-js to v1.7.5.

### Fixed

- dPortal mini-view: adjust height.
- dPortal assets: reduce of requests to DEC balance.
- Disable update PDV on inactive browser tabs.

## 1.0.7

### Added

- dPortal assets: transfer DEC coins.
- Sync Charon transactions. Querying of transactions.

### Fixed

- dPortal: translate assets tab.
- dPortal: stop rising of balance requests if keep page inactive.
- Disabled PDV auto-updating for inactive tabs.

## 1.0.6

### Changed

- Hide birthday date field.

## 1.0.5

### Added

- dHub: upload images to images hosting.
- dHub: remove "Statistic from" from Coin rate.
- Default digitsInfo implemented for dayMargin.

### Changed

- Auto-lock changed from 40 minutes to 4 hours.
- dHub: extended size of post popup.
- Toolbar: removed settings button.

### Fixed

- Navigation back behavior for guarded pages.

## 1.0.3
## 1.0.2
## 1.0.1
## 1.0.0
