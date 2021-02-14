![Build Main Branch](https://github.com/bingzer/attributive.js/workflows/Build%20Main%20Branch/badge.svg)

# attributive.js

### What is it?
**attributive.js** is a library that uses element attributes to modify DOM elements.
It is an unobtrusive vanilla javascript library written in Typescript.

* A library (Not a framework)
* Plug N Play
* Extensible
* Self Documenting
* Complements other js library

### Concept
Let's say you have a 'partial.html' somewhere.
And you want to display it in a `<div>`.
Usually you would have to do (in jQuery sample or other similar Ajax code):
```
$.get('partial.html', function (data) {
  $('#container').html(data);
});
```
Using **attributive.js**, you would put `[data-partial]` to load the html:
```
<div data-partial="auto" data-url="partial.html">
  <!-- Content will be here after it's done loading -->
</div>
```
> `[data-partial]` is a built-in attribute in attributive.js that does Ajax functionality.


### Example

This is an example code how to create your own attribute that simply prints out `Hello World` or `Hello Mars` depending on the value of the attribute.
```
<html>

<body>
  <div data-hello="world"></div>
  <div data-hello="mars"></div>
</body>

<script src="attv.js"></script>

<script>

// Create an attribute called [data-hello-world]
Attv.register("data-hello", function (attr) {

    // Map "world" value to the attribute
    attr.map("world", function (value, element) {

        // insert the text Hello World to the element
        element.innerHTML = "Hello World";

    });

    // Map "world" value to the attribute
    attr.map("mars", function (value, element) {        

        // insert the text Hello World to the element
        element.innerHTML = "Hello Mars";
        
    });

});

</script>
</html>
```

During runtime you would have 

```
<html>
<body>
  <div data-hello="world">Hello World</div>
  <div data-hello="mars">Hello Mars</div>
</body>
</html>
```

### Build
First

```
npm install
gulp
```

When developing
```
gulp watch
```

Running tests
```
npm test
```

### Demo
Coming soon
