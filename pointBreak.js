!(function (win, doc, exportName, undefined) {
    'use strict';

    var eventListeners = [],
        pointBreak, breakPoints, style, css, key;


    // Does useragent support RD?
    if (!win.matchMedia) {
        win.console.log('matchMedia unsupported. Quitting.');
        return;
    }


    // Breakpoints
    breakPoints = {
        'none': {
            'rule': '(max-width:0px)'
        },
        'phone': {
            'rule': '(max-width:767px)'
        },
        'mini-tablet': {
            'rule': '(min-width:768px) and (max-width:979px)'
        },
        'tablet': {
            'rule': '(min-width:980px) and (max-width:1023px)'
        },
        'desktop': {
            'rule': '(min-width:1024px) and (max-width:1599px)'
        },
        'hd-desktop': {
            'rule': '(min-width:1600px) and (max-width:99999px)'
        }
    };


    css = 'body:after{content:"desktop";position:fixed;top:-999%}';
    for (key in breakPoints) {
        css += '@media ' + breakPoints[key].rule + '{body:after{content:"' + key + '"}}'
    }


    // Inject suppport CSS
    style = doc.createElement('style');
    style.innerHTML = css;
    doc.body.appendChild(style);


    // Shorthand querySelectorAll
    function q$(selector) {
        return Array.prototype.slice.call(doc.querySelectorAll(selector), 0);
    }


    // Add breakpoint change event listener
    function addListener(listener) {
        eventListeners.push(listener);
        return pointBreak;
    }


    // Remove breakpoint change event listener
    function removeListener(listener) {
        var i, j;

        for (i = 0, j = eventListeners.length; i < j; i++){
            if (eventListeners[i] === listener){
                eventListeners.splice(i, 1);
            }
        }

        return pointBreak;
    }


    // Fire subscribed breakpoint change event listeners
    function fireEventListeners(arg) {
        var i, j;

        for (i = 0, j = eventListeners.length; i < j; i++) {
            eventListeners[i].apply(null, [arg]);
        }
    }


    // Return current breakpoints
    function getBreakpoints() {
        return breakPoints;
    }


    // Update breakpoints
    function setBreakpoints(bpObj) {
        breakPoints = bpObj;
        return pointBreak;
    }


    // Fire custom event
    function triggerDOMEvent(eventName, el) {
        var event;

        el = el || doc;

        if (doc.createEvent) {
            event = doc.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true );
            !el.dispatchEvent(event);
        } else {
            event = doc.createEventObject();
            el.fireEvent('on' + eventName.toLowerCase(), event);
        }

        return pointBreak;
    }

    // Return current breakpoint based on hidden body:after CSS pseudo element content value
    function getCurrentBreakPoint() {
        var key = 'desktop',
            tKey;

        if (win.getComputedStyle) {
            tKey = win.getComputedStyle(doc.body, ':after').getPropertyValue('content').replace( /"/g,'');
        }

        if (tKey) {
            key = tKey;
        }

        return {
            'key': key,
            'rule': breakPoints[key].rule
        };
    }


    // Broadcast breakpoint change to event subscribers and global obj
    function triggerBreakPointChange(breakpoint) {
        if (! breakPoints[breakpoint]) {
            console.log('pointBreak error: no such breakpoint "' + breakpoint + '"');
            return;
        }

        fireEventListeners(breakpoint);
        triggerDOMEvent('breakpointChange', doc);
        triggerDOMEvent('breakpointChange-' + breakpoint.replace('-', ''), doc);
        console.log('breakpointChange-' + breakpoint.replace('-', ''));
    }


    // Force fire breakpoint events
    function trigger() {
        triggerBreakPointChange(getCurrentBreakPoint().key);
        return pointBreak;
    }


    // Add listeners for breakpoint changes
    if (win.matchMedia('all').addListener) {
        for (key in breakPoints) {
            win.matchMedia(breakPoints[key].rule).addListener(trigger);
        }
    }

    // Paint initial state
    trigger();


    // PUBLIC API
    pointBreak = {
        addListener     : addListener,
        breakpoints     : getBreakpoints,
        current         : getCurrentBreakPoint,
        get             : getCurrentBreakPoint,
        getBreakpoints  : getBreakpoints,
        removeListener  : removeListener,
        set             : setBreakpoints,
        trigger         : trigger
    };


    // Share public API
    if (typeof define == 'function' && define.amd) {
        define(function() {
            return pointBreak;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = pointBreak;
    } else {
        win[exportName] = pointBreak;
    }
} (window, document, 'pointBreak'));