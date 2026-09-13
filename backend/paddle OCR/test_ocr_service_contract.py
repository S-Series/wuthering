"""Exercise the full response assembly with a fake predictor, not an accuracy test."""
import importlib
import sys
import types
import unittest
import io
import json
from unittest.mock import patch

from PIL import Image


class ServiceContractTests(unittest.TestCase):
    def test_region_ids_survive_a_missing_row(self):
        image = Image.new("RGB", (820, 600), (20, 24, 30))
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        bands = [{"index": i-1, "top": 16+i*64, "bottom": 48+i*64} for i in range(8)]
        metadata = {"version": 1, "width": 820, "height": 600, "bands": bands, "icon": [20,20,35,35]}
        lines = []
        for band in bands:
            if band["index"] == 3:
                continue
            y = (band["top"] + band["bottom"]) / 2
            lines.append([[[20, y-5], [180, y-5], [180, y+5], [20, y+5]], ("COST 3" if band["index"] == -1 else "ATK 7.1%", 0.99)])
        fake = types.ModuleType("ocr_engine")
        fake.get_ocr = lambda lang: types.SimpleNamespace(ocr=lambda image, cls: [lines])
        with patch.dict(sys.modules, {"ocr_engine": fake}):
            sys.modules.pop("ocr_service", None)
            service = importlib.import_module("ocr_service")
            try:
                result = service.analyze_image(buffer.getvalue(), "en", json.dumps(metadata))
                self.assertTrue(result["success"])
                self.assertEqual(result["vision"]["version"], 1)
                rows = result["vision"]["rows"]
                self.assertEqual([row["index"] for row in rows], list(range(7)))
                self.assertEqual(rows[3]["tokens"], [])
                self.assertEqual(rows[4]["tokens"][0]["text"], "ATK 7.1%")
                self.assertIn("COST 3", result["texts"])
                self.assertTrue(result["image_base64"])
                self.assertIsNone(service.analyze_image(buffer.getvalue(), "en")["vision"])
                metadata["width"] = 819
                with self.assertRaises(ValueError):
                    service.analyze_image(buffer.getvalue(), "en", json.dumps(metadata))
                metadata["width"] = 820
                metadata["bands"][3]["top"] = -1
                with self.assertRaises(ValueError):
                    service.analyze_image(buffer.getvalue(), "en", json.dumps(metadata))
            finally:
                sys.modules.pop("ocr_service", None)


if __name__ == "__main__":
    unittest.main()
