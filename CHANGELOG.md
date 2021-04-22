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
