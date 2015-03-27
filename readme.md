# ImageZoomModule


## Generate tiles
Dev set up is using [this image](http://www-images.theonering.org/torwp/wp-content/uploads/2013/11/HDOS_TAPESTRY_Domestic.jpg) until the final scroll is completed by Liam.

1. Download image
2. Modify `tile_generator/generate.py:7&14` to point to the correct file
3. Navigate to `tile_generator`
4. Run `python generate.py`


## Creation of the DeepZoom

Include the JS and CSS on the page

Create a bulleted list with this `ul`

```
<ul class="point_data" data-dzi="/assets/tiles/scroll.dzi" data-osd_box_id="osd_liam">
```

Set up each `li` as follows:

```
<li data-point_x="0.375044972015069", data-point_y="0.02152184223721047">
	<h3>Point Name</h3>
	<p class="point_data__date">23 October 2014</p>
	<div class="point_data__content">
		<iframe class="point_data__vimeo" src="https://player.vimeo.com/video/106610828" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
		<h4>Transcript</h4>
		<p>[Background music]</p>
	</div>
</li>
```

The Deep Zoom will appear above it.

## Work out point coordinates

Add `?builder=true` to the query string

