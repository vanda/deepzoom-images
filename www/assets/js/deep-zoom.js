$('body').removeClass('js-off').addClass('js-on');

// Create pins from points
point_overlays = [];
var point_list = $('.point_data li');
point_list.each(function(i, li) {
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

// Pan to start of the scroll
// Needs a second delay otherwise doesn't recognise OpenSeaDragon
setTimeout(function () {
	viewer.viewport.panTo(new OpenSeadragon.Point(0.2,0.0573));
}, 1000);

$('.pin').live( 'click', function(e) {
    pin_id = $(this).attr('id').replace('point','');
    var point_bullet = $(point_list[pin_id]);
    $('.infobox h1').text(point_bullet.find('h3').text());
    $('.infobox__insertedhtml').html(point_bullet.find('.content').html());
    $('.infobox').fadeIn("fast");
});

$('.infobox__btnclose, .infobox').click(function(e) {
    $('.infobox').fadeOut("fast");
});

// TODO: Do not let into production

viewer.addHandler('canvas-click', function (event)
{
    var viewportPoint = viewer.viewport.pointFromPixel(event.position);
    console.log("x: " + viewportPoint.x);
    console.log("y: " + viewportPoint.y);
});