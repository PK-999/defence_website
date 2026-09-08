#!/usr/bin/env python3
"""Create a small, deterministic orientation map from the reviewed source geometry.

This keeps every source feature and property while reducing coordinate detail. It is
intended for the checked-in public asset, not for operational or survey-grade use.
"""

import json
import math
import sys
from pathlib import Path


def rdp(points, tolerance):
    if len(points) <= 2:
        return points
    x1, y1 = points[0]
    x2, y2 = points[-1]
    dx, dy = x2 - x1, y2 - y1
    denominator = math.hypot(dx, dy)
    furthest_distance = -1.0
    furthest_index = 0
    for index, (x, y) in enumerate(points[1:-1], 1):
        distance = (
            abs(dy * x - dx * y + x2 * y1 - y2 * x1) / denominator
            if denominator
            else math.hypot(x - x1, y - y1)
        )
        if distance > furthest_distance:
            furthest_distance, furthest_index = distance, index
    if furthest_distance > tolerance:
        left = rdp(points[: furthest_index + 1], tolerance)
        right = rdp(points[furthest_index:], tolerance)
        return left[:-1] + right
    return [points[0], points[-1]]


def simplify_ring(ring, tolerance):
    points = ring[:-1] if len(ring) > 1 and ring[0] == ring[-1] else ring
    simplified = rdp(points, tolerance)
    if len(simplified) < 3:
        simplified = points[:3]
    return simplified + [simplified[0]]


def simplify_geometry(geometry, tolerance):
    if not geometry:
        return geometry
    coordinates = geometry["coordinates"]
    if geometry["type"] == "Polygon":
        coordinates = [simplify_ring(ring, tolerance) for ring in coordinates]
    elif geometry["type"] == "MultiPolygon":
        coordinates = [[simplify_ring(ring, tolerance) for ring in polygon] for polygon in coordinates]
    else:
        raise ValueError(f"Unsupported geometry type: {geometry['type']}")
    return {**geometry, "coordinates": coordinates}


def main():
    source = Path(sys.argv[1] if len(sys.argv) > 1 else "public/india-states.geojson")
    tolerance = float(sys.argv[2] if len(sys.argv) > 2 else "0.01")
    data = json.loads(source.read_text())
    simplified = {
        **data,
        "features": [
            {**feature, "geometry": simplify_geometry(feature.get("geometry"), tolerance)}
            for feature in data["features"]
        ],
    }
    source.write_text(json.dumps(simplified, separators=(",", ":")) + "\n")
    print(f"wrote {source} ({source.stat().st_size} bytes; tolerance={tolerance})")


if __name__ == "__main__":
    main()
