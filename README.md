[![Build Status](https://travis-ci.org/bingzer/attributive.js.svg?branch=master)](https://travis-ci.org/bingzer/attributive.js)

# attributive.js
An unobtrusive vanilla javascript library.

* Not a framework
* A library
* Plug N Play
* Extensible
* Self Documenting

# What is it?
A library that uses attributes to modify
DOM behavior.

# Concept
Let's say you have a 'partial.html' somewhere.
And you want to display it in a `<div>`.
Usually you would have to do (in jQuery sample or other similar Ajax code):
```
$.get('partial.html', function (data) {
  $('#container').html(data);
});
```
Using **attributive.js**, you can simply put `[data-partial]` to load the html:
```
<div data-partial="auto" data-url="partial.html">
  <!-- Content will be here after it's done loading -->
</div>
```
`[data-partial]` is a built-in attribute in attributive.js that does Ajax functionality.

The purpose of **attributive.js** is to eliminate a boilerplate and repetitive javascript code by using html attributes.

# Demo
[https://bingzer.github.io/attributive.js/](https://bingzer.github.io/attributive.js/)
