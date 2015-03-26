/*jslint browser: true*/
/*global $, jQuery, OpenSeadragon*/

// Begin some useful functions...

function open_infobox(point_id) {
    var point_bullet = $(window.point_list[point_id]);
    $('.infobox h1').text(point_bullet.find('h3').text());
    $('.infobox__insertedhtml').html(point_bullet.find('.content').html());
    $('.infobox').fadeIn("fast", function () {
        $(this).addClass('show');
    });
}

function close_infobox() {
    $('.infobox').fadeOut("fast", function () {
        $(this).removeClass('show');
    });
}

jQuery.fn.extend({
    toggleText: function (a, b) {
        var that = this;
        if (that.text() !== a && that.text() !== b) {
            that.text(a);
        } else if (that.text() === a) {
            that.text(b);
        } else if (that.text() === b) {
            that.text(a);
        }
        return this;
    }
});

// Set up vars

var overlay = true,
    point_overlays = [],
    viewer,
    data,
    i;

// And away we go...

$('body').removeClass('js-off').addClass('js-on');

// Create pins from points
window.point_list = $('.point_data li');
window.point_list.each(function (i) {
    data = {
        id: 'point' + i,
        x: $(this).data('point_x'),
        y: $(this).data('point_y'),
        width: 0.01,
        height: 0.01,
        className: 'pin'
    };
    point_overlays.push(data);
});

viewer = new OpenSeadragon({
    id: "osd_liam",
    prefixUrl: "assets/images/",
    tileSources: "/assets/tiles/scroll.dzi",
    defaultZoomLevel: 2.7,
    minZoomLevel: 2.7,
    visibilityRatio: 1, // Ensure image stays in the viewpoint
    zoomPerClick: 1, // Click will not trigger zoom
    showNavigationControl: false,
    springStiffness: 5.0,
    constrainDuringPan: true,
    overlays: point_overlays
});

viewer.addHandler('open', function () {

    // Needs a brief delay otherwise doesn't recognise OpenSeaDragon
    setTimeout(function () {
        var point_id;

        // Pan to start of the scroll
        viewer.viewport.panTo(new OpenSeadragon.Point(0.2, 0.091));

        // Add a tracker to each pin on the map
        for (i = 0; i < window.point_list.length; i = i + 1) {
            new OpenSeadragon.MouseTracker({
                element: 'point' + i,
                clickHandler: function (e) {
                    point_id = e.eventSource.element.id.replace('point', '');
                    open_infobox(point_id);
                }
            });
        }

        // Go full screen
        $('.osd_btn_full_screen').click(function (e) {
            e.preventDefault();
            viewer.setFullScreen(1);
        });

        // Show hide the overlays
        $('.osd_btn_show_hide_pins').click(function (e) {
            e.preventDefault();
            $('.pin').toggleClass('pin__hidden');
            $(this).toggleText('Show the pins', 'Hide the pins');
        });

    }, 500);

});

// On click of the bulleted list pan & zoom to the relevant area
$('.point_data li').click(function (e) {
    e.preventDefault();
    viewer.viewport.panTo(new OpenSeadragon.Point($(this).data('point_x'), $(this).data('point_y')));
    viewer.viewport.zoomTo(7);
});

$('.infobox__btnclose, .infobox').click(function (e) {
    e.preventDefault();
    close_infobox();
});

// If we click inside the the infobox content we don't want the info box to close
$(".infobox .infobox__content").click(function(e) {
    e.stopPropagation();
});

// Events on key presses
$(document).keyup(function (e) {
    // 27: ESC
    if (e.keyCode === 27) { close_infobox(); }
});