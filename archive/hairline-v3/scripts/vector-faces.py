"""Author the ten native face studies. No raster tracing or image embedding.

Coordinates are hand-curated against the corpus's internal realistic plates.
The 400x300 coordinate space is deliberate; the SVGs render at 1200x900.
"""
from pathlib import Path
import json
from html import escape
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'corpus/svg'
OUT.mkdir(parents=True,exist_ok=True)
records=[]
def p(name,d,c='mid',fill='none'):
 return f'<path id="{name}" class="{c}" d="{d}" fill="{fill}"/>'
def save(id,inner):
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="1200" height="900" role="img"><title>{id} — clean anatomical line study</title><desc>Native cubic curves; anatomical interpretation of our own graphite illustration. No bitmap, texture, filters or tonal fills.</desc><style>svg{{background:#101014}}path,ellipse,circle{{stroke-width:.92;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round;fill:none}}.sil{{stroke:#a1a1aa}}.mid{{stroke:#52525b}}.lo{{stroke:#27272a}}.hi{{stroke:#fafafa}}</style><rect width="400" height="300" fill="#101014"/>{inner}</svg>'''
 (OUT/f'{id}.svg').write_text(svg)
# Portrait: silhouette, overlaps, anatomical features and directional hair, all authored curves.
body=[
('shoulder-left','M45 252 C66 240 88 234 113 224 C123 219 125 204 136 198 C141 195 146 193 149 193','sil'),
('shoulder-right','M239 205 C246 215 249 218 263 223 C284 231 307 238 332 252','sil'),
('neck-left','M151 159 C152 172 151 186 146 201 C143 213 146 225 157 236','mid'),
('neck-right','M237 192 C234 204 236 219 243 229','mid'),
('neck-tendon','M174 209 C179 226 190 240 201 247','lo'),
('throat','M202 224 C211 228 217 232 224 237','lo'),
('shirt-collar-left','M143 199 C135 204 132 215 129 223 L149 227 L140 239 C153 248 164 263 173 277','sil'),
('shirt-collar-inner','M143 207 C142 228 155 247 173 277','mid'),
('shirt-collar-right','M239 213 C247 221 254 230 263 245 L243 241 L247 251 C234 262 229 272 224 282','sil'),
('shirt-opening','M157 237 C175 257 187 277 193 285 M235 242 C235 257 232 274 224 282','mid'),
('shirt-fold-left','M79 248 C94 245 106 245 117 242 M97 259 C109 256 123 258 136 267','lo'),
('shirt-fold-right','M268 241 C281 243 295 249 304 258 M252 265 C269 260 282 264 294 268','lo')]
head=[
('hair-outline','M142 113 C143 103 145 92 152 83 C156 73 162 72 170 68 C173 61 185 58 193 55 C198 48 206 48 212 48 C219 43 225 48 231 48 C239 46 245 52 249 55 C259 55 264 64 267 69 C273 75 273 83 271 88 C278 93 279 102 275 108 C277 117 270 128 265 135','sil'),
('hairline','M150 137 C151 128 154 118 160 109 C165 101 168 94 175 89 C182 83 190 85 196 82 C204 82 211 84 218 78 C228 80 236 78 244 86 C254 94 259 107 260 121','sil'),
('face-outline','M151 155 C153 171 159 183 174 194 C182 202 193 210 205 210 C219 209 229 202 235 192 C242 183 248 173 251 164 C259 155 261 144 265 135','sil'),
('ear-outer','M144 115 C140 109 133 113 132 123 C130 134 133 145 140 153 C144 157 150 156 151 151','sil'),
('ear-helix','M140 118 C134 119 135 130 136 135 M137 139 C138 146 143 151 147 150','mid'),
('ear-fold','M143 121 C146 122 148 128 147 132 C143 131 140 134 142 138 C144 139 145 141 145 144','mid'),
('temple','M156 122 C156 128 157 132 158 136','lo'),
('brow-left','M183 114 C191 110 200 111 208 114 C211 115 214 117 216 117','mid'),
('brow-left-inner','M181 116 C192 112 202 112 210 115','lo'),
('brow-right','M231 120 C239 117 248 121 255 127','mid'),
('eye-left-upper','M187 125 C192 121 200 120 205 123 C208 124 210 125 212 126','hi'),
('eye-left-lower','M187 125 C194 129 203 131 210 127','mid'),
('eye-left-iris','M195 123 C193 125 194 128 197 129 C200 129 202 126 200 123','mid'),
('eye-left-pupil','M197 125 L197 126','mid'),
('eye-right-upper','M233 131 C239 126 246 128 251 134','mid'),
('eye-right-lower','M233 131 C239 136 246 138 251 134','mid'),
('eye-right-iris','M239 129 C236 131 237 135 240 136 C243 136 245 133 242 130','mid'),
('eye-right-pupil','M240 132 L240 133','mid'),
('lid-crease-left','M187 121 C194 117 202 117 208 121','lo'),
('lid-crease-right','M232 127 C240 123 248 126 253 130','lo'),
('cheek-left','M183 130 C189 135 197 137 205 135','mid'),
('smile-eye-fold','M183 125 C179 123 177 122 174 120 M183 130 C179 130 176 130 173 128','lo'),
('eye-fold-right','M235 139 C242 143 247 144 250 144','lo'),
('nose-bridge','M224 125 C222 132 223 140 225 146 C229 151 227 155 223 156','mid'),
('nose-wing','M207 149 C209 145 214 145 218 149 M203 152 C207 155 210 156 214 154 C218 153 220 157 224 156','sil'),
('nostril-left','M206 151 C209 149 212 150 214 152','mid'),
('nostril-right','M224 153 C227 150 230 151 231 154','mid'),
('nasal-cheek-left','M200 148 C193 153 190 158 188 164','lo'),
('nasal-cheek-right','M234 156 C238 163 238 171 235 177','lo'),
('smile-corner','M186 163 C187 166 189 166 192 166','mid'),
('mouth-seam','M188 165 C198 170 211 175 223 175 C228 176 232 175 234 173','sil'),
('upper-lip','M192 165 C200 164 205 168 210 168 C215 168 222 173 229 173','mid'),
('lower-lip','M193 170 C205 178 219 181 230 177','mid'),
('chin','M197 191 C205 194 216 194 223 190','lo'),
('chin-under','M187 202 C196 207 211 209 221 202','lo'),
('jaw-cheek','M166 168 C170 176 175 182 180 185','lo'),
('forehead-fold','M191 97 C206 94 221 97 230 100','lo')]
hair=[
'M146 108 C151 92 158 85 171 80','M151 101 C159 93 162 79 177 75','M162 96 C173 90 172 78 188 74','M174 87 C186 85 191 75 202 70','M184 80 C196 78 203 72 212 61','M198 79 C211 78 220 68 222 55','M213 76 C226 70 231 60 235 55','M227 77 C241 73 245 65 246 61','M240 80 C252 78 259 74 260 70','M250 87 C261 86 265 83 267 78','M258 99 C267 95 271 92 273 88','M265 113 C272 109 274 104 273 99','M152 79 C161 70 172 68 181 65','M174 66 C184 60 196 59 204 55','M189 56 C201 53 214 53 222 51','M230 51 C234 52 238 54 242 58']
clips='<defs><clipPath id="near-eye-clip"><path style="fill:white;stroke:none" d="M187 125 C192 121 200 120 205 123 C208 124 210 125 212 126 C203 131 194 129 187 125Z"/></clipPath><clipPath id="far-eye-clip"><path style="fill:white;stroke:none" d="M233 131 C239 126 246 128 251 134 C246 138 239 136 233 131Z"/></clipPath></defs>'
def happy_feature(a):
 q=p(*a)
 if a[0] in ['eye-left-iris','eye-left-pupil']:
  q='<g clip-path="url(#near-eye-clip)">'+q+'</g>'
 if a[0] in ['eye-right-iris','eye-right-pupil']:
  q='<g clip-path="url(#far-eye-clip)">'+q+'</g>'
 return q
s=clips+'<g id="shoulders">'+''.join(p(*a) for a in body)+'</g><g id="head">'+''.join(happy_feature(a) for a in head)+''.join(p(f'hair-flow-{i}',d,'lo') for i,d in enumerate(hair))+'</g>'
save('105196',s)
# Skull: primary silhouette, anatomical orbital/zygomatic/jaw construction.
skull=[
('vault-silhouette','M94 95 C102 84 104 70 113 56 C134 24 170 7 209 7 C248 7 278 21 302 46 C333 76 343 107 343 143 C344 173 335 201 319 222 C312 230 300 233 285 232','sil'),
('far-face','M94 95 C87 101 86 111 89 119 C89 132 85 139 82 146 C80 154 81 167 84 176 L94 178 C98 188 96 192 94 197','sil'),
('far-orbit','M91 105 C99 96 115 92 123 99 C127 104 126 113 120 118 C116 124 113 135 103 141 L91 146 C96 135 94 127 91 120 C88 115 88 110 91 105 Z','mid'),
('orbital-ridge','M124 99 C140 87 166 88 184 94 C207 99 220 112 222 127 C223 145 212 151 197 153','sil'),
('near-orbit','M144 103 C159 93 179 96 194 104 C210 112 213 126 206 137 C198 147 181 148 165 144 C151 141 142 135 140 123 C139 115 140 109 144 103 Z','hi'),
('orbital-depth','M148 109 C146 120 148 131 157 136 M201 111 C208 121 207 131 201 137','lo'),
('nasal-bridge','M130 101 C131 113 124 121 118 125 C115 131 115 138 115 144','sil'),
('nasal-aperture','M113 127 C109 135 108 145 108 157 C106 167 109 172 116 171 C122 172 128 173 135 170 C141 166 139 154 135 146 C131 139 132 131 126 126','mid'),
('nasal-septum','M116 143 C119 151 123 157 122 166 L116 171 M125 161 C130 158 131 155 132 151','lo'),
('near-cheek','M143 139 C145 151 151 160 160 168 C175 177 189 179 201 177 C214 173 230 167 243 165 C255 163 260 166 266 171','sil'),
('zygomatic-arch','M222 129 C225 144 229 154 244 158 C256 163 263 167 276 167 C283 169 289 168 295 167','mid'),
('temporal-hollow','M230 73 C219 84 217 96 222 105 C229 112 233 125 232 137 C232 149 239 152 247 154','lo'),
('maxilla','M109 174 C104 183 101 190 101 197 M143 175 C143 185 140 192 141 199 M163 177 C160 184 160 194 164 201','mid'),
('maxilla-edge','M105 193 C119 196 130 195 142 199 C156 201 173 202 188 199','lo'),
('jaw-outer','M96 226 C95 237 92 244 91 254 C86 262 87 269 94 271 C100 273 105 269 110 271 C119 277 133 274 151 271 L229 262 C237 259 239 250 240 240 C241 223 248 210 258 197 C265 188 269 182 267 174','sil'),
('jaw-ramus','M198 180 C210 173 222 176 229 183 C231 193 224 208 217 217 C204 233 188 238 166 241','mid'),
('ramus-notch','M227 182 C237 190 248 189 256 181','sil'),
('jaw-inner','M103 235 C111 238 123 240 137 239 C152 240 169 240 181 237','lo'),
('chin-plane','M96 262 C108 260 112 265 121 266 C139 267 159 262 177 259','mid'),
('mastoid','M272 190 C269 201 267 210 270 219 C273 226 278 223 281 216 C285 208 288 204 292 203','lo'),
('coronal-suture','M251 21 L250 27 L254 31 L251 34 L256 39 L253 43 L257 47 L254 51 L257 57 L255 62 L258 67 L255 72 L257 77 L254 82 L255 88 L251 94','lo'),
('temporal-suture','M243 105 L248 102 L253 99 L256 103 L260 99 L263 104 L267 104 L270 108 L275 108 L278 115 L283 114 L285 120 L290 120 L292 125 L299 125 L302 129','lo'),
('lower-dental-curve','M97 225 C112 230 127 231 143 231 C161 233 178 228 189 221','mid')]
# Separate incisors, a pointed canine and receding bicuspids. The lower arcade
# shares one continuous edge, avoiding the repeated capsule look of a tooth icon.
teeth=[
('upper-far-incisor','M97 203 Q99 199 103 202 L104 214 Q100 215 97 213 Z','mid'),
('upper-incisor-one','M105 201 Q109 197 115 201 L115 215 Q110 217 105 214 Z','mid'),
('upper-incisor-two','M117 201 Q122 198 128 202 L128 216 Q121 218 117 215 Z','mid'),
('upper-lateral','M130 203 Q134 199 139 204 L139 216 Q135 219 130 216 Z','mid'),
('upper-canine','M141 205 Q145 201 149 206 L150 214 L146 220 L141 216 Z','mid'),
('upper-bicuspid-one','M151 207 Q155 203 159 207 L161 213 Q159 219 154 218 L151 215 Z','mid'),
('upper-bicuspid-two','M162 207 Q166 205 170 207 L172 213 Q169 218 165 216 L162 214 Z','mid'),
('upper-molar-one','M173 208 Q178 204 182 207 L183 211 Q180 216 176 215 L173 213 Z','mid'),
('upper-molar-two','M184 207 Q188 203 191 207 L190 212 L185 213 Z','lo'),
('lower-incisal-arc','M98 215 Q104 218 111 216 Q118 218 124 218 Q132 219 140 219 L146 221 Q155 222 161 220 Q172 219 181 216 L188 214','lo'),
('lower-separations','M103 217 L103 225 M110 217 L111 228 M119 218 L120 230 M129 219 L131 230 M140 220 L141 231 M150 221 L152 231 M161 220 L163 229 M172 219 L174 226 M182 216 L183 223','lo')]
s='<g transform="translate(8 10) scale(.96)"><g id="skull">'+''.join(p(*a) for a in skull)+''.join(p(*a) for a in teeth)+'</g></g>'
save('105193',s)

def group(name, curves, extra=''):
 return f'<g id="{name}">'+''.join(p(*a) for a in curves)+extra+'</g>'

def eye(name,x,y,w=25,h=4,tilt=0,look=.49,focal=False,down=False,lift=1):
 """Lids, tear corner and a globe clipped by the actual lid aperture."""
 upper=f'M0 0 C{w*.25} {-h*lift} {w*.62} {-h*lift*1.25} {w} 0'
 lower=f'M0 0 C{w*.32} {h*.85} {w*.72} {h*.72} {w} 0'
 aperture=upper+f'C{w*.72} {h*.72} {w*.32} {h*.85} 0 0Z'
 cx=w*look; cy=h*.2 if down else -h*.12; r=w*.16
 iris=f'M{cx-r} {cy} A{r} {r*1.12} 0 1 0 {cx+r} {cy} A{r} {r*1.12} 0 1 0 {cx-r} {cy}'
 clip=f'<defs><clipPath id="{name}-clip"><path style="fill:white;stroke:none" d="{aperture}"/></clipPath></defs>'
 inner=p(name+'-iris',iris,'mid')+p(name+'-pupil',f'M{cx} {cy-1} L{cx} {cy+1}','mid')
 marks=p(name+'-upper',upper,'hi' if focal else 'mid')+p(name+'-lower',lower,'mid')
 marks+=p(name+'-crease',f'M1 {-h*lift*.7-2} C{w*.3} {-h*lift*1.75-2} {w*.68} {-h*lift*1.9-2} {w-1} {-h*lift*.7-2}','lo')
 marks+=p(name+'-corner',f'M0 0 Q1 2 3 2','lo')
 return f'<g id="{name}" transform="translate({x} {y}) rotate({tilt})">{clip}{marks}<g clip-path="url(#{name}-clip)">{inner}</g></g>'

def ear_small(name,x,y,scale=1,mirror=False):
 curves=[('outer','M0 0 C-8 -7 -12 2 -10 13 C-9 23 -4 31 3 32 C7 33 9 29 8 25','sil'),
 ('helix','M-3 1 C-8 -1 -8 9 -6 14 C-5 21 -1 27 4 27','mid'),
 ('fold','M-2 4 C3 6 5 12 3 16 C-1 13 -4 16 -1 19 C2 20 3 23 3 25','mid')]
 return f'<g transform="translate({x} {y}) scale({-scale if mirror else scale} {scale})">'+''.join(p(name+'-'+n,d,c) for n,d,c in curves)+'</g>'

# A close eye: two unequal lids, a tear duct and an occluded circular iris.
eye_curves=[
('brow-contour','M82 103 C103 77 134 69 161 77 C199 84 236 99 278 124','sil'),
('brow-lower','M88 108 C115 86 142 88 168 95 C209 105 237 114 272 128','mid'),
('brow-plane','M95 88 C119 71 141 70 158 75 M166 82 C194 86 222 99 241 108','lo'),
('glabella','M79 109 C73 127 78 140 69 161 C56 187 46 211 42 239','mid'),
('nose-plane','M87 143 C91 157 87 171 78 185 C67 202 60 220 55 234','lo'),
('upper-orbit','M102 134 C127 119 152 117 179 125 C222 137 251 152 281 172','mid'),
('upper-lid','M110 164 C139 141 162 138 192 148 C219 155 242 167 266 181','hi'),
('lower-lid','M110 164 C122 183 151 193 180 195 C214 196 245 190 266 181','sil'),
('upper-lid-thickness','M111 168 C140 145 162 143 191 152 C221 159 242 169 260 180','mid'),
('tear-duct','M110 164 C102 168 101 173 104 180 C111 178 115 176 118 175','mid'),
('lower-lid-rim','M115 183 C144 203 180 206 210 200 C236 196 252 188 264 182','mid'),
('orbital-bag','M115 198 C144 216 179 219 215 211 C235 207 251 199 265 190','lo'),
('outer-corner-fold','M265 181 C279 182 290 188 300 196 M269 177 C284 176 294 179 304 184','lo'),
('inner-lid-fold','M108 186 C101 193 97 204 94 217','lo'),
('cheek-plane','M122 225 C157 238 203 236 237 222','lo')]
clip='<defs><clipPath id="eye-aperture"><path style="fill:white;stroke:none" d="M111 168 C140 145 162 143 191 152 C221 159 242 169 260 180 C245 190 214 196 180 195 C151 193 122 183 111 168Z"/></clipPath></defs>'
iris='<g clip-path="url(#eye-aperture)">'+p('iris','M146 168 C146 146 155 132 168 132 C183 132 193 148 192 168 C191 188 183 199 169 200 C155 199 147 187 146 168Z','mid')+p('pupil','M158 164 C158 156 163 151 170 151 C178 151 183 157 183 165 C183 173 178 179 170 179 C163 179 158 173 158 164Z','mid')+p('iris-inner-arc','M152 168 C153 184 160 192 170 193 C181 192 186 183 187 174','lo')+'</g>'
save('105194',group('eye-study',eye_curves,clip+iris))

# The ear is drawn as continuous folds around the concha, not a spiral symbol.
ear_curves=[
('ear-outline','M156 93 C153 73 160 51 181 40 C203 28 229 34 246 49 C268 70 273 97 266 123 C260 147 249 167 237 187 C229 202 224 222 212 238 C201 251 184 262 169 256 C154 250 149 234 151 219','sil'),
('ear-helix','M164 98 C161 81 168 60 186 51 C202 42 219 47 233 58 C251 73 256 94 251 116 C245 140 238 152 232 172','hi'),
('helix-return','M232 172 C224 188 215 201 209 220 C202 236 188 247 175 245','mid'),
('helix-ridge','M169 100 C176 112 189 113 197 123 C211 139 213 152 203 170 C198 180 188 188 178 190','sil'),
('superior-crus','M178 105 C180 87 190 71 205 66 C220 65 232 79 234 94','mid'),
('antihelix','M206 73 C203 90 213 105 221 119 C230 136 227 158 216 173 C209 182 205 188 201 196','mid'),
('antihelix-branch','M182 111 C194 114 203 122 208 135','mid'),
('concha-rim','M170 133 C183 125 193 135 198 147 C204 159 197 174 186 180 C179 184 172 186 166 184','mid'),
('tragus','M152 148 C160 143 164 148 165 158 C168 168 163 172 158 174 C154 176 153 184 155 192','sil'),
('antitragus','M157 199 C166 195 171 191 177 192 C182 195 178 202 173 207','mid'),
('lobe-fold','M156 212 C161 223 173 226 184 220 C190 216 194 209 196 204','lo'),
('ear-attachment','M152 115 C148 126 150 136 152 142 M151 202 C147 209 148 217 151 222','mid'),
('temporal-plane','M133 66 C141 80 145 94 146 108 M134 228 C138 241 148 255 158 262','lo'),
('concha-depth','M177 142 C186 141 191 150 190 159 C189 166 184 171 178 173','lo')]
save('105195',group('ear-study',ear_curves))

def flow_curves(curves):
 return ''.join(p(f'hair-flow-{i}',d,'lo') for i,d in enumerate(curves))

def shirt(left,right,collar=0):
 """Open collar anchored at each portrait's actual neck base."""
 lx,ly=left;rx,ry=right
 return group('shoulders',[
 ('left-shoulder',f'M45 273 C75 256 103 248 {lx-14} {ly+16} C{lx-8} {ly+7} {lx-4} {ly} {lx} {ly}','sil'),
 ('right-shoulder',f'M{rx} {ry} C{rx+6} {ry+12} {rx+18} {ry+14} {rx+29} {ry+20} C{rx+48} {ry+29} 323 258 355 274','sil'),
 ('left-collar',f'M{lx} {ly} C{lx-7} {ly+12} {lx-9} {ly+20} {lx-7} {ly+28} L{lx+6} {ly+25} L{lx+20} {ly+46} C{lx+16} {ly+28} {lx+10} {ly+16} {lx+6} {ly+8}','mid'),
 ('right-collar',f'M{rx} {ry} C{rx+3} {ry+12} {rx+8} {ry+21} {rx+11} {ry+30} L{rx-2} {ry+26} L{rx-18} {ry+48} C{rx-14} {ry+28} {rx-7} {ry+17} {rx-5} {ry+9}','mid'),
 ('shirt-folds',f'M91 265 Q110 260 {lx-13} {ly+30} M{rx+27} {ry+28} Q280 258 299 267 M{lx+26} {ly+46} L{lx+34} 287','lo')])

# Sadness: older, elongated face, raised inner brows and downcast eyes.
sad=[
('hair-outline','M137 125 C130 112 130 94 135 81 C139 68 150 59 163 53 C173 44 185 44 193 43 C204 38 217 43 225 46 C238 45 248 53 254 62 C265 71 269 90 264 107 L258 128','sil'),
('hairline','M141 130 C144 117 147 104 153 94 C163 84 177 80 185 72 C192 68 199 67 205 64 C215 70 230 69 241 78 C252 87 255 102 255 113','mid'),
('face-outline','M144 156 C147 175 155 187 170 198 C181 212 194 221 207 219 C221 216 232 204 237 191 C245 176 250 162 252 150 L258 128','sil'),
('temple','M151 118 C151 127 154 136 156 140','lo'),
('near-brow','M178 123 C189 120 199 120 209 115 L214 115','mid'),
('near-brow-edge','M179 125 C192 123 203 122 211 118','lo'),
('far-brow','M235 123 C243 126 249 132 253 137','mid'),
('inner-brow-fold','M218 114 C219 122 218 129 218 135 M224 116 C224 122 224 126 225 130','mid'),
('forehead','M184 101 C199 96 215 100 229 106 M191 108 C204 105 213 107 219 109','lo'),
('nose-bridge','M228 133 C226 142 227 149 231 155 C235 162 232 166 226 167','mid'),
('nose-wing','M207 161 C210 156 217 156 220 160 M206 164 C212 169 217 167 220 167 C224 168 229 170 233 166','sil'),
('nostrils','M209 164 Q214 160 219 164 M228 164 Q233 161 236 165','mid'),
('left-nasolabial','M201 163 C193 168 191 178 190 185','mid'),
('right-nasolabial','M238 171 C241 180 240 187 237 194','lo'),
('mouth-seam','M193 190 C202 185 210 183 216 185 C224 184 229 188 233 193','sil'),
('upper-lip','M196 186 C205 180 211 181 217 181 C224 181 228 186 230 190','mid'),
('lower-lip','M199 193 C210 190 220 192 228 195','mid'),
('mouth-corners','M190 188 Q190 193 193 196 M234 190 Q237 194 236 198','lo'),
('cheek-plane','M164 153 C165 170 174 178 180 183 M237 153 C242 153 246 151 248 147','lo'),
('under-eye','M177 140 C186 146 198 148 207 145 M233 147 C239 152 245 153 249 151','mid'),
('beard-boundary','M152 156 C157 172 169 175 177 184 C184 193 188 200 192 202 M239 182 C237 196 226 211 211 214','lo'),
('chin','M202 204 C209 201 219 203 224 205','mid'),
('neck-left','M155 184 C155 207 151 221 147 231','mid'),
('neck-right','M231 201 C229 215 231 227 234 237','mid'),
('throat','M176 212 C181 232 189 242 198 250 M214 225 C208 237 205 246 204 255','lo')]
sad_hair=['M138 104 C143 88 154 78 167 75','M145 90 C152 77 159 69 171 65','M159 83 C172 76 175 62 188 59','M177 74 C185 64 197 58 206 51','M198 68 C208 62 218 60 223 54','M214 67 C230 69 241 73 246 84','M239 58 C250 68 256 80 258 93','M145 72 C157 60 171 58 181 53','M192 47 C205 47 214 48 222 51','M248 89 C256 99 258 107 257 115']
sad_extra=ear_small('near-ear',140,128,.9)+eye('near-eye',180,133,30,3.1,10,.58,True,True)+eye('far-eye',234,142,19,2.8,17,.53,False,True)+flow_curves(sad_hair)
save('105197',shirt((147,218),(235,221))+group('head',sad,sad_extra))

# Anger: broad jaw, compressed lids and brow pressure focused at the glabella.
anger=[
('hair-outline','M128 119 C122 102 125 84 132 73 C144 58 165 53 183 51 C202 47 221 53 234 64 C246 73 251 88 249 104 L247 119','sil'),
('hairline','M131 121 C132 108 135 99 144 91 L152 88 C160 80 172 80 182 73 C193 80 205 83 216 90 C228 95 236 106 237 119','mid'),
('face-outline','M131 124 C129 136 131 148 134 157 C132 169 137 184 149 195 C157 207 165 215 179 216 C194 217 209 212 218 203 C231 191 239 175 243 157','sil'),
('brow-far','M133 122 C141 116 151 117 159 123','mid'),
('brow-near','M175 121 C185 115 198 111 210 114','sil'),
('brow-pressure','M177 117 C188 111 201 108 210 111','lo'),
('glabellar-fold','M164 113 C165 118 165 123 164 129 M170 110 C171 116 171 121 170 125','mid'),
('forehead','M147 101 C153 103 157 106 160 109 M178 102 C184 100 193 99 199 101','lo'),
('nose-bridge','M162 130 C158 137 157 145 154 150 C150 157 155 161 162 160','mid'),
('nose-base','M148 157 C149 162 154 165 159 163 C164 167 171 165 175 162','sil'),
('near-ala','M170 155 C177 151 182 156 181 162','mid'),
('nostrils','M152 160 Q155 157 160 160 M171 161 Q175 157 179 160','mid'),
('nasolabial-near','M182 161 C188 167 191 174 191 180','mid'),
('nasolabial-far','M145 163 C142 170 144 174 146 177','lo'),
('mouth-seam','M147 181 C157 178 168 176 178 178 C184 179 189 182 193 184','sil'),
('upper-lip','M151 177 C158 173 164 175 168 174 C175 172 182 176 188 179','mid'),
('lower-lip','M151 184 C162 188 177 186 187 184','mid'),
('chin','M159 199 C167 194 178 194 187 198','mid'),
('jaw-plane','M202 178 C205 190 201 199 194 205 M146 189 C149 198 153 203 158 206','lo'),
('near-cheek','M190 144 C201 145 210 141 217 136','mid'),
('far-cheek','M134 143 C139 147 146 148 151 147','lo'),
('neck-left','M153 201 C154 216 151 227 146 235','mid'),
('neck-right','M239 158 C237 180 239 203 248 224','mid'),
('neck-tendons','M217 198 C207 218 203 234 204 251 M166 219 C173 235 180 242 184 254','lo'),
('larynx','M184 230 C190 226 198 229 201 234','lo')]
anger_hair=['M129 97 C140 80 151 71 165 67','M137 93 C151 86 162 71 176 66','M153 84 C168 74 184 66 193 59','M176 76 C188 69 204 65 214 63','M192 80 C203 76 216 75 225 76','M212 88 C222 86 234 92 240 102','M130 82 C140 71 152 65 165 61','M173 57 C187 54 201 56 213 59','M226 64 C238 75 244 87 244 97']
anger_extra=ear_small('near-ear',246,118,.92,True)+eye('far-eye',135,131,21,2.6,-8,.49)+eye('near-eye',177,129,30,3.1,-12,.46,True)+flow_curves(anger_hair)
save('105198',shirt((145,220),(248,214))+group('head',anger,anger_extra))

# Fear: raised inner brows, upward gaze, tense lower lids and a retracted mouth.
fear=[
('hair-outline','M112 143 C103 129 102 109 107 94 C109 80 119 66 133 61 C143 50 157 47 170 47 C183 40 196 42 207 48 C222 48 231 60 236 72 C243 83 242 96 239 108','sil'),
('hairline','M119 145 C119 129 124 117 128 108 C135 96 144 93 152 85 C165 80 179 70 187 64 C197 70 210 70 220 82 C231 91 235 106 234 118','mid'),
('face-outline','M121 169 C125 190 139 207 157 220 C170 232 183 238 194 234 C208 229 218 217 224 205 C229 191 230 177 231 163 L237 141 C240 132 239 120 239 108','sil'),
('near-brow','M151 123 C160 115 171 111 181 109 C185 109 188 112 189 115','mid'),
('far-brow','M204 111 C214 103 223 104 230 110','mid'),
('glabella','M192 110 C193 117 192 123 191 128 M197 108 C198 113 198 118 199 121','mid'),
('forehead','M160 103 C173 96 185 96 195 99 M174 91 C189 86 204 89 215 94','lo'),
('nose-bridge','M199 130 C198 138 201 145 204 151 C209 157 205 164 200 164','mid'),
('nose-wing','M183 157 C185 152 190 151 194 155 M182 162 C185 165 190 166 194 164 C199 166 204 166 208 162','sil'),
('nostrils','M185 161 Q189 157 194 161 M202 160 Q206 157 209 160','mid'),
('near-cheek','M151 144 C160 151 170 151 180 147','mid'),
('far-cheek','M210 139 C216 144 224 141 228 138','lo'),
('nasolabial','M175 162 C169 171 167 180 168 187 M211 168 C217 175 219 185 217 192','mid'),
('mouth-aperture','M169 188 C181 178 192 176 204 180 C211 182 216 186 217 192 C208 190 201 189 193 189 C183 189 176 192 169 192Z','sil'),
('upper-lip','M170 184 C179 175 188 173 196 176 C205 175 212 181 215 185','mid'),
('lower-lip','M173 197 C187 192 202 194 212 197','mid'),
('upper-teeth','M176 184 C188 180 199 180 208 185 L207 188 C196 186 185 187 178 188Z','lo'),
('mouth-corners','M166 186 Q165 192 168 197 M218 190 L219 197','lo'),
('chin','M178 214 C187 209 201 211 207 214','mid'),
('jaw-plane','M136 179 C140 195 150 205 160 211','lo'),
('neck-left','M141 207 C145 222 143 236 139 246','mid'),
('neck-right','M221 211 C217 229 218 244 222 255','mid'),
('neck-tension','M164 227 C168 241 173 251 180 260 M211 226 C202 241 197 252 194 265','lo')]
fear_hair=['M110 115 C118 95 129 81 142 75','M118 108 C127 95 139 85 150 80','M132 94 C142 78 156 70 167 64','M150 85 C164 75 175 65 181 54','M168 73 C180 67 190 59 195 51','M189 67 C205 68 216 77 222 87','M217 63 C231 76 235 89 236 100','M115 88 C124 70 139 65 154 59','M146 57 C159 51 173 50 183 51','M112 131 L114 143']
fear_extra=ear_small('near-ear',116,144,.92)+eye('near-eye',154,135,31,5,-13,.65,True,lift=1.8)+eye('far-eye',207,126,24,4.6,-5,.64,lift=1.8)+flow_curves(fear_hair)
save('105199',shirt((139,234),(224,238))+group('head',fear,fear_extra))

# Surprise: rounder cranial shape, raised outer and inner brows and a dropped jaw.
surprise=[
('hair-outline','M117 140 C111 131 108 117 112 106 C108 94 114 79 124 72 C128 60 139 55 150 54 C160 44 172 43 182 47 C193 38 207 43 213 49 C225 45 237 55 238 65 C250 71 254 84 249 95 C256 107 250 123 246 133','sil'),
('hairline','M125 143 C124 131 128 120 134 110 C140 98 151 98 158 91 C166 85 172 87 180 81 C193 84 202 76 209 72 C222 78 231 87 236 100 C240 108 241 118 241 128','mid'),
('face-outline','M127 165 C131 184 142 200 153 212 C167 227 182 236 196 236 C210 237 222 228 228 214 C237 196 240 178 240 164 L246 133','sil'),
('near-brow','M149 117 C159 105 174 101 185 107','mid'),
('far-brow','M208 106 C217 100 229 104 236 113','mid'),
('forehead-first','M155 98 C175 88 196 90 212 94','lo'),
('forehead-second','M161 91 C175 84 194 84 205 88','lo'),
('inner-brow-plane','M192 106 C194 112 195 117 195 122','lo'),
('nose-bridge','M202 124 C201 134 205 143 208 149 C211 155 208 160 202 160','mid'),
('nose-base','M182 158 C186 162 191 163 195 160 C200 164 208 164 213 159','sil'),
('nose-wing','M182 155 C184 149 191 150 195 154 M210 153 C214 150 217 154 216 158','mid'),
('nostril','M185 158 Q189 153 194 157 M207 158 Q211 154 214 157','mid'),
('cheek-left','M148 143 C159 150 172 151 183 146','mid'),
('cheek-right','M212 139 C220 144 228 142 234 138','lo'),
('nasolabial','M178 164 C171 174 171 183 173 191 M216 165 C223 176 223 187 221 195','lo'),
('mouth-outline','M177 185 C180 177 187 174 195 176 C205 174 214 179 217 186 C217 193 211 199 202 202 C193 204 183 200 179 195 C177 191 176 188 177 185Z','sil'),
('upper-lip','M179 180 C185 171 192 171 197 172 C205 170 213 176 216 181','mid'),
('lower-lip','M182 205 C192 211 208 210 214 202','mid'),
('upper-dental-edge','M182 182 C191 178 202 179 212 185 L210 189 C200 185 191 184 182 187','lo'),
('tongue-plane','M186 198 C192 194 201 195 208 198','lo'),
('chin','M189 226 C197 229 206 228 212 224','lo'),
('neck-left','M145 202 C146 222 142 235 139 244','mid'),
('neck-right','M229 212 C225 230 227 243 231 251','mid'),
('neck-tendons','M168 226 C171 242 179 254 187 263 M218 228 C208 243 204 255 202 265','lo')]
surprise_hair=['M116 115 C121 104 128 100 135 96','M121 99 C125 85 138 78 151 77','M136 99 C144 88 155 84 162 75','M155 88 C167 78 175 68 172 57','M174 80 C188 76 196 64 191 53','M191 79 C203 73 210 62 207 53','M210 75 C224 71 231 81 233 91','M235 93 C246 96 246 108 243 117','M128 73 C135 61 149 60 156 65','M146 55 C158 49 166 51 171 56','M203 47 C213 45 220 53 219 61','M231 58 C241 64 243 75 239 81']
surprise_extra=ear_small('near-ear',122,142,.83)+ear_small('far-ear',246,145,.55,True)+eye('near-eye',150,129,32,6.2,-7,.49,True,lift=1.8)+eye('far-eye',209,126,25,5.6,3,.48,lift=1.8)+flow_curves(surprise_hair)
save('105200',shirt((138,231),(233,235))+group('head',surprise,surprise_extra))

# Laughter in strict profile: one eye, a continuous nose/lip/chin silhouette,
# a short receding dental edge and the raised cheek that explains the expression.
laugh=[
('hair-outline','M136 189 C121 184 111 172 106 157 C99 142 100 122 104 108 C106 90 119 75 133 65 C144 53 162 48 177 48 C190 39 203 45 213 47 C222 44 230 50 232 59 C238 63 237 71 232 77','sil'),
('hairline','M139 169 C144 157 143 148 144 137 C143 128 150 121 161 123 C167 120 171 113 171 105 C182 99 189 88 194 79 C206 77 218 73 225 65','mid'),
('forehead-profile','M232 77 C230 86 232 94 237 101 C239 105 239 109 242 112 C248 116 255 118 262 119 C269 120 270 124 264 128 C259 131 254 130 250 132 L248 137 C253 137 256 139 257 142','sil'),
('laughing-profile','M257 142 C252 144 246 146 241 148 C245 152 250 155 255 157 C260 160 259 163 256 166 C261 171 262 177 258 182 C251 189 243 191 233 194 C219 200 207 202 195 200','sil'),
('jaw-angle','M165 170 C169 183 181 195 195 200','mid'),
('brow','M209 106 C217 101 227 101 233 105','mid'),
('eye-closed','M214 115 C220 116 227 113 233 110','hi'),
('eye-upper-fold','M211 111 C217 107 226 108 231 110','mid'),
('eye-lower-fold','M214 119 C220 122 227 120 233 116','mid'),
('crow-feet','M211 114 L203 111 M211 118 L203 119 M213 121 L207 126','lo'),
('near-cheek','M218 131 C225 126 234 126 239 129','lo'),
('nose-wing','M242 127 C245 124 250 124 253 126','mid'),
('nostril','M247 129 C250 127 254 127 258 128','mid'),
('nasolabial','M239 133 C235 136 235 141 238 145','mid'),
('mouth-corner','M237 145 C238 148 240 150 242 150','mid'),
('upper-dental-edge','M242 147 C247 143 252 142 256 142 L255 146 C251 148 247 149 244 150','mid'),
('tooth-separations','M247 145 L248 148 M252 143 L253 147','lo'),
('lower-lip','M244 159 C248 162 252 164 256 164','mid'),
('chin-plane','M246 178 C250 176 254 176 257 177','lo'),
('smile-cheek','M202 136 C211 141 219 146 225 153','lo'),
('temple','M198 98 C200 104 200 108 200 112','lo'),
('neck-back','M137 184 C142 204 145 221 151 237','mid'),
('neck-front','M233 197 C221 212 218 224 219 239','mid'),
('sternomastoid','M174 187 C186 209 195 230 197 246','lo'),
('throat','M222 210 C217 213 213 218 212 224','lo')]
laugh_hair=['M106 134 C112 109 126 96 141 88','M112 114 C123 95 138 83 154 76','M130 100 C142 90 150 77 167 68','M146 102 C160 96 171 82 176 70','M164 97 C177 86 185 72 183 60','M184 86 C195 76 203 66 200 54','M200 78 C217 74 224 66 222 57','M111 154 C117 164 127 173 135 176','M118 143 C125 153 134 158 141 159','M121 91 C134 72 152 62 169 60','M137 66 C151 55 164 54 176 53','M176 49 C190 47 200 50 208 53']
laugh_extra=ear_small('near-ear',164,130,1.05)+flow_curves(laugh_hair)
save('105202',shirt((150,222),(222,229))+group('head',laugh,laugh_extra))

# A held wink: cheek compression on the closed side, a level open eye and
# an asymmetric smile. The facial silhouette is distinct from the happy study.
wink=[
('hair-outline','M135 132 C128 119 130 102 135 88 C139 73 149 62 163 56 C173 47 187 47 199 48 C213 40 225 47 234 50 C247 49 257 62 258 75 C267 87 264 106 258 119 L254 136','sil'),
('hairline','M143 141 C144 129 148 119 153 109 C158 99 171 98 176 89 C189 91 202 81 207 75 C216 82 228 80 237 88 C247 100 250 113 249 126','mid'),
('face-outline','M144 160 C148 177 155 191 168 204 C181 216 194 222 206 219 C220 215 230 204 236 191 C244 176 247 159 251 148 L254 136','sil'),
('closed-side-brow','M165 124 C177 119 192 120 204 125','mid'),
('open-side-brow','M224 120 C233 116 243 120 249 124','mid'),
('closed-lid','M166 134 C177 140 190 139 202 132','hi'),
('closed-upper-lid','M168 131 C180 134 191 133 199 130','mid'),
('closed-lower-lid','M171 143 C182 146 193 144 201 139','mid'),
('wink-crow-feet','M165 133 L157 129 M165 137 L156 138 M166 141 L160 145','lo'),
('wink-cheek','M168 150 C178 147 189 149 197 154','lo'),
('bridge-pressure','M210 124 C212 131 211 138 211 143','lo'),
('nose-bridge','M220 132 C219 142 222 148 224 154 C225 160 221 164 216 163','mid'),
('nose-wing','M200 157 C202 151 208 152 212 155 M198 161 C203 165 208 164 212 162 C217 166 223 165 227 161','sil'),
('nostrils','M201 161 Q205 157 210 160 M221 161 Q226 157 229 160','mid'),
('near-nasolabial','M194 158 C185 164 182 172 183 179','mid'),
('far-nasolabial','M231 167 C236 174 235 181 231 186','lo'),
('mouth-seam','M184 180 C196 186 208 187 218 185 C223 184 227 181 229 179','sil'),
('upper-lip','M188 179 C197 178 203 181 209 180 C216 182 223 181 226 179','mid'),
('lower-lip','M191 186 C202 192 217 192 225 186','mid'),
('smile-corner','M181 177 C181 180 182 183 185 185','mid'),
('chin','M194 205 C202 207 214 205 219 202','lo'),
('jaw-plane','M155 171 C160 186 169 195 179 200','lo'),
('forehead','M179 104 C192 100 207 102 218 106','lo'),
('neck-left','M159 197 C162 216 159 231 154 242','mid'),
('neck-right','M232 200 C231 218 235 231 242 243','mid'),
('neck-tendon','M180 216 C185 232 193 243 203 251','lo')]
wink_hair=['M134 111 C142 93 154 82 167 76','M144 109 C150 94 164 85 176 78','M162 96 C178 89 184 75 188 64','M179 87 C193 82 204 67 202 57','M197 80 C213 77 222 67 219 56','M215 81 C229 80 239 87 244 97','M238 69 C249 77 255 88 254 103','M141 83 C150 67 165 61 179 58','M174 53 C187 49 201 53 208 56','M249 108 L254 115']
wink_extra=ear_small('near-ear',140,137,.88)+eye('open-eye',224,134,24,3.5,4,.49)+flow_curves(wink_hair)
tee=group('shoulders',[
('left-shoulder','M52 272 C86 254 119 248 152 232','sil'),
('right-shoulder','M237 233 C270 245 307 252 348 272','sil'),
('crew-neck','M152 232 C161 260 203 272 236 246 L241 237','mid'),
('crew-neck-seam','M148 237 C158 267 202 279 237 253 L246 239','lo'),
('shirt-folds','M94 260 L126 256 M270 259 L304 267','lo')])
save('105203',tee+group('head',wink,wink_extra))

briefs={
'105193':('Three-quarter skull','A complete adult skull in three-quarter view facing left. Preserve the continuous cranial vault, unequal receding orbital cavities, nasal aperture, open zygomatic arch and attached mandible. A compact natural dental arcade has distinct incisor, canine and molar forms and a quieter lower row. Reserve the focal line for the near orbital rim.', 'The full vault and mandible stay connected. The dental arcade was redrawn with varying crown shapes after the first repeated-capsule version; this is an artistic osteological study, not a dental or medical atlas.', 'The skull holds still while the near orbital rim gently changes emphasis.', 'near-orbit'),
'105194':('Eye and eyelid structure','An enlarged human eye viewed obliquely. The upper lid wraps the globe, the lower rim has a shallow asymmetric curve, and the tear duct joins the inner corner. Clip the circular iris and pupil beneath the actual lid aperture. Suggest brow and nose bridge with a few continuous contours; no eyelash texture or radiating iris decoration.', 'The iris and pupil are explicitly clipped beneath the upper lid. Unequal lid arcs, tear duct and lower orbital fold establish depth without a cartoon full-circle eye. The sparse brow is structural rather than individual hair texture.', 'A quiet emphasis moves through the upper eyelid while the anatomy remains fixed.', 'upper-lid'),
'105195':('Auricle and concha','One upright dimensional human ear, with a continuous helix, a branching antihelix, concha, tragus, antitragus and fleshy lobe. Show the connections between folds and preserve clean negative spaces. A short temporal attachment places the ear on a head without drawing the entire head. Focus the upper helix.', 'The outer helix, antihelix branch, tragus and lobe are separately readable and connected. Interior folds have lower contrast than the silhouette; no spiral icon or decorative texture is used.', 'The upper helix receives one slow seven-second emphasis cycle.', 'ear-helix'),
'105196':('A quiet smile','A three-quarter adult male portrait with a relaxed smile and a slight head tilt. Lift the cheeks, soften the lower eyelids and curve the lips upward asymmetrically. Preserve adult cranial proportions, a dimensional ear, a believable nose and an open shirt collar. Clip both irises under reduced eyelid apertures; focus only the near upper eyelid.', 'Revised the eye apertures and clipped both irises after the earlier staring appearance. A single near lid is bright; the far eye is subordinate. The held smile uses cheek and lip curves, with small restrained head motion.', 'A held smile with a very small head inclination, returning to the same pose.', 'head'),
'105197':('Quiet sadness','An older adult male with an elongated face, receding swept hair and a lowered gaze. Raise and draw together the inner brows; keep the eyelids heavy and the mouth corners quietly lowered. Use nasolabial and chin contours to explain the expression instead of a generic frown. Preserve an attached long neck and open collar.', 'Distinct long jaw, inner-brow lift, downcast irises and heavy lids communicate sadness. Hair and beard are reduced to directional boundaries. No tears or theatrical expression morph is claimed.', 'The sad expression holds while the head settles by a fraction of a degree.', 'head'),
'105198':('Contained anger','A broad-jawed adult male turned slightly left. Compress the inner brows, narrow the eyes, tighten the nostril wings and press the lips. Show a square mandibular angle, short swept hair and neck tension with a few restrained curves. Focus one near upper eyelid; avoid decorative forehead hatch marks.', 'The wider mandible, compressed glabella, narrow eye apertures and pressed lips distinguish this portrait from sadness. Both irises remain contained by their lids; one focal upper lid carries the eye contact.', 'A held angry expression with a tiny coherent head inclination.', 'head'),
'105199':('A moment of fear','An adult male looking upward to the right, with raised knitted inner brows, tense wide eyes, a retracted slightly parted mouth and taut neck tendons. The lower lids remain supportive and the upper teeth are a short quiet strip. Use a slim asymmetrical jaw and swept hair. Keep the fear readable through coordinated facial muscles, not bulging eyeballs.', 'Fear uses an upward side gaze, brow knitting, horizontal mouth tension and restrained upper teeth. It differs from surprise in both gaze and mouth geometry. The native curves simplify the muscle planes without deforming the eyes.', 'A held fearful glance with a tiny head recoil and return; the expression is not morphed.', 'head'),
'105200':('Open surprise','An adult male with a rounder cranial shape and loose swept curls. Raise both inner and outer brows, show naturally wide eyes and drop the lower jaw for a soft vertically open mouth. Keep eyelids wrapped around clipped irises and the upper dental edge in perspective. Avoid a circular emoji mouth or symmetric graphic eyes.', 'The more vertical open mouth, evenly raised brows and level gaze separate surprise from fear. Jaw and throat remain attached. The drawing contains no continuous expression transition; it holds one authored pose.', 'A held surprised expression with a small coherent head inclination and return.', 'head'),
'105202':('Laughter in profile','A right-facing adult male profile in laughter. Draw one eye only, compressed by a raised cheek. Connect forehead, nasal bridge, nose tip, upper lip, receding open mouth, lower lip and chin as a continuous profile silhouette. A small perspective dental edge sits beneath the upper lip. Show the near ear and the neck leading naturally into an open collar.', 'The single-eye profile has a connected nose, lip and chin contour. The mouth interior recedes toward its corner, and the short dental edge follows the upper lip. This is a held laugh with head intention, not a complete jaw-opening cycle.', 'A held profile laugh with a small backward inclination and return.', 'head'),
'105203':('A knowing wink','An adult male portrait with one eye closed, the same-side cheek lifted, the other eye gently open, and an asymmetric closed-mouth smile. Coordinate the closed lid, crow-feet and compressed cheek rather than deleting the eye. Draw distinct swept hair, a tapered jaw and a crew-neck shirt. Reserve the focal accent for the closed eyelid.', 'The closed lid, cheek lift and asymmetric smile are authored together. The opposite iris is clipped beneath a normal narrow aperture. The wink remains held; motion does not claim to open or close the eyelid.', 'A held wink with a small head inclination and return.', 'head')}
for id,(title,subject,review,motion,target) in briefs.items():
 prompt=('Create a clean native SVG drawing, 1200 by 900 pixels with a 400 by 300 viewBox. '+subject+' Use Hairline-inspired contour discipline adapted to organic anatomy: background #101014, silhouette #a1a1aa, internal structure #52525b, receding detail #27272a, and one meaningful focal contour #fafafa. Use a uniform 0.92-pixel non-scaling stroke with round caps and joins. Favor continuous anatomical cubic curves, meaningful occlusion and clear negative space. No embedded raster images, filled tonal shapes, gradients, filters, grain, repetitive hatching, labels, borders or text. Keep a complete silhouette and generous safe margins. The original source photo supplies anatomical context; the internal realistic corpus plate supplies proportional construction. Rebuild selected contours independently, without copying a photographed page layout. Animate only the stated restrained action in a seamless seven-second loop; preserve all facial feature dimensions and attachment.')
 if id in ['105193','105194','105195']:
  anim=[{'target':target,'attribute':'stroke','values':['#fafafa','#a1a1aa','#fafafa'],'keyTimes':[0,.5,1]}]
 else:
  pivot={'105196':(193,241),'105197':(190,241),'105198':(196,242),'105199':(184,253),'105200':(190,251),'105202':(191,236),'105203':(197,243)}[id]
  angle={'105196':-.35,'105197':.32,'105198':-.3,'105199':-.35,'105200':-.3,'105202':-.4,'105203':.35}[id]
  x,y=pivot
  anim=[{'target':'head','type':'rotate','values':[f'0 {x} {y}',f'{angle} {x} {y}',f'0 {x} {y}'],'keyTimes':[0,.5,1]}]
 corrections={'105194':' Independent review identified an overly narrow pupil; it was broadened to a near-circular foreshortened form and re-rendered.', '105199':' Independent review identified an upper eyelid too narrow for the expression; both upper lids were lifted while the lower rims stayed fixed, then re-rendered.', '105200':' Independent review identified normal-width eyes beneath strongly raised brows; the upper lids were lifted without moving the lower rims, then re-rendered. The mouth was also widened and made less circular.'}
 record={'id':id,'title':title,'svg':f'corpus/svg/{id}.svg','prompt':prompt,'method':'Hand-authored native cubic anatomical contours informed by the original source observation and the owned realistic-v2 construction plate; no automatic edge trace, bitmap embedding or generated texture in the final SVG.','review':{'notes':review+corrections.get(id,''),'scope':'Authored still inspected at full size and native thumbnail size by the author and an independent collaborating reviewer. Animation reviewed separately by the corpus compositor.'},'motionCaption':motion,'animations':anim}
 records.append(record)
 path=OUT/f'{id}.svg'
 source=path.read_text().replace(f'<title>{id} — clean anatomical line study</title>',f'<title>{escape(title)}</title>')
 path.write_text(source)
(ROOT/'corpus/hairline').mkdir(exist_ok=True)
(ROOT/'corpus/hairline/faces.json').write_text(json.dumps(records,indent=2)+'\n')
print(f'Authored {len(records)} native face studies.')
