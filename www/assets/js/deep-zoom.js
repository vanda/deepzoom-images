$('body').removeClass('js-off').addClass('js-on');
	
// Create pins from points
var point_overlays = [];
window.point_list = $('.point_data li');
window.point_list.each(function(i, li) {
	d = {
		id: 'point' + i,
        x: $(this).data('point_x'), 
        y: $(this).data('point_y'), 
        width: 0.01,
        height: 0.01,
        className: 'pin'
	};
    point_overlays.push(d);
});

var viewer = OpenSeadragon({
    id: "osd_liam",
    prefixUrl: "assets/images/",
    tileSources: "/assets/tiles/landscape.dzi",
	defaultZoomLevel: 4.3,
	minZoomLevel: 4.3,
	visibilityRatio: 1, // Ensure image stays in the viewpoint
	zoomPerClick: 1, // Click will not trigger zoom
	showNavigationControl: false,
	springStiffness: 5.0,
	constrainDuringPan: true,
    overlays: point_overlays
});

viewer.addHandler('open', function() {
	
	// Needs a brief delay otherwise doesn't recognise OpenSeaDragon
	setTimeout(function () {
		
		// Pan to start of the scroll
		viewer.viewport.panTo(new OpenSeadragon.Point(0.2,0.0573));
		
		// Add a tracker to each pin on the map
		for (var i = 0; i < window.point_list.length; i++) {
		    new OpenSeadragon.MouseTracker({
			    element: 'point' + i,
			    clickHandler: function(e) {
				    point_id = e.eventSource.element.id.replace('point', '');
				    open_overlay(point_id);
				}
		    });
		}
		
		// Go full screen
		$('.osd_btn_full_screen').click( function(e) {
			e.preventDefault();
			viewer.setFullScreen(1);
		});
		
	}, 100);
});

function open_overlay(point_id) {
	var point_bullet = $(window.point_list[point_id]);
    $('.infobox h1').text(point_bullet.find('h3').text());
    $('.infobox__insertedhtml').html(point_bullet.find('.content').html());
    $('.infobox').fadeIn("fast");
}

$('.infobox__btnclose, .infobox').click(function(e) {
    $('.infobox').fadeOut("fast");
});