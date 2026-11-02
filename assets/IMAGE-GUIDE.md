# Package artwork

- `banner.png`: wide, colorful package banner with your avatar, glass folder, package name and filename example.
- `mascot.png`: matching avatar holding a glass folder, on a transparent background.

Created with the built-in image-generation tool using your supplied nv.png as the identity reference.

## Add the banner to npm

The README uses the public repository banner URL:

https://raw.githubusercontent.com/sureshapps/filename-fixer/main/assets/banner.png

Both images are stored in this GitHub repository. Publish a new npm package version to deliver the updated README to the npm page. The assets folder is kept out of the npm tarball; the README loads its banner directly from GitHub.

## Generation prompts

Banner: Wide approximately 3:1 developer-tool banner. Preserve the supplied avatar's smiling face, swept black hair, rectangular black glasses, beard and red hoodie. Mascot holding a luminous translucent cyan folder with violet and orange document cards. Glossy 3D/glassmorphic style; midnight indigo, cyan, violet, hot pink and warm orange. Exact title: filename-fixer. Tagline: Messy filenames. Clean results. Creator: by sureshkaleyannan. Example: My Photo.JPG → my-photo.jpg. Generous padding, readable text, no watermark.

Mascot: Square transparent-background polished 3D illustration. Preserve the same avatar identity and red hoodie, holding a glossy cyan glass folder containing violet and orange document cards with a mint checkmark. Bright cyan/violet rim lighting, compact silhouette, no text, no watermark.
