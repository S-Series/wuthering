"""Batch transport contract tests; the predictor is mocked, not an accuracy test."""
import asyncio
import importlib
import io
import sys
import types
import unittest
from unittest.mock import patch
from fastapi import UploadFile
from PIL import Image
import image_processing  # Load native modules before patch.dict restores sys.modules.
import echo_vision


class BatchTests(unittest.TestCase):
    def test_order_empty_and_failure_preserve_slots(self):
        buffer = io.BytesIO()
        Image.new("RGB", (100, 30)).save(buffer, format="PNG")
        calls = []

        def predict(image, cls):
            calls.append(image.shape)
            if len(calls) == 3:
                return [None]
            if len(calls) == 5:
                raise RuntimeError("fake failure")
            return [[[[[1, 1], [10, 1], [10, 10], [1, 10]], ("ATK 7.1%", 0.99)]]]

        fake = types.ModuleType("ocr_engine")
        fake.get_ocr = lambda lang: types.SimpleNamespace(ocr=predict)
        with patch.dict(sys.modules, {"ocr_engine": fake}):
            sys.modules.pop("ocr_service", None)
            service = importlib.import_module("ocr_service")
            try:
                files = [UploadFile(filename=f"{id}.png", file=io.BytesIO(buffer.getvalue())) for id in reversed(service.REGION_IDS)]
                response = asyncio.run(service.run_ocr_batch(files, "en"))
                regions = response["regions"]
                self.assertEqual([r["id"] for r in regions], list(service.REGION_IDS))
                self.assertEqual(len(calls), 9)
                self.assertEqual(regions[2]["texts"], [])
                self.assertTrue(regions[2]["success"])
                self.assertFalse(regions[4]["success"])
                self.assertEqual(regions[5]["texts"], ["ATK 7.1%"])
                with self.assertRaises(ValueError):
                    asyncio.run(service.run_ocr_batch(files[:8], "en"))
                duplicates = [UploadFile(filename="name.png", file=io.BytesIO(buffer.getvalue())) for _ in range(9)]
                with self.assertRaises(ValueError):
                    asyncio.run(service.run_ocr_batch(duplicates, "en"))
                for file in files + duplicates:
                    file.file.close()
            finally:
                sys.modules.pop("ocr_service", None)


if __name__ == "__main__":
    unittest.main()
