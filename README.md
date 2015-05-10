# pointBreak
Library agnostic JS responsive design breakpoint detection / eventing. Only 873 bytes minified and gzipped!


## Usage

    // Listen to all breakpoint changes
    document.addEventListener('breakpointChange', function () {
        console.log('Current breakpoint: ' + pointBreak.get().key);
    }, true);


    // What is current breakpoint
    console.log('Current breakpoint is: ' + pointBreak.get());


    // Listen for a specific breakpoint change
    document.addEventListener('breakpointChange-desktop', function () {
        console.log('We\'re back to desktop size!');
    }, true);


    // Subscribe directly (chainable)
    var listener = function (evt) {
        console.log('Listener fired: ' + evt);
    };

    pointBreak
        .addListener(listener)
        .addListener(function (evt) {
            console.log('2.' + evt);
        });


    // Unsubscribe a listener (chainable)
    pointBreak.removeListener(listener);


## Global events

* breakpointChange-phone
* breakpointChange-minitablet
* breakpointChange-tablet
* breakpointChange-desktop
* breakpointChange-hddesktop


## Default breakpoints

* Phone: (max-width:767px)
* mini-tablet: (min-width:768px) and (max-width:979px)
* tablet: (min-width:980px) and (max-width:1023px)
* desktop: (min-width:1024px) and (max-width:1599px)
* hd-desktop: (min-width:1600px) and (max-width:99999px)


## Support
* All modern browsers
* IE9+