#!/usr/bin/env python3
"""Original native SVG story illustrations and exactly-seven-second SMIL editions.
The drawing paths are authored here; no source photograph is embedded or traced.
"""
from pathlib import Path
from html import escape
import json, math
ROOT=Path(__file__).resolve().parents[1]
INK='#24343b'; PAPER='#f3eee2'; SAGE='#87958a'; RUST='#a56850'; GOLD='#bc945a'

def P(d,fill='none',stroke=INK,w=2.2,extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def E(cx,cy,rx,ry,fill,stroke='none',w=1,extra=''):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" {extra}/>'
def G(name,content,transform='',extra=''):
    return f'<g id="{name}"'+(f' transform="{transform}"' if transform else '')+f' {extra}>{content}</g>'
def A(kind,values,keys='0;.12;.24;.54;.72;1',center='',attr=None):
    if attr:
        return f'<animate attributeName="{attr}" values="{values}" keyTimes="{keys}" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="'+ ';'.join(['.42 0 .58 1']*(len(keys.split(';'))-1))+'"/>'
    return f'<animateTransform attributeName="transform" type="{kind}" values="{values}" keyTimes="{keys}" dur="7s" repeatCount="indefinite" additive="sum" calcMode="spline" keySplines="'+ ';'.join(['.42 0 .58 1']*(len(keys.split(';'))-1))+'"/>'
def anim(s): return '<!--MOTION-->'+s+'<!--/MOTION-->'
def stalk(x,y,h,lean=0,fill=SAGE):
    d=P(f'M{x} {y} Q{x+lean} {y-h/2} {x+lean} {y-h}',w=1.4)
    for n,side in [(0.30,-1),(0.48,1),(0.65,-1),(0.82,1)]:
        yy=y-h*n; xx=x+lean*n
        d+=P(f'M{xx} {yy} C{xx+side*36} {yy-6} {xx+side*38} {yy-30} {xx+side*8} {yy-18} Q{xx+side*3} {yy-10} {xx} {yy}',fill,w=1.1)
        d+=P(f'M{xx} {yy} Q{xx+side*15} {yy-12} {xx+side*29} {yy-19}',stroke=INK,w=.8)
    return d

def defs(id):
 return f'''<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c4d2cc"/><stop offset=".63" stop-color="#eee5ce"/><stop offset="1" stop-color="{PAPER}"/></linearGradient>
 <linearGradient id="coat" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#bd8870"/><stop offset=".46" stop-color="#a36954"/><stop offset="1" stop-color="#553f3c"/></linearGradient>
 <linearGradient id="sage" x1="0" y1="0" x2=".85" y2=".7"><stop stop-color="#cbd1ae"/><stop offset=".42" stop-color="#99aa8c"/><stop offset="1" stop-color="#526d69"/></linearGradient>
 <linearGradient id="skin" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#eed6b2"/><stop offset=".47" stop-color="#d6b794"/><stop offset="1" stop-color="#9b7868"/></linearGradient>
 <linearGradient id="worm" x1=".1" y1="0" x2=".8" y2="1"><stop stop-color="#e1c49a"/><stop offset=".48" stop-color="#b89272"/><stop offset="1" stop-color="#756e64"/></linearGradient>
 <linearGradient id="inkwash"><stop stop-color="#63777a"/><stop offset="1" stop-color="#253c43"/></linearGradient>
 <linearGradient id="linen" x1="0" y1="0" x2=".8" y2=".6"><stop stop-color="#f7efd7"/><stop offset=".65" stop-color="#d3c6a9"/><stop offset="1" stop-color="#a69a87"/></linearGradient>
 <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e1c68c"/><stop offset=".37" stop-color="#b78d50"/><stop offset=".64" stop-color="#c9ab73"/><stop offset="1" stop-color="#806142"/></linearGradient>
 <radialGradient id="glow"><stop stop-color="#fff4b6" stop-opacity=".95"/><stop offset=".35" stop-color="#e5ca85" stop-opacity=".36"/><stop offset="1" stop-color="#ebce8e" stop-opacity="0"/></radialGradient>
 <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(26)"><path d="M0 0 V9" stroke="{INK}" stroke-width=".8" opacity=".35"/></pattern>
 <pattern id="cross" width="11" height="11" patternUnits="userSpaceOnUse"><path d="M-3 11 L11 -3 M0 14 L14 0 M0 0 L11 11" fill="none" stroke="{INK}" stroke-width=".65" opacity=".32"/></pattern>
 <pattern id="paper" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M6 9h1m21 19h1m-13 9h1m19-32h1" stroke="#796e56" stroke-width=".8" opacity=".18"/></pattern>
 <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
 <clipPath id="scene"><rect x="80" y="70" width="1040" height="750" rx="26"/></clipPath>
 </defs>'''

def base(title,desc,body,id):
 return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc>{defs(id)}
<rect width="1200" height="900" fill="{PAPER}"/>
<g clip-path="url(#scene)">{body}<rect x="80" y="70" width="1040" height="750" fill="url(#paper)" pointer-events="none"/></g>
<rect x="80" y="70" width="1040" height="750" rx="26" fill="none" stroke="#b2aa96" stroke-width="1"/>
<path d="M106 841h70m848 0h70" stroke="#8d8d7c" stroke-width="1"/>
<text x="600" y="847" text-anchor="middle" fill="{INK}" font-family="Georgia,serif" font-size="16" letter-spacing="3">{escape(title.upper())}</text>
</svg>'''

def pirate():
 s='<rect x="80" y="70" width="1040" height="750" fill="url(#sky)"/>'
 # Air, distant headland and sea: atmospheric value separation.
 s+=E(906,207,97,97,'#e9d6a5',extra='opacity=".55"')
 s+=P('M928 123 C858 139 847 228 909 267 C865 268 823 226 830 182 C837 136 877 112 928 123','#f7ecd2','none')
 s+=P('M80 465 C176 457 205 426 284 445 C350 457 394 423 471 442 C536 458 598 434 666 455 C771 442 814 410 897 437 C973 450 1043 426 1120 449 L1120 657 L80 657Z','#aebdb3','none')
 s+=P('M80 500 C194 484 276 501 366 486 C506 473 572 497 685 482 C834 469 935 497 1120 477 L1120 678 L80 678Z','#bdc6b7','none')
 for i in range(12):
  y=494+i*11;x=100+(i*61)%180
  s+=P(f'M{x} {y} Q{x+80} {y-4} {x+142} {y} M{x+377} {y+3} Q{x+436} {y-1} {x+505} {y+3} M{x+720} {y-5}h100',stroke='#617c7a',w=.8,extra='opacity=".38"')
 # Far ship, etched rigging.
 ship=P('M240 484 Q287 506 350 482 L334 507 Q292 519 256 506Z','#637d7b','none')
 ship+=P('M298 370V492 M275 392V490 M248 490L298 374L344 492 M277 392L317 489',stroke='#607776',w=1.2)
 ship+=P('M302 377 Q320 414 340 440 Q321 450 302 442Z','#e1ddc5','#8c9d91',1)
 ship+=P('M294 386 Q269 424 265 450 Q284 449 294 445Z','#e9e1c9','#8c9d91',1)
 s+=G('distant-sailing-ship',ship)
 for x,y in [(385,230),(430,249),(311,270),(941,310)]:
  s+=P(f'M{x-15} {y+4} Q{x-5} {y-7} {x} {y} Q{x+6} {y-10} {x+19} {y-4}',stroke='#6c807c',w=1.5)
 # Dock with two vanishing directions and chipped planks.
 s+=P('M80 668 L779 595 L1120 665 L1120 820 L80 820Z','#cfbea0',w=1.6)
 for y in [671,704,744,791]:s+=P(f'M80 {y} L785 {y-59} L1120 {y-4}',stroke='#8d8773',w=1.1)
 for x in [122,304,510,747,992]:s+=P(f'M{x} 820 L{620+(x-620)*.55:.1f} 614',stroke='#9a8f77',w=1)
 for x,y in [(163,723),(393,700),(465,781),(858,751),(1032,693),(695,670)]:
  s+=P(f'M{x} {y}c14-3 34-4 49-1m-44 5c11-3 21-2 31-1',stroke='#918773',w=.8)
  s+=E(x+2,y-10,1.6,1.1,INK)
 s+=E(622,737,179,23,'#51574e',extra='opacity=".15" filter="url(#soft)"')
 # Dock bollard and rope.
 s+=P('M186 694 L185 604 Q202 591 222 601 L227 694 Q207 709 186 694Z','url(#inkwash)',w=2)
 s+=E(204,601,21,9,'#637a78',INK,1.5)
 for y in [626,636,646]:s+=P(f'M174 {y} Q201 {y+16} 238 {y+1}',stroke='#b99c6f',w=8)+P(f'M174 {y-1} Q201 {y+14} 238 {y}',stroke='#6f6c58',w=1)
 s+=P('M232 641 C311 695 348 606 416 656 C460 686 416 730 365 715',stroke='#968261',w=6)
 s+=P('M232 638 C311 692 348 603 416 653 C460 683 416 727 365 712',stroke='#d8c4a0',w=2)
 # Long coat tails behind legs.
 s+=G('captain-coat-tails',P('M555 445 C533 500 510 556 479 642 L535 683 Q581 614 608 546 Q615 624 672 681 L712 643 C689 558 688 501 661 445Z','url(#coat)',w=2.7)+P('M559 482 Q538 573 504 642 L533 665 Q567 595 584 535 M642 514 Q660 606 688 653 L707 643',fill='url(#hatch)',w=1.2))
 # Trousers and boots individually posed, asymmetry.
 legs=P('M565 507 Q588 500 612 517 L615 585 Q597 623 583 671 L547 671 Q546 625 560 584Z','url(#linen)',w=2.4)
 legs+=P('M610 514 Q637 498 657 519 Q671 561 672 587 Q664 620 688 659 L655 676 Q619 632 617 598 Q607 572 610 514Z','url(#linen)',w=2.4)
 legs+=P('M554 582 Q574 567 600 570 M560 595 Q577 583 590 582 M551 633 Q565 626 583 629 M623 560 Q644 555 658 568 M629 582 Q645 578 664 590 M643 628 L665 640',w=1.3)
 legs+=P('M545 651 Q565 659 589 651 L583 714 Q592 728 611 733 Q620 745 605 749 L534 748 Q526 735 536 722Z','url(#inkwash)',w=2.4)
 legs+=P('M649 650 Q665 646 685 636 L708 704 Q729 712 744 730 Q748 741 735 744 L680 731 Q666 722 666 703Z','url(#inkwash)',w=2.4)
 legs+=P('M544 672 Q561 680 584 672 M539 704 Q557 711 582 705 M536 735 Q569 741 606 740 M665 666 L686 656 M672 691 L696 684 M678 716 Q706 720 735 736',stroke='#a1aaa1',w=1.2)
 legs+=P('M542 665L539 722 M680 662L694 709',stroke='#c3bda7',w=2)
 legs+=P('M575 583Q565 615 568 648L583 650Q584 615 598 589Z','url(#hatch)','none')
 legs+=P('M645 595Q641 616 666 653L683 642Q661 614 667 594Z','url(#hatch)','none')
 for k in range(14):
  legs+=P(f'M{571-k*.2:.1f} {682+k*2.6:.1f}l8 -5 M{675+k*.6:.1f} {672+k*2.4:.1f}l9 -4',stroke='#152f35',w=.75,extra='opacity=".8"')
 s+=G('captain-standing-legs',legs)
 # Torso, soft linen folds inside the cutaway coat.
 torso=P('M552 363 Q596 344 639 356 Q670 369 680 411 L663 521 Q616 549 555 519 Q539 454 552 363Z','url(#linen)',w=2.6)
 torso+=P('M569 360 Q563 401 582 451 Q592 484 576 523 L542 535 Q526 449 539 384Z','url(#coat)',w=2.3)
 torso+=P('M630 357 Q631 403 616 453 L632 528 L681 514 Q680 443 668 385Z','url(#coat)',w=2.3)
 torso+=P('M570 359 L584 388 L571 408 L591 443 L565 424 L548 375Z','#c09876',w=1.4)
 torso+=P('M634 356 L616 390 L629 408 L610 448 L644 418 L654 374Z','#bc8d70',w=1.4)
 torso+=P('M591 385 Q597 433 593 467 M606 391 Q603 414 610 437 M579 458 L594 476 M614 461 L603 487 M583 493 Q597 488 617 496',w=1.2)
 torso+=P('M545 497 Q611 515 678 488 L680 513 Q609 540 549 520Z','#4c4d45',w=2)
 torso+=P('M603 506 L629 502 L634 521 L606 526Z','url(#brass)',w=1.6)+P('M610 511L624 508L627 517L612 520Z','#52574a',w=1)
 torso+=P('M554 425 L551 491 M649 432 L664 481',stroke='#d2aa86',w=1.1)
 for x,y in [(555,440),(557,466),(652,445),(658,468)]:torso+=E(x,y,3,4,'url(#brass)',INK,.9)
 torso+=P('M540 409Q535 455 545 493L557 496Q546 445 552 416Z','url(#cross)','none')
 torso+=P('M656 430Q666 464 670 486L649 494L638 450Z','url(#hatch)','none')
 torso+=P('M577 465Q588 483 581 497L597 503L598 484Z','url(#hatch)','none')
 for k in range(11):
  torso+=P(f'M{644+k*1.6:.1f} {456+k*2:.1f}l8 -8',stroke='#394540',w=.55,extra='opacity=".62"')
 s+=G('captain-torso',torso)
 # Supporting arm with antique star chart.
 left=P('M544 378 C520 374 506 393 503 417 L478 469 Q478 491 498 504 L536 490 L528 464 Q542 429 557 407Z','url(#coat)',w=2.5)
 left+=P('M514 409 Q512 437 494 463 M506 473 Q517 476 530 469 M511 393 L536 402',w=1.2)
 left+=P('M482 472 Q500 484 522 480 L522 503 L492 511Z','url(#linen)',w=1.7)
 left+=P('M487 496 Q479 501 477 512 L481 537 Q488 545 495 533 L503 519 Q509 525 515 517 Q519 505 511 499Z','url(#skin)',w=1.8)
 left+=P('M487 509L489 525 M495 505L497 521 M502 504L505 514',w=1)
 # chart, including subtle celestial notation.
 left+=P('M424 508 Q463 513 483 500 L522 575 Q481 594 444 582 L423 528 Q412 524 414 516 Q416 509 424 508Z','url(#linen)',w=1.8)
 left+=P('M423 512 Q433 510 437 521 L447 576 M437 525 Q473 529 491 516 M449 572 Q484 581 511 567',stroke='#9c9076',w=1)
 left+=P('M457 540 L489 549 M477 532L470 563 M457 554L489 535',stroke='#829185',w=1)
 left+=E(473,546,13,13,'none','#8d947f',.9)+E(473,546,4,4,'#b78d50')
 for x,y in [(457,562),(491,558),(453,534)]:left+=P(f'M{x-3} {y}h6m-3-3v6',stroke='#8b8069',w=.8)
 s+=G('captain-chart-arm',left+anim(A('rotate','0 544 390;-3 544 390;1 544 390;1 544 390;0 544 390;0 544 390')))
 # Neck and face, beard sculpted as multiple curling tapered shapes.
 head=P('M582 334 L579 370 Q600 392 624 368 L626 333Z','url(#skin)',w=2)
 head+=P('M574 271 C594 247 632 253 651 279 Q663 294 656 314 L667 330 Q670 336 653 339 Q653 359 634 369 Q597 374 579 344 L567 307Z','url(#skin)',w=2.6)
 head+=P('M644 290 Q650 312 643 321 L659 329 L644 333',fill='#b4957c',stroke='none')
 head+=P('M572 292 C552 289 550 311 563 321 L578 323 L585 303Z','#b69275',w=1.7)
 head+=P('M566 300 Q557 302 566 313 L573 307',w=1.2)
 head+=P('M575 266 Q580 247 609 247 Q636 246 651 271 L643 285 Q624 270 607 276 Q588 280 582 303 L572 312 Q563 292 575 266Z','#46534d',w=1.5)
 head+=P('M581 316 Q592 339 606 339 Q610 328 626 334 Q638 341 653 336 Q659 356 643 373 L633 370 L624 384 L610 376 L600 382 L587 365 Q576 352 576 336Z','#53605a',w=2)
 head+=P('M592 344 Q600 349 603 364 M609 350L615 371 M623 347L628 368 M636 347 Q645 348 641 359 M581 335L588 352',stroke='#aeb2a0',w=1.2)
 head+=P('M612 328 Q623 315 634 327 L648 330 Q635 338 623 330 Q615 336 607 335Z','#4b5650',w=1)
 head+=P('M614 306 Q628 297 641 305',w=3)+P('M619 313 Q629 307 639 311',w=1.5)
 head+=E(632,312,2.7,3.1,INK)+P('M613 319 Q619 322 626 320 M624 295L638 294',stroke='#987c69',w=1)
 head+=E(565,322,5,7,'none','#bd9d65',2.4)
 # Tricorn silhouette, worn leather and a long feather with separate barb paths.
 head+=P('M546 279 Q556 254 551 231 Q593 244 614 218 Q645 224 666 252 Q682 254 703 238 Q701 273 672 286 Q612 284 546 279Z','url(#inkwash)',w=2.8)
 head+=P('M553 272 Q578 264 591 247 Q625 257 649 246 Q659 267 680 274 Q617 287 553 272Z','#485852',w=1.4)
 head+=P('M554 234 Q574 251 590 249 M612 224Q639 231 650 252 M683 268Q692 257 697 244',stroke='#bda679',w=2)
 head+=P('M575 254 C527 229 501 194 511 155 C532 181 565 180 576 209 C588 222 583 238 575 254Z','#d8c9a4','#6c756a',1.3)
 head+=P('M515 165Q531 216 577 253',w=1.2)
 for i in range(8):
  y=179+i*8;x=520+i*5
  head+=P(f'M{x} {y}l-9 -8m13 14l9 -8',stroke='#8e9480',w=.8)
 for k in range(13):
  x=584+k*4
  head+=P(f'M{x} {344+(k%3)*3}q3 10 6 16',stroke='#233c3b',w=.65)
 for k in range(7):head+=P(f'M{592+k*3} {285+k*.7:.1f}l-3 7',stroke='#8a7664',w=.6)
 s+=G('captain-head',head+anim(A('rotate','0 606 361;-2 606 361;1 606 361;1 606 361;0 606 361;0 606 361')))
 # Articulated observing arm: shoulder to elbow to wrist, telescope follows hand.
 arm=P('M662 378 Q683 373 700 389 L720 407 Q728 404 731 388 L738 352 L763 358 Q766 404 747 431 Q728 451 705 430 L672 414Z','url(#coat)',w=2.6)
 arm+=P('M679 390 Q697 398 711 419 M722 421Q736 417 741 400 M752 375L744 395',w=1.4)
 arm+=P('M734 350 L737 372 Q750 380 765 371 L768 349Z','url(#linen)',w=1.8)
 arm+=P('M737 354 Q729 341 731 327 L741 318 Q748 315 752 323 L754 339 Q759 322 766 325 Q772 329 767 343 L761 355Z','url(#skin)',w=1.8)
 arm+=P('M740 327L741 343 M748 325L749 340 M756 336L755 345',w=1)
 scope=P('M651 314 L819 276 L826 300 L658 337Z','url(#brass)',w=2)
 scope+=P('M670 309L677 333 M705 300L712 325 M782 284L789 309',w=1.4)
 scope+=P('M811 271 L834 266 L844 299 L820 305Z','url(#brass)',w=2)
 scope+=E(839,282,6.3,17,'#314a50','#1d343c',1.7,extra='transform="rotate(-16 839 282)"')
 scope+=P('M837 271Q844 281 840 291',stroke='#b9d1c2',w=1.5)
 scope+=P('M664 318L806 285',stroke='#f5e1af',w=1.2)
 arm+=G('brass-telescope',scope,'translate(0 -12)')
 # Fingers overlap the optical tube; the eyepiece aligns with the eye, not the nose.
 arm+=P('M737 344 L734 319 Q733 309 739 306 Q744 305 745 313 L748 332 L749 306 Q750 298 756 302 L758 326 Q762 312 767 316 Q771 319 766 333 L761 350Z','url(#skin)',w=1.5)
 arm+=P('M742 316L745 334 M752 309L754 330 M763 324L760 337',w=.85)
 s+=G('captain-telescope-arm',arm+anim(A('rotate','0 667 392;5 667 392;-5 667 392;-5 667 392;1 667 392;0 667 392')))
 # Foreground story detail: crab guards the compass.
 crab=P('M863 747 Q866 731 886 731 Q905 732 909 747 Q890 762 863 747Z','#ad7659',w=1.7)
 crab+=P('M870 747L855 757L848 753 M870 741L850 741L841 735 M902 748L917 758L924 754 M902 741L921 740L927 733 M869 734L860 720 M902 735L912 718',w=1.5)
 crab+=P('M859 721 Q846 719 849 707 L859 713 L866 705 Q872 719 859 721Z','#b7825d',w=1.4)+P('M912 720 Q900 717 905 707 L912 713 L920 705 Q926 718 912 720Z','#b7825d',w=1.4)
 crab+=P('M877 735L875 727 M893 735L895 726',w=2)+E(875,726,2.4,3,INK)+E(895,726,2.4,3,INK)
 s+=G('compass-crab',crab+anim(A('translate','0 0;-1 0;2 -2;2 -2;-1 0;0 0')))
 s+=E(943,765,21,9,'url(#brass)',INK,1.6)+E(943,763,15,6,'#e4d9b8',INK,.7)+P('M934 763L943 758L951 763L942 767Z','#77594c',w=.5)
 return s

def marsh():
 s='<rect x="80" y="70" width="1040" height="750" fill="url(#sky)"/>'
 s+=E(780,224,150,150,'#ece5c7',extra='opacity=".6"')
 # Receding wetland, willow arches, reflected light.
 s+=P('M80 499 Q207 430 317 490 Q406 459 510 483 Q664 444 780 482 Q952 434 1120 470 L1120 820 L80 820Z','#bcc7b9','none')
 s+=P('M80 578 C213 541 313 587 415 560 C589 516 684 579 826 535 Q1006 527 1120 566 L1120 820 L80 820Z','#a7b7a8','none')
 s+=P('M101 70 C109 228 155 331 122 547 L80 588 L80 70Z','#8e9f8f','none')
 s+=P('M1099 70 C1038 196 1044 357 1102 523 L1120 555 L1120 70Z','#7f9789','none')
 for x,y in [(111,133),(112,234),(1085,166),(1071,279)]:
  direction=1 if x<600 else -1
  s+=P(f'M{x} {y} C{x+direction*87} {y-61} {x+direction*148} {y-33} {x+direction*182} {y+5}',stroke='#8e9f8b',w=4)
  for i in range(4):
   xx=x+direction*(54+32*i)
   s+=P(f'M{xx} {y-22} Q{xx+direction*12} {y+25} {xx+direction*2} {y+79}',stroke='#8e9f8b',w=1.2)
   for j in range(3):
    yy=y+5+j*22
    s+=P(f'M{xx+direction*5} {yy} Q{xx+direction*28} {yy+6} {xx+direction*14} {yy+22} Q{xx+direction*5} {yy+13} {xx+direction*5} {yy}',fill='#94a592',stroke='none')
 for i in range(10):
  y=598+i*17
  s+=P(f'M{115+i*8} {y} Q{251+i*9} {y-9} {390+i*6} {y} M{707+i*2} {y+6} Q{876+i*2} {y-6} 1089 {y+5}',stroke='#68877e',w=.85,extra='opacity=".5"')
 s+=E(594,704,241,36,'#435e58',extra='opacity=".17" filter="url(#soft)"')
 # Far dorsal fin and webbed hind feet.
 fin=P('M503 556 C399 527 349 436 365 350 C411 394 446 384 468 331 C482 414 529 419 572 416 C539 452 551 509 577 546Z','#bdaf88',w=2)
 fin+=P('M505 547 Q411 461 371 363 M508 545 Q455 437 468 344 M510 549 Q500 468 558 424',stroke='#7d8068',w=1.3)
 fin+=P('M409 401 Q416 455 462 495 M480 426Q479 468 500 510',stroke='#e6d3a9',w=1.4)
 s+=G('dragon-far-sail',fin+anim(A('rotate','0 540 548;3 540 548;-7 540 548;-3 540 548;1 540 548;0 540 548')))
 foot=P('M530 589 Q550 612 527 640 L492 672 L454 676 L472 659 L452 660 L473 643 L464 636 Q487 626 494 598Z','url(#sage)',w=2.2)
 foot+=P('M493 649L478 666 M503 651L494 669 M485 636Q501 634 512 621',w=1.3)
 foot+=P('M660 600 Q682 626 674 649 Q657 664 639 674 L606 672 L626 659 L610 655 L634 648 Q638 630 628 617Z','url(#sage)',w=2)
 foot+=P('M642 651L628 663 M652 656L644 667',w=1.2)
 s+=G('dragon-hind-feet',foot)
 # Broad serpentine body with built-in twist and receding tail.
 body=P('M552 546 C495 500 435 517 393 552 C346 593 312 603 286 578 C264 558 274 533 301 525 C268 521 236 542 239 578 C244 626 305 649 361 632 C411 618 422 589 456 588 C430 647 478 687 544 689 C628 692 685 644 687 589 C689 532 644 501 620 462 C598 430 615 402 647 374 L668 319 C605 331 565 364 555 405 C539 456 585 487 578 522Z','url(#sage)',w=3)
 body+=P('M278 584 C306 617 352 605 382 582 C435 544 479 538 517 565 C496 594 482 628 511 660 C470 648 469 618 482 596 C439 568 411 607 369 625 C320 646 270 630 252 599Z','#536f65','none')
 body+=P('M596 386 C581 426 595 456 621 486 C652 522 665 556 650 600 C634 653 582 676 530 663 C577 648 609 619 611 583 C615 536 592 510 579 483 C549 435 567 399 596 386Z','#d0d0a5',w=1.4)
 body+=P('M629 501 Q645 532 640 555 Q628 588 600 608 C561 637 535 626 519 609 Q512 640 537 657 C588 664 640 632 651 590 Q667 544 629 501Z','url(#hatch)','none')
 body+=P('M252 573Q265 558 280 559 M257 589Q270 577 286 581 M271 606Q280 591 298 594 M290 619Q296 600 315 601 M315 625Q316 606 336 598 M341 624Q341 603 357 588 M369 610Q366 590 382 573 M396 590Q393 572 406 563',stroke='#405d57',w=1.1)
 # Cross-contour plates bend with the underside.
 for d in ['M582 411 Q598 414 613 403','M579 431 Q597 438 608 422','M584 451 Q603 456 618 441','M594 472 Q612 477 631 461','M604 492 Q625 499 642 484','M612 515 Q636 522 651 507','M619 539 Q639 546 658 533','M619 565 Q639 572 658 558','M615 590 Q633 604 652 588','M605 611 Q622 627 640 613','M587 632 Q597 651 617 642','M566 645 Q571 664 589 662','M540 651 Q540 667 557 671']:
  body+=P(d,stroke='#7b8f73',w=1.4)
 for x,y,r in [(473,550,8),(487,560,5),(460,565,4),(547,554,8),(558,570,5),(539,584,6),(564,600,4),(575,555,3),(581,496,4),(568,468,5),(563,444,3),(576,396,5),(592,379,3),(344,610,3),(324,618,4),(307,613,3)]:
  body+=P(f'M{x-r} {y} Q{x} {y-r*1.5} {x+r} {y} Q{x} {y+r} {x-r} {y}',fill='#526d63',stroke='#314d4c',w=.7)
 body+=P('M269 606C308 635 352 612 382 596Q424 553 463 572L477 582Q434 573 395 608C344 643 297 642 269 606Z','url(#cross)','none')
 body+=P('M492 628Q497 676 552 681Q598 682 634 655Q594 700 535 687Q490 682 474 651Z','url(#hatch)','none')
 for row in range(4):
  for col in range(9):
   x=482+col*11+row*3; y=584+row*13+math.sin(col*.55)*5
   body+=P(f'M{x:.1f} {y:.1f}q4 8 9 1',stroke='#426259',w=.7,extra='opacity=".7"')
 for k in range(10):body+=P(f'M{556+k*.6:.1f} {408+k*4.5:.1f}l8 -5',stroke='#3f6056',w=.7)
 s+=G('dragon-coiled-body',body)
 # Tall ornamental spikes read as leaf-like antlers, not teeth.
 spines=''
 for x,y,dx,dy in [(566,493,-23,-34),(552,464,-31,-31),(546,436,-31,-23),(550,405,-30,-16),(561,379,-22,-30)]:
  spines+=P(f'M{x} {y} Q{x+dx-3} {y+dy+18} {x+dx} {y+dy} Q{x+3} {y+dy+10} {x+9} {y-12}Z','#d8c79d',w=1.3)
 s+=G('dragon-leaf-spines',spines)
 # Near wing: articulated delicate fan.
 wing=P('M549 570 C519 518 491 471 486 407 C522 439 565 414 582 380 C580 433 611 445 640 435 C609 480 611 530 588 562 Q566 579 549 570Z','#bdc3a0',w=2.3)
 wing+=P('M552 564Q528 470 490 414 M553 565Q559 460 581 388 M554 563Q594 485 633 441',w=1.3)
 wing+=P('M511 454Q530 474 536 509 M572 450Q568 492 560 530 M599 474Q584 516 565 543',stroke='#ecdfbc',w=2)
 wing+=P('M551 568 Q560 550 579 552 Q591 555 588 567',fill='#829680',w=1.4)
 for k in range(13):
  wing+=P(f'M{518+k*2.7:.1f} {478+k*5.7:.1f}q10 3 18 -1',stroke='#8a9578',w=.6,extra='opacity=".65"')
 s+=G('dragon-near-sail',wing+anim(A('rotate','0 556 568;3 556 568;-12 556 568;-7 556 568;2 556 568;0 556 568')))
 # Long head and facial planes. Brows/cheek guide focus toward lantern.
 head=P('M624 392 Q616 368 638 344 L661 311 Q683 286 715 293 C736 296 742 317 760 321 L801 328 Q818 332 815 347 Q808 365 782 368 L729 366 Q702 383 677 395Z','url(#sage)',w=2.8)
 head+=P('M651 345 Q679 331 703 340 Q714 357 731 356 L798 347 Q808 347 812 339 Q817 357 785 366 L733 364 Q706 382 675 390 L637 389Z','#d6d4b1','none')
 head+=P('M695 303 Q706 282 689 264 Q678 253 669 239 Q667 270 683 287 Q668 297 666 315Z','#c7b78f',w=1.9)
 head+=P('M669 244Q676 273 690 283',w=1)
 head+=P('M651 317 Q627 299 615 267 Q637 265 652 280 Q670 294 662 316Z','#8c9f84',w=1.7)
 head+=P('M625 275Q642 285 651 305',stroke='#c7ceb0',w=1.4)
 # Branching antler grounded in the skull.
 head+=P('M689 301 C704 276 719 255 713 226 C710 214 694 202 694 184 C705 190 710 204 719 206 C728 187 727 172 724 158 C743 176 742 194 730 219 C738 237 734 254 724 269 C743 258 752 246 761 224 C769 247 757 270 734 280 L711 309Z','#b69c73',w=1.7)
 head+=P('M703 296Q731 255 720 220 M728 275Q748 261 760 236',stroke='#eee0b9',w=1.3)
 head+=P('M689 321 Q703 307 719 320',w=2.7)+E(705,328,8,9,'#e7d6aa',INK,1.2)+E(709,329,3.5,5,INK)+E(710,326,1.3,1.8,'#f7efd7')
 head+=P('M687 342 Q697 350 708 347 M738 346Q767 354 796 343 M792 335Q799 332 803 337',w=1.5)
 head+=E(795,336,2.4,1.8,INK)
 head+=P('M734 360 C762 389 822 372 832 345 C838 330 826 318 817 325 C810 332 821 337 826 330',stroke='#4d6761',w=2.1)
 head+=P('M716 366 C731 399 779 408 795 391 C806 379 793 368 786 377',stroke='#748474',w=1.4)
 for x,y in [(648,359),(659,350),(675,344),(727,323),(738,332)]:head+=P(f'M{x-4} {y}q4-6 8 0q-4 5-8 0',fill='#718a74',w=.6)
 s+=G('dragon-bowing-head',head+anim(A('rotate','0 632 390;-3 632 390;5 632 390;5 632 390;-1 632 390;0 632 390')))
 # Forelimb carries a hanging seed lantern, with separate pendant follow-through.
 arm=P('M627 509 Q640 482 664 494 Q677 507 689 524 L748 488 L758 505 Q722 543 687 548 Q663 547 647 528Z','url(#sage)',w=2.3)
 arm+=P('M654 504Q670 528 687 532L741 502',stroke='#cdd3ae',w=1.3)
 arm+=P('M744 488 Q749 477 759 479 L775 487 Q780 493 774 497 L760 490 L776 503 Q780 510 773 513 L754 502 Q762 514 754 516 L745 506Z','#b2b89a',w=1.7)
 lantern=P('M769 501Q789 488 805 503',w=1.5)+P('M786 498V528',w=1.6)
 lantern+=E(787,578,84,88,'url(#glow)')
 lantern+=P('M769 532 L787 517 L804 533 L808 584 Q789 612 767 584Z','url(#brass)',w=2)
 lantern+=P('M773 542 Q786 535 799 542 L801 578 Q790 593 773 580Z','#ead59c',w=1.2)
 lantern+=P('M780 581Q775 568 787 553Q798 570 790 582Z','#fff0b0','none')
 lantern+=P('M769 535H804 M767 584Q786 592 808 584 M787 537V590',w=1.5)
 lantern+=E(787,605,3,5,'#a9895b',INK,1)
 arm+=G('seed-lantern',lantern+anim(A('rotate','0 787 501;6 787 501;-9 787 501;3 787 501;-2 787 501;0 787 501')))
 s+=G('dragon-lantern-foreleg',arm+anim(A('rotate','0 635 510;3 635 510;-7 635 510;-7 635 510;1 635 510;0 635 510')))
 # Lily pads overlap each other, different viewing angles establish the water plane.
 for x,y,r in [(292,708,67),(903,687,73),(829,745,47),(400,758,57),(1003,779,83)]:
  s+=P(f'M{x} {y} L{x+r} {y-8} C{x+r-7} {y-31} {x-r} {y-30} {x-r} {y-3} C{x-r-7} {y+20} {x+r} {y+21} {x+r} {y+3}Z','#899f87','#4c7164',1.4)
  s+=P(f'M{x-r+9} {y-2}Q{x-14} {y-13} {x} {y}L{x+26} {y+12} M{x} {y}L{x-20} {y+14}',stroke='#bdc5a3',w=1)
 s+=P('M907 679 C881 659 882 632 903 641 Q911 616 923 643 C944 632 950 661 928 680Z','#e4d8b4',w=1.4)
 s+=P('M903 641Q903 666 917 679Q932 663 923 643 M894 651L910 673',stroke='#a99274',w=1)
 for x,y,h,lean in [(161,790,158,10),(194,798,112,-12),(1055,812,190,-16),(1024,810,117,8)]:s+=stalk(x,y,h,lean,'#768e78')
 # Three fireflies, restrained light only.
 for i,(x,y) in enumerate([(824,408),(870,449),(898,375)]):
  fly=E(x,y,19,19,'url(#glow)')+P(f'M{x} {y}q-11-12-15-4q0 8 15 4q12-13 16-6q3 8-16 6','#d5d7b6','#8e9b80',.8)+E(x,y,2.5,4,'#e7c66e',INK,.7)
  s+=G(f'marsh-firefly-{i}',fly+anim(A('translate',f'0 0;{-3-i} -4;{3+i} -9;{6+i} -3;-2 2;0 0')))
 return s

def worm():
 s='<rect x="80" y="70" width="1040" height="750" fill="url(#sky)"/>'
 s+=P('M80 70H1120V595 Q903 539 727 574 Q512 539 305 586Q172 576 80 604Z','#cbd0b9','none')
 # A dappled canopy: shapes fade into the paper before the subject.
 for x,y,r in [(174,156,115),(342,133,93),(1007,203,115),(859,113,92)]:
  s+=P(f'M{x-r} {y} C{x-r} {y-r*.7} {x+r*.5} {y-r} {x+r} {y-12} Q{x+r*.6} {y+r*.8} {x} {y+r*.6} Q{x-r*.7} {y+r} {x-r} {y}',fill='#a8b79f',stroke='none',extra='opacity=".45"')
 s+=P('M219 70 C252 232 219 381 192 618 L157 640 Q194 319 158 70Z','#9cad96','none')
 s+=P('M1024 70 C993 238 1009 455 1058 618 L1108 638 Q1046 322 1084 70Z','#9aaa94','none')
 s+=P('M239 252 Q341 192 389 91 M1012 296Q928 218 889 140',stroke='#9cad96',w=17)
 s+=P('M80 654 C214 590 338 639 447 614 C583 589 705 603 819 626 C929 604 1031 604 1120 652 L1120 820H80Z','#b5bba0','none')
 s+=P('M80 717 C229 665 362 705 482 662 C651 633 787 714 918 666 Q1022 657 1120 704V820H80Z','#cfc8a8','none')
 # Split seed shell in the middle distance, a miniature hollow home.
 s+=P('M851 640 Q855 562 919 550 Q980 563 985 643 L956 657 Q902 673 851 640Z','#918c71',w=1.5)
 s+=P('M865 636 Q867 579 920 567 Q967 585 968 640Z','#d4c6a3',w=1.2)
 s+=P('M878 640 Q884 590 920 588 Q950 599 952 644Z','#687e6c',w=1)
 for x in [865,878,893,942,956,969]:s+=P(f'M{x} 635Q{x-10} 586 918 555',stroke='#7d8068',w=.8)
 # Luminous mushrooms, gill anatomy and a curved supporting stalk.
 mushroom=P('M291 423 C313 489 291 564 276 644 Q296 664 322 645 C334 562 331 489 317 426Z','url(#linen)',w=2)
 mushroom+=P('M300 446 Q312 528 293 634 M315 459Q324 552 310 641',stroke='#9a9c7f',w=1.3)
 mushroom+=P('M194 425 C206 366 261 333 313 341 C365 347 411 389 415 432 Q367 455 310 447 Q254 462 194 425Z','url(#coat)',w=2.4)
 mushroom+=P('M198 426 C259 407 358 411 412 431 C361 458 255 462 198 426Z','#ded0a9',w=1.5)
 for x in range(209,406,13):mushroom+=P(f'M{x} 430Q{(x+312)/2:.1f} 442 312 444',stroke='#8d8871',w=.9)
 mushroom+=P('M212 403 Q241 359 286 355 M333 354Q376 366 397 405',stroke='#d1a385',w=1.5)
 for x,y,rx,ry in [(239,392,11,5),(285,366,15,7),(332,387,18,8),(365,412,10,4),(278,413,8,4)]:
  mushroom+=P(f'M{x-rx} {y}Q{x} {y-ry*2} {x+rx} {y}Q{x} {y+ry} {x-rx} {y}',fill='#d5b08d',stroke='#91654e',w=.8)
 s+=G('great-russet-mushroom',mushroom)
 # Smaller overlapping mushroom before the large stalk.
 s+=P('M214 563Q211 607 225 664L241 661Q224 609 232 563Z','url(#linen)',w=1.4)
 s+=P('M167 561Q173 516 222 516Q265 515 282 557Q228 579 167 561Z','#af9273',w=1.7)
 s+=P('M173 561Q221 551 276 557Q232 579 173 561Z','#e2d4b0',w=1)
 for x in [181,198,214,237,252,268]:s+=P(f'M{x} 562L225 569',stroke='#a59b7e',w=.7)
 s+=E(586,715,244,32,'#59634f',extra='opacity=".17" filter="url(#soft)"')
 # Worm's posterior has massive compressible forms, never a simple ellipse stack.
 body=P('M781 687 C821 683 837 663 830 646 C824 632 806 640 797 651 C780 670 747 665 722 638 C694 603 655 593 617 603 C589 608 574 626 558 641 C524 611 469 603 424 626 C387 645 364 676 377 700 C393 728 444 729 477 717 C510 740 549 739 581 724 C624 744 661 738 684 720 C727 737 760 721 781 687Z','url(#worm)',w=3)
 body+=P('M381 693 C423 710 454 688 475 692 C517 709 543 706 566 690 C608 711 652 706 677 691 C707 712 750 710 779 686 C754 724 721 729 684 714 C650 741 615 736 581 719 C540 741 510 736 477 713 C438 735 398 726 381 703Z','#807b66','none')
 body+=P('M416 637Q446 657 442 710 M446 626Q483 661 477 716 M485 628Q511 665 511 725 M521 638Q544 678 548 728 M564 634Q585 674 582 724 M600 611Q619 655 620 734 M637 606Q657 654 655 731 M674 617Q692 657 684 720 M707 637Q722 673 714 722 M736 660Q744 682 739 719 M767 668Q776 685 765 708 M792 659Q804 671 792 684',stroke='#6b7464',w=1.7)
 body+=P('M404 645Q416 663 416 682 M457 641Q470 659 468 681 M495 643Q508 658 508 675 M615 627Q627 649 627 671 M655 626Q667 643 667 662 M717 657Q726 670 725 685',stroke='#ead4ad',w=2.3)
 body+=P('M384 682Q420 694 439 678 M482 696Q498 704 511 694 M588 704Q608 710 620 702 M659 706Q675 708 683 699 M744 699L761 690',stroke='#4f625a',w=1)
 body+=P('M380 694Q428 716 477 700Q520 725 580 707Q629 728 685 706Q724 725 765 705Q726 740 685 722Q631 746 580 726Q526 746 477 719Q404 738 380 704Z','url(#cross)','none')
 for i in range(35):
  x=394+i*10.4;y=691+math.sin(i*.8)*8
  body+=P(f'M{x:.1f} {y:.1f}q-3 8 2 13',stroke='#5b6c5d',w=.65,extra='opacity=".72"')
 s+=G('worm-weighted-coil',body)
 # Lifting torso is a single curved volume whose cross contours tighten at the bend.
 torso=P('M558 689 C516 663 496 620 506 574 C514 538 548 521 558 490 L566 441 L638 431 C645 477 631 514 617 548 C608 574 628 599 654 621 C682 646 674 677 646 692 C620 706 582 706 558 689Z','url(#worm)',w=2.8)
 torso+=P('M566 464 C587 484 580 528 559 559 C535 597 547 641 577 665 C595 680 627 683 654 673 C635 701 590 706 559 685 C522 656 504 615 518 575 C533 534 554 524 566 464Z','#d8c29c','none')
 torso+=P('M619 491 C617 523 595 551 594 576 C593 613 640 635 645 654 Q662 676 646 688 C670 675 680 651 654 624 C620 596 612 575 618 550 C632 517 642 477 635 449 L622 454Z','url(#hatch)','none')
 for d in ['M559 495Q594 515 631 492','M551 517Q583 539 625 518','M537 539Q564 563 615 543','M523 562Q551 587 610 566','M515 587Q542 610 613 590','M519 614Q553 634 627 614','M531 639Q569 660 646 638','M550 661Q588 684 662 662']:
  torso+=P(d,stroke='#777f68',w=1.5)
 for x,y in [(538,579),(543,604),(560,632),(582,652),(585,521),(576,545)]:
  torso+=P(f'M{x} {y}l3-4m5 4l2-4m5 3l2-3',stroke='#9c8b6f',w=.8)
 for k in range(19):
  x=602+math.sin(k*.17)*14;y=519+k*7.4
  torso+=P(f'M{x:.1f} {y:.1f}q5 5 13 3',stroke='#657663',w=.65,extra='opacity=".7"')
 s+=G('worm-rising-neck',torso)
 # Expressive head, rolled cheek planes, sculptural brow and a warm asymmetrical smile.
 head=P('M559 481 C528 468 517 439 524 409 C529 380 557 354 592 356 C627 351 658 373 666 402 L678 423 Q684 433 672 440 L653 445 C649 474 630 490 600 492 Q577 497 559 481Z','url(#worm)',w=2.8)
 head+=P('M529 428 Q545 442 561 438 Q572 469 593 470 Q628 474 651 451 C642 476 621 494 595 491 Q550 492 529 454Z','#d5c19b','none')
 head+=P('M624 391 Q640 403 641 423 L661 429 Q646 437 631 432',fill='#ad8c6f',stroke='none')
 head+=P('M540 404 Q553 390 573 402 M601 397Q621 382 638 398',w=3)
 head+=P('M543 414 Q555 401 569 412 Q555 428 543 414Z','#e7d7b5',w=1.5)
 head+=P('M605 409 Q621 394 635 406 Q622 423 605 409Z','#e7d7b5',w=1.5)
 head+=E(561,413,4,5,INK)+E(626,406,4,5,INK)+E(562,411,1.3,1.5,'#f7efd7')+E(627,404,1.3,1.5,'#f7efd7')
 head+=P('M552 449 Q585 464 618 445 Q628 440 635 442 M546 446Q541 451 545 456 M634 440L637 447',w=1.8)
 head+=P('M569 469Q593 476 609 465',stroke='#937f64',w=1.1)
 head+=P('M534 432Q543 439 553 435 M610 428Q623 434 635 427',stroke='#b48369',w=3,extra='opacity=".45"')
 for x,y in [(542,433),(552,431),(562,435),(608,430),(617,426),(628,428)]:head+=E(x,y,1.4,1,'#806e5c')
 # A leaf bonnet and curling feelers echo the reference's horned silhouette without copying it.
 bonnet=P('M526 408 C504 380 520 349 554 341 C585 320 619 333 637 355 Q656 368 657 392 C629 371 611 366 592 373 Q556 363 526 408Z','#879579',w=2.1)
 bonnet+=P('M528 394Q556 357 591 362Q622 355 650 381 M549 346Q551 365 533 387 M576 338Q582 348 582 363 M609 340Q605 354 607 366',stroke='#c4c5a0',w=1.2)
 bonnet+=P('M529 408Q529 448 547 460',stroke='#6e7b62',w=2)+P('M649 392Q659 429 643 452',stroke='#6e7b62',w=2)
 bonnet+=P('M545 459q-18-5-15 5q8 8 18-3q16-9 19 0q-6 10-19 1l3 17',stroke='#687b65',w=1.6)
 head+=G('worm-leaf-bonnet',bonnet)
 feelerL=P('M543 375 C503 366 476 340 483 307 C491 277 523 273 538 292 C553 310 537 332 522 325 C511 320 519 309 527 313 C519 294 501 302 504 319 C507 340 532 340 554 350Z','url(#worm)',w=2.1)
 feelerL+=P('M544 362C503 348 491 326 496 308 M505 287L511 300 M492 299L505 309 M488 315L503 319 M494 336L510 331 M509 350L520 340 M526 360L534 348',stroke='#6c7564',w=1.1)
 head+=G('worm-left-curled-feeler',feelerL+anim(A('rotate','0 549 366;3 549 366;-6 549 366;-3 549 366;2 549 366;0 549 366')))
 feelerR=P('M620 358 C656 332 677 299 669 273 C659 247 636 241 621 259 C613 272 622 287 633 285 C639 284 638 277 632 276 C628 269 636 265 642 271 C660 289 635 319 607 337Z','url(#worm)',w=2.2)
 feelerR+=P('M614 345Q660 313 658 284 M642 252L637 266 M657 260L647 273 M668 279L654 284 M669 301L654 297 M656 322L646 309 M639 342L629 327',stroke='#6b7665',w=1.1)
 head+=G('worm-right-curled-feeler',feelerR+anim(A('rotate','0 616 350;-3 616 350;8 616 350;4 616 350;-1 616 350;0 616 350')))
 s+=G('worm-curious-head',head+anim(A('rotate','0 589 487;-3 589 487;6 589 487;6 589 487;-1 589 487;0 589 487')))
 # The light, small enough to preserve a single visual story.
 fly=E(803,345,88,88,'url(#glow)')
 fly+=P('M801 342 C782 314 763 319 773 333 Q780 343 801 342 C810 318 832 318 827 332 Q821 343 801 342Z','#e6e1bc','#7b8d75',1.1)
 fly+=P('M781 328L798 340 M818 327L804 340',stroke='#a1aa8a',w=.8)
 fly+=P('M798 337 Q808 333 812 343 Q817 358 806 364 Q795 355 798 337Z','#d9ba69',w=1.4)
 fly+=P('M801 350L813 348 M805 338L802 330 M807 338L812 330',w=1)
 fly+=E(806,358,5,5,'#ffe8a0')
 s+=G('borrowed-star-firefly',fly+anim(A('translate','0 0;-18 5;-41 -14;-29 -26;-8 -5;0 0')))
 # Tattered seed pods, a small trail and fern fans with overlap.
 for x,y,h,lean in [(136,793,170,5),(182,810,112,-6),(1020,811,194,11),(961,804,110,-10)]:s+=stalk(x,y,h,lean,'#718670')
 for i in range(7):
  x=825+i*25;y=746+(i%2)*7
  s+=P(f'M{x} {y}q6-4 10-1',stroke='#7e816a',w=1.3)
 s+=P('M313 776 C326 731 362 728 386 742 Q407 749 424 776 Q372 802 313 776Z','#b0946d',w=1.7)
 s+=P('M321 775Q351 759 411 777 M334 746L348 767 M356 739L365 770 M379 745L385 772',stroke='#645f4e',w=1)
 for x,y in [(472,778),(709,773),(775,789),(244,738)]:s+=P(f'M{x-10} {y}Q{x-3} {y-9} {x+8} {y-2}Q{x+11} {y+4} {x-10} {y}',fill='#aaa68b',stroke='#7a806b',w=.9)
 # Dewdrop hanging from a fern tip to echo the light.
 s+=P('M1008 677Q998 690 1008 697Q1017 691 1008 677Z','#d7ddd0','#8d9c8a',.8)+E(1005,689,1.3,2.3,'#f7f1d9')
 return s

def gardener():
 s='<rect x="80" y="70" width="1040" height="750" fill="url(#sky)"/>'
 s+=E(337,220,118,118,'#e7d9b4',extra='opacity=".55"')
 # Old garden walls: softly irregular masonry, atmospheric distance.
 s+=P('M80 452 Q183 436 299 449 Q432 437 537 451 Q677 429 818 444 Q995 433 1120 446V820H80Z','#c1c4ab','none')
 for i in range(5):
  y=470+i*34
  s+=P(f'M80 {y} Q366 {y-10} 618 {y-2} T1120 {y-5}',stroke='#9ca88f',w=.9)
  for x in range(100+(i%2)*58,1100,118):s+=P(f'M{x} {y-31}L{x-4} {y-3}',stroke='#a3ac94',w=.8)
 # Trellis arch is an airy frame, with vines carefully separated from the face.
 s+=P('M196 582 L198 294 C202 132 420 119 444 285 L448 585 M214 584L216 296 C223 157 395 150 426 288L430 584',stroke='#8b9982',w=2.5)
 for y in [329,385,441,497]:s+=P(f'M200 {y}H442 M215 {y+11}H429',stroke='#a3ac92',w=1)
 s+=P('M227 586 C201 511 259 454 228 395 C188 332 266 283 240 230 C221 183 261 146 292 144',stroke='#667f6a',w=2.1)
 for x,y,side in [(231,521,-1),(228,479,1),(236,444,1),(224,409,-1),(219,366,-1),(236,320,1),(244,269,1),(233,231,-1),(251,183,-1)]:
  s+=P(f'M{x} {y}C{x+side*29} {y-28} {x+side*48} {y-13} {x+side*22} {y+8}Q{x+side*5} {y+10} {x} {y}',fill='#94a487',stroke='#72886f',w=.9)
  s+=P(f'M{x} {y}L{x+side*29} {y-8}',stroke='#c8ceb0',w=.8)
 s+=P('M80 692 C239 621 371 682 473 646 Q718 614 846 659 Q997 618 1120 673V820H80Z','#c8c1a2','none')
 s+=P('M164 820L411 665L501 657L349 820Z','#ddd1b0','#aaa589',1)
 for y,x in [(705,346),(748,282),(794,205)]:s+=P(f'M{x} {y}L{x+105} {y+8}',stroke='#ada387',w=1.3)
 # A leaning garden fork and full-bodied cabbage establish human scale.
 s+=P('M952 631L1000 382',stroke='#8c7657',w=8)+P('M950 631L997 384',stroke='#c8ae7b',w=2)
 s+=P('M1000 391 L1010 340 M989 390 L1000 338 M1011 391 L1021 343 M989 390 Q1000 402 1011 391',stroke='#5d746c',w=4)
 cab=P('M926 694 C899 673 906 639 931 637 C929 607 964 597 984 618 C1008 598 1036 622 1028 644 C1055 656 1047 683 1027 694Q973 718 926 694Z','#91a184',w=1.8)
 cab+=P('M941 693 C920 658 942 628 962 640 C971 616 999 632 995 651 C1023 636 1031 676 1009 695Z','#b0b897',w=1.2)
 cab+=P('M977 699 Q952 678 959 653Q977 645 987 662Q1007 675 977 699 M930 652Q946 663 943 684 M1019 652Q1005 673 1009 685 M969 626Q967 634 968 641',stroke='#5e7c67',w=1.2)
 s+=G('garden-cabbage',cab)
 s+=E(618,738,218,29,'#4a5d4e',extra='opacity=".15" filter="url(#soft)"')
 # Kneeling trousers: bent knee strongly foreshortened, weight on ground.
 legs=P('M522 571 Q547 552 577 570 L614 620 Q625 659 597 684 L541 715 L509 702 Q532 672 560 650 L516 621Z','url(#inkwash)',w=2.5)
 legs+=P('M582 574 Q612 555 636 580 Q667 612 667 653 Q665 681 643 708 L597 709 Q610 675 611 653 L579 622Z','url(#inkwash)',w=2.5)
 legs+=P('M531 592Q552 612 564 637 M555 660Q575 655 591 665 M620 598Q632 626 629 648 M627 664Q639 671 653 669 M605 692L639 694',stroke='#8f9a89',w=1.5)
 legs+=P('M514 691 Q530 695 544 710 L520 735 Q479 753 446 746 Q431 737 445 728 L478 717Z','#5b6054',w=2.2)
 legs+=P('M596 696Q619 702 643 697L642 726Q669 731 684 742Q689 753 675 757L590 751Q581 739 590 725Z','#5b6054',w=2.2)
 legs+=P('M444 737Q474 745 512 729 M594 738Q624 745 679 748 M488 717L507 725 M480 724L499 731 M602 709H625 M599 719H623',stroke='#b9b59c',w=1.1)
 legs+=P('M579 590Q601 616 612 640Q622 666 603 690L619 694Q641 659 627 632Z','url(#cross)','none')
 for k in range(12):legs+=P(f'M{599+k*.35:.1f} {711+k*2.1:.1f}l14 -4',stroke='#304b43',w=.75)
 s+=G('gardener-kneeling-legs',legs)
 # Jacket: torn edges are dry cloth, patches and folds add lived history.
 torso=P('M520 394 Q563 377 600 393 Q629 409 635 451 L637 563 L651 586 L628 581 L627 598 L607 589 Q558 608 507 581 L495 590 L495 573 L478 574 Q486 538 489 493 L494 431Z','url(#sage)',w=2.6)
 torso+=P('M535 398L563 419L546 439L563 470L521 445L513 410Z','#b3b99a',w=1.7)
 torso+=P('M585 393L565 419L581 440L566 475L607 439L605 405Z','#b1b79a',w=1.7)
 torso+=P('M553 424Q573 443 584 474L597 572Q566 588 533 572L535 476Z','#d4c9a7',w=1.5)
 torso+=P('M552 450Q569 461 582 452 M549 473Q569 486 586 473 M548 498Q571 508 590 497 M548 523Q572 532 593 523',stroke='#958b71',w=1)
 # Apron silhouette, seamed pocket and stitching.
 torso+=P('M523 432L541 437L536 475Q563 486 596 472L592 431L610 427L619 582Q575 619 512 585Z','url(#coat)',w=2)
 torso+=P('M523 445L519 580Q570 604 607 578L601 443',stroke='#d4ab84',w=1.2)
 torso+=P('M538 516Q566 522 594 515L595 555Q570 568 539 556Z','#9f715a',w=1.4)
 torso+=P('M544 524Q566 530 588 523 M546 550Q566 557 587 549',stroke='#d7b28c',w=.9,extra='stroke-dasharray="2 4"')
 torso+=P('M501 480L514 485L507 506L495 501Z','#9d8f6c',w=1)+P('M498 480L494 484 M506 485L502 490 M500 499L496 504 M510 494L505 499',w=1)
 torso+=P('M611 476Q626 487 629 509 M503 431Q492 467 497 483 M612 542L629 552',w=1.3)
 torso+=P('M600 477L614 477L619 579Q603 596 581 600L580 585Q605 580 600 548Z','url(#cross)','none')
 torso+=P('M497 481L509 487L505 548L491 565Z','url(#hatch)','none')
 for k in range(14):torso+=P(f'M{601+k*.4:.1f} {500+k*5.3:.1f}l8 -6',stroke='#594e41',w=.6)
 s+=G('gardener-patched-apron',torso)
 # Supporting arm: cloth folds gather at cuff and thin fingers curl over the knee.
 left=P('M505 410 Q480 406 464 434 Q450 465 463 491 L500 546 L521 531 L493 479 Q492 451 515 438Z','url(#sage)',w=2.3)
 left+=P('M471 434Q481 449 489 450 M467 456Q477 469 485 470 M472 486L495 513',w=1.3)
 left+=P('M492 519L510 507L528 533L507 551Z','#d8ccad',w=1.5)
 left+=P('M510 541 Q516 533 527 537 L556 555 Q562 563 556 567 L538 557 L557 576 Q560 585 553 587 L531 565 L547 587 Q549 595 542 595 L519 569 L529 591 Q530 598 523 597 L509 568 Q503 554 510 541Z','#a8b393',w=1.8)
 left+=P('M517 549L536 560 M518 565L524 563 M528 570L533 567 M540 575L544 573',w=1)
 left+=P('M468 443L475 439L480 451L472 455Z','#b79f74',w=1)
 s+=G('gardener-resting-hand',left+anim(A('rotate','0 505 424;-1 505 424;2 505 424;1 505 424;0 505 424;0 505 424')))
 # Neck: dry stylized anatomy, layered tendons, no gore.
 neck=P('M550 352L542 401Q562 425 584 400L591 350Z','url(#sage)',w=2)
 neck+=P('M555 361L560 397L567 406 M581 359L570 395 M548 387Q565 381 585 384',w=1.2)
 neck+=P('M560 366L575 370L571 381L562 379Z','#5c7466',w=1)
 s+=G('gardener-neck',neck)
 # Skull-like facial planes, friendly brow, one missing tooth and humorous cowlick.
 head=P('M516 291 C517 254 543 236 576 244 C609 247 631 273 627 304 L619 338 Q617 368 589 380 Q556 394 532 365 L520 336 Q503 326 507 309Z','url(#sage)',w=2.8)
 head+=P('M576 249Q608 259 614 281L605 306L619 321L604 338L604 361Q590 375 576 374L568 349L550 340L550 322L539 301L543 268Z','#bdc4a2','none')
 head+=P('M519 297Q530 300 535 316L531 333L517 326Q503 316 510 306Z','#8e9f84',w=1.5)
 head+=P('M516 308Q524 305 526 316L520 320',w=1.1)
 # Asymmetric dark sockets with expressive eyelids, clear lively eye.
 head+=P('M536 301Q546 283 562 296L568 312Q555 329 538 317Z','#4d6359',w=1.3)
 head+=P('M581 299Q599 284 610 299L605 315Q592 325 580 314Z','#62796b',w=1.3)
 head+=P('M538 297Q548 289 561 296 M582 295Q596 282 608 292',stroke='#334f49',w=2.4)
 head+=P('M541 306Q551 300 562 306Q551 318 541 306Z','#dcd8b3',w=1)+E(555,307,3.5,4.5,INK)+E(556,306,1.1,1.4,'#f3eee2')
 head+=P('M583 305Q592 311 604 303',stroke='#d8dab4',w=1.7)
 head+=P('M575 308L568 329Q573 336 584 330Z','#647c69',w=1)
 head+=P('M539 328L550 333L548 343 M605 325L592 335L597 344',w=1.5)
 head+=P('M549 346 Q573 360 601 341 Q599 360 582 366 Q559 371 549 346Z','#455e54',w=1.6)
 head+=P('M554 350L559 359L566 360L565 354 M577 355L579 363L587 360L586 352 M594 348L592 356L598 350',fill='#e1dbc0',stroke='#b8b99f',w=.6)
 head+=P('M560 376Q575 380 589 373 M532 338L540 346 M605 338L611 331',stroke='#7f947c',w=1)
 # Scars are sewn, like a well-loved rag doll.
 head+=P('M546 270Q563 264 581 270 M550 265L551 275 M559 263L560 272 M569 264L569 274 M578 267L577 276',w=1.1)
 head+=P('M610 277L616 285 M612 275L608 282 M616 280L612 287',w=1)
 hair=P('M513 294 Q503 275 516 262 L509 250L526 253L524 235L541 242L550 226L560 237L573 221L578 237Q601 227 619 246L635 248L628 260L638 277L628 285L625 304L613 288L615 274L600 264L596 279L587 259L570 265L559 250L544 265L530 267L527 290Z','#617165',w=1.9)
 hair+=P('M521 263L524 279 M540 246L534 260 M557 239L552 253 M574 236L570 250 M595 242L601 255 M618 254L622 270',stroke='#b7bc9e',w=1.3)
 head+=G('gardener-tousled-hair',hair)
 # A tiny daisy behind the ear turns the unsettling silhouette toward kindness.
 head+=P('M521 302L510 280',stroke='#4f7661',w=1.4)
 for deg in range(0,360,60):
  rad=math.radians(deg);x=508+math.cos(rad)*7;y=276+math.sin(rad)*7
  head+=E(round(x,1),round(y,1),3.5,6,'#eee4c6','#8f9c82',.5,extra=f'transform="rotate({deg+90} {x:.1f} {y:.1f})"')
 head+=E(508,276,4,4,'#b8995c',INK,.6)
 for k in range(9):head+=P(f'M{530+k*2.4:.1f} {342+k*2.8:.1f}l6 -3',stroke='#52705f',w=.7)
 for k in range(7):head+=P(f'M{603+k*.8:.1f} {322+k*3:.1f}l5 -5',stroke='#52705f',w=.65)
 s+=G('gardener-kindly-head',head+anim(A('rotate','0 566 392;-2 566 392;5 566 392;4 566 392;0 566 392;0 566 392')))
 # Upper arm anchored to shoulder; articulated forearm carries the jug.
 upper=P('M611 418Q632 405 651 427L674 456L688 472L671 493Q648 482 635 469L610 449Z','url(#sage)',w=2.2)
 upper+=P('M633 427Q635 446 650 455 M649 437L660 458 M649 470L663 466',w=1.2)
 s+=G('gardener-watering-upper-arm',upper)
 fore=P('M673 469Q698 477 717 472L743 462L753 481Q729 502 704 503L673 495Z','url(#sage)',w=2)
 fore+=P('M708 475L718 499L734 493L726 469Z','#d4c7a5',w=1.4)
 fore+=P('M731 467Q744 454 757 460L772 473Q776 480 770 484L754 473L748 480L764 490Q768 497 762 500L744 488L738 480Z','#a4b090',w=1.7)
 fore+=P('M744 466L757 476 M746 481L755 488',w=1)
 # Well-loved tea jug, with a bird motif and a visible hollow handle.
 jug=P('M772 458Q780 442 797 449Q812 455 803 475L796 483L790 475Q806 464 798 457Q786 450 781 465Z','#c6b58e',w=1.7)
 jug+=P('M753 465Q775 474 802 464L800 506Q782 523 760 508Z','url(#linen)',w=2)
 jug+=P('M801 474Q812 474 820 464L823 468Q817 485 800 488Z','#d7c9a8',w=1.5)
 jug+=E(777,466,25,6,'#b4aa8d',INK,1.3)+E(777,465,20,3.6,'#617d75')
 jug+=P('M764 490Q775 478 788 489L785 496Q775 500 767 493L762 496L764 490Z','#7d9886',w=.8)
 jug+=P('M777 484L783 479L783 487 M769 493L767 499 M777 498L778 502',stroke='#59776c',w=.8)
 jug+=E(785,487,1,1,INK)+P('M790 488L794 489L790 491Z','#b59d6d',w=.5)
 jug+=P('M760 475L764 504',stroke='#eee6c9',w=1.4)
 fore+=G('gardener-tea-jug',jug)
 s+=G('gardener-pouring-forearm',fore+anim(A('rotate','0 678 482;-4 678 482;12 678 482;12 678 482;1 678 482;0 678 482')))
 # Arc and droplets explicitly pulse only when the vessel tips.
 water=P('M823 498 C843 523 829 554 826 579',stroke='#729c99',w=2.6,extra='opacity=".72"')
 water+=P('M828 508Q841 533 833 553',stroke='#e4e5c8',w=1.2)
 for x,y in [(828,585),(832,596),(821,605),(841,607)]:water+=P(f'M{x} {y}q-4 7 0 9q4-3 0-9Z',fill='#86aaa2',stroke='none')
 water+=anim(A('', '0;0;.8;.8;0;0', attr='opacity'))
 s+=G('watering-stream',water,extra='opacity="0"')
 # Sapling is the emotional payoff: a lift with delayed settling.
 s+=E(823,720,87,14,'#6a7059',extra='opacity=".17"')
 pot=P('M772 631L874 631L862 710Q827 735 784 711Z','url(#coat)',w=2.3)
 pot+=P('M772 645Q823 660 874 645L877 628Q826 643 769 628Z','#c39772',w=1.5)
 pot+=E(823,629,54,13,'#d2b08a',INK,1.5)+E(823,628,46,8,'#5f6150',INK,.8)
 pot+=P('M790 661L798 704 M850 664L846 712',stroke='#dfb58b',w=1.2)+P('M802 715Q824 723 845 716',stroke='#624e40',w=1)
 s+=G('terracotta-home',pot)
 plant=P('M822 629 C821 604 835 575 824 549',stroke='#4d7360',w=3)
 plant+=P('M827 594 C794 596 775 574 776 558 C803 556 825 570 827 594Z','url(#sage)',w=1.6)
 plant+=P('M830 578 C851 552 877 552 894 558 C882 585 856 593 830 578Z','url(#sage)',w=1.6)
 plant+=P('M827 551 C813 541 811 522 823 512 C837 526 839 540 827 551Z','#a3b68d',w=1.4)
 plant+=P('M783 564L827 594 M838 578L882 563 M823 518L827 548',stroke='#e0d7ad',w=1.1)
 plant+=P('M791 566L795 578 M801 571L806 586 M848 575L853 563 M858 572L863 560',stroke='#6c8d70',w=.8)
 s+=G('seedling-reaching-for-water',plant+anim(A('rotate','0 822 629;1 822 629;-3 822 629;-2 822 629;1 822 629;0 822 629')))
 # Foreground tools and worm helper: modest final note.
 s+=P('M712 749L739 730L748 739L722 759Z','#a6875d',w=1.5)+P('M738 731Q768 702 779 711Q788 724 751 743Z','#81918a',w=1.5)
 s+=P('M746 733L772 716',stroke='#d4d6b8',w=1)
 s+=P('M340 748 C350 729 377 735 380 752 Q398 747 405 759 Q390 771 374 764 Q355 757 340 760Z','#ad9271',w=1.4)
 s+=E(350,747,1.7,2,INK)+E(355,747,1.7,2,INK)+P('M349 753Q354 756 359 752',w=.8)
 for x,y,h,lean in [(135,813,135,12),(1078,813,147,-8),(1012,819,82,-5)]:s+=stalk(x,y,h,lean,'#7d9478')
 return s

STORIES=[
 dict(id='105232',title='The Captain Who Charted the Moon',category='pirate',source='105232.jpg',observation='A book photograph of two swashbucklers: convincing counterweighted poses, layered costume, foreshortened hands, broad hat silhouettes, curved cloth folds and dense directional crosshatching. The new scene studies these principles without tracing either figure.',prompt='Draw an original fine-ink and translucent-wash storybook illustration as editable native SVG, 1200×900 on warm ivory #f3eee2. A thoughtful bearded pirate astronomer in a weathered tricorn with a long feather, russet cutaway coat, gathered linen shirt, buckled belt, articulated trousers and tall indigo boots stands on a perspective wooden harbor dock. One hand steadies an unfolded star chart; the other bends at shoulder and elbow to lift a brass telescope toward a pale crescent moon. Give him an asymmetrical kind expression, sculpted cheeks, carefully drawn fingers and a believable center of gravity. Use custom cubic contours, flowing coat folds, tapering feather barbs, directional crosshatching, separate warm-lit and cool-shadow planes, fine brass highlights, and a clear silhouette. Compose a distant sailing ship, subdued sage sea, etched dock grain and coiled rope behind him; a small crab guards a compass in the foreground. One upper-left key light, restrained ochre/russet/sage accents, layered atmospheric depth, plenty of luminous negative space. Preserve named anatomical groups and telescope/chart props. Do not copy a photographed composition or embed raster art.',motion='Exactly 7.000 s, continuous loop: 0–0.84 s settle and glance; 0.84–1.68 s telescope arm dips 5° in anticipation; 1.68–3.78 s lift and observe with a −5° shoulder pose; 3.78–5.04 s hold while head and chart follow subtly; 5.04–7.00 s return to the initial pose. The specific shoulder/arm/telescope group moves, with independently delayed head and chart-hand motion. All SMIL clocks are seven seconds.',fn=pirate),
 dict(id='105233',title='The Lantern Keeper of Willow Marsh',category='creature',source='105233.jpg',observation='A fantasy-illustration page combines long curling tentacles, dramatic thin-versus-heavy silhouettes, layered organic surfaces and a theatrical figure high above elaborate creatures. The new dragon uses the serpentine construction and etched surface rhythm, with an original gentle story.',prompt='Create an original sophisticated native SVG storybook plate, 1200×900, graphite/indigo #24343b on warm ivory #f3eee2, translucent sage, muted ochre and russet washes. A gentle marsh dragon with an elegantly coiled serpentine body, weighted belly, plated cross-contours, webbed hind feet, delicate sail-like wings, branching antlers, long curled whiskers and a narrow expressive muzzle carefully carries a seed lantern over lily water. Sculpt the anatomy from a strong line of action; the head, neck, shoulder, elbow and claw must connect convincingly. Draw bespoke cubic silhouettes and overlapping leaf-shaped scales, fine curved hatching, light-catching edges and distinct cool shadow planes. Its near wing opens with translucent ribs; its foreclaw supports a slender lantern handle. Surround it with atmospheric willow arches, layered reeds, elliptical lily pads, one pale flower, quiet reflections and only three tiny fireflies. Compose a single readable focal relationship between the eye and the warm lantern. Preserve separated, named head, wing, foreleg and hanging lantern groups. No traced source shapes, raster embeds or external assets.',motion='Exactly 7.000 s, continuous loop: 0–0.84 s poised breath; 0.84–1.68 s foreleg lowers 3° and sails compress; 1.68–3.78 s lantern foreleg lifts −7°, near sail opens −12°, head bows 5°; 3.78–5.04 s warm presentation hold, lantern swings back with delayed follow-through; 5.04–7.00 s wing, head and claw recover continuously. Lantern and fireflies have seven-second subsidiary tracks with matching endpoints.',fn=marsh),
 dict(id='105234',title='A Small Worm and a Borrowed Star',category='worm',source='105234.jpg',observation='A fantastical worm drawing emphasizes broad compressed body masses, folded neck anatomy, strong cross-contour shading and curling horn silhouettes around a skull-like head. This original child-friendly scene keeps the weight, segmentation and curling silhouette while replacing the horror face with curiosity.',prompt='Draw an original richly observed native SVG woodland story illustration, 1200×900 with a warm ivory #f3eee2 paper ground and fine graphite-indigo #24343b contours. A large soft earthworm with a heavy segmented coil, compressed contact folds and a rising curved neck discovers one luminous firefly. Give the worm gently aged expressive eyelids, an asymmetrical smile, soft cheek planes, delicate freckles, two elaborately curled feelers and a leaf bonnet tied below its chin. Build the body from continuous custom cubic paths rather than stacked ellipses. Curve each cross-contour stripe around the local surface, tighten folds at compression and leave lit planes spacious. Use translucent ochre and warm clay shading, cool sage reflected light, subtle hatching and believable grounded shadows. Frame the exchange with russet mushrooms showing radial gills, deep fern fans, a hollow seed-shell home, overlapping pebbles, dew and atmospheric tree trunks. The firefly remains tiny and precious against luminous negative space. Separate the head and each feeler into named pivot groups for expressive motion. Original composition, no traced skull or copied creature, no raster art.',motion='Exactly 7.000 s, continuous loop: 0–0.84 s curious pause; 0.84–1.68 s head inclines −3° while feelers coil inward; 1.68–3.78 s head tilts 6° toward the approaching firefly, the two feelers open with different amplitudes; 3.78–5.04 s gaze and smile hold while feelers settle later; 5.04–7.00 s firefly, head and feelers return along smooth closed tracks. The grounded body stays weight-bearing.',fn=worm),
 dict(id='105235',title='The Gardener Who Grew Another Morning',category='zombie',source='105235.jpg',observation='The reference shows an expressive undead head with pronounced facial planes, irregular teeth, tousled hair, torn cloth, articulated fingers and a decorated mug. This original gently comic gardener carries over the expressive structure, sewn repairs and handled vessel, without exposed tissue or gore.',prompt='Create an original high-quality native SVG storybook plate, 1200×900 on ivory #f3eee2, with graphite-indigo #24343b linework and muted sage, rust and ochre washes. A kindly elderly zombie kneels in an old walled garden and carefully pours water from a bird-painted tea jug onto a small terracotta seedling. His dry skull-like face has asymmetrical living eyelids, a reassuring crooked smile, one missing tooth, sewn doll-like scars, tousled hair and a tiny daisy tucked behind his ear; no gore or exposed tissue. Draw angular cheek and neck anatomy with soft lit planes, believable elbows, slender articulated fingers wrapped around a real handle, weighted kneeling legs and worn boots. Give his patched sage jacket a russet apron, seamed pocket, repair stitches, frayed edges and specific curved cloth folds. Use hand-shaped cubic silhouettes, directional crosshatching, restrained gradients and grounded contact shadows. Compose atmospheric old masonry, a vine-covered trellis, receding garden path, cabbage, fork, trowel and a tiny earthworm helper. The lifted leaves are the emotional focal point. Separate head, upper arm, rotating forearm/jug, water and sapling into named native SVG groups; no raster assets, tracing or external dependencies.',motion='Exactly 7.000 s, continuous loop: 0–0.84 s quiet attention; 0.84–1.68 s pouring forearm lifts back −4° in anticipation; 1.68–3.78 s forearm tips 12°, head bows kindly and the water fades in; 3.78–5.04 s pour hold, sapling responds with a delayed −3° lift and settling; 5.04–7.00 s water ceases and jug, head and leaves return smoothly to their starting poses. Native SMIL only; every duration is seven seconds.',fn=gardener)
]

def main():
 import re
 entries=[]
 for info in STORIES:
  id=info['id'];body=info['fn']()
  source=base(info['title'], info['observation']+' '+info['motion'], body,id)
  animated=source.replace('<!--MOTION-->','').replace('<!--/MOTION-->','')
  still=re.sub(r'<!--MOTION-->.*?<!--/MOTION-->','',source,flags=re.S)
  for folder,doc in [('svg',still),('animated',animated)]:
   p=ROOT/'corpus'/folder/(id+'.svg');p.parent.mkdir(parents=True,exist_ok=True);p.write_text(doc)
  entry={k:v for k,v in info.items() if k!='fn'}
  entry.update(svg=f'corpus/svg/{id}.svg',animated=f'corpus/animated/{id}.svg')
  entries.append(entry)
 p=ROOT/'corpus/metadata/stories.json';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(entries,indent=2,ensure_ascii=False)+'\n')
 print('Generated four original story plates, four 7-second SMIL editions and metadata.')
if __name__=='__main__':main()
