/*!
 * javascript.xeyes.js
 * jquery.xeyes-2.0.js Copyright 2014-2017 Felix Milea-Ciobanu
 * javascript.xeyes.js Copyright 2023 Rich DeBourke / SBF Consulting
 *
 * Licensed under MIT (https://github.com/RichDeBourke/JavaScript-Xeyes/blob/master/LICENSE)
 */

(function() {
    "use strict";

    const Xeyes = function(irises, padding = 0) {
        this.init(irises, padding);
    };

    function Iris(irisEl) {
        this.iris = irisEl;

        this.width = this.iris.offsetWidth;
        this.height = this.iris.offsetHeight;

        this.resetOffset = function() {
            let offset = this.iris.getBoundingClientRect();
            this.offset = {
                x: offset.left + window.scrollX,
                y: offset.top + window.scrollY
            };
        };
    }

    function Eye(irisEl) {
        this.eye = irisEl.parentElement;

        this.width = this.eye.clientWidth;
        this.height = this.eye.clientHeight;

        this.iris = new Iris(irisEl);

        this.pos = {
            x: (this.width - this.iris.width) / 2,
            y: (this.height - this.iris.height) / 2
        };

        irisEl.style.setProperty("left", this.pos.x + "px");
        irisEl.style.setProperty("top", this.pos.y + "px");
    }

    Eye.prototype.follow = function(mouse) {
        mouse.x = mouse.x - this.pos.x;
        mouse.y = mouse.y - this.pos.y;

        this.iris.resetOffset();

        const degree = Math.atan((mouse.y - this.iris.offset.y) / (mouse.x - this.iris.offset.x));
        const direction = (this.iris.offset.x > mouse.x) ? -1 : 1;
        const newX = Math.cos(degree) * ((this.width - this.iris.width) / 2 - this.padding) * direction;
        const newY = Math.sin(degree) * ((this.height - this.iris.height) / 2 - this.padding) * direction;
        const radius = Math.sqrt(Math.pow(newX, 2) + Math.pow(newY, 2));
        const distance = Math.sqrt(Math.pow(mouse.y - this.iris.offset.y, 2) + Math.pow(mouse.x - this.iris.offset.x, 2));

        if (radius > distance) {
            this.iris.iris.style.setProperty("left", (mouse.x - this.iris.offset.x + this.pos.x) + "px");
            this.iris.iris.style.setProperty("top", (mouse.y - this.iris.offset.y + this.pos.y) + "px");
        } else {
            this.iris.iris.style.setProperty("left", this.pos.x + newX + "px");
            this.iris.iris.style.setProperty("top", this.pos.y + newY + "px");
        }
    };

    Xeyes.prototype.init = function(irises, padding) {

        for (const irisEl of irises) {
            const eye = new Eye(irisEl);
            eye.padding = padding;

            eye.iris.iris.style.setProperty("left", eye.pos.x + "px");
            eye.iris.iris.style.setProperty("top", eye.pos.y + "px");

            window.addEventListener("mousemove", function(event) {
                eye.follow({
                    x: event.pageX,
                    y: event.pageY
                });
            });
        }

    };
    window.Xeyes = Xeyes;
}());