![Version](https://img.shields.io/npm/v/<module-name>.svg)
![License](https://img.shields.io/npm/l/<module-name>.svg)
![Coverage](https://img.shields.io/coveralls/github/<user-name>/<repo-name>.svg)
# we-recurring-select
_Slightly adjusted Yarn version of recurring_select gem by GetJobber_
<table>
  <tbody>
    <tr>
      <td><b>Downloads</b></td>
      <td><a href="https://www.npmjs.com/package/<module-name>">https://www.npmjs.com/package/<module-name></a></td>
    </tr>
    <tr>
      <td><b>Source</b></td>
      <td><a href="https://github.com/<user-name>/<repo-name>">https://github.com/<user-name>/<repo-name></a></td>
    </tr>
    <tr>
      <td><b>Documentation</b></td>
      <td><a href="https://<user-name>.github.io/<repo-name>">https://<user-name>.github.io/<repo-name>/</a></td>
    </tr>
  </tbody>
</table>

## Intro
WARNING:

Documentation is mostly a placeholder and not completely updated yet.

Tests are not written yet, this really is a plugin in flux right now

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
How to import and use each class or function in the module...

```javascript
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
```

## Dev Installation
```shell
$ npm install --only=dev 
  # or
$ npm install -g chai coveralls docsify-cli karma karma-chai karma-cli karma-coverage karma-mocha karma-mocha-reporter karma-phantomjs-launcher karma-sinon karma-webpack mocha nyc phantomjs-prebuilt sinon standard webpack webpack-cli
$ npm install @babel/core @babel/preset-env babel-loader 
```
## Test
```shell
$ npm test
```
## Build
```shell
$ npm run build
```
## Report
```shell
$ npm run coverage
```
## Collaboration Notes
A collaborator should always **FORK** the repo from the main master and fetch changes from the upstream repo before making pull requests. Please add unittests and documentation for any features added in the pull request.

## Old files
The coffee and js files in src/coffee are the files from the original recurring projectd, https://github.com/GetJobber/recurring_select
For now they are included for reference, but they will eventually be removed