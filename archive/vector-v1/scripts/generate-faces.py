from pathlib import Path
from math import sin,cos,pi
import json, re, html
ROOT=Path(__file__).resolve().parents[1]
INK='#24343b'; PAPER='#f3eee2'; RUST='#a26046'; GOLD='#b59058'; LIGHT='#fbf6e9'
ANIM=False

def path(d,fill='none',stroke=INK,width=2,extra='',inside=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" {extra}>{inside}</path>'
def anim(attr,values,times='0;.14;.28;.48;.68;.84;1',kind='animate',extra=''):
    if not ANIM: return ''
    return f'<{kind} attributeName="{attr}" values="{values}" keyTimes="{times}" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines="'+ ';'.join(['.42 0 .22 1']*(len(times.split(';'))-1))+f'" {extra}/>'
def move(values,times='0;.14;.28;.48;.68;.84;1'):
    return anim('transform',values,times,'animateTransform','type="translate"')
def group(id,content,extra='',motion=''):
    return f'<g id="{id}" {extra}>{motion}{content}</g>'
def hatch(d,id,angle=32,opacity=.24,spacing=8):
    # Contour-designed shadow shapes constrain fine engraver lines.
    lines=''.join(path(f'M {x} 60 L {x+500} 860',stroke=INK,width=.8) for x in range(-500,1300,spacing))
    return f'<clipPath id="{id}-clip">{path(d,stroke="none")}</clipPath><g id="{id}" opacity="{opacity}" clip-path="url(#{id}-clip)">{lines}</g>'
def defs():
    return '''<defs>
<linearGradient id="skin" x1="15%" y1="20%" x2="90%" y2="80%"><stop stop-color="#fbf7ec"/><stop offset=".42" stop-color="#e5d3b5"/><stop offset=".76" stop-color="#c4b397"/><stop offset="1" stop-color="#9b9c8b"/></linearGradient>
<linearGradient id="bone" x1="20%" y1="0%" x2="85%" y2="100%"><stop stop-color="#fff9e7"/><stop offset=".48" stop-color="#e1cda9"/><stop offset=".82" stop-color="#a9a48f"/><stop offset="1" stop-color="#6a7973"/></linearGradient>
<linearGradient id="shade" x1="0%" y1="0%" x2="100%" y2="90%"><stop stop-color="#839084" stop-opacity=".16"/><stop offset="1" stop-color="#24343b" stop-opacity=".7"/></linearGradient>
<linearGradient id="hair" x1="0%" y1="0%" x2="80%" y2="100%"><stop stop-color="#687269"/><stop offset=".35" stop-color="#3b4948"/><stop offset="1" stop-color="#202f35"/></linearGradient>
<radialGradient id="sclera" cx="40%" cy="25%" r="80%"><stop stop-color="#fffaf0"/><stop offset=".7" stop-color="#d8d3bb"/><stop offset="1" stop-color="#89968b"/></radialGradient>
<radialGradient id="iris"><stop stop-color="#24343b"/><stop offset=".4" stop-color="#617970"/><stop offset=".72" stop-color="#9a9f78"/><stop offset="1" stop-color="#293e40"/></radialGradient>
<linearGradient id="lip" x1="0%" y1="0%" x2="35%" y2="100%"><stop stop-color="#7b5546"/><stop offset=".45" stop-color="#b97f62"/><stop offset="1" stop-color="#d3aa87"/></linearGradient>
<radialGradient id="halo"><stop stop-color="#b59058" stop-opacity=".16"/><stop offset="1" stop-color="#b59058" stop-opacity="0"/></radialGradient>
</defs>'''

def svg(title,desc,body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-labelledby="title desc">
<title id="title">{html.escape(title)}</title><desc id="desc">{html.escape(desc)}</desc>{defs()}
<rect width="1200" height="900" fill="{PAPER}"/>
<ellipse cx="600" cy="430" rx="420" ry="370" fill="url(#halo)"/>
{body}
</svg>'''

def eye(id,x,y,w=104,h=22,openness=1,look=0,blink=True):
    h*=openness
    d=f'M 0 0 C {w*.22} {-h*.92} {w*.58} {-h*1.12} {w} 1 C {w*.76} {h*.8} {w*.27} {h*.9} 0 0 Z'
    shut=f'M 0 0 C {w*.22} {h*.15} {w*.58} {h*.24} {w} 1 C {w*.76} {h*.23} {w*.27} {h*.17} 0 0 Z'
    an=anim('d',';'.join([d,d,shut,d,d,d]),'0;.28;.31;.35;.83;1') if blink else ''
    content=f'<clipPath id="{id}-eyeclip">{path(d,stroke="none",inside=an)}</clipPath>'
    content+=path(f'M -9 -4 C {w*.15} {-h-31} {w*.77} {-h-38} {w+12} 2 C {w*.8} {h+20} {w*.2} {h+25} -9 -4 Z','url(#shade)','none',0,extra='opacity=".4"')
    content+=path(d,'url(#sclera)',INK,1.5,inside=an)
    iris=f'<circle cx="{w*.52}" cy="1" r="{w*.185}" fill="url(#iris)" stroke="{INK}" stroke-width="1.7"/>'
    for i in range(30):
        a=i*2*pi/30; rr=w*.185; cx=w*.52
        iris+=path(f'M {cx+cos(a)*rr*.57:.2f} {1+sin(a)*rr*.57:.2f} Q {cx+cos(a+.03)*rr*.75:.2f} {1+sin(a+.03)*rr*.75:.2f} {cx+cos(a)*rr*.94:.2f} {1+sin(a)*rr*.94:.2f}',stroke=INK,width=.8,extra='opacity=".6"')
    iris+=f'<circle cx="{w*.52}" cy="1" r="{w*.085}" fill="{INK}"/><circle cx="{w*.47}" cy="{-w*.06}" r="{w*.033}" fill="{LIGHT}"/>'
    content+=group(id+'-clipped-globe',group(id+'-gaze',iris,motion=move(f'0 0;0 0;{look} -1;{look} -1;{look/2} 0;0 0;0 0')),extra=f'clip-path="url(#{id}-eyeclip)"')
    content+=path(f'M -2 0 C {w*.24} {-h-8} {w*.64} {-h-11} {w+2} 1',stroke=INK,width=3.2,inside=anim('opacity','1;1;.45;1;1;1;1'))
    content+=path(f'M 4 {-h-12} C {w*.25} {-h-25} {w*.65} {-h-25} {w-7} {-h-6}',stroke=INK,width=1.1)
    content+=path(f'M 7 {h*.8+9} C {w*.34} {h+19} {w*.73} {h+16} {w-1} 9',stroke=INK,width=1,extra='opacity=".58"')
    content+=path(f'M 7 3 C 11 0 13 0 16 3',stroke=RUST,width=2)
    # Tiny broken upper lashes imply thickness without decorative eyelashes.
    for i in range(5):
        xx=w*(.7+i*.055); yy=-h*.7+(i*.055*w)*.32
        content+=path(f'M {xx} {yy} q 5 -2 7 -6',stroke=INK,width=1.1)
    return group(id,content,extra=f'transform="translate({x} {y})"')

HEAD='M 416 268 C 417 204 462 149 536 135 C 610 118 718 144 765 207 C 794 247 790 320 784 362 C 780 396 785 430 773 473 C 760 521 729 566 692 598 C 659 628 629 648 594 644 C 554 641 509 614 480 578 C 445 536 430 495 424 452 C 417 405 410 330 416 268 Z'
NECK='M 474 558 C 488 621 477 664 450 692 C 404 728 344 741 279 783 C 255 799 240 817 233 836 L 958 836 C 933 804 876 778 815 752 C 749 723 713 692 704 647 L 702 580 C 627 627 554 637 474 558 Z'

def ears():
    d='M 425 356 C 408 333 388 336 384 362 C 379 391 391 420 400 445 C 406 461 423 465 433 450 L 437 399 Z'
    l=path(d,'url(#skin)',INK,2.2)+path('M 419 359 C 396 347 394 375 401 394 C 419 373 430 396 413 409 C 406 418 413 439 424 440',stroke=INK,width=2.2)+path('M 401 396 C 407 391 412 391 415 396 L 409 415 C 401 419 398 410 401 396 Z',INK,'none')
    r=path('M 781 351 C 803 332 818 344 817 371 C 816 404 804 436 793 452 C 784 465 770 456 769 441 L 773 392 Z','url(#skin)',INK,2)+path('M 786 361 C 802 344 808 366 799 393 C 784 383 776 398 791 408 C 799 422 788 438 781 441',stroke=INK,width=2)+path('M 798 392 C 785 386 782 396 788 411 L 798 418 C 803 409 801 401 798 392 Z',INK,'none')
    return group('ears',l+r)

def hair():
    d='M 415 356 C 400 330 400 275 407 236 C 401 196 420 160 450 132 C 444 141 439 160 443 167 C 487 116 549 91 608 103 C 596 107 590 112 587 118 C 650 93 703 112 735 142 C 751 147 778 168 793 201 C 777 187 770 186 766 186 C 792 222 796 272 782 328 L 772 369 C 754 341 757 303 752 273 C 747 239 721 208 699 196 C 637 224 582 231 542 224 C 562 217 573 211 579 204 C 543 217 516 210 501 200 C 493 226 469 249 445 253 C 443 288 432 320 433 354 L 424 375 Z'
    out=path(d,'url(#hair)',INK,2.6)
    # Direction follows cranial volume: long locks converge into the temple.
    for i in range(22):
        a=i/21
        x=438+a*310; y=192-62*sin(a*pi)
        ex=451+a*278; ey=229-21*sin(a*pi)
        out+=path(f'M {x:.1f} {y:.1f} C {x+20:.1f} {y-30:.1f} {ex+26:.1f} {ey-45:.1f} {ex:.1f} {ey:.1f}',stroke='#c4c0a1',width=1+(i%3)*.4,extra=f'opacity="{.2+(i%4)*.1}"')
    out+=path('M 448 199 C 476 150 520 125 566 127 M 459 205 C 483 170 512 151 543 143 M 605 124 C 656 113 697 133 722 155 M 702 178 C 729 197 747 222 757 255 M 421 251 C 413 290 420 321 421 340',stroke='#d7c4a0',width=2,extra='opacity=".48"')
    return group('hair-volume',out)

def face_base():
    content=group('neck-and-shoulders',path(NECK,'url(#skin)',INK,2)+path('M 475 577 C 502 613 540 637 578 645 C 549 679 511 699 484 720 C 466 740 444 781 433 835 L 284 835 C 329 782 429 728 452 688 C 475 650 477 620 475 577 Z','url(#shade)','none')+path('M 699 598 C 675 647 644 678 626 720 C 665 711 694 699 714 683 C 705 652 704 631 699 598 Z',INK,'none',extra='opacity=".24"')+path('M 489 659 C 474 711 450 758 439 805 M 671 660 C 650 705 640 755 645 809 M 428 754 C 489 744 532 749 566 775 M 663 767 C 715 744 766 758 806 784',stroke=INK,width=1.7,extra='opacity=".6"')+path('M 310 799 C 359 773 395 764 426 762 M 670 784 C 700 775 735 777 760 783',stroke=LIGHT,width=4,extra='opacity=".65"'))
    content+=ears()+path(HEAD,'url(#skin)',INK,2.3)
    # Sculpted side, cheek, forehead and jaw planes.
    content+=group('facial-planes',path('M 426 260 C 449 244 475 235 501 229 C 467 293 453 339 456 388 C 457 436 477 471 485 506 C 496 555 530 590 565 620 C 509 603 469 562 448 514 C 429 473 421 421 418 375 Z','url(#shade)','none')+path('M 696 202 C 738 224 757 257 761 296 C 766 339 753 378 760 416 C 769 460 742 514 710 542 C 727 501 721 470 700 439 C 683 411 701 365 714 334 C 731 290 718 240 696 202 Z','url(#shade)','none',extra='opacity=".48"')+path('M 449 428 C 471 404 495 403 519 420 C 500 437 482 447 463 459 Z',GOLD,'none',extra='opacity=".3"')+path('M 647 426 C 677 405 704 414 733 442 C 707 456 681 459 658 453 Z',RUST,'none',extra='opacity=".13"')+path('M 493 555 C 527 578 548 600 592 606 C 624 612 656 593 679 579 C 668 620 624 639 593 634 C 552 632 516 603 493 555 Z','url(#shade)','none',extra='opacity=".5"'))
    content+=hatch('M 425 283 C 450 269 468 265 478 263 C 453 323 446 381 454 429 C 460 461 473 483 487 516 C 463 491 438 451 428 404 Z','temple-engraving',opacity=.18)
    content+=hatch('M 475 527 C 506 572 536 608 574 623 L 559 633 C 513 617 477 586 460 546 Z','jaw-engraving',opacity=.18)
    content+=hatch('M 478 624 C 501 658 530 662 555 667 C 526 690 487 721 464 766 L 448 792 C 449 724 482 680 478 624 Z','neck-engraving',opacity=.24)
    content+=path('M 482 273 C 513 247 543 243 566 247 M 600 243 C 630 231 663 234 686 246 M 478 461 C 486 478 492 488 493 506 M 717 460 C 710 477 701 489 699 506',stroke=INK,width=1,extra='opacity=".28"')
    return content

def nose():
    out=path('M 576 335 C 565 370 566 398 556 427 C 551 438 545 445 543 452 C 542 465 553 474 568 473 C 582 488 601 489 614 477 C 632 482 650 469 644 456 C 641 447 630 443 623 439 C 617 416 610 388 609 362','url(#skin)',INK,1.5)
    out+=path('M 595 350 C 591 382 598 417 606 440 C 615 448 619 458 616 467 C 607 478 592 475 584 470 C 597 466 600 457 597 444 C 586 420 579 395 582 371 Z','url(#shade)','none')
    out+=path('M 547 455 C 553 445 566 446 573 455 C 573 462 563 463 554 460 Z',INK,'none')+path('M 612 456 C 622 448 636 452 639 460 C 630 465 618 466 612 456 Z',INK,'none')
    out+=path('M 571 451 C 575 439 585 434 593 438 M 580 476 C 588 480 598 480 605 476',stroke=LIGHT,width=3,extra='opacity=".75"')
    out+=path('M 581 482 C 577 492 577 500 572 506 M 599 483 C 604 493 605 501 607 506',stroke=INK,width=1,extra='opacity=".45"')
    return group('nose-and-philtrum',out)

CONFIG={
'105196':dict(title='A smile finding its way',cat='happiness',h=17,brows=('M 465 322 C 489 302 520 302 546 315 C 523 308 489 312 465 322 Z','M 637 314 C 661 301 698 304 722 321 C 692 314 664 311 637 314 Z'),mouth='M 512 526 C 538 519 561 516 580 520 C 596 514 621 516 652 516 C 634 540 604 548 578 545 C 550 545 529 537 512 526 Z',lower='M 516 528 C 542 540 564 542 583 540 C 604 543 634 531 650 518',emotion='Relaxed brow, cheek lifting and the outward pull of the closed smiling mouth.',action='A small closed-mouth smile grows through raised cheeks; a gentle blink lands before the mouth settles.'),
'105197':dict(title='The weight of a quiet thought',cat='sadness',h=14,brows=('M 463 332 C 489 324 520 310 546 297 C 534 319 492 336 463 332 Z','M 637 298 C 664 310 696 322 724 330 C 700 335 663 323 637 298 Z'),mouth='M 520 549 C 540 528 562 521 585 525 C 607 520 631 528 650 546 C 628 538 604 536 585 540 C 562 535 540 540 520 549 Z',lower='M 528 551 C 549 548 564 546 585 548 C 604 545 621 546 642 550',emotion='The inner brows draw upward and together while the lip corners and gaze fall.',action='The gaze drops, the inner brow lifts, and the lower lip trembles once before easing.'),
'105198':dict(title='A storm held behind the eyes',cat='anger',h=12,brows=('M 459 310 C 490 306 518 321 547 335 L 546 345 C 514 334 486 321 459 322 Z','M 635 336 C 664 321 696 307 726 309 L 724 321 C 693 322 664 337 635 346 Z'),mouth='M 527 534 C 548 529 566 528 584 532 C 603 528 622 528 643 532 C 619 538 602 541 585 540 C 563 541 544 538 527 534 Z',lower='M 536 544 C 558 553 607 551 634 542',emotion='Compressed eyebrows, narrowed lids, flared nostrils and a tense, narrow mouth.',action='Brows squeeze inward, the eyelids narrow and the nostrils tighten, followed by a controlled release.'),
'105199':dict(title='The moment before the courage',cat='fear',h=30,brows=('M 461 312 C 485 283 520 278 549 294 L 547 304 C 519 293 488 296 461 312 Z','M 636 295 C 668 276 701 284 724 309 C 694 294 665 292 637 305 Z'),mouth='M 512 530 C 534 511 558 514 584 518 C 612 512 637 512 657 529 C 650 549 628 564 600 566 C 566 572 531 556 512 530 Z',lower='M 518 539 C 544 566 603 577 645 551',emotion='Wide visible irises, lifted brows and retracted lips revealing a tense strip of teeth.',action='A quick upward glance leads the brow lift; lips stretch, the jaw catches, then the face exhales.'),
'105200':dict(title='An astonishment in warm light',cat='surprise',h=31,brows=('M 461 307 C 487 277 521 273 549 289 L 547 300 C 516 289 490 292 461 307 Z','M 635 289 C 666 272 701 283 725 308 C 697 293 665 287 636 300 Z'),mouth='M 553 526 C 557 506 580 501 594 506 C 616 505 633 524 632 547 C 636 580 616 600 592 600 C 568 601 550 580 551 555 C 550 543 551 534 553 526 Z',lower='M 558 583 C 577 607 611 610 629 582',emotion='Raised orbital arches, round open eyes and a lowered jaw create surprise.',action='The eyes open first, brows rise in delayed response, and the jaw opens into a soft gasp before recovery.'),
'105203':dict(title='A conspiratorial wink',cat='asymmetric-expression',h=20,brows=('M 461 320 C 485 307 519 309 547 323 C 517 317 492 317 461 320 Z','M 636 303 C 667 281 701 294 726 315 C 698 304 667 299 636 313 Z'),mouth='M 520 536 C 543 534 566 527 585 530 C 607 528 629 518 649 506 C 632 531 609 543 585 544 C 561 545 540 542 520 536 Z',lower='M 531 547 C 563 557 614 550 639 531',emotion='A unilateral eyelid squeeze, one raised eyebrow and one tight mouth corner make an asymmetric expression.',action='One brow lifts, the opposite eye winks, then one mouth corner curls with a delayed cheek response.')}

def portrait(id,c):
    content=face_base()+hair()
    # Slightly asymmetric socket washes anchor each eye in the head.
    content+=path('M 458 333 C 482 313 522 320 548 344 C 543 361 525 377 497 376 C 479 369 466 356 458 333 Z','url(#shade)','none',extra='opacity=".54"')+path('M 636 338 C 655 316 704 314 732 339 C 725 366 694 378 672 371 C 652 367 642 354 636 338 Z','url(#shade)','none',extra='opacity=".42"')
    content+=eye('left-eye',467,352,85,c['h'],look=(-5 if id=='105197' else 4),blink=id!='105203')
    content+=eye('right-eye',639,351,88,c['h'],look=(-5 if id=='105197' else 4))
    brows=path(c['brows'][0],INK,INK,1)+path(c['brows'][1],INK,INK,1)
    # Discrete hair strokes along the brow contribute a broken edge.
    for i in range(12):
        x=468+i*6.4
        if id=='105198': y=313+(x-468)*.32
        elif id=='105197':y=330-(x-468)*.34
        else:y=309-12*sin(i/11*pi) + (-14 if id in ('105199','105200') else 0)
        brows+=path(f'M {x} {y+4} l 5 -7',stroke=INK,width=.8)
    content+=group('expressive-brows',brows,motion=move('0 0;0 1;0 -5;0 -5;0 -2;0 0;0 0' if id!='105198' else '0 0;0 -1;0 5;0 5;0 2;0 0;0 0'))
    content+=nose()
    content+=group('cheeks-and-folds',path('M 541 468 C 526 483 518 506 512 524 M 644 470 C 656 488 662 504 658 524',stroke=INK,width=1.6,extra='opacity=".68"')+path('M 521 481 C 506 486 496 499 496 512 M 665 478 C 678 489 685 505 682 521',stroke=RUST,width=3,extra='opacity=".23"'),motion=move('0 0;0 1;0 -3;0 -4;0 -2;0 0;0 0'))
    mouth=path(c['mouth'],'url(#lip)',INK,1.5)+path(c['lower'],stroke=INK,width=1.2)
    if id in ('105199','105200'):
        cavity=c['mouth'];mouth=path(cavity,INK,INK,1.6)
        if id=='105199':
            teeth='M 522 530 C 547 521 574 525 587 526 C 610 519 633 521 648 530 L 642 540 C 617 536 590 543 572 539 C 552 541 537 536 526 536 Z'
            mouth+=path(teeth,LIGHT,INK,1)
            for i in range(7): mouth+=path(f'M {538+i*14} {527+(i%2)*2} l 0 11',stroke=INK,width=.6)
            mouth+=path('M 533 546 C 565 548 607 557 632 545 C 611 564 561 563 533 546 Z',RUST,'none',extra='opacity=".6"')
        else:
            mouth+=path('M 556 527 C 574 516 609 515 628 532 L 626 539 C 606 532 577 533 555 537 Z',LIGHT,'none',extra='opacity=".8"')+path('M 564 579 C 576 558 604 558 621 581 C 606 596 578 597 564 579 Z',RUST,'none',extra='opacity=".75"')
        mouth+=path(c['lower'],stroke=RUST,width=4,extra='opacity=".6"')
    else:
        mouth+=path('M 559 550 C 571 554 592 555 607 550',stroke=LIGHT,width=2.2,extra='opacity=".6"')
    content+=group('mouth-and-jaw',mouth,motion=move('0 0;0 -1;0 5;0 7;0 3;0 0;0 0' if id in ('105199','105200') else '0 0;0 1;0 -3;0 -4;0 -1;0 0;0 0'))
    content+=path('M 564 585 C 581 578 607 579 623 586',stroke=INK,width=1.1,extra='opacity=".4"')
    if id in ('105197','105199','105200'):
        wrinkles=path('M 505 274 C 546 259 602 258 650 270 M 516 288 C 547 278 602 276 634 284 M 561 306 C 568 294 570 286 569 281 M 611 307 C 605 297 604 289 605 283',stroke=INK,width=1.1,extra='opacity=".5"')
        content+=group('forehead-tension',wrinkles,motion=anim('opacity','.6;.6;1;1;.8;.6;.6'))
    if id=='105198':
        content+=group('glabella-compression',path('M 560 316 C 568 325 568 337 566 344 M 615 315 C 607 325 607 336 610 345 M 556 408 C 547 414 541 424 540 433 M 626 407 C 638 415 645 422 646 431',stroke=INK,width=1.8),motion=anim('opacity','.6;.6;1;1;.8;.6;.6'))
    if id=='105203':
        # A skin lid overlays the eyeball while preserving dimensional brow/cheek anatomy.
        wink='M 467 352 C 487 333 517 332 552 353 C 528 369 492 371 467 352 Z'
        lid=path(wink,'url(#skin)','none')+path('M 467 351 C 489 356 519 360 552 350',stroke=INK,width=3)+path('M 458 352 l -8 -5 M 456 358 l -10 1 M 462 363 l -9 7',stroke=INK,width=1.2)
        content+=group('wink-lid',lid,extra='opacity=".96"',motion=anim('opacity','.96;.4;1;1;.7;.96;.96'))
    return group('portrait',content,extra='transform="translate(0 -5)"')

def skull():
    cranium='M 384 364 C 357 309 371 234 413 187 C 453 140 506 115 571 109 C 657 100 742 128 794 184 C 844 235 866 305 850 370 C 843 402 824 425 802 445 C 798 479 780 501 753 508 C 731 529 718 562 710 596 C 660 620 588 626 536 608 C 524 577 504 548 477 533 C 452 520 416 518 399 495 C 386 474 398 437 412 415 C 400 403 389 383 384 364 Z'
    b=path(cranium,'url(#bone)',INK,2.8)
    # Cranium turns away on the temporal plane; the forehead remains pale.
    side='M 694 130 C 772 150 828 212 846 284 C 866 352 824 398 802 445 C 788 470 780 487 754 502 C 767 469 762 434 753 409 C 730 370 743 343 770 318 C 780 256 746 187 694 130 Z'
    b+=path(side,'url(#shade)','none')+hatch(side,'cranial-turn',opacity=.18,spacing=7)
    b+=path('M 401 301 C 417 246 464 189 518 171 C 576 148 623 148 677 164',stroke=LIGHT,width=9,extra='opacity=".55"')
    # Cranial sutures, irregular but anatomically rooted in the calvarium.
    b+=path('M 621 116 l -9 18 9 9 -11 13 8 12 -9 15 4 14 -8 12 6 12 -8 13 4 14 M 625 251 C 673 254 719 283 751 312 l 7 -4 8 10 7 -2 6 11 7 3 6 14 M 765 196 l -11 12 5 9 -5 12 8 6 -5 13 8 7',stroke=INK,width=1,extra='opacity=".5"')
    # Orbital arch and zygomatic rim.
    b+=path('M 402 359 C 425 316 477 300 523 313 C 549 319 566 342 570 364 C 579 343 594 331 612 331 C 629 334 638 349 643 366 C 668 328 720 318 760 338 C 788 351 802 377 800 399 C 785 384 772 376 757 377 C 714 355 670 373 658 398 C 644 428 642 452 629 464 L 600 446 L 574 464 C 558 451 553 430 548 408 C 539 370 481 340 437 369 C 425 376 416 384 412 395 Z','url(#bone)',INK,2.1)
    # Deep orbits get distinct rim silhouettes rather than identical ellipses.
    left='M 431 370 C 454 347 491 348 518 365 C 544 381 553 407 546 437 C 540 461 517 473 491 469 C 464 466 438 449 427 424 C 418 406 420 386 431 370 Z'
    right='M 664 383 C 679 359 716 348 749 360 C 779 370 793 396 786 423 C 778 451 756 469 728 472 C 700 475 671 462 659 442 C 650 425 652 401 664 383 Z'
    b+=group('orbital-depth',path(left,INK,INK,3)+path(right,INK,INK,3)+path('M 432 383 C 444 362 485 358 508 373 C 475 376 452 394 442 421 C 435 432 433 440 435 444 C 421 425 421 400 432 383 Z','#6b776d','none')+path('M 666 395 C 685 366 725 360 750 373 C 715 368 691 390 684 419 C 676 440 672 450 670 453 C 655 438 655 414 666 395 Z','#536761','none'))
    b+=path('M 436 427 C 455 452 495 463 528 445 M 686 446 C 713 462 752 452 770 431',stroke='#959b83',width=1.2,extra='opacity=".65"')
    # Root and piriform nasal aperture.
    b+=path('M 573 350 C 583 339 602 341 610 354 C 614 380 615 404 624 426 C 635 454 641 483 628 505 C 618 515 606 516 598 507 C 585 516 566 513 561 499 C 558 478 565 452 574 428 C 581 407 578 375 573 350 Z','url(#bone)',INK,2)
    b+=path('M 587 421 C 582 441 570 464 571 487 C 570 501 581 506 591 494 L 601 477 L 608 499 C 616 505 629 499 627 486 C 627 465 617 445 610 426 L 599 437 Z',INK,INK,1.5)
    b+=path('M 591 440 C 585 455 581 473 581 486 M 608 454 C 616 474 616 488 613 495',stroke='#6a7b6d',width=2)
    # Maxilla fans from the nasal root into alveolar teeth.
    b+=path('M 426 452 C 434 480 460 489 487 484 C 506 481 521 468 539 449 C 538 479 545 506 560 521 C 582 535 614 534 638 518 C 654 502 660 482 658 455 C 681 479 701 491 732 488 C 738 508 729 532 710 548 C 665 566 587 575 537 557 C 519 540 502 526 479 519 C 445 518 415 496 411 473 Z','url(#bone)',INK,2)
    b+=path('M 444 480 C 464 501 487 503 508 501 C 500 514 498 526 498 534 L 466 523 C 445 514 433 498 444 480 Z','url(#shade)','none')+path('M 681 490 C 691 505 705 510 721 507 L 711 536 L 668 549 C 679 528 684 512 681 490 Z','url(#shade)','none')
    b+=hatch('M 451 487 C 476 510 510 502 529 486 L 548 544 L 533 557 C 513 541 497 533 475 526 Z','maxillary-hatching',opacity=.22,spacing=7)
    b+=path('M 530 480 C 523 499 518 510 515 520 M 650 481 C 659 498 662 511 662 523 M 553 511 C 556 526 563 538 567 546 M 627 516 C 623 534 619 541 619 546',stroke=INK,width=1.2)
    # Teeth belong to a continuous curved dental arcade, with unequal widths.
    upper=''
    teeth=[(516,552,19,33),(535,556,22,38),(557,558,24,41),(581,558,25,43),(606,557,25,42),(631,554,24,40),(655,551,22,35),(677,546,19,31)]
    for i,(x,y,w,h) in enumerate(teeth):
        upper+=path(f'M {x} {y} C {x+3} {y-6} {x+w-3} {y-6} {x+w} {y} L {x+w-1} {y+h-7} Q {x+w/2} {y+h+1} {x+1} {y+h-5} Z',LIGHT,INK,1.15)
        upper+=path(f'M {x+5} {y+5} C {x+3} {y+14} {x+6} {y+21} {x+6} {y+h-9}',stroke=GOLD,width=.8,extra='opacity=".55"')
    b+=group('upper-dental-arcade',upper)
    # Mandible is anatomically separate, opening a little at the temporomandibular hinge.
    jaw='M 407 463 C 415 450 425 449 433 460 C 442 489 445 534 457 572 C 474 616 499 656 532 682 C 568 708 627 714 677 695 C 720 675 749 634 766 591 C 781 550 783 498 779 470 C 780 457 795 448 803 460 C 815 512 809 570 792 619 C 777 665 740 706 697 729 C 652 751 590 752 547 735 C 500 713 466 676 440 628 C 415 580 405 524 407 463 Z'
    jawbody=path(jaw,'url(#bone)',INK,2.8)+path('M 434 529 C 446 602 484 664 534 697 C 575 724 633 730 682 711 C 731 692 767 644 788 594 C 774 652 742 696 696 720 C 651 744 590 745 548 726 C 493 702 448 635 435 584 Z','url(#shade)','none')
    jawbody+=hatch('M 435 570 C 461 640 495 683 542 710 C 589 740 644 737 689 722 C 643 746 587 743 547 728 C 486 703 450 640 435 600 Z','mandible-engraving',opacity=.2,spacing=7)
    for i,(x,y,w,h) in enumerate(teeth):
        yy=612 + 7*sin(i/7*pi)
        jawbody+=path(f'M {x+4} {yy} C {x+7} {yy-4} {x+w-4} {yy-4} {x+w-1} {yy} L {x+w-1} {yy+23} Q {x+w/2} {yy+29} {x+4} {yy+24} Z','#e7dbc0',INK,1)
    jawbody+=path('M 518 659 C 555 681 629 691 682 666 M 566 696 C 593 705 624 707 649 700',stroke=INK,width=1.5,extra='opacity=".55"')
    b+=group('mandible',jawbody,motion=anim('transform','0 605 468;-1 605 468;2 605 468;3 605 468;1 605 468;0 605 468;0 605 468',kind='animateTransform',extra='type="rotate"'))
    # Highlight overlay moves without ever concealing the original drawing.
    highlight=path('M 419 353 C 457 316 506 320 543 353 M 654 366 C 686 337 731 336 770 361 M 411 452 C 414 481 439 508 464 512',stroke=GOLD,width=3,extra='opacity=".45"')
    b+=group('rim-light-study',highlight,motion=anim('opacity','.25;.25;1;.7;.4;.25;.25'))
    return group('skull-study',b,extra='transform="translate(-8 10)"')

def eye_study():
    out=''
    orbital='M 245 434 C 261 329 334 244 452 207 C 560 170 717 193 822 256 C 907 309 951 389 954 466 C 943 541 906 599 853 643 C 752 708 598 725 460 675 C 350 636 268 559 245 434 Z'
    out+=path(orbital,'url(#skin)','none')
    out+=path('M 250 437 C 293 315 414 256 541 270 C 661 274 787 310 893 421 C 811 358 711 342 618 345 C 489 330 390 353 306 415 L 281 489 Z','url(#shade)','none')
    out+=path('M 288 473 C 352 548 444 592 556 603 C 664 620 783 598 873 530 C 822 626 702 674 571 652 C 440 648 339 586 288 473 Z','url(#shade)','none',extra='opacity=".7"')
    out+=hatch('M 273 452 C 307 350 411 289 505 283 L 487 320 C 397 337 325 386 296 457 Z','orbital-hatching',opacity=.2,spacing=9)
    out+=hatch('M 327 540 C 406 612 497 649 586 654 L 595 672 C 461 670 378 615 327 540 Z','lid-hatching',opacity=.19,spacing=8)
    out+=group('brow-ridge',path('M 289 333 C 378 253 487 233 595 255 C 713 276 816 309 884 373 C 790 328 685 309 585 292 C 471 274 370 287 289 333 Z','url(#hair)',INK,1.6),motion=move('0 0;0 2;0 -9;0 -9;0 -3;0 0;0 0'))
    # Fine converging eyebrow hairs follow the form of the ridge.
    hairs=''
    for i in range(65):
        x=308+i*8.5;y=308-39*sin(i/64*pi)+.00055*(x-470)**2
        hairs+=path(f'M {x:.1f} {y+8:.1f} Q {x+9:.1f} {y-2:.1f} {x+12:.1f} {y-17:.1f}',stroke=('#d7c2a0' if i%3==0 else INK),width=1.2,extra='opacity=".6"')
    out+=group('brow-hairs',hairs,motion=move('0 0;0 2;0 -9;0 -9;0 -3;0 0;0 0'))
    out+=eye('large-anatomical-eye',312,456,555,116,look=29)
    # The medial canthus and tear lake turn into the nose-side slope.
    out+=path('M 307 459 C 285 447 273 447 262 462 C 271 479 289 487 313 481 C 304 473 304 468 307 459 Z',RUST,INK,1.4)
    out+=path('M 278 459 C 281 467 287 468 295 469',stroke=LIGHT,width=3)
    out+=path('M 247 431 C 218 488 224 542 253 590 M 900 457 C 923 460 939 472 948 483 M 901 472 C 925 484 936 497 938 511 M 886 500 C 906 516 918 531 920 544',stroke=INK,width=1.6,extra='opacity=".55"')
    out+=path('M 354 603 C 455 690 637 731 778 674 M 390 627 C 508 699 644 706 749 679 M 826 282 C 887 317 924 365 943 418',stroke=INK,width=.8,extra='opacity=".24"')
    out+=path('M 365 574 C 481 637 652 662 783 600',stroke=LIGHT,width=6,extra='opacity=".5"')
    return group('eye-study',out)

def ear_study():
    ear='M 467 619 C 438 566 415 494 411 422 C 404 336 418 257 461 203 C 500 153 570 126 634 143 C 709 161 749 230 755 302 C 764 377 741 442 706 505 C 686 544 667 568 659 612 C 649 668 627 711 585 729 C 544 746 495 726 477 688 C 467 670 466 643 467 619 Z'
    out=path(ear,'url(#skin)',INK,2.8)
    outer='M 463 579 C 439 518 424 452 428 387 C 430 315 444 254 488 210 C 526 174 581 160 632 181 C 690 207 716 256 720 313 C 725 369 710 422 684 471 C 710 388 702 316 675 267 C 647 215 599 195 556 206 C 507 217 479 261 465 318 C 444 409 448 497 475 563 Z'
    out+=path(outer,'url(#shade)','none')
    # Inner scapha and helix turning continuously into the lobe.
    out+=path('M 476 574 C 451 506 442 443 448 382 C 454 301 479 246 526 218 C 570 191 624 202 661 237 C 696 270 708 322 700 370 C 695 407 684 433 668 460 C 646 500 629 537 625 575 C 620 625 611 663 587 679 C 569 694 541 690 530 671',stroke=INK,width=3.2)
    out+=path('M 474 515 C 459 451 463 371 483 318 C 502 268 528 244 565 237 C 603 228 640 245 658 271',stroke=LIGHT,width=7,extra='opacity=".7"')
    # The triangular fossa between the two antihelix crura.
    fossa='M 522 307 C 547 270 581 258 614 274 C 632 283 642 303 639 324 C 617 311 591 306 565 320 C 547 331 533 329 522 307 Z'
    out+=path(fossa,INK,INK,1.3)
    out+=path('M 534 303 C 558 281 589 276 610 289',stroke='#8c9680',width=3,extra='opacity=".75"')
    # Antihelix divides then folds inward into a deep concha bowl.
    out+=path('M 491 452 C 492 409 508 369 534 340 C 550 322 572 316 590 319 C 618 319 642 338 647 363 C 650 386 638 406 620 426 C 599 447 590 465 591 485 C 590 504 605 525 604 544 C 602 570 582 594 563 598 C 536 604 509 584 503 562 C 529 580 550 574 560 555 C 573 534 560 514 554 496 C 548 475 554 452 568 435 C 587 412 607 394 603 373 C 599 354 578 347 563 355 C 533 373 517 408 516 448 Z','url(#bone)',INK,2.1)
    out+=path('M 516 447 C 527 417 545 401 564 408 C 549 433 541 459 550 481 C 557 505 569 526 558 548 C 546 572 520 574 507 556 C 503 536 507 512 497 496 C 484 481 485 458 496 448 C 501 442 509 443 516 447 Z',INK,INK,1.2)
    out+=path('M 523 430 C 537 419 545 421 545 430 C 535 449 532 470 535 487 C 520 476 511 462 523 430 Z','#6e7b70','none')
    # Tragus and antitragus interrupt the bowl rather than outlining a symbol.
    out+=path('M 475 470 C 487 460 506 467 512 483 C 518 498 511 513 500 518 C 493 520 491 535 496 546 C 478 543 469 527 472 510 C 478 496 478 482 475 470 Z','url(#skin)',INK,2.3)
    out+=path('M 500 570 C 510 546 531 545 541 559 C 545 573 536 584 520 590 C 515 600 516 611 523 620 C 509 612 500 596 500 570 Z','url(#skin)',INK,1.6)
    out+=path('M 525 640 C 535 659 554 667 571 659 M 493 628 C 487 654 496 683 516 695 M 552 711 C 585 712 608 693 620 666',stroke=INK,width=1.2,extra='opacity=".6"')
    out+=hatch('M 441 405 C 434 474 455 551 475 588 L 476 643 C 447 593 426 507 424 447 Z','helix-shading',opacity=.23,spacing=7)
    out+=hatch('M 646 444 C 665 415 683 381 690 348 C 695 402 676 444 658 483 C 634 530 630 583 616 616 C 625 552 630 500 646 444 Z','antihelix-shading',opacity=.21,spacing=6)
    out+=hatch('M 494 665 C 511 704 549 724 586 711 C 565 731 520 718 503 695 Z','lobule-shading',opacity=.23,spacing=7)
    # Contour sweeps are light study overlays; full anatomy is always present.
    overlay=path('M 473 549 C 448 454 449 331 492 263 C 525 212 578 197 628 221',stroke=GOLD,width=4,extra='stroke-dasharray="1 7"')+path('M 519 434 C 530 398 550 368 575 362 C 600 356 614 374 604 394',stroke=GOLD,width=3,extra='opacity=".7"')
    out+=group('light-following-cartilage',overlay,motion=anim('opacity','.2;.2;.85;1;.45;.2;.2'))
    # Sound pressure arcs are small secondary drawing marks, emerging only mid-loop.
    arcs=path('M 823 319 C 849 363 849 419 824 458 M 856 296 C 892 354 893 427 859 484',stroke=GOLD,width=1.7,extra='opacity=".58"')
    out+=group('listening-echo',arcs,extra='opacity=".22"',motion=anim('opacity','.22;.1;.8;.4;.15;.22;.22'))
    return group('ear-study',out,extra='transform="rotate(9 580 445) translate(15 0)"')

def profile_laugh():
    neck='M 444 494 C 471 587 474 648 437 702 C 395 747 330 772 273 816 L 922 816 C 880 772 813 747 760 718 C 726 698 699 676 692 635 L 623 562 Z'
    out=path(neck,'url(#skin)',INK,2)+path('M 454 550 C 487 602 530 628 577 631 C 573 674 545 714 512 741 C 486 764 474 787 463 816 L 320 816 C 368 768 429 732 449 685 C 473 636 462 593 454 550 Z','url(#shade)','none')
    out+=path('M 480 656 C 493 693 489 736 474 773 M 613 647 C 641 670 665 693 682 727 M 354 786 C 414 759 453 751 491 756 M 706 750 C 738 751 777 768 812 790',stroke=INK,width=1.4,extra='opacity=".6"')
    head='M 415 328 C 408 251 437 184 496 148 C 556 112 645 121 709 154 C 758 177 793 215 800 260 C 807 289 797 311 799 334 C 802 353 824 370 834 390 C 845 410 861 427 883 442 C 891 449 888 459 877 464 L 842 470 C 837 481 834 490 842 496 C 848 502 848 511 839 517 C 822 526 810 527 798 522 C 805 554 818 582 821 612 C 825 639 807 662 785 668 C 763 676 739 663 721 654 C 680 648 642 638 606 618 C 566 599 533 574 504 554 C 478 537 449 505 438 471 C 424 435 421 383 415 328 Z'
    out+=path(head,'url(#skin)',INK,2.6)
    out+=path('M 437 349 C 460 310 492 311 527 331 C 529 387 541 425 574 452 C 612 483 641 511 653 552 C 667 593 696 626 730 648 C 669 637 618 619 580 592 C 529 558 486 527 464 483 C 444 447 436 394 437 349 Z','url(#shade)','none')
    out+=path('M 713 177 C 759 200 786 236 790 274 C 791 299 780 313 788 334 C 765 330 748 330 728 338 C 739 294 742 236 713 177 Z','url(#shade)','none',extra='opacity=".55"')
    # Swept back dark hair and temple.
    out+=path('M 432 461 C 406 426 391 371 395 311 C 390 251 411 192 447 160 C 433 169 420 170 415 172 C 449 129 497 105 541 101 C 530 108 529 113 529 116 C 586 85 665 103 711 127 C 744 140 777 169 793 203 C 785 195 777 193 771 191 C 794 222 809 251 804 276 C 786 272 768 252 754 242 C 717 237 691 218 672 198 C 628 214 578 218 539 204 C 548 201 556 195 561 191 C 531 199 499 220 482 245 C 462 271 460 302 456 329 C 450 352 442 369 439 396 L 438 457 Z','url(#hair)',INK,2.5)
    for i in range(27):
        a=i/26;x=435+a*325;y=202-64*sin(a*pi);ex=457+a*295;ey=258-49*sin(a*pi)
        out+=path(f'M {x:.1f} {y:.1f} C {x+27:.1f} {y-33:.1f} {ex+25:.1f} {ey-52:.1f} {ex:.1f} {ey:.1f}',stroke='#c4b791',width=1.1+(i%3)*.35,extra=f'opacity="{.2+(i%4)*.1}"')
    # The ear occludes the temporal muscle plane.
    ear='M 504 354 C 486 332 461 341 455 365 C 446 396 461 435 481 457 C 494 472 515 469 521 448 C 527 424 523 397 516 377 Z'
    out+=path(ear,'url(#skin)',INK,2)+path('M 498 357 C 480 344 465 361 469 383 C 472 393 478 401 480 412 C 484 424 476 433 484 444 C 492 455 505 448 507 436 M 478 382 C 491 365 510 376 507 389 C 506 401 490 402 493 416 L 504 421',stroke=INK,width=2)+path('M 482 397 C 490 390 498 396 497 406 L 491 426 C 478 426 477 408 482 397 Z',INK,'none')
    # Eye closes by cheek pressure; crescent lid remains anatomical.
    out+=group('laughing-eye',path('M 689 358 C 719 340 755 340 786 360 C 755 356 725 356 698 370 Z',INK,'none')+path('M 703 377 C 728 367 756 369 780 380 C 752 378 730 385 707 389',stroke=INK,width=3)+path('M 710 398 C 733 390 757 393 777 402 M 700 381 l -15 -6 M 695 389 l -15 2 M 701 397 l -13 9',stroke=INK,width=1.3),motion=move('0 0;0 1;0 -3;0 -5;0 -2;0 0;0 0'))
    out+=path('M 796 350 C 798 380 814 406 833 426 C 840 436 835 445 822 445 C 810 442 806 432 797 430 C 785 425 774 436 782 445 C 790 452 802 453 810 452',stroke=INK,width=2.1)
    out+=path('M 786 438 C 793 431 805 435 809 441 C 800 448 790 447 786 438 Z',INK,'none')
    out+=path('M 806 390 C 822 414 838 430 862 444 M 745 421 C 762 411 781 415 791 424',stroke=LIGHT,width=4,extra='opacity=".65"')
    # Nasolabial fold and raised zygomatic plane define the laugh.
    out+=group('laughing-cheek',path('M 777 453 C 756 450 740 463 733 480 C 725 498 717 511 703 516',stroke=INK,width=2.3)+path('M 691 446 C 716 420 745 416 768 432 C 741 439 723 458 708 479 Z',GOLD,'none',extra='opacity=".38"')+path('M 686 453 C 702 438 720 433 731 434 M 689 469 C 699 457 711 451 719 449',stroke=INK,width=1,extra='opacity=".5"'),motion=move('0 0;0 1;0 -5;0 -6;0 -2;0 0;0 0'))
    # Mouth gap follows the muzzle; the teeth wrap backward in perspective.
    mouth='M 737 489 C 773 503 807 502 838 493 C 829 511 815 526 807 544 C 801 561 805 583 803 597 C 783 588 770 568 760 544 C 750 524 741 506 737 489 Z'
    out+=path(mouth,INK,INK,1.8)
    out+=path('M 743 494 C 773 507 803 509 833 498 L 822 518 C 797 526 775 518 754 512 Z',LIGHT,INK,1)
    for i in range(6):
        x=758+i*11;y=505+sin(i/5*pi)*7
        out+=path(f'M {x} {y} l -1 11',stroke=INK,width=.8)
    out+=path('M 779 566 C 791 563 802 570 804 587 L 800 596 C 790 587 785 578 779 566 Z',RUST,'none')
    jaw=path('M 739 509 C 746 545 756 580 779 606 C 791 619 808 619 822 610 C 826 637 811 659 790 664 C 767 669 748 656 733 644 C 722 629 720 613 722 598 C 737 619 756 631 777 630 C 753 602 741 574 735 544 Z','url(#skin)',INK,2)
    jaw+=path('M 739 536 C 743 569 760 605 777 620 C 758 608 743 593 736 576 Z','url(#shade)','none')+path('M 777 610 C 791 618 807 619 817 612',stroke=RUST,width=3)+path('M 744 636 C 754 647 771 652 787 651',stroke=LIGHT,width=3)
    out+=group('laughing-jaw',jaw,motion=anim('transform','0 646 478;-1 646 478;2 646 478;3 646 478;1 646 478;0 646 478;0 646 478',kind='animateTransform',extra='type="rotate"'))
    out+=hatch('M 527 467 C 567 491 609 526 629 569 C 645 603 672 623 699 635 C 652 624 610 606 577 581 C 553 563 532 544 521 527 Z','masseter-hatching',opacity=.2,spacing=7)
    out+=hatch('M 463 592 C 484 625 519 643 552 651 C 547 683 527 711 507 730 L 479 762 C 491 708 486 650 463 592 Z','laugh-neck-hatching',opacity=.23,spacing=8)
    out+=path('M 644 564 C 656 584 666 596 676 601 M 629 574 C 636 589 643 598 654 607 M 600 616 C 626 631 647 648 658 668',stroke=INK,width=1.2,extra='opacity=".5"')
    return group('laughing-profile',out,extra='transform="translate(0 -5)"')

SPECIAL={
'105193':dict(title='Architecture beneath the face',cat='skull-and-orbit',fn=skull,observation='The reference isolates the bony orbit, nasal aperture and zygomatic arches. Deep occlusion is nearly black, while thin rim lights make the thickness of bone readable.',subject='an original human skull in a slight three-quarter view, domed frontal cranium, irregular sutures, unequal deep orbital cavities, a delicate nasal bridge, curved zygomatic arches and articulated upper and lower dental arcades',motion='0–1 s: hold the full drawing; 1–2 s: warm rim light gathers along the orbital arch; 2–3.4 s: the mandible rotates three degrees at the hinge; 3.4–4.8 s: the light crosses the zygomatic contour; 4.8–6 s: jaw and light settle; 6–7 s: return exactly to the initial pose.'),
'105194':dict(title='The globe beneath the lid',cat='eye-anatomy',fn=eye_study,observation='The eyeball and both lids wrap around a sphere. The brow ridge, tear lake, lid crease and lower orbital plane must turn in depth rather than become flat graphic outlines.',subject='a large isolated anatomical eye, eyelids wrapping around the spherical cornea, layered upper crease, detailed olive iris and dark pupil, wet tear lake at the medial corner, directional eyebrow hairs and a sculpted lower orbital plane',motion='0–1 s: quiet open gaze; 1–2 s: brow anticipates a glance; 2–2.17 s: the upper lid closes; 2.17–2.45 s: the eye reopens; 2.45–4.8 s: iris looks laterally while the brow holds; 4.8–6 s: gaze returns; 6–7 s: initial pose is restored.'),
'105195':dict(title='Cartilage catching the light',cat='ear-anatomy',fn=ear_study,observation='The ear has a continuous helix, a bifurcated antihelix, triangular fossa, deep concha, projecting tragus and soft lobule. Its back surface and overlapping folds are volumes, not a flat symbol.',subject='a greatly enlarged three-quarter human ear, continuous outer helix, Y-shaped antihelix branches, triangular fossa, deep conchal bowl, small projecting tragus and antitragus, soft asymmetric lobule and finely hatched turning planes',motion='0–1 s: full anatomical drawing holds; 1–2 s: a subtle cartilage highlight builds; 2–3.4 s: light follows the helix and antihelix while small sound arcs appear; 3.4–4.8 s: the highlights soften; 4.8–6 s: sound arcs and light settle; 6–7 s: match the opening drawing.'),
'105202':dict(title='Laughter in profile',cat='laughter-profile',fn=profile_laugh,observation='The profile laugh combines a rising cheek, compressed eyelid, deepened nasolabial fold and lowered mandible. The teeth wrap in perspective and the neck responds to the jaw.',subject='a warmly lit expressive male head in right-facing profile laughing openly, swept-back engraved hair, anatomically folded ear, compressed crescent eyelid, raised zygomatic cheek, perspective dental arcade, descending mandible and taut neck tendons',motion='0–1 s: hold the open laugh; 1–2 s: cheek and eye anticipate; 2–3.4 s: the jaw rotates down and the cheek rises; 3.4–4.8 s: laugh peaks with a soft jaw follow-through; 4.8–6 s: jaw and eyelid settle; 6–7 s: identical opening pose.')}

def write_all():
    global ANIM
    metas=[]
    for id in ['105193','105194','105195','105196','105197','105198','105199','105200','105202','105203']:
        if id in CONFIG:
            c=CONFIG[id];title=c['title'];cat=c['cat'];obs=c['emotion']
            subject=f'an original coherent male portrait expressing {cat}, asymmetrical natural proportions, sculpted cranial and cheek planes, detailed olive irises, directional swept hair, true ear folds, modeled nose cartilage, expressive lips and tendons of the neck'
            motion='0–1 s: readable resting expression; 1–2 s: small anticipation; 2–3.4 s: '+c['action']+' 3.4–4.8 s: sustain the emotional peak; 4.8–6 s: secondary features ease back; 6–7 s: exact return to the initial pose. The coordinated blink closes at 2.17 s and reopens at 2.45 s.'
            fn=lambda id=id,c=c:portrait(id,c)
        else:
            c=SPECIAL[id];title=c['title'];cat=c['cat'];obs=c['observation'];subject=c['subject'];motion=c['motion'];fn=c['fn']
        prompt=f'Create a museum-quality original native SVG drawing of {subject}. Use the visual lesson of reference {id}.jpg as anatomical study material; do not trace its photograph, page, lettering or composition. Compose on a 1200 × 900 warm ivory (#f3eee2) field with generous breathing room. Draw explicit editable cubic Bézier contours, a 2–3 px indigo graphite (#24343b) silhouette, broken 0.8–1.5 px interior lines, restrained contour hatching, pale upper-left light, olive gray shadow planes, muted ochre and russet accents. Make the subject feel sculptural through overlap, occlusion, perspective, curved cross-contours and reflected light. Preserve natural asymmetry and avoid icon geometry, plastic gradients, raster embeds and decorative UI. Name structural SVG groups and provide accessible title/description. Animate a seven-second looping study with anticipation, anatomically motivated independent parts and a soft settle; keep the artwork fully readable at time zero and make the ending identical.'
        for is_anim in (False,True):
            ANIM=is_anim
            drawing=svg(title,obs+' '+('Seven-second native SVG loop. '+motion if is_anim else 'Original editable vector study.'),fn())
            folder='animated' if is_anim else 'svg'
            (ROOT/'corpus'/folder/(id+'.svg')).write_text(drawing)
        metas.append(dict(id=id,title=title,category=cat,source=id+'.jpg',observation=obs,prompt=prompt,motion=motion,animated=f'corpus/animated/{id}.svg',svg=f'corpus/svg/{id}.svg'))
    (ROOT/'corpus/metadata/faces.json').write_text(json.dumps(metas,indent=2,ensure_ascii=False)+'\n')
    print('Wrote 10 static SVGs, 10 animated SVGs and metadata/faces.json.')
if __name__=='__main__':write_all()
