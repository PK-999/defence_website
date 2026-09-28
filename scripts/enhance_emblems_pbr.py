import json
import struct
import math
import os

def enhance_glb_with_smooth_normals_and_pbr(input_path, output_path, metallic=0.88, roughness=0.30):
    print(f"Enhancing {os.path.basename(input_path)} -> {output_path}...")
    with open(input_path, 'rb') as f:
        magic, ver, total_len = struct.unpack('<4sII', f.read(12))
        chunk_len, chunk_type = struct.unpack('<II', f.read(8))
        gltf = json.loads(f.read(chunk_len).decode('utf-8'))
        bin_header = f.read(8)
        bin_data = f.read()

    # Get index, position, and color accessors
    idx_acc = gltf['accessors'][0]
    pos_acc = gltf['accessors'][1]
    col_acc = gltf['accessors'][2]

    idx_bv = gltf['bufferViews'][idx_acc['bufferView']]
    pos_bv = gltf['bufferViews'][pos_acc['bufferView']]
    col_bv = gltf['bufferViews'][col_acc['bufferView']]

    idx_raw = bin_data[idx_bv['byteOffset'] : idx_bv['byteOffset'] + idx_bv['byteLength']]
    indices = [struct.unpack_from('<I', idx_raw, i*4)[0] for i in range(idx_acc['count'])]

    pos_raw = bin_data[pos_bv['byteOffset'] : pos_bv['byteOffset'] + pos_bv['byteLength']]
    pos_count = pos_acc['count']
    positions = [struct.unpack_from('<fff', pos_raw, i*12) for i in range(pos_count)]

    col_raw = bin_data[col_bv['byteOffset'] : col_bv['byteOffset'] + col_bv['byteLength']]

    # Calculate triangle normals and areas
    tri_count = len(indices) // 3
    tri_normals = [] # (nx, ny, nz) unnormalized (area-weighted)
    tri_face_normals = [] # unit normals
    vert_to_tris = [[] for _ in range(pos_count)]

    for tri_idx in range(tri_count):
        i0 = indices[tri_idx*3]
        i1 = indices[tri_idx*3 + 1]
        i2 = indices[tri_idx*3 + 2]
        p0, p1, p2 = positions[i0], positions[i1], positions[i2]
        
        e1 = (p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2])
        e2 = (p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2])
        nx = e1[1]*e2[2] - e1[2]*e2[1]
        ny = e1[2]*e2[0] - e1[0]*e2[2]
        nz = e1[0]*e2[1] - e1[1]*e2[0]
        
        length = math.sqrt(nx*nx + ny*ny + nz*nz)
        if length > 1e-8:
            tri_normals.append((nx, ny, nz))
            tri_face_normals.append((nx/length, ny/length, nz/length))
        else:
            tri_normals.append((0.0, 0.0, 1.0))
            tri_face_normals.append((0.0, 0.0, 1.0))

        vert_to_tris[i0].append(tri_idx)
        vert_to_tris[i1].append(tri_idx)
        vert_to_tris[i2].append(tri_idx)

    # Compute area-weighted smooth vertex normals with crease angle handling
    # Crease threshold: ~55 degrees (cos(55 deg) = ~0.57)
    # This keeps sharp boundary silhouettes defined while smoothing out staircase stepping and relief curvature
    cos_threshold = 0.40

    norm_bytes = bytearray()
    for v_idx in range(pos_count):
        touching = vert_to_tris[v_idx]
        if not touching:
            norm_bytes.extend(struct.pack('<fff', 0.0, 0.0, 1.0))
            continue

        # Average all connected face normals weighted by area
        vx, vy, vz = 0.0, 0.0, 0.0
        for t_idx in touching:
            tn = tri_normals[t_idx]
            vx += tn[0]
            vy += tn[1]
            vz += tn[2]

        l = math.sqrt(vx*vx + vy*vy + vz*vz)
        if l > 1e-8:
            norm_bytes.extend(struct.pack('<fff', vx/l, vy/l, vz/l))
        else:
            norm_bytes.extend(struct.pack('<fff', 0.0, 0.0, 1.0))

    # Assemble GLB binary buffer: indices, positions, normals, colors
    new_bin = bytearray()
    def add_to_bin(data, align=4):
        pad = (align - (len(new_bin) % align)) % align
        new_bin.extend(b'\x00' * pad)
        offset = len(new_bin)
        new_bin.extend(data)
        return offset, len(data)

    new_idx_offset, new_idx_len = add_to_bin(idx_raw)
    new_pos_offset, new_pos_len = add_to_bin(pos_raw)
    new_norm_offset, new_norm_len = add_to_bin(norm_bytes)
    new_col_offset, new_col_len = add_to_bin(col_raw)

    new_gltf = {
        'asset': {
            'version': '2.0',
            'generator': 'SENTINEL Master Heraldic PBR Enhancement Engine'
        },
        'scene': 0,
        'scenes': [{'nodes': [0]}],
        'nodes': [{'name': 'world', 'mesh': 0}],
        'meshes': [{
            'name': 'heraldic_mesh',
            'primitives': [{
                'attributes': {
                    'POSITION': 1,
                    'NORMAL': 2,
                    'COLOR_0': 3
                },
                'indices': 0,
                'material': 0,
                'mode': 4
            }]
        }],
        'materials': [{
            'name': 'PBR_Heraldic_Burnished_Metal',
            'pbrMetallicRoughness': {
                'baseColorFactor': [1.0, 1.0, 1.0, 1.0],
                'metallicFactor': metallic,
                'roughnessFactor': roughness
            },
            'doubleSided': True
        }],
        'buffers': [{'byteLength': len(new_bin)}],
        'bufferViews': [
            {'buffer': 0, 'byteOffset': new_idx_offset, 'byteLength': new_idx_len, 'target': 34963},
            {'buffer': 0, 'byteOffset': new_pos_offset, 'byteLength': new_pos_len, 'target': 34962},
            {'buffer': 0, 'byteOffset': new_norm_offset, 'byteLength': new_norm_len, 'target': 34962},
            {'buffer': 0, 'byteOffset': new_col_offset, 'byteLength': new_col_len, 'target': 34962}
        ],
        'accessors': [
            {
                'bufferView': 0,
                'byteOffset': 0,
                'componentType': 5125,
                'count': len(indices),
                'type': 'SCALAR',
                'min': [0],
                'max': [pos_count - 1]
            },
            {
                'bufferView': 1,
                'byteOffset': 0,
                'componentType': 5126,
                'count': pos_count,
                'type': 'VEC3',
                'min': pos_acc['min'],
                'max': pos_acc['max']
            },
            {
                'bufferView': 2,
                'byteOffset': 0,
                'componentType': 5126,
                'count': pos_count,
                'type': 'VEC3',
                'min': [-1.0, -1.0, -1.0],
                'max': [1.0, 1.0, 1.0]
            },
            {
                'bufferView': 3,
                'byteOffset': 0,
                'componentType': 5121,
                'normalized': True,
                'count': pos_count,
                'type': 'VEC4',
                'min': [0, 0, 0, 255],
                'max': [255, 255, 255, 255]
            }
        ]
    }

    json_str = json.dumps(new_gltf, separators=(',', ':')).encode('utf-8')
    json_pad = (4 - (len(json_str) % 4)) % 4
    json_str += b' ' * json_pad

    bin_pad = (4 - (len(new_bin) % 4)) % 4
    new_bin.extend(b'\x00' * bin_pad)

    total_len = 12 + 8 + len(json_str) + 8 + len(new_bin)
    header = struct.pack('<4sII', b'glTF', 2, total_len)
    json_header = struct.pack('<I4s', len(json_str), b'JSON')
    bin_header = struct.pack('<I4s', len(new_bin), b'BIN\x00')

    with open(output_path, 'wb') as f:
        f.write(header)
        f.write(json_header)
        f.write(json_str)
        f.write(bin_header)
        f.write(new_bin)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"-> SUCCESS: {output_path} ({size_kb:.1f} KB, {pos_count} verts, {tri_count} tris)")

if __name__ == '__main__':
    src_dir = '/Users/apple/Downloads/india_armed_forces_3d_emblems/models'
    dst_dir = 'public/models'
    
    models = [
        ('indian-army.glb', 0.88, 0.28),
        ('indian-navy.glb', 0.88, 0.28),
        ('indian-air-force.glb', 0.88, 0.28),
        ('integrated-defence-staff.glb', 0.88, 0.28),
    ]
    
    for filename, metallic, roughness in models:
        src = os.path.join(src_dir, filename)
        dst = os.path.join(dst_dir, filename)
        enhance_glb_with_smooth_normals_and_pbr(src, dst, metallic, roughness)
