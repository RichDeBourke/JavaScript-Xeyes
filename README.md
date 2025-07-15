# JavaScript Xeyes

Update of [Felixmc's jQuery xeyes](https://github.com/felixmc/jQuery-xeyes/blob/master/jquery.xeyes-2.0.js) plugin from jQuery to vanilla JavaScript.

I had been using Felix's plugin with Bootstrap 4, which also uses jQuery, but with the switch to Bootstrap 5, jQuery is no longer required, so it made sense to switch to a vanilla Xeyes plugin.

There is a TypeScript based Xeyes available that started as a conversion of [jQuery xeyes](https://github.com/felixmc/jQuery-xeyes/blob/master/jquery.xeyes-2.0.js) at [prantlf / web-xeyes ](https://github.com/prantlf/web-xeyes/tree/1ddb0a28e992f45988583c2c487584c69cd6065d).

## Demo

A demo of this JavaScript Xeyes is at [https://richdebourke.github.io/JavaScript-Xeyes/xeyes-demo.html](https://richdebourke.github.io/JavaScript-Xeyes/xeyes-demo.html).

## Usage

The plugin requires two block level elements, the eye and the iris and the associated CSS.

```html
<div id="eyes">
    <div class="eye left">
        <div class="iris"></div>
    </div>
    <div class="eye right">
        <div class="iris"></div>
    </div>
</div>
```


```css
.eye {
    width: 30px;
    height: 54px;
    background: #fff;
    border-radius: 50%;
    border: 2px solid #000;
    cursor: none;
    position: relative;
    top: 0;
    overflow: hidden;
}

.iris {
    width: 10px;
    height: 10px;
    background: #000;
    border-radius: 50%;
    border: 2px solid #000;
    position: absolute;
    top: 20px;
    left: 8px;
}
```

To initialize the plugin, call the js function on the `iris` elements:

```js
const irises = document.querySelectorAll(".iris");
const xeyes = new Xeyes(irises);
```

The plugin will use the immediate parents as the `eyeball` elements. 

## Configuration

While the [original jQuery xeyes](https://github.com/felixmc/jQuery-xeyes/blob/master/jquery.xeyes-2.0.js) plugin had options for padding, iris starting position, reset, trigger window, and radius, I only included the option for padding.

## Updates

**2025/07/15** Enhanced the JavaScript based on a AI review.
