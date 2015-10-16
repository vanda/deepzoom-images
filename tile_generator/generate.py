#!/usr/bin/env python
# -*- coding: utf-8 -*-

import deepzoom

# Specify your source image
SOURCE = "final-sansbutton.jpg"

# Create Deep Zoom Image creator with weird parameters
creator = deepzoom.ImageCreator(tile_size=256, tile_overlap=2, tile_format="png",
                                image_quality=0.8, resize_filter="bicubic")

# Create Deep Zoom image pyramid from source
creator.create(SOURCE, "../www/assets/tiles/scroll.dzi")