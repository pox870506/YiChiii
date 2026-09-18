'use client';
import {useEffect,useRef,useState} from 'react';
import metadata from '@/lib/photo-meta.json';
type PhotoMeta={label:string;width:number;height:number;small:string;smallWidth:number};
const meta=metadata as Record<string,PhotoMeta>;
const sizes='(max-width:650px) calc(100vw - 40px), 980px';
function srcset(src:string){const m=meta[src];return m&&m.smallWidth<m.width?`${m.small} ${m.smallWidth}w, ${src} ${m.width}w`:undefined;}
export default function Gallery({images,label,showCaption=true}:{images:string[];label:string;showCaption?:boolean}){const [index,setIndex]=useState(0),[zoom,setZoom]=useState(false),[nearby,setNearby]=useState(false);const figure=useRef<HTMLElement>(null);const n=Math.min(index,Math.max(0,images.length-1));const src=images[n],m=meta[src],caption=m?.label||label;
 useEffect(()=>{if(!figure.current)return;if(typeof IntersectionObserver==='undefined'){setNearby(true);return;}const observer=new IntersectionObserver(([entry])=>setNearby(entry.isIntersecting),{rootMargin:'300px'});observer.observe(figure.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{if(!nearby||images.length<2)return;const next=[images[(n+1)%images.length],images[(n+images.length-1)%images.length]];next.forEach(url=>{const img=new Image();img.decoding='async';img.sizes=sizes;img.srcset=srcset(url)||'';img.src=url;});},[nearby,n,images.join('|')]);
 useEffect(()=>{if(!zoom)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setZoom(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[zoom]);
 if(!images.length)return null;
 return <figure ref={figure} className="j-gallery"><div className="j-photo-frame"><button className="j-image-button" aria-label={`放大${label}照片`} onClick={()=>setZoom(true)}><img src={src} srcSet={srcset(src)} sizes={sizes} width={m?.width} height={m?.height} alt={caption} loading="lazy" decoding="async"/></button></div>{showCaption&&<figcaption className="j-photo-caption">📍 {caption}</figcaption>}{images.length>1&&<div className="j-gallery-nav"><button aria-label={`${label}上一張照片`} onClick={()=>setIndex((n+images.length-1)%images.length)}>←</button><span>{n+1} / {images.length}</span><button aria-label={`${label}下一張照片`} onClick={()=>setIndex((n+1)%images.length)}>→</button></div>}{zoom&&<div className="j-lightbox" role="dialog" aria-modal="true" aria-label={caption} onClick={()=>setZoom(false)}><button autoFocus onClick={()=>setZoom(false)}>關閉 ✕</button><img src={src} alt={caption}/></div>}</figure>;
}
