[![Main Branch](https://github.com/bingzer/attributive.js/workflows/Build%20Main%20Branch/badge.svg)](https://github.com/bingzer/attributive.js/actions)

# attributive.js

### What is this?
**attributive.js** is a library that uses HTML attributes to modify DOM elements.
It is an unobtrusive vanilla javascript library written in Typescript. It has no dependencies on other libraries.

It is:
* A library (Not a framework)
* Plug N Play
* Extensible
* Self Documenting
* Complements other js libraries

### Concept
Let's say you have a 'partial.html', that you want to display in a `div#container`.

Typically, you would write:
```
<script>
  // using fetch API
  fetch('partial.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('#container').innerHTML = data;
    });
    
  // or jquery
  $.get('partial.html', function (data) {
    $('#container').html(data);
  });
</script>
```
With **attributive.js**, you would add `[data-partial]` to the `div#container` to load the content without needing to write any javascript code:
```
<div id="container" data-partial="auto" data-url="partial.html">
  <!-- Content will be here after it's done loading -->
</div>
```
> Note that `[data-partial]` is a built-in attribute that handles Ajax.


### Example

This is an example code on how to create your own attribute using **attributive.js** that prints out `Hello World` or `Hello Mars` depending on the value of the attribute. In this example, we are creating `[data-hello]` attributes.

```
<html>

<body>
  <div data-hello="world"></div>
  <div data-hello="mars"></div>
</body>


<script src="attv.js"></script>

<script>

// Create an attribute called [data-hello]
Attv.register("data-hello", function (attr) {

    // Map "world" value to the attribute
    attr.map("world", function (value, element) {

        // set 'Hello World' to the element
        element.innerHTML = "Hello World 🌎";

    });

    // Map "mars" value to the attribute
    attr.map("mars", function (value, element) {        

        // set 'Hello Mars' to the element
        element.innerHTML = "Hello Mars 👽";
        
    });

});

</script>
</html>
```

During runtime you would have 

```
<html>
...
<body>
  <div data-hello="world">Hello World 🌎</div>
  <div data-hello="mars">Hello Mars 👽</div>
</body>
...
</html>
```

### Browser Supports

Should work with all modern browsers since it is a vanilla javascript code. Last time I tested this, it works with IE 11 (it will be dropped as soon as the world is ready to).

### Build
It is a Typescript project because I **like** having types in Javascript and arrow functions :). However, you can still develop your own code using Javascript code. In `tsconfig.json`, we are targeting `es5`.

I use Visual Studio Code to develop this but you can use your own IDE.

#### First load, clone the repository then

```
npm install
gulp
```

#### During coding/development
```
gulp watch
```
`gulp watch` watches all the typescript (\*.ts) files and transpile them into javascript (\*.js) files.


#### Running tests
```
npm test
```
This project uses Karma/Jasmine to run the tests

#### Playgrounds
This project has a playground sample area to showcase all the attributes. To run it, use [`http-server`](https://github.com/http-party/http-server#readme)
```
npm install -g http-server
http-server
```
Navigate to http://localhost:8080/playgrounds
> By default [http-server](https://github.com/http-party/http-server#readme) will run on port 8080. 

#### Building/Minify the JS
```
gulp
```
You should see `dist` directory will all the minified versions, js.map and d.ts files to distribute.


### Demo + Wiki
Soon
