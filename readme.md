# ImageZoomModule


## Generate tiles
Dev set up is using [this image](http://www-images.theonering.org/torwp/wp-content/uploads/2013/11/HDOS_TAPESTRY_Domestic.jpg) until the final scroll is completed by Liam.

1. Download image
2. Modify `tile_generator/generate.py:7&14` to point to the correct file
3. Navigate to `tile_generator`
4. Run `python generate.py`


## Work out point reference
Add this snippet at the bottom of `www/assets/js/deep-zoom.js`

```
viewer.addHandler('canvas-click', function (event) {
    var viewportPoint = viewer.viewport.pointFromPixel(event.position);
    console.log("x: " + viewportPoint.x);
    console.log("y: " + viewportPoint.y);
});
```