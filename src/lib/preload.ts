const loaded = new Set<string>();

/** 곧 쓸 이미지를 미리 받아 둔다. 이미 요청한 주소는 건너뛴다. */
export function preloadImages(sources: readonly string[]) {
  for (const source of sources) {
    if (loaded.has(source)) continue;
    loaded.add(source);
    const image = new Image();
    image.decoding = 'async';
    image.src = source;
  }
}
