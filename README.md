[![Build Status](https://travis-ci.org/dakolech/angular-unit-testing-helpers.svg?branch=master)](https://travis-ci.org/dakolech/angular-unit-testing-helpers)

# Angular Unit Testing Helpers

## Table of Contents

  - [Why?](#why)
  - [Installation](#installation)
  - [Services](#services)
    - [Injecting a real service](#injecting-a-real-service)
  - [Controllers](#controllers)
  - [Directives](#directivs)

## Why?
I've created this package to simplify unit testing in AngularJS apps. I had enough of writing repeated code. For every spec (controller, directive, service) I had to write the same injector and compile blocks of code, for every mocked service I had to write the same lines. With this package everything becomes a easier and faster.

## Installation:

  1. Download package:

  ```
  npm install angular-unit-testing-helpers
  ```

  1. Inject it to `karma.conf.js`

  ```javascript
  files: [
    'node_modules/angular-unit-testing-helpers/test-helpers.js',
    ...
  ],
  ```


# Services

### Injecting a real service

  Instead of injecting $injector, like this:

  ```javascript
    beforeEach(inject(function($injector) {
      someService = $injector.get('someService');
    }));
  ```

  You can do the same with `TestServ`:

  ```javascript
    beforeEach(function() {
      someService = new TestServ('someService');
    });
  ```

  Of course you have to inject module where service is defined.
**[Back to top](#table-of-contents)**
