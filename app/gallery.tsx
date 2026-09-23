'use client';
// oxlint-disable next/no-img-element -- Local photos already provide optimized thumbnails and full-size sources.

import {useCallback, useEffect, useRef, useState} from 'react';
import metadata from '@/lib/photo-meta.json';

type PhotoMeta = {label:string; width:number; height:number; small:string; smallWidth:number};
const meta = metadata as Record<string, PhotoMeta>;
const sizes = '(max-width:650px) calc(100vw - 40px), 980px';

function srcset(src:string) {
  const photo = meta[src];
  return photo && photo.smallWidth < photo.width
    ? `${photo.small} ${photo.smallWidth}w, ${src} ${photo.width}w`
    : undefined;
}

export default function Gallery({images, label, showCaption=true, priority=false}:{images:string[]; label:string; showCaption?:boolean; priority?:boolean}) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [nearby, setNearby] = useState(priority);
  const [imageReady, setImageReady] = useState(false);
  const [fullReady, setFullReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const figure = useRef<HTMLElement>(null);
  const n = Math.min(index, Math.max(0, images.length-1));
  const src = images[n] || '';
  const photo = meta[src];
  const caption = photo?.label || label;
  const change = useCallback((offset:number) => {
    setImageReady(false);
    setFullReady(false);
    setImageError(false);
    setIndex(current => (current+offset+images.length)%images.length);
  }, [images.length]);

  useEffect(() => {
    if (priority || !figure.current) return;
    if (typeof IntersectionObserver === 'undefined') { queueMicrotask(() => setNearby(true)); return; }
    const observer = new IntersectionObserver(([entry]) => setNearby(entry.isIntersecting), {rootMargin:'500px'});
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!nearby || images.length < 2) return;
    [images[(n+1)%images.length], images[(n+images.length-1)%images.length]].forEach(url => {
      const next = new Image();
      next.decoding = 'async';
      next.sizes = sizes;
      next.srcset = srcset(url) || '';
      next.src = meta[url]?.small || url;
    });
  }, [nearby, n, images]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event:KeyboardEvent) => {
      if (event.key === 'Escape') setZoom(false);
      if (event.key === 'ArrowRight' && images.length > 1) change(1);
      if (event.key === 'ArrowLeft' && images.length > 1) change(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom, images.length, change]);

  if (!src) return null;
  return <figure ref={figure} className="j-gallery">
    <div className="j-photo-frame">
      <button className="j-image-button" type="button" aria-label={`放大${caption}照片`} onClick={() => {setFullReady(false); setZoom(true);}}>
        {!imageReady && !imageError && <span className="j-photo-loading">照片載入中…</span>}
        {imageError && <span className="j-photo-loading">照片暫時無法顯示，點一下重試</span>}
        <img key={src} src={src} srcSet={srcset(src)} sizes={sizes} width={photo?.width} height={photo?.height} alt={caption} loading={priority || nearby ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" onLoad={() => {setImageReady(true);setImageError(false);}} onError={() => setImageError(true)}/>
      </button>
    </div>
    {showCaption && <figcaption className="j-photo-caption">📍 {caption}</figcaption>}
    {images.length > 1 && <div className="j-gallery-nav"><button type="button" aria-label={`${label}上一張照片`} onClick={() => change(-1)}>←</button><span>{n+1} / {images.length}</span><button type="button" aria-label={`${label}下一張照片`} onClick={() => change(1)}>→</button></div>}
    {zoom && <dialog open className="j-lightbox" aria-label={caption} onCancel={() => setZoom(false)}>
      <button className="j-lightbox-close" type="button" autoFocus onClick={() => setZoom(false)}>關閉 ✕</button>
      <img className="j-lightbox-preview" src={photo?.small || src} alt="" aria-hidden="true"/>
      <img key={src} className="j-lightbox-full" src={src} alt={caption} onLoad={() => setFullReady(true)}/>
      {!fullReady && <span className="j-lightbox-status">清晰照片載入中…</span>}
      {images.length > 1 && <><button className="j-lightbox-prev" type="button" aria-label="上一張照片" onClick={() => change(-1)}>←</button><button className="j-lightbox-next" type="button" aria-label="下一張照片" onClick={() => change(1)}>→</button></>}
    </dialog>}
  </figure>;
}
