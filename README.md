# easyreading
This is a [bionic reading](https://bionic-reading.com) extension for Chrome-based browsers.

## User Guide

### How to Install
This works on any Chrome-based browser (eg Chromium, Edge, Brave, Gener8).

1. Click on the green button 'Code' in the right corner
2. Download as zip
3. Un-zip in a folder
4. Go to extensions
5. Enable developer mode
6. Click Load-Unpacked
7. Select the whole folder with the files inside

### Features
- Changing the bolded-font color to anything you wish.
- Changing the proportion of bolded letters in a word
- Saving the current settings on a particular domain (i.e blue on github, red on stack)
- Blacklisting domains

## Contributor Guide
The extension uses both [cloud & local storage](https://developer.chrome.com/docs/extensions/reference/storage/). The data structure is as follows.

### Cloud (sync) Storage
This has 3 properties:

- `textColor` - how to colorise the bold parts. Chosen via HTML5 colour picker input.
- `proportion` - the fraction of each word to bolden. Ranges from 0.1 to 0.9 in steps of 0.1.
- `blacklist` - an array of hostnames for the extension to ignore.

The first 2, `textColor` and `proportion` are default values. They may get overriden by the `settings` property in local storage.

### Local Storage
This has 1 property, `settings`, which is an array of key-value pairs. The values are objects with `textColor` and `proportion` fields while the keys are website hostnames on which to apply the corresponding settings value.
