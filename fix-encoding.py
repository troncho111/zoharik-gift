import zipfile
import io

# Read clean gift.html from the original zip
with zipfile.ZipFile(r'C:\Users\User\Downloads\zohar.zip') as zf:
    with zf.open('gift.html') as f:
        content = f.read().decode('utf-8')

# Verify it's clean
assert 'זוהריקו' in content, "Hebrew check failed"
assert 'מתנה בשבילכם' in content, "Title check failed"
print("Source from zip: clean UTF-8 confirmed")

# Apply 3 modifications
# 1. Add robots noindex meta after viewport
old = '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>'
new = '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">\n<title>'
assert content.count(old) == 1, f"viewport+title block not found exactly once (got {content.count(old)})"
content = content.replace(old, new)

# 2 & 3. Replace og:image and twitter:image URLs
old_img_url = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&h=630&fit=crop&q=85'
new_img_url = 'https://troncho111.github.io/zoharik-gift/preview.png'
assert content.count(old_img_url) == 2, f"Unsplash URL not found exactly twice (got {content.count(old_img_url)})"
content = content.replace(old_img_url, new_img_url)

# Write as UTF-8 without BOM
out_path = r'C:\Users\User\Projects\zoharik-gift\index.html'
with open(out_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

# Verify written file
with open(out_path, 'rb') as f:
    raw = f.read()
print(f"Written size: {len(raw)} bytes")
bom = b'\xef\xbb\xbf'
has_bom = raw[:3] == bom
print(f"First 3 bytes (BOM check): {raw[0]},{raw[1]},{raw[2]} ({'BOM' if has_bom else 'no BOM'})")
decoded = raw.decode('utf-8')
assert 'noindex,nofollow' in decoded
assert 'troncho111.github.io/zoharik-gift/preview.png' in decoded
assert 'זוהריקו' in decoded
print("All 3 modifications applied. Hebrew intact. UTF-8 without BOM.")
