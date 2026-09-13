import unittest

import numpy as np
from PIL import Image

from build_vision_assets import PROFILES
from echo_vision import locate_panel, make_atlas, match_harmony
from image_processing import load_rgb_image, preprocess_image


class EchoVisionTests(unittest.TestCase):
    def test_blank_and_noise_are_not_panels(self):
        self.assertIsNone(locate_panel(Image.new("RGB", (1920, 1080), "black")))
        self.assertIsNone(locate_panel(Image.new("RGB", (205, 190), "white")))
        noise = np.random.default_rng(42).integers(0, 256, (190, 205, 3), dtype=np.uint8)
        self.assertIsNone(locate_panel(Image.fromarray(noise)))
        self.assertIsNone(match_harmony(Image.new("RGB", (32, 32), "black")))

    def test_preprocessing_does_not_recrop_large_panels(self):
        image = Image.new("RGB", (820, 760))
        self.assertEqual(preprocess_image(image).size, image.size)

    def test_reference_geometry(self):
        if not all(profile[1].exists() for profile in PROFILES):
            self.skipTest("Local reference screenshots unavailable")
        for name, path, display, _, _, centers, _ in PROFILES:
            with self.subTest(profile=name):
                with Image.open(path) as source:
                    image = source.convert("RGB")
                layout = locate_panel(image)
                self.assertIsNotNone(layout)
                self.assertEqual(len(layout["rows"]), 7)
                for box, center in zip(layout["rows"], centers):
                    expected = center * image.height / display[1]
                    self.assertLess(box[1], expected)
                    self.assertGreater(box[3], expected)
                atlas, bands = make_atlas(image, layout)
                self.assertEqual([b["index"] for b in bands], list(range(-1, 7)))
                self.assertLessEqual(atlas.width, 840)
                self.assertTrue(all(bands[i]["bottom"] < bands[i+1]["top"] for i in range(7)))

    def test_remaining_wide_references(self):
        from build_vision_assets import RECORD
        stamps = ["21.52.55.92", "21.52.28.00", "21.52.03.23", "21.51.54.78", "21.51.15.82", "21.48.59.51"]
        paths = [RECORD / f"Wuthering Waves Screenshot 2026.09.12 - {stamp}.png" for stamp in stamps]
        if not all(path.exists() for path in paths):
            self.skipTest("Local reference screenshots unavailable")
        for path in paths:
            with self.subTest(image=path.name), Image.open(path) as image:
                layout = locate_panel(image)
                self.assertIsNotNone(layout)
                for box, center in zip(layout["rows"], [199, 228, 258, 286, 314, 342, 370]):
                    self.assertLess(box[1], center * 1.25)
                    self.assertGreater(box[3], center * 1.25)

    def test_large_already_cropped_reference(self):
        path = PROFILES[-1][1]
        if not path.exists():
            self.skipTest("Local reference unavailable")
        with Image.open(path) as source:
            image = source.resize((820, 760))
        layout = locate_panel(image)
        self.assertIsNotNone(layout)
        self.assertEqual(layout["profile"], "panel")
        self.assertLess(layout["box"][0], 40)
        self.assertGreater(layout["box"][2], 760)

    def test_invalid_image_rejected(self):
        with self.assertRaises(Exception):
            load_rgb_image(b"not an image")


if __name__ == "__main__":
    unittest.main()
