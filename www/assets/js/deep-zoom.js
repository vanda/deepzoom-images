/*jslint browser: true*/
/*global $, jQuery, OpenSeadragon*/

// Begin some useful functions...

function open_infobox(point_id) {
    var point_bullet = $(window.point_list[point_id]);
    $('.infobox h1').text(point_bullet.find('h3').text());
    $('.infobox__insertedhtml').html(point_bullet.find('.point_data__content').html());
    $('.infobox').fadeIn("fast", function () {
        $(this).addClass('show');
    });
}

function close_infobox() {
    // Slightly hacky way of stoping vimeo
    $('.point_data__vimeo').each(function() {
        var vi = $(this),
            vidsrc = vi.attr('src');
        vi.attr('src','');
        vi.attr('src', vidsrc);
    });
    
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

function get_querystring_value(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Only kick this off if there is point_data on the page...
if( $('.point_data').length ) {
    
    // Set up vars
    var point_list = $('.point_data'),
        dzi_location = point_list.attr('data-dzi'),
        osd_container = point_list.attr('data-osd_box_id'),
        overlay = true,
        point_overlays = [],
        viewer,
        data,
        i;
    
    // And away we go...
    $('body').removeClass('js-off').addClass('js-on');
    
    // Create OSD container
    $('<div></div>', {
        'class': 'osd'
    }).append($('<div></div>',{
        'class': 'osd__container',
        'id': osd_container
    })).insertBefore(point_list);
    
    $('<p></p>', {
        'class': 'osd__instruction',
        'html': '<a href="#" class="more osd_btn_full_screen">View full screen</a> <a href="#" class="more osd_btn_show_hide_pins">Hide the pins</a>'
    }).insertAfter('.osd__container');
    
    $('<p></p>', {
        'class': 'osd__instruction',
        'text': 'Scroll left and right to explore the building project over the last year, zoom in and out to see the detail.'
    }).insertAfter('.osd__container');
    
    // Create overlay container
    $('<div></div>', {
        'class': 'infobox'
    }).append($('<div></div>', {
        'class': 'infobox__middle'
    }).append($('<div></div>', {
        'class': 'infobox__content',
        'html': '<a href="#" class="infobox__btnclose btn right">Close</a><h1 class="infobox__title"></h1><div class="infobox__insertedhtml"></div>'
    }))).appendTo('.osd__container');
    
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
        id: osd_container,
        tileSources: dzi_location,
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
    
    if( get_querystring_value('builder') === 'true' ) {
        $('<div></div>', {
            'class': 'osd_coord_tester pane'
        }).append($('<h3></h3>', {
            'text': 'Deep Zoom Coords'
        })).insertAfter('.osd__container');
        
        $('<p></p>', {
            'class': 'osd_coord_tester__x',
            'text': 'x:'
        }).appendTo('.osd_coord_tester');
        
        $('<p></p>', {
            'class': 'osd_coord_tester__y',
            'text': 'y:'
        }).appendTo('.osd_coord_tester');
        
        viewer.addHandler('canvas-click', function (event) {
            var viewportPoint = viewer.viewport.pointFromPixel(event.position);
            $('.osd_coord_tester__x').text("x: " + viewportPoint.x);
            $('.osd_coord_tester__y').text("y: " + viewportPoint.y);
        });
    }

}