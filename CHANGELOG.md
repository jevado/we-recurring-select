# ChangeLog

## 0.1.2 (2021.04.16)
* picked up an abandoned yarn package and bumped the minor version https://yarnpkg.com/package/recurring-select

## 0.1.3 (2021.04.21)
* including images to the scss as DATA-uri

## 0.2.0 (2021.04.22)
* Turning the original repo into a more complete Yarn package
* Minor fix to display "Last" if 6 weeks are enabled in the monthly - select day of week
* Made jQuery and $ global via the webpack.config and removed the $ var from the recurring select dialog
* Removed the intitialization of the select box out of the code, this should happen in the application js

## 0.2.1 (2021.04.22)
* made sure that the prepare script runs the build-prod script
* removed the old package.json (_prev_package.json)
* expanded the package.json to include files and keywords

## 0.2.2 (2021.04.26)
* mostly been fiddeling with the scope of $, turned out the plugin settings in the webpack config where clashing with the one in Rails

## 0.2.3 (2021.04.26)
* added an option to disable yearly to the plugin ( only clientside )
* extended the documentation

## 0.2.4 (2021.04.26)
* FIX: accidentally the yearly option disabled a little bit too much of the popup

## 0.2.5 (2021.06.11)
* Providing the option to switch between languages instead of always in fr, en or any other locale
