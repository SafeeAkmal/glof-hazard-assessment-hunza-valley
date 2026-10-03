"""Google Earth Engine authentication / initialization smoke test.

Usage:
    python -m src.glof.gee.auth --test

Acceptance criterion (Epic 0, US-0.3): returns a non-empty pixel array for a
known coordinate, confirming both `earthengine authenticate` has been run
and the active GCP project (if required by your EE account type) is
reachable.
"""
from __future__ import annotations

import argparse
import sys


def initialize_ee() -> None:
    """Authenticate and initialize the Earth Engine Python API.

    Raises whatever `ee` raises on failure — callers should not silently
    swallow auth errors, since every later GEE export depends on this
    succeeding.
    """
    import ee

    try:
        ee.Initialize()
    except Exception:
        ee.Authenticate()
        ee.Initialize()


def test_pixel_fetch() -> dict:
    """Pull a single pixel's value from a known, stable public image.

    Returns the sampled dictionary so callers (and tests) can assert on it.
    """
    import ee

    initialize_ee()
    point = ee.Geometry.Point([74.77, 36.47])  # Passu Glacier reference point, DEC-024
    image = ee.Image("COPERNICUS/DEM/GLO30").select("DEM")
    sample = image.sample(point, 30).first()
    if sample is None:
        raise RuntimeError("No sample returned — check AOI/collection availability.")
    return sample.getInfo()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--test", action="store_true", help="Run the pixel-fetch smoke test."
    )
    args = parser.parse_args()

    if args.test:
        result = test_pixel_fetch()
        print(result)
        if not result:
            print("FAILED: empty result", file=sys.stderr)
            return 1
        print("OK: Earth Engine authenticated and reachable.")
        return 0

    initialize_ee()
    print("OK: Earth Engine initialized.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
