"""Authored sparse story geometry. No tracing, raster images, or tonal fills.

The prior generated plates supplied subject/pose reference. This script constructs
the four story studies as editable cubic paths with a Hairline-inspired palette.
"""
from pathlib import Path
import math
import json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'corpus/svg'
META=ROOT/'corpus/hairline/stories.json'
BG='#101014'
SIL,MID,LO,HI='#a1a1aa','#52525b','#27272a','#fafafa'

def p(d,c='mid',filled=False,ident=None):
    attrs=f' id="{ident}"' if ident else ''
    return f'<path{attrs} class="{c}" d="{d}" fill="{BG if filled else "none"}"/>'

def group(ident,paths):return f'<g id="{ident}">'+''.join(paths)+'</g>'
def frame(ident,title,desc,parts):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-labelledby="s{ident}-title s{ident}-desc">
<title id="s{ident}-title">{title}</title><desc id="s{ident}-desc">{desc}</desc>
<style>path{{stroke-width:1.1;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}}.sil{{stroke:#a1a1aa}}.mid{{stroke:#52525b}}.lo{{stroke:#27272a}}.hi{{stroke:#fafafa}}</style>
<rect width="1200" height="900" fill="#101014"/>{''.join(parts)}</svg>'''

def pirate():
    parts=[]
    parts.append(group('harbor',[
        p('M 150,677 L 1046,741 M 180,718 L 1009,783 M 269,744 L 931,814 M 358,644 L 178,806 M 579,664 L 564,828 M 736,684 L 924,824','lo'),
        p('M 624,548 C 736,550 853,548 1019,543 M 764,583 C 855,583 925,580 993,580','lo'),
        p('M 801,540 Q 865,550 927,533 L 912,561 Q 863,580 819,562 Z','mid',True),
        p('M 857,545 L 857,372 M 897,544 L 897,409 M 857,388 C 844,438 831,463 816,489 L 855,481 M 861,401 C 883,432 893,459 901,480 L 862,482 M 896,420 L 919,504 L 898,503','lo'),
        p('M 1002,189 A 30,30 0 0,0 1012,241 A 32,32 0 0,1 1002,189','mid'),
    ]))
    parts.append(group('bollard',[
        p('M 684,635 C 684,625 721,622 725,634 L 731,718 Q 710,727 689,718 Z','mid',True),
        p('M 687,638 Q 708,645 723,637 M 684,681 Q 708,692 729,679 M 685,689 Q 708,701 730,688 M 730,694 Q 779,730 846,729','lo')
    ]))
    parts.append(group('legs',[
        p('M 322,337 C 360,330 411,332 446,347 C 459,403 472,493 468,557 L 479,633 L 421,650 C 406,601 394,548 391,493 L 376,428 C 362,474 346,524 325,572 L 298,651 L 242,631 C 258,563 278,493 293,433 Z','sil',True),
        p('M 376,428 Q 380,397 390,377 M 300,455 Q 320,475 342,470 M 279,534 Q 298,552 322,546 M 393,482 Q 422,496 450,486 M 411,561 Q 431,570 464,558','mid')
    ]))
    parts.append(group('boots',[
        p('M 244,606 Q 271,623 306,612 L 294,679 Q 282,723 264,775 C 273,784 286,795 282,809 Q 263,820 219,813 C 212,798 220,781 225,766 L 237,685 Z','sil',True),
        p('M 242,614 L 231,667 Q 257,684 297,672 M 230,744 Q 247,753 272,749 M 222,794 Q 250,785 281,803 M 221,810 Q 255,817 281,806','mid'),
        p('M 410,614 Q 442,612 474,594 L 490,657 L 484,710 Q 493,736 519,750 L 556,768 Q 568,777 559,784 C 529,795 477,795 435,786 L 431,766 L 436,705 Z','sil',True),
        p('M 415,622 L 428,664 Q 457,663 489,647 M 441,734 Q 463,727 489,732 M 439,773 Q 502,787 562,778','mid')
    ]))
    parts.append(group('coat',[
        p('M 331,146 Q 299,151 272,169 C 239,185 231,216 229,254 L 254,321 L 256,411 C 242,472 211,537 183,605 Q 207,628 248,640 C 283,580 304,511 325,441 L 350,355 L 403,348 C 418,421 437,516 467,610 L 527,588 C 508,518 492,451 477,373 L 449,251 L 429,179 Q 416,158 390,153 Z','sil',True),
        p('M 328,159 L 306,183 L 332,202 L 302,218 C 310,259 325,297 340,328 M 391,161 L 415,186 L 401,208 L 426,221 L 426,311 M 278,324 C 286,388 269,478 242,548 M 453,357 C 463,430 483,515 502,581','mid'),
        p('M 312,264 A 4,4 0 1,0 320,264 A 4,4 0 1,0 312,264 M 305,294 A 4,4 0 1,0 313,294 A 4,4 0 1,0 305,294 M 299,325 A 4,4 0 1,0 307,325 A 4,4 0 1,0 299,325','mid')
    ]))
    parts.append(group('shirt-belt',[
        p('M 337,151 L 358,174 L 383,155 L 405,205 L 416,324 L 337,330 L 347,223 Z','mid',True),
        p('M 349,186 L 361,212 L 371,185 M 373,211 L 381,286 M 347,255 Q 356,290 345,315','lo'),
        p('M 323,323 Q 373,342 427,319 L 434,343 Q 377,359 318,345 Z','sil',True),
        p('M 370,327 L 396,327 L 399,349 L 373,350 Z M 377,334 L 391,333 L 392,343 L 378,344 Z','mid')
    ]))
    parts.append(group('chart',[
        p('M 208,445 L 321,413 L 344,514 L 235,547 Q 220,493 208,445 Z','sil',True),
        p('M 221,453 L 313,426 L 330,505 L 244,530 Z M 255,458 C 276,438 279,478 300,459 C 315,454 304,478 322,483 M 254,490 C 272,477 278,506 294,494','lo'),
        p('M 278,471 L 286,482 L 281,494 L 273,483 Z','mid')
    ]))
    parts.append(group('down-arm',[
        p('M 273,174 C 241,178 224,209 222,242 C 218,280 204,310 195,342 L 181,355 L 195,414 Q 216,427 243,419 L 255,373 L 259,319 Q 277,282 280,241','sil',True),
        p('M 230,218 Q 245,229 257,240 M 216,294 Q 231,308 250,307 M 194,354 Q 216,364 249,353 M 195,395 Q 213,402 246,394','mid'),
        p('M 203,409 Q 220,402 239,410 L 244,431 L 244,449 Q 239,454 235,447 L 233,430 L 231,454 Q 224,458 222,450 L 222,432 L 217,454 Q 210,455 210,448 L 211,431 L 207,442 Q 201,443 201,436 Z','sil',True),
        p('M 202,410 Q 221,417 241,409 M 214,418 L 211,431 M 225,419 L 222,432 M 235,419 L 233,430','mid')
    ]))
    parts.append(group('raised-arm',[
        p('M 416,164 C 434,158 454,166 464,180 L 479,165 L 477,143 Q 497,132 520,137 L 536,173 C 543,192 535,214 516,222 C 487,233 465,225 443,209 L 430,239','sil',True),
        p('M 451,184 L 461,210 M 473,184 Q 496,193 523,181 M 481,157 Q 505,170 530,154','mid'),
        p('M 482,147 L 475,125 Q 465,116 461,102 L 461,87 C 457,78 461,74 465,78 L 471,89 L 473,76 C 475,70 481,73 482,79 L 485,88 L 486,76 C 489,70 494,75 494,80 L 497,89 L 499,80 Q 506,77 508,85 L 506,105 Q 501,117 509,140 Q 496,153 482,147 Z','sil',True),
        p('M 472,91 Q 476,103 483,108 M 484,91 Q 488,101 494,103 M 496,91 L 500,101','mid')
    ]))
    parts.append(group('head',[
        p('M 339,88 C 345,70 368,61 391,68 Q 411,72 413,86 L 413,97 L 425,107 Q 429,112 418,115 L 416,124 Q 421,126 418,131 L 412,137 Q 414,145 404,150 L 386,152 L 384,165 L 363,179 L 339,153 L 341,134 Q 329,124 329,108 Z','sil',True),
        p('M 345,102 C 330,90 329,117 342,120 M 339,105 Q 345,100 346,112 M 387,93 Q 398,88 407,93 M 390,98 Q 399,94 407,99 M 404,99 L 404,102 M 392,108 Q 398,113 402,114 M 401,126 Q 409,122 417,126','mid'),
        p('M 347,123 C 352,132 359,136 367,133 C 372,143 378,143 383,138 C 388,144 396,145 403,138 L 412,137 M 347,130 Q 355,145 366,147 M 374,142 L 375,154 M 390,144 L 389,153','mid'),
        p('M 338,90 C 321,100 322,116 311,120 Q 327,118 331,109 M 333,120 Q 315,125 323,139 M 341,132 Q 331,135 330,146','lo')
    ]))
    parts.append(group('telescope',[
        p('M 414,86 L 458,83 L 458,94 L 416,98 Z','sil',True),
        p('M 497,77 L 659,66 Q 670,70 671,83 Q 672,95 663,100 L 499,96 Z','sil',True),
        p('M 551,74 Q 558,83 554,98 M 593,70 Q 601,83 596,98 M 502,82 L 649,74','mid'),
        p('M 661,66 C 653,67 653,97 663,100 C 674,99 674,68 661,66 Z','hi')
    ]))
    parts.append(group('hat',[
        p('M 281,92 Q 303,79 316,54 C 353,30 400,28 442,42 Q 430,64 414,77 Q 347,80 304,102 Z','sil',True),
        p('M 288,91 C 333,74 380,74 416,76 M 317,55 Q 343,68 364,71','mid')
    ]))
    parts.append(group('feather',[
        p('M 305,77 C 290,65 282,50 266,43 C 294,37 315,47 323,64 L 308,80 M 271,45 Q 304,54 320,70','mid'),
        p('M 282,45 L 282,52 M 294,47 L 292,59 M 305,53 L 301,66','lo')
    ]))
    return frame('105232','The Captain Who Charted the Moon','Native path illustration of an adult seafarer looking through a telescope on a quiet pier. A single bright lens edge anchors the monochrome line composition.',parts)

def dragon():
    parts=[]
    parts.append(group('marsh',[
        p('M 143,677 C 247,707 419,701 571,652 C 634,639 683,642 721,666 M 747,686 C 847,688 934,681 1050,670 M 719,727 C 826,736 936,727 1013,714','lo'),
        p('M 196,422 C 164,355 162,261 183,165 M 177,298 C 228,254 257,225 268,182 M 182,188 C 203,165 243,147 279,151','lo'),
        p('M 215,237 Q 231,264 229,300 M 248,208 Q 262,243 259,274 M 902,575 L 893,502 M 901,549 L 916,520 M 932,584 L 935,507','lo'),
        p('M 794,757 C 821,745 855,746 871,759 C 849,770 815,771 794,757 M 897,721 C 919,709 951,713 965,723 Q 930,737 897,721','lo')
    ]))
    parts.append(group('tail',[
        p('M 407,538 C 347,517 272,528 250,574 C 228,620 272,646 330,648 C 379,650 399,672 364,688 C 329,706 247,706 219,686 C 253,737 386,736 433,695 C 468,666 452,637 409,623 L 449,590 Z','sil',True),
        p('M 262,586 C 270,616 348,608 383,630 M 380,686 C 344,703 293,709 256,703','mid')
    ]))
    parts.append(group('far-wing',[
        p('M 499,469 L 394,296 Q 374,326 346,333 C 319,344 289,343 265,341 C 292,374 297,400 290,431 C 344,418 379,440 396,478 L 469,517 Z','sil',True),
        p('M 394,296 C 401,356 432,407 475,464 M 394,296 C 369,352 341,388 290,431 M 346,333 Q 377,369 400,411','mid')
    ]))
    parts.append(group('body',[
        p('M 463,418 C 408,414 367,448 357,493 C 343,541 365,597 417,622 C 469,648 544,638 584,608 C 623,578 620,536 596,507 C 571,477 517,439 463,418 Z','sil',True),
        p('M 373,504 C 390,552 429,576 475,581 M 395,603 Q 446,625 494,616','mid')
    ]))
    parts.append(group('neck',[
        p('M 466,491 C 462,433 478,382 500,332 C 516,297 516,268 502,237 C 483,199 497,165 529,149 C 560,131 605,140 628,167 L 670,212 L 709,228 Q 733,235 741,250 Q 738,265 720,272 L 684,273 L 653,259 C 626,253 605,238 591,221 C 570,215 562,231 568,255 C 579,294 585,315 572,348 C 557,393 554,437 577,487 C 589,514 600,548 578,572 C 549,603 495,580 466,548 Z','sil',True),
        p('M 590,221 C 561,235 546,262 550,297 C 552,334 531,370 529,407 C 526,453 543,500 568,541','mid'),
        p('M 536,319 Q 555,332 575,334 M 526,352 Q 549,366 562,366 M 514,390 Q 534,405 554,404 M 512,429 Q 535,441 557,442 M 518,469 Q 541,478 570,475 M 536,507 Q 559,516 585,510 M 555,546 Q 571,550 585,543','mid'),
        p('M 650,224 Q 668,214 682,222 Q 672,233 657,230 Z M 667,222 L 667,229 M 722,243 Q 728,239 732,244 M 695,257 Q 715,260 731,253','sil'),
        p('M 646,234 C 659,258 677,272 696,282 M 669,252 C 666,276 680,301 704,310','lo')
    ]))
    parts.append(group('horns',[
        p('M 585,171 C 562,141 550,119 551,99 C 532,123 536,143 550,166 L 567,184 Z','sil',True),
        p('M 616,180 C 601,149 599,126 610,108 C 583,119 578,149 588,174 Z','sil',True),
    ]))
    parts.append(group('near-wing',[
        p('M 461,491 C 425,438 405,373 403,307 L 371,339 C 343,367 303,384 271,379 C 288,412 280,445 266,472 C 321,452 359,466 383,506 L 443,530 Z','sil',True),
        p('M 403,307 C 399,388 416,450 443,503 M 403,307 C 373,374 334,429 266,472 M 371,339 C 372,383 365,426 353,466','mid')
    ]))
    parts.append(group('resting-paw',[
        p('M 463,538 C 481,548 499,565 520,575 L 568,586 Q 584,587 594,599 L 605,615 Q 604,622 597,620 L 581,608 L 591,625 Q 588,632 581,628 L 566,613 L 574,629 Q 571,635 564,631 L 550,615 L 514,615 C 477,609 450,596 432,578 Z','sil',True),
        p('M 454,564 Q 480,585 516,589 M 548,599 L 566,613 M 566,594 L 581,608','mid')
    ]))
    parts.append(group('holding-arm',[
        p('M 574,463 C 606,486 627,475 643,442 L 667,386 C 675,369 688,358 701,358 L 719,364 L 734,381 Q 739,389 734,397 L 722,389 L 714,378 L 702,380 L 709,390 L 722,397 Q 724,404 716,405 L 697,397 L 685,391 C 678,416 676,447 662,473 C 640,512 603,529 576,507 Z','sil',True),
        p('M 596,492 Q 626,504 651,464 M 704,364 L 715,372 M 686,375 Q 695,372 702,380','mid')
    ]))
    parts.append(group('lantern-ring',[
        p('M 721,393 C 700,396 700,426 718,430 C 738,430 741,403 727,397','sil'),
        p('M 714,427 L 714,442 L 722,442 L 722,429','mid')
    ]))
    parts.append(group('lantern',[
        p('M 696,452 L 706,442 L 732,442 L 743,452 L 746,535 L 736,546 L 701,546 L 691,535 Z','sil',True),
        p('M 696,452 L 743,452 M 701,458 L 737,458 L 739,529 L 699,529 Z M 691,535 L 746,535 M 708,458 L 707,529 M 731,458 L 733,529 M 712,546 L 714,554 L 723,554 L 726,546','mid'),
        p('M 718,518 C 701,511 712,493 718,486 C 715,500 735,505 725,516 Q 721,521 718,518 Z','hi')
    ]))
    return frame('105233','A Lantern for the Marsh','Native line drawing of a heavy resting dragon holding a lantern ring in one claw. Sparse body planes and wing bones explain the anatomy; the flame is the single bright mark.',parts)

def gardener():
    parts=[]
    parts.append(group('garden',[
        p('M 154,733 C 272,758 506,759 685,735 M 767,739 C 852,731 949,727 1037,706 M 752,598 C 866,557 948,518 1034,474 M 802,630 C 897,604 964,575 1038,544','lo'),
        p('M 183,556 L 176,382 Q 249,347 323,380 L 316,515 M 185,454 L 252,440 M 252,366 L 257,482','lo'),
        p('M 926,563 L 941,286 M 1007,552 L 990,293 M 937,337 L 994,340 M 934,414 L 998,419 M 929,491 L 1002,496','lo'),
        p('M 954,553 C 967,505 947,481 969,441 C 984,412 961,383 979,355 M 968,443 Q 943,440 945,425 Q 960,425 968,443 M 964,476 Q 989,458 997,471 Q 982,483 964,476','mid')
    ]))
    parts.append(group('legs',[
        p('M 371,487 C 403,472 454,479 472,513 L 486,571 L 484,634 C 474,673 442,725 406,735 C 365,743 305,724 267,691 L 222,669 L 239,619 L 298,631 L 340,658 L 358,609 Z','sil',True),
        p('M 431,508 C 470,474 518,424 552,408 C 583,393 611,418 609,449 L 592,522 C 578,562 575,608 573,657 L 513,667 C 507,623 508,581 515,545 L 477,571 Z','sil',True),
        p('M 372,621 Q 388,643 417,657 M 293,649 Q 306,678 331,690 M 534,452 Q 561,477 591,472 M 524,534 Q 547,549 583,540 M 517,625 Q 541,634 574,621','mid')
    ]))
    parts.append(group('boots',[
        p('M 242,612 Q 251,639 237,669 C 232,695 209,716 196,719 Q 181,716 182,703 L 196,660 L 190,633 Q 193,613 213,602 Z','sil',True),
        p('M 195,622 Q 217,633 240,632 M 192,676 L 217,688 M 189,692 L 205,703','mid'),
        p('M 513,645 Q 542,651 574,641 L 585,704 C 600,713 627,721 630,734 Q 622,747 596,746 L 512,736 L 509,718 Z','sil',True),
        p('M 519,655 Q 542,663 577,651 M 517,714 Q 548,707 583,714 M 514,731 Q 578,746 626,735 M 532,674 L 562,684 M 531,685 L 562,695','mid')
    ]))
    parts.append(group('coat',[
        p('M 421,221 C 381,210 340,231 321,264 C 294,303 290,358 303,397 L 319,440 C 307,479 294,524 286,566 L 329,584 L 361,544 L 394,575 L 466,558 L 479,465 L 505,409 L 542,376 C 560,354 560,329 546,301 L 504,244 L 473,225 Z','sil',True),
        p('M 420,225 L 397,260 L 418,278 L 393,304 L 410,362 M 474,233 L 501,260 L 483,279 L 511,295 L 494,350 M 328,475 Q 352,501 368,533','mid')
    ]))
    parts.append(group('shirt-apron',[
        p('M 422,229 L 446,254 L 476,233 L 489,294 L 459,368 L 408,350 L 424,291 Z','mid',True),
        p('M 433,267 L 447,287 L 462,265 M 447,288 L 443,327','lo'),
        p('M 378,285 L 388,282 L 400,350 L 464,371 L 484,290 L 494,294 L 475,383 L 456,568 Q 413,581 368,570 L 352,421 Z','sil',True),
        p('M 373,421 Q 405,437 447,430 L 443,480 Q 408,489 373,476 Z M 364,522 Q 404,535 455,522','mid')
    ]))
    parts.append(group('far-arm',[
        p('M 503,272 C 523,284 537,314 536,343 L 560,384 L 548,413 Q 523,409 507,387 L 477,357','sil',True),
        p('M 518,331 L 512,352 M 537,379 Q 548,377 557,384','mid'),
        p('M 551,386 C 559,378 573,378 583,384 L 600,397 L 608,417 Q 608,426 601,423 L 590,408 L 596,430 Q 594,437 587,431 L 579,414 L 582,437 Q 577,443 573,435 L 570,416 L 567,436 Q 561,439 558,432 L 558,410 L 546,405 Z','sil',True),
        p('M 561,393 Q 575,396 584,405 M 571,390 L 590,408','mid')
    ]))
    parts.append(group('near-arm',[
        p('M 359,248 C 335,254 319,278 318,305 C 314,333 319,357 338,370 L 393,382 L 411,353 L 366,330 L 376,290','sil',True),
        p('M 323,324 Q 342,338 367,330 M 331,350 Q 353,355 373,345','mid'),
        p('M 373,342 Q 393,334 411,348 L 423,373 L 409,397 Q 387,395 373,382 L 363,359 Z','sil',True),
        p('M 377,349 Q 388,361 414,365 M 372,361 Q 387,376 412,379','mid')
    ]))
    # Handle drawn first; the near gripping hand will occlude its upper arc.
    parts.append(group('jug',[
        p('M 478,439 C 462,408 436,420 434,449 C 433,466 443,482 457,481 L 461,468 C 446,470 442,447 451,436 Q 460,428 470,449 Z','sil',True),
        p('M 479,429 Q 496,423 511,433 C 518,445 520,454 533,462 L 566,468 Q 574,470 570,477 L 544,481 C 539,515 519,549 491,565 C 470,565 437,546 424,521 C 423,500 439,468 454,452 Z','sil',True),
        p('M 479,429 C 486,443 500,453 514,450 Q 513,433 502,427 M 442,514 Q 459,542 490,551 M 458,483 Q 481,470 503,487 Q 481,482 469,501','mid')
    ]))
    parts.append(group('gripping-hand',[
        p('M 411,353 C 435,357 458,364 478,374 L 498,392 L 501,409 Q 497,418 489,414 L 482,407 L 484,425 Q 480,432 473,428 L 468,418 L 468,430 Q 462,435 458,429 L 453,417 L 450,427 Q 445,431 442,424 L 440,405 L 414,391 L 402,376 Z','sil',True),
        p('M 430,374 Q 451,376 467,388 M 448,391 L 453,417 M 460,393 L 468,418 M 473,396 L 482,407 M 489,399 L 493,407','mid'),
        p('M 425,365 L 421,373 M 434,368 L 430,376 M 443,371 L 438,378','lo')
    ]))
    parts.append(group('head',[
        p('M 425,225 L 440,199 C 426,186 420,168 423,149 C 424,119 448,100 477,103 C 509,104 534,121 535,148 L 531,165 L 541,177 Q 542,184 531,186 L 527,199 Q 523,215 506,222 L 485,224 L 474,240 L 448,255 Z','sil',True),
        p('M 438,154 C 428,143 424,161 435,170 M 434,154 L 437,163 M 484,153 Q 496,146 509,151 M 486,160 Q 495,155 504,161 M 501,161 L 500,164 M 511,169 L 516,181 Q 523,184 530,181 M 500,196 Q 511,201 523,194 M 493,210 Q 504,214 514,209','mid'),
        p('M 477,137 Q 495,134 514,143 M 479,145 Q 491,141 504,145 M 478,174 Q 479,186 489,193 M 463,197 Q 467,213 477,220','lo'),
        p('M 445,174 L 454,192 L 447,214 M 443,181 L 451,178 M 449,193 L 458,189 M 447,205 L 454,204 M 490,121 L 497,137 M 487,128 L 499,125 M 490,135 L 500,132','mid')
    ]))
    parts.append(group('hair',[
        p('M 427,151 C 414,142 417,129 424,120 Q 418,108 434,103 Q 435,91 451,95 C 462,82 472,91 483,88 Q 495,80 505,93 C 523,89 529,103 536,111 Q 548,123 538,140 L 533,151 C 527,141 523,132 513,130 Q 502,112 489,117 C 471,108 459,120 450,134 L 442,154 Z','sil',True),
        p('M 427,127 Q 437,110 449,113 M 443,106 Q 458,99 471,106 M 466,95 Q 488,95 498,106 M 496,102 Q 517,106 525,124 M 453,126 L 445,144','mid')
    ]))
    parts.append(group('pot',[
        p('M 636,652 Q 687,635 738,650 L 732,669 L 718,743 Q 684,759 651,741 L 640,674 Z','sil',True),
        p('M 636,652 C 652,668 723,671 738,650 M 641,670 Q 688,685 732,669 M 651,715 Q 683,729 721,717','mid')
    ]))
    parts.append(group('sapling',[
        p('M 687,652 C 691,622 686,595 691,565 M 689,614 C 673,596 662,588 650,588 C 650,605 666,614 689,614 M 690,597 C 709,575 723,577 729,582 C 721,598 706,602 690,597 M 691,580 Q 678,565 679,552 Q 693,554 691,580','sil'),
        p('M 651,589 L 678,608 M 694,595 L 725,583','lo')
    ]))
    parts.append(group('water',[
        p('M 568,473 C 594,504 619,565 648,635 M 575,489 C 597,524 614,567 635,610','hi'),
        p('M 639,622 L 642,630 M 649,640 L 651,646','mid')
    ]))
    return frame('105235','The Gardener Who Grew Another Morning','Native path drawing of an elderly gentle undead gardener kneeling beside a sapling. The hand grips the jug; the knees, boots and pot meet the ground. Water is the single bright accent.',parts)

def catmull(a,b,c,d,t):
    return tuple(.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t) for k in range(3))

def samples(knots, count=30):
    out=[]
    for i in range(len(knots)-1):
        a=knots[max(0,i-1)];b=knots[i];c=knots[i+1];d=knots[min(len(knots)-1,i+2)]
        for j in range(count): out.append(catmull(a,b,c,d,j/count))
    out.append(knots[-1]); return out

def axes(pts,i):
    a,b=pts[max(0,i-1)],pts[min(len(pts)-1,i+1)]
    dx,dy=b[0]-a[0],b[1]-a[1]; n=math.hypot(dx,dy)
    return (dx/n,dy/n),(-dy/n,dx/n)

def pt(p):return f'{p[0]:.2f},{p[1]:.2f}'
def path(points,close=False):return 'M'+' L'.join(pt(p) for p in points)+(' Z' if close else '')
def svgpath(d,cls='mid',fill='none',extra=''):
    return f'<path class="{cls}" d="{d}" fill="{fill}" {extra}/>'

knots=[(450,575,11),(390,548,26),(310,532,38),(232,552,43),(203,608,44),(255,661,52),(405,680,57),(555,651,56),(670,593,49),(709,506,43),(690,427,39),(714,352,33),(774,306,26),(800,300,20)]
P=samples(knots)
left=[];right=[]
for i,(x,y,r) in enumerate(P):
    t,n=axes(P,i)
    left.append((x+n[0]*r,y+n[1]*r));right.append((x-n[0]*r,y-n[1]*r))
# Smooth sampled tube with round ends. The SVG holds real geometry; no raster data.
T0,N0=axes(P,0);T1,N1=axes(P,len(P)-1)
end=[]
for j in range(1,18):
    a=math.pi*j/18;x,y,r=P[-1]
    end.append((x+r*(N1[0]*math.cos(a)+T1[0]*math.sin(a)),y+r*(N1[1]*math.cos(a)+T1[1]*math.sin(a))))
start=[]
for j in range(1,18):
    a=math.pi*j/18;x,y,r=P[0]
    start.append((x+r*(-N0[0]*math.cos(a)-T0[0]*math.sin(a)),y+r*(-N0[1]*math.cos(a)-T0[1]*math.sin(a))))
silhouette=path(left+end+list(reversed(right))+start,True)

def make_worm(spacing=42):
    art=[]
    # Sparse far environment is drawn first and hidden by any near plate.
    art += [svgpath('M 155,525 C 165,431 164,343 149,272 M 159,385 C 184,362 206,339 218,307', 'lo'),
            svgpath('M 995,519 C 982,421 992,349 1005,283 M 988,415 C 960,386 945,367 931,340','lo'),
            svgpath('M 172,700 C 277,738 531,747 734,697 M 784,677 C 851,673 886,665 914,651','lo')]
    # Two mushrooms, each only a coherent stem, cap silhouette and one underside crease.
    art += [svgpath('M 193,537 C 203,500 209,462 209,428 C 216,427 222,429 226,433 C 222,478 220,509 215,540 Z','mid',BG),
            svgpath('M 139,423 C 149,383 188,363 214,370 C 247,376 266,399 272,423 C 234,441 178,441 139,423 Z','sil',BG),
            svgpath('M 145,423 C 183,430 231,433 266,422','mid'),
            svgpath('M 180,559 C 186,537 190,518 189,500 L 200,499 C 200,526 198,544 194,560 Z','mid',BG),
            svgpath('M 153,499 C 165,472 188,465 204,474 C 215,479 224,488 226,499 C 201,510 175,509 153,499 Z','mid',BG),
            svgpath('M 159,500 Q 188,505 220,499','lo')]
    art.append('<g id="worm" data-role="continuous-body">')
    art.append(svgpath(silhouette,'sil',BG))
    # Segment lines are genuine anatomical rings with broad intervals, not texture.
    arc=0;last=-spacing/2;bands=0
    for i in range(1,len(P)-10):
        arc+=math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1])
        if arc-last<spacing:continue
        last=arc;x,y,r=P[i];t,n=axes(P,i)
        a=(x+n[0]*r*.97,y+n[1]*r*.97);b=(x-n[0]*r*.97,y-n[1]*r*.97)
        c=(x+t[0]*r*.48,y+t[1]*r*.48)
        art.append(svgpath(f'M{pt(a)} Q{pt(c)} {pt(b)}','mid'));bands+=1
    # One small near eye with an eyelid and two structural feelers.
    art += [svgpath('M 794,296 A 3.4,3.4 0 1,0 800.8,296 A 3.4,3.4 0 1,0 794,296 Z','sil',BG),
            '<g id="feeler-near">'+svgpath('M 801,282 C 805,265 819,246 834,244','sil')+'</g>',
            '<g id="feeler-far">'+svgpath('M 813,292 C 830,277 845,270 859,275','mid')+'</g>',
            svgpath('M 812,309 Q 803,312 797,311','mid')]
    art.append('</g>')
    # The one bright mark is the firefly, not a glow or filled spotlight.
    art += ['<g id="firefly" data-role="story-focal-object">',
            svgpath('M 898,236 C 893,231 891,222 895,216 C 900,219 905,227 903,234 Q 901,237 898,236 Z','hi',BG),
            svgpath('M 896,220 C 881,217 876,207 879,202 C 886,202 895,211 896,220 M 899,220 C 906,205 917,203 920,207 C 921,213 909,220 899,220','sil'),
            svgpath('M 895,216 L 891,211 M 899,216 L 901,209','mid'),'</g>']
    # Only two foreground structural leaf shapes; no scatter texture.
    art += [svgpath('M 838,704 C 840,685 838,670 831,655 M 838,687 C 816,684 813,673 813,666 C 827,667 835,678 838,687 M 839,676 C 856,666 864,666 870,669 C 863,681 851,681 839,676','mid'),
            svgpath('M 125,660 C 139,651 153,649 168,651','lo')]
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-labelledby="s105234-title s105234-desc">
<title id="s105234-title">A Small Worm and a Borrowed Star</title>
<desc id="s105234-desc">A continuous coiled worm lifts its head toward one firefly. Hand-authored silhouette and cross-contours, sparse mushrooms, no bitmap or tonal fill.</desc>
<style>path{{stroke-width:1.1;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}}.sil{{stroke:{SIL}}}.mid{{stroke:{MID}}}.lo{{stroke:{LO}}}.hi{{stroke:{HI}}}</style>
<rect width="1200" height="900" fill="{BG}"/>
{''.join(art)}
</svg>'''
    return svg

def worm():return make_worm()

def anim(target,kind,values):
    return {'target':target,'type':kind,'values':values,'keyTimes':[0,0.12,0.22,0.46,0.62,0.88,1]}

REVIEWS = {
 '105232': 'Inspected full-size rest and authored feather extreme. Adult body proportion and long planted legs remain coherent; the profile meets the eyepiece and raised fingers interrupt the tube as a grip. Softened the initially angular beard. Sparse pier and ship retain depth. Only the feather moves; there is no telescope lift or coat-body motion.',
 '105233': 'Inspected full-size rest and lantern rotation extreme. Ring remains in the claw, the lamp rotates from its suspension point, and the heavy body, tail and resting paw stay fixed. Removed small spine marks whose attachment was ambiguous. Wing membranes remain a simplified invented structure. No wingbeat or body lift is claimed.',
 '105234': 'Inspected full-size rest and authored firefly/feeler extreme. Widened the coil bend to remove offset-curve self-intersection, and moved the eye off the silhouette. Feelers rotate at their visible roots; the continuous body remains weighted. Segment rhythm is deliberately sparse and somewhat regular. No crawling or major neck bend is claimed.',
 '105235': 'Inspected full-size rest and sapling extreme. Bent the near fingers around the handle and raised its arc to make the grip continuous. Planted boot, grounded knee and pot retain their contact; sapling pivots at the soil line. Water and jug are held contours. This does not perform a full pouring action.',
}

def main():
    OUT.mkdir(parents=True,exist_ok=True);META.parent.mkdir(parents=True,exist_ok=True)
    authors=[
        ('105232',pirate,'An adult weathered seafarer standing on a pier, eye aligned with a long brass telescope, a star chart held at his side. Build native cubic silhouettes with adult proportions, five-finger grips and planted boots; retain only the hat, coat construction, face profile, telescope sections and sparse harbor depth cues. Use charcoal occlusion plates, a 1.1-pixel monochrome stroke hierarchy and one bright lens rim. No texture trace, image, gradient, glow, caption or colored fill.',
         'The hat feather answers a small sea breeze while the telescope, hands, coat and planted boots stay rigid.',
         [anim('feather','rotate',['0 308 80','0 308 80','-2 308 80','7 308 80','4 308 80','0 308 80','0 308 80'])]),
        ('105233',dragon,'A grounded heavy marsh dragon with a continuous curved neck, folded wing bones and a claw genuinely supporting a lantern ring. Author clean silhouettes and a few structural creases; keep the paw, tail and belly on the bank. Monochrome charcoal Hairline-inspired line hierarchy, with the flame as the only bright accent. Omit scales, foliage noise and tonal shading; native SVG geometry only.',
         'The lantern sways from a fixed ring while the dragon keeps its grasp, folded wings and planted ground contacts.',
         [anim('lantern','rotate',['0 718 442','0 718 442','-1.5 718 442','4.5 718 442','2 718 442','0 718 442','0 718 442'])]),
        ('105234',worm,'A continuous coiled soft-bodied worm raises its small animal-like head toward a firefly. Construct an authored swept contour with sparse curved segment seams, two fine feelers and a small near eye. Keep the coil weighted on the ground, the mushrooms quiet and the firefly the single bright stroke. Native SVG paths on charcoal, no bitmap, texture, gradient, glow or human face pasted onto the worm.',
         'The firefly makes a returning hover and the attached feelers turn toward it; the continuous body holds its weighted coil.',
         [anim('firefly','translate',['0 0','0 0','4 2','-18 -12','-10 -6','0 0','0 0']), anim('feeler-near','rotate',['0 801 282','0 801 282','-3 801 282','12 801 282','7 801 282','0 801 282','0 801 282']), anim('feeler-far','rotate',['0 813 292','0 813 292','-2 813 292','8 813 292','5 813 292','0 813 292','0 813 292'])]),
        ('105235',gardener,'An elderly kindly undead gardener kneels with one boot planted and one knee down, holding a ceramic jug by its handle to water a sapling. Author believable adult proportions, a clear five-digit grip, restrained facial creases and a few stitches without gore. Quiet native cubic contours on charcoal; water is the single bright accent. Use only background-colored occlusion plates, no texture trace, colored fill, gradients or embedded image.',
         'The sapling makes a gentle anchored lean; the adult pose, handle grip, jug, water source, knee, boot and pot stay fixed.',
         [anim('sapling','rotate',['0 687 652','0 687 652','-1 687 652','3 687 652','1.5 687 652','0 687 652','0 687 652'])]),
    ]
    meta=[]
    for ident,fn,prompt,caption,animations in authors:
        svg=fn();(OUT/f'{ident}.svg').write_text(svg)
        meta.append({'id':ident,'svg':f'corpus/svg/{ident}.svg','prompt':prompt,'method':'Hand-authored native SVG contour geometry informed by the prior generated pose; no raster embedded or automatic paint trace.','review':{'notes':REVIEWS[ident], 'stillAndAuthoredPeakInspected':True, 'encodedFilmInspected':False, 'limits':'Sparse illustrative anatomy and selected local object movement; not a photorealistic drawing or full articulated character performance.'},'motionCaption':caption,'animations':animations})
    META.write_text(json.dumps(meta,indent=2)+'\n')
    print('Wrote four native story SVGs and authoring metadata.')

if __name__=='__main__':main()
