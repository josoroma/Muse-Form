"""Encode sampled browser frames without changing geometry or source colors before quantization."""
import sys
from pathlib import Path
from PIL import Image

folder, target, fps = Path(sys.argv[1]), Path(sys.argv[2]), int(sys.argv[3])
frames = [Image.open(p).convert('RGB') for p in sorted(folder.glob('*.png'))]
if not frames:
    raise SystemExit('No captured frames')
samples = frames[::max(1, len(frames)//10)]
strip = Image.new('RGB', (192 * len(samples), 192))
for index, frame in enumerate(samples):
    tile = frame.copy()
    tile.thumbnail((192, 192), Image.Resampling.LANCZOS)
    strip.paste(tile, (192 * index, 0))
palette = strip.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
indexed[0].save(target, save_all=True, append_images=indexed[1:], duration=1000//fps, loop=0, optimize=False, disposal=1)
with Image.open(target) as check:
    total = 0
    for i in range(check.n_frames):
        check.seek(i)
        total += check.info['duration']
    assert total == 5000, (target, total)
    assert check.n_frames > 1, (target, 'static output')
print(f'Encoded {target.name}: {target.stat().st_size:,} bytes; {total} ms')
