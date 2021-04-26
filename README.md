![Version](https://img.shields.io/npm/v/we-recurring-select.svg)
![License](https://img.shields.io/npm/l/we-recurring-select.svg)
![Coverage](https://img.shields.io/coveralls/github/jevado/we-recurring-select.svg)
# we-recurring-select
_Slightly adjusted Yarn version of recurring_select gem by GetJobber_
<table>
  <tbody>
    <tr>
      <td><b>Downloads</b></td>
      <td><a href="https://yarnpkg.com/package/we-recurring-select">"https://yarnpkg.com/package/we-recurring-select</a></td>
    </tr>
    <tr>
      <td><b>Source</b></td>
      <td><a href="https://github.com/jevado/we-recurring-select">https://github.com/jevado/we-recurring-select</a></td>
    </tr>
    <tr>
      <td><b>Documentation</b></td>
      <td><a href="https://github.com/jevado/we-recurring-select">https://github.com/jevado/we-recurring-select</a></td>
    </tr>
  </tbody>
</table>

## Intro
WARNING:

* Documentation is completely updated yet.
* Tests are not written yet, this really is a plugin in flux right now

## Installation
From Yarn / add to a project:
```shell
$ yarn add we-recurring-select
```
From GitHub:
```shell
$ git clone https://github.com/jevado/we-recurring-select
$ cd we-recurring-select
$ yarn install --production
```
## Usage
After including the package you need to add the triggers to your 'document ready' block
Future plans are to make this mechanism more flexible so we can move  that code back into the plugin

Options include which weeks to show when selecting a month AND disabling the yearly option.

```javascript
require('we-recurring-select');

$(document).on('ready turbolinks:load', function (e) {

        $(document).on("focus", ".recurring_select", function() {
            return $(this).recurring_select('set_initial_values');
        });
        $(document).on("change", ".recurring_select", function() {
            return $(this).recurring_select('changed');
        });


    $.fn.recurring_select.options = {
        monthly: {
            show_week: [true, true, true, true, false, false] //display week 1, 2 .... Last
        },
        yearly: false
    }
});

import 'we-recurring-select/dist/css/main.css'

```

## Dev Installation
```shell
$ yarn install --production=false
  # or
$ yarn add -g chai coveralls docsify-cli karma karma-chai karma-cli karma-coverage karma-mocha karma-mocha-reporter karma-phantomjs-launcher karma-sinon karma-webpack mocha nyc phantomjs-prebuilt sinon standard webpack webpack-cli
$ yarn add @babel/core @babel/preset-env babel-loader
```
## Test
```shell
$ yarn run test
```
## Build
```shell
$ yarn run prod-build
```
## Report
```shell
$ yarn run coverage
```
## Collaboration Notes
A collaborator should always **FORK** the repo from the main master and fetch changes from the upstream repo before making pull requests. Please add unittests and documentation for any features added in the pull request.

## Troubleshooting
In case you get
* Cannot read property 'fn' of undefined
* jquery__WEBPACK_IMPORTED_MODULE_*** is not a function
* $(....).recurring_select is not a funcion

It very likely has to do with the context of $ / jQuery.
For me the trick was not to define  $ /jQuery / window.jQuery as a plugin in the environment.js of Rails

## Old files
The coffee and js files in src/coffee are the files from the original recurring projectd, https://github.com/GetJobber/recurring_select
For now they are included for reference, but they will eventually be removed

