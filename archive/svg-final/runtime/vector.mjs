/** Native SVG playback; artwork contains all geometry and five-second SMIL tracks. */
export function vectorFromMarkup(markup){
 const doc=new DOMParser().parseFromString(markup,'image/svg+xml');
 if(doc.querySelector('parsererror'))throw new Error('The vector drawing could not be parsed.');
 if(doc.querySelector('script,foreignObject,image'))throw new Error('Expected self-contained native SVG geometry.');
 for(const el of doc.querySelectorAll('*'))for(const a of el.attributes)if(/^on/i.test(a.name)||(/href$/i.test(a.name)&&!a.value.startsWith('#')))throw new Error('External or active SVG content is not supported.');
 const element=document.importNode(doc.documentElement,true);
 return{element,seek(t){element.pauseAnimations();element.setCurrentTime(Math.max(0,Math.min(5,Number(t)||0)));},destroy(){element.pauseAnimations();element.remove();}};
}
