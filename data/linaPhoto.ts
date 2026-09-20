import type { PhotoScene } from '@/types/configurator';

// Coordinates match the supplied 1448 × 1086 reference image exactly.
// Holes protect glass, seals, handles, rainwater pipes and stone window sills.
// Share the exterior contour with the facade cutout: no untinted rim or competing facade overlay.
const mainFrame = 'M535 604.5 L690 611.5 L690 785 L535 787 Z';
const smallFrame = 'M137 650 L171 643 L172 753 L137 755 Z';
// The left reveal is plaster: the frame starts at x192, behind the reveal.
const upperFrame = 'M192 369 L210 361 L210 495 L192 501.5 Z';
// Stop at the actual outer profile, before the right reveal and bottom sill.
const portalFrame = 'M1061 637 L1277.5 645.9 L1277.5 865.5 L1061 873.5 Z';
const doorFrame = 'M839 631 L924 636 L924 880 L839 885 Z';
// Exclude only the stone itself. Cast shadows belong to the plaster and must
// receive facade tint; generous rectangular cutouts leave pale halos in dark finishes.
const mainSill = 'M532 787.5 L703 784.8 L703 790.2 L532 793.5 Z';
const smallSill = 'M117.5 756 L172.5 755 L172.5 761 L117.5 760.5 Z';
const upperSill = 'M173.5 508 L212 495 L212 501.5 L173.5 514 Z';
// The left end is chamfered: the area above the projecting tip is still plaster.
const portalSill = 'M1061 873.5 L1277.5 865.5 L1291 867.5 L1291 871.5 L1060 880 L1058 879.5 L1058 878 L1061 877 Z';
// Trace the pipe itself, including its offset, rather than excluding a wide wall strip.
const drainpipe = 'M434 483 L446 484 L445 516 L443 523 L432 541 L430 548 L430 955 L418 955 L418 544 L420 536 L432 516 L434 510 Z';
const mainGlass = 'M540.5 620.5 L599.5 623 L599.5 770 L541 770 Z M619 624 L674 626 L674 769 L619 769.5 Z';
// The fixed pane reaches the left opening edge; there is no visible upright there.
// Follow the sloping glass edges below the top profiles, not a rectangular inset.
const portalGlass = 'M1061 646.5 L1153.5 650 L1153.5 857 L1061 861 Z M1170.5 650.5 L1263.5 654.5 L1263.5 852.5 L1170.5 858.5 Z';
const smallGlass = 'M146 654 L164 651 L165 745 L146 746 Z';
const upperGlass = 'M194 379 L204 374 L204 488 L194 492 Z';
const doorGlass = 'M858 673 L869 677 L869 844 L858 844 Z';
// Protect the pull and its mounts, not their rectangular bounding box or cast shadow.
const doorHardware = [
  'M905 725 L907 723.5 L908.5 725 L908.5 792 L905 792 Z',
  'M908.5 732.5 L911 732.5 L911 735 L908.5 735 Z',
  'M902 778 L905 779 L905 781 L902 780 Z',
  'M908.5 778 L910.5 778 L910.5 781 L908.5 781 Z',
  'M898 703 L899.5 699.5 L901 701 L901 704 L903 706 L900 708 L897 706 Z',
];

export const linaPhoto: PhotoScene = {
  source: '/houses/lina-photo.png', width:1448, height:1086,
  surfaces: [
    {
      id:'facade-side', material:'facade', referenceLight:.96,
      // Follow the underside of the verge, then overlap the front by one source
      // pixel at the corner so independent antialiasing cannot expose a pale seam.
      path:'M80 566 L195 170 L397 497 L397 509 L401 511 L401 915 L80 848 Z',
      cutouts:[
        smallFrame, upperFrame,
        smallSill, upperSill,
      ],
    },
    {
      id:'facade-front', material:'facade', referenceLight:.96,
      path:'M400 511 L1360 578 L1359 868 L400 915 Z',
      cutouts:[
        drainpipe, mainFrame,
        mainSill,
        doorFrame, portalFrame,
        portalSill,
      ],
    },
    {
      id:'roof', material:'roof', referenceLight:.48,
      // One continuous silhouette includes ridge caps and both gable verges.
      // The concave underside follows the plaster; gutter and downpipe stay outside.
      path:'M190 131 L197 130 L1064 296 L1074 306 L1381 548 L410 475 L410 510 L397 509 L397 497 L195 170 L78 586 L69 592 L69 583 L63 580 Z',
    },
    {
      id:'living-window-frame', material:'windows', referenceLight:.48,
      path:`${mainFrame} ${mainGlass}`,
      horizontalGrain:'M535 604.5 L690 611.5 L690 628 L535 622 Z M535 770 L690 769 L690 785 L535 787 Z',
    },
    {
      id:'small-window-frame', material:'windows', referenceLight:.48,
      path:`${smallFrame} ${smallGlass}`,
      horizontalGrain:'M137 650 L171 643 L164 651 L146 654 Z M137 746 L172 744 L172 753 L137 755 Z',
    },
    {
      id:'upper-window-frame', material:'windows', referenceLight:.48,
      path:`${upperFrame} ${upperGlass}`,
      horizontalGrain:'M192 369 L210 361 L204 374 L194 379 Z M192 493 L210 487 L210 495 L192 501.5 Z',
    },
    {
      id:'sliding-portal-frame', material:'portal', referenceLight:.48,
      path:portalFrame,
      cutouts:[portalGlass],
      horizontalGrain:'M1061 637 L1277.5 645.9 L1263 658 L1061 649 Z M1061 861 L1277.5 855 L1277.5 865.5 L1061 873.5 Z',
    },
    {
      id:'entrance-frame', material:'door', referenceLight:.4,
      path:doorFrame,
      cutouts:[doorGlass, ...doorHardware],
    },
  ],
};
