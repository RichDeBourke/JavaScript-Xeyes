/*!
* javascript.xeyes.js
* jquery.xeyes-2.0.js Copyright 2014-2017 Felix Milea-Ciobanu
* javascript.xeyes.js Copyright 2023-2025 Rich DeBourke / SBF Consulting
*
* Licensed under MIT (https://github.com/RichDeBourke/JavaScript-Xeyes/blob/master/LICENSE)
*/

(function() {
    "use strict";

    const Xeyes = function(irises, padding, lastMouse) {
        this.init(irises, padding, lastMouse);
    };

    function Iris(irisEl) {
        this.iris = irisEl;
        this.width = this.iris.offsetWidth;
        this.height = this.iris.offsetHeight;
        this.offset = null;

        this.resetOffset = function() {
            const rect = this.iris.getBoundingClientRect();
            this.offset = {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
            };
        };
    }

    function Eye(irisEl) {
        this.eye = irisEl.parentElement;
        this.width = this.eye.clientWidth;
        this.height = this.eye.clientHeight;
        this.iris = new Iris(irisEl);
        this.padding = 0;

        // Calculate center position
        this.centerPos = {
            x: (this.width - this.iris.width) / 2,
            y: (this.height - this.iris.height) / 2
        };

        // Set initial position
        this.setIrisPosition(this.centerPos.x, this.centerPos.y);

        // Cache eye offset for better performance
        this.updateEyeOffset();
    }

    Eye.prototype.updateEyeOffset = function() {
        const rect = this.eye.getBoundingClientRect();
        this.eyeOffset = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY
        };
    };

    Eye.prototype.setIrisPosition = function(x, y) {
        this.iris.iris.style.left = x + "px";
        this.iris.iris.style.top = y + "px";
    };

    Eye.prototype.follow = function(mouseX, mouseY) {
        // Calculate relative mouse position to eye center
        const eyeCenterX = this.eyeOffset.x + this.width / 2;
        const eyeCenterY = this.eyeOffset.y + this.height / 2;

        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;

        // Early return if mouse is at center
        if (deltaX === 0 && deltaY === 0) {
            this.setIrisPosition(this.centerPos.x, this.centerPos.y);
            return;
        }

        // Calculate angle and maximum radius
        const angle = Math.atan2(deltaY, deltaX);
        const maxRadius = (Math.min(this.width, this.height) - Math.max(this.iris.width, this.iris.height)) / 2 - this.padding;

        // Calculate distance from center
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Constrain to maximum radius
        const constrainedDistance = Math.min(distance, maxRadius);

        // Calculate new position
        const newX = this.centerPos.x + Math.cos(angle) * constrainedDistance;
        const newY = this.centerPos.y + Math.sin(angle) * constrainedDistance;

        this.setIrisPosition(newX, newY);
    };

    Xeyes.prototype.init = function(irises, padding, lastMouse) {
        const eyes = [];
        let mousePos = {
            x: 0,
            y: 0
        };
        let animationFrame = null;
        let isScrolling = false;
        let scrollTimeout;

        // Create eye instances
        for (const irisEl of irises) {
            const eye = new Eye(irisEl);
            eye.padding = padding || 0;
            eyes.push(eye);
        }

        // Update function with requestAnimationFrame
        function updateEyes() {
            eyes.forEach(eye => eye.follow(mousePos.x, mousePos.y));
            animationFrame = null;
        }

        // Throttled scroll handler
        function handleScroll() {
            isScrolling = true;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Update eye offsets after scrolling stops
                eyes.forEach(eye => eye.updateEyeOffset());
                isScrolling = false;

                // Trigger an update if we have a mouse position
                if (mousePos.x !== 0 || mousePos.y !== 0) {
                    if (!animationFrame) {
                        animationFrame = requestAnimationFrame(updateEyes);
                    }
                }
            }, 100);
        }

        // Single mousemove listener
        function handleMouseMove(event) {
            mousePos.x = event.pageX;
            mousePos.y = event.pageY;

            // Skip updates while scrolling for better performance
            if (isScrolling) return;

            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateEyes);
            }
        }

        // Add event listeners
        window.addEventListener("mousemove", handleMouseMove, {
            passive: true
        });
        window.addEventListener("scroll", handleScroll, {
            passive: true
        });

        // Handle initial position if provided
        if (lastMouse && typeof lastMouse.x === 'number' && typeof lastMouse.y === 'number') {
            mousePos = {
                ...lastMouse
            };
            updateEyes();
        }

        // Store cleanup function
        this.cleanup = function() {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            clearTimeout(scrollTimeout);
        };
    };

    window.Xeyes = Xeyes;
}());