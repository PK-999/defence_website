import json
import struct
import math
import os
from PIL import Image

def build_3d_emblem_glb(image_path, output_glb_path, max_depth=0.28):
    print(f"Generating true 3D GLB from {image_path} -> {output_glb_path}...")
    img = Image.open(image_path).convert('RGB')
    
    # 128x128 resolution gives ~16,000 vertices and ~32,000 triangles
    # Ultra-smooth 60fps on mobile/desktop with gorgeous depth
    grid_size = 128
    img_small = img.resize((grid_size, grid_size), Image.Resampling.LANCZOS)
    pixels = img_small.load()
    
    scale_xy = 1.8 # 1.8m bounding box
    step = scale_xy / (grid_size - 1)
    
    heights = [[0.0 for _ in range(grid_size)] for _ in range(grid_size)]
    mask = [[False for _ in range(grid_size)] for _ in range(grid_size)]
    
    for y in range(grid_size):
        for x in range(grid_size):
            r, g, b = pixels[x, y]
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            
            nx = (x / (grid_size - 1)) * 2.0 - 1.0
            ny = (y / (grid_size - 1)) * 2.0 - 1.0
            dist_sq = nx * nx + ny * ny
            
            # Non-background threshold
            if lum > 0.08:
                mask[y][x] = True
                dome = max(0.0, 1.0 - 0.3 * dist_sq)
                # Volumetric sculpted depth
                h = math.pow(lum, 0.8) * max_depth * dome + 0.035
                heights[y][x] = h
            else:
                heights[y][x] = 0.0

    # Build Front Vertices
    vertices = []
    grid_to_vert = {}
    
    for y in range(grid_size):
        for x in range(grid_size):
            if not mask[y][x]:
                continue
            u = x / (grid_size - 1)
            v = y / (grid_size - 1)
            wx = (u - 0.5) * scale_xy
            wy = (0.5 - v) * scale_xy
            wz = heights[y][x]
            
            # Central difference for normal
            hx0 = heights[y][max(0, x - 1)]
            hx1 = heights[y][min(grid_size - 1, x + 1)]
            hy0 = heights[max(0, y - 1)][x]
            hy1 = heights[min(grid_size - 1, y + 1)][x]
            
            dhdx = (hx1 - hx0) / (2.0 * step)
            dhdy = (hy0 - hy1) / (2.0 * step)
            
            nx = -dhdx
            ny = -dhdy
            nz = 1.0
            length = math.sqrt(nx*nx + ny*ny + nz*nz)
            if length > 1e-6:
                nx /= length
                ny /= length
                nz /= length
            else:
                nx, ny, nz = 0.0, 0.0, 1.0
                
            vert_idx = len(vertices)
            grid_to_vert[(x, y)] = vert_idx
            vertices.append({
                'pos': (wx, wy, wz),
                'uv': (u, v),
                'norm': (nx, ny, nz)
            })

    # Build Front Triangles
    indices = []
    for y in range(grid_size - 1):
        for x in range(grid_size - 1):
            p00 = grid_to_vert.get((x, y))
            p10 = grid_to_vert.get((x + 1, y))
            p01 = grid_to_vert.get((x, y + 1))
            p11 = grid_to_vert.get((x + 1, y + 1))
            
            if p00 is not None and p10 is not None and p01 is not None:
                indices.extend([p00, p01, p10])
            if p10 is not None and p01 is not None and p11 is not None:
                indices.extend([p10, p01, p11])

    # Build Solid Backing Plate (z = -0.02)
    num_front = len(vertices)
    back_z = -0.02
    
    for i in range(num_front):
        wx, wy, _ = vertices[i]['pos']
        u, v = vertices[i]['uv']
        vertices.append({
            'pos': (wx, wy, back_z),
            'uv': (u, v),
            'norm': (0.0, 0.0, -1.0)
        })
        
    # Reverse winding for back faces
    front_tri_count = len(indices)
    for i in range(0, front_tri_count, 3):
        i0, i1, i2 = indices[i], indices[i+1], indices[i+2]
        indices.extend([num_front + i0, num_front + i2, num_front + i1])
        
    # Side Skirt Quads for Perimeter
    for y in range(grid_size):
        for x in range(grid_size):
            p_curr = grid_to_vert.get((x, y))
            if p_curr is None:
                continue
            
            # Check right neighbor
            if x + 1 < grid_size:
                p_right = grid_to_vert.get((x + 1, y))
                # If one is inside and one is outside
                # or check bottom neighbor
            
            for dx, dy in [(1, 0), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < grid_size and 0 <= ny < grid_size:
                    p_neighbor = grid_to_vert.get((nx, ny))
                    if p_neighbor is not None:
                        # Check if either point is on boundary (any of its 4 neighbors are outside)
                        is_curr_edge = False
                        for cx, cy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                            tx, ty = x + cx, y + cy
                            if tx < 0 or tx >= grid_size or ty < 0 or ty >= grid_size or not mask[ty][tx]:
                                is_curr_edge = True
                                break
                                
                        is_neigh_edge = False
                        for cx, cy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                            tx, ty = nx + cx, ny + cy
                            if tx < 0 or tx >= grid_size or ty < 0 or ty >= grid_size or not mask[ty][tx]:
                                is_neigh_edge = True
                                break
                                
                        if is_curr_edge and is_neigh_edge:
                            # Connect skirt
                            f1 = p_curr
                            f2 = p_neighbor
                            b1 = num_front + p_curr
                            b2 = num_front + p_neighbor
                            indices.extend([f1, b1, f2])
                            indices.extend([f2, b1, b2])

    total_vertices = len(vertices)
    total_triangles = len(indices) // 3
    print(f"Generated mesh: {total_vertices} vertices, {total_triangles} triangles.")
    
    # Read compressed JPEG texture
    with open(image_path, 'rb') as f:
        texture_bytes = f.read()

    pos_bytes = bytearray()
    norm_bytes = bytearray()
    uv_bytes = bytearray()
    
    min_pos = [float('inf'), float('inf'), float('inf')]
    max_pos = [-float('inf'), -float('inf'), -float('inf')]
    min_norm = [float('inf'), float('inf'), float('inf')]
    max_norm = [-float('inf'), -float('inf'), -float('inf')]
    min_uv = [float('inf'), float('inf')]
    max_uv = [-float('inf'), -float('inf')]
    
    for v in vertices:
        x, y, z = v['pos']
        nx, ny, nz = v['norm']
        u, v_c = v['uv']
        
        pos_bytes.extend(struct.pack('<fff', x, y, z))
        norm_bytes.extend(struct.pack('<fff', nx, ny, nz))
        uv_bytes.extend(struct.pack('<ff', u, v_c))
        
        for k, val in enumerate([x, y, z]):
            min_pos[k] = min(min_pos[k], val)
            max_pos[k] = max(max_pos[k], val)
        for k, val in enumerate([nx, ny, nz]):
            min_norm[k] = min(min_norm[k], val)
            max_norm[k] = max(max_norm[k], val)
        min_uv[0] = min(min_uv[0], u)
        min_uv[1] = min(min_uv[1], v_c)
        max_uv[0] = max(max_uv[0], u)
        max_uv[1] = max(max_uv[1], v_c)
        
    idx_bytes = bytearray()
    use_uint = total_vertices > 65535
    if use_uint:
        for idx in indices:
            idx_bytes.extend(struct.pack('<I', idx))
        idx_comp_type = 5125
    else:
        for idx in indices:
            idx_bytes.extend(struct.pack('<H', idx))
        idx_comp_type = 5123

    bin_buffer = bytearray()
    def append_chunk(data, alignment=4):
        pad = (alignment - (len(bin_buffer) % alignment)) % alignment
        bin_buffer.extend(b'\x00' * pad)
        offset = len(bin_buffer)
        bin_buffer.extend(data)
        return offset, len(data)

    idx_offset, idx_len = append_chunk(idx_bytes)
    pos_offset, pos_len = append_chunk(pos_bytes)
    norm_offset, norm_len = append_chunk(norm_bytes)
    uv_offset, uv_len = append_chunk(uv_bytes)
    tex_offset, tex_len = append_chunk(texture_bytes)

    gltf = {
        "asset": {"version": "2.0", "generator": "SENTINEL 3D PBR Master Sculptor"},
        "scenes": [{"nodes": [0]}],
        "scene": 0,
        "nodes": [{"mesh": 0, "name": "Emblem_3D_Sculpt"}],
        "meshes": [{
            "name": "Emblem_Mesh",
            "primitives": [{
                "attributes": {
                    "POSITION": 1,
                    "NORMAL": 2,
                    "TEXCOORD_0": 3
                },
                "indices": 0,
                "material": 0,
                "mode": 4
            }]
        }],
        "materials": [{
            "name": "Master_Heraldic_Gold_PBR",
            "pbrMetallicRoughness": {
                "baseColorTexture": {"index": 0},
                "metallicFactor": 0.88,
                "roughnessFactor": 0.22
            },
            "doubleSided": True
        }],
        "textures": [{"source": 0, "sampler": 0}],
        "images": [{
            "bufferView": 4,
            "mimeType": "image/jpeg",
            "name": "Emblem_Master_HD_Texture"
        }],
        "samplers": [{
            "magFilter": 9729,
            "minFilter": 9987,
            "wrapS": 33071,
            "wrapT": 33071
        }],
        "buffers": [{"byteLength": len(bin_buffer)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": idx_offset, "byteLength": idx_len, "target": 34963},
            {"buffer": 0, "byteOffset": pos_offset, "byteLength": pos_len, "target": 34962},
            {"buffer": 0, "byteOffset": norm_offset, "byteLength": norm_len, "target": 34962},
            {"buffer": 0, "byteOffset": uv_offset, "byteLength": uv_len, "target": 34962},
            {"buffer": 0, "byteOffset": tex_offset, "byteLength": tex_len}
        ],
        "accessors": [
            {
                "bufferView": 0,
                "byteOffset": 0,
                "componentType": idx_comp_type,
                "count": len(indices),
                "type": "SCALAR",
                "min": [0],
                "max": [total_vertices - 1]
            },
            {
                "bufferView": 1,
                "byteOffset": 0,
                "componentType": 5126,
                "count": total_vertices,
                "type": "VEC3",
                "min": min_pos,
                "max": max_pos
            },
            {
                "bufferView": 2,
                "byteOffset": 0,
                "componentType": 5126,
                "count": total_vertices,
                "type": "VEC3",
                "min": min_norm,
                "max": max_norm
            },
            {
                "bufferView": 3,
                "byteOffset": 0,
                "componentType": 5126,
                "count": total_vertices,
                "type": "VEC2",
                "min": min_uv,
                "max": max_uv
            }
        ]
    }

    json_bytes = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    json_pad = (4 - (len(json_bytes) % 4)) % 4
    json_bytes += b' ' * json_pad
    
    bin_pad = (4 - (len(bin_buffer) % 4)) % 4
    bin_buffer.extend(b'\x00' * bin_pad)
    
    total_len = 12 + 8 + len(json_bytes) + 8 + len(bin_buffer)
    header = struct.pack('<4sII', b'glTF', 2, total_len)
    json_header = struct.pack('<I4s', len(json_bytes), b'JSON')
    bin_header = struct.pack('<I4s', len(bin_buffer), b'BIN\x00')
    
    with open(output_glb_path, 'wb') as f:
        f.write(header)
        f.write(json_header)
        f.write(json_bytes)
        f.write(bin_header)
        f.write(bin_buffer)
        
    file_size_mb = os.path.getsize(output_glb_path) / (1024 * 1024)
    print(f"SUCCESS: {output_glb_path} generated ({file_size_mb:.2f} MB, {total_vertices} verts, {total_triangles} tris)")

if __name__ == '__main__':
    emblems = [
        ("public/images/emblems/army-master-hd.jpg", "public/models/indian-army.glb", 0.32),
        ("public/images/emblems/navy-master-hd.jpg", "public/models/indian-navy.glb", 0.32),
        ("public/images/emblems/air-force-master-hd.jpg", "public/models/indian-air-force.glb", 0.34),
        ("public/images/emblems/tri-service-master-hd.jpg", "public/models/integrated-defence-staff.glb", 0.32)
    ]
    for src, dst, depth in emblems:
        build_3d_emblem_glb(src, dst, depth)
