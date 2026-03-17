(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ══════════════════════════════════════════
     COUNTDOWN
     ══════════════════════════════════════════ */
  var wedding  = new Date('2026-06-29');
  var daysLeft = Math.max(0, Math.ceil((wedding - new Date()) / 86400000));
  document.getElementById('countdown').textContent = daysLeft + ' дни до сватбата';


  /* ══════════════════════════════════════════
     TREE GENERATION
     ══════════════════════════════════════════ */
  (function () {
    var container = document.getElementById('treesContainer');

    // Leaf SVG path templates — various deciduous leaf shapes
    var leafPaths = [
      'M0,-1 C.3,-.9 .5,-.4 .5,0 C.5,.4 .3,.9 0,1 C-.3,.9 -.5,.4 -.5,0 C-.5,-.4 -.3,-.9 0,-1Z',
      'M0,-1 C.4,-.8 .6,-.3 .5,0 C.4,.4 .2,.8 0,1 C-.2,.8 -.4,.4 -.5,0 C-.6,-.3 -.4,-.8 0,-1Z',
      'M0,-1 C.35,-.7 .55,-.2 .45,.1 C.35,.4 .2,.8 0,1 C-.2,.8 -.35,.4 -.45,.1 C-.55,-.2 -.35,-.7 0,-1Z',
      'M0,-1 C.3,-.85 .55,-.5 .5,-.1 C.48,.2 .3,.65 0,1 C-.3,.65 -.48,.2 -.5,-.1 C-.55,-.5 -.3,-.85 0,-1Z',
      'M0,-1 C.45,-.75 .5,-.25 .4,.1 C.3,.5 .15,.85 0,1 C-.15,.85 -.3,.5 -.4,.1 C-.5,-.25 -.45,-.75 0,-1Z'
    ];

    // Green palettes — each tree cycles through these
    var greens = [
      ['#122418','#162c1e','#1a3525','#1e3e2c','#224832','#275038','#2c5a40','#327045'],
      ['#14281a','#183020','#1c3828','#204230','#264c38','#2b5640','#306248','#367050'],
      ['#101e14','#14261a','#1a3022','#1e3a2a','#224432','#284e3a','#2e5842','#34644a']
    ];

    var vw = Math.max(320, window.innerWidth || 1024);
    var isMobile = vw < 768;

    // Each tree: minW = minimum viewport width (px) to render.
    // Edge trees (x < 15 or x > 85) always show — they stick out past the sides.
    // Inner trees are progressively dropped on narrow screens.
    var trees = [
      // Left side — layered depth
      { x: -5,  h: 110, op: .7,  sw: 'Left',   trunk: { w: 16, h: 120 }, crown: { rx: 80, ry: 95, leaves: 320 }, minW: 0    },
      { x: 4,   h: 95,  op: .8,  sw: 'Center', trunk: { w: 13, h: 105 }, crown: { rx: 65, ry: 80, leaves: 260 }, minW: 820  },
      { x: 12,  h: 78,  op: .55, sw: 'Right',  trunk: { w: 11, h: 90 },  crown: { rx: 52, ry: 62, leaves: 200 }, minW: 1100 },
      { x: 20,  h: 62,  op: .4,  sw: 'Left',   trunk: { w: 8,  h: 75 },  crown: { rx: 38, ry: 46, leaves: 130 }, minW: 1280 },
      { x: -8,  h: 85,  op: .5,  sw: 'Right',  trunk: { w: 10, h: 90 },  crown: { rx: 48, ry: 58, leaves: 180 }, minW: 640  },

      // Right side — layered depth
      { x: 105, h: 115, op: .65, sw: 'Right',  trunk: { w: 16, h: 125 }, crown: { rx: 82, ry: 98, leaves: 340 }, minW: 0    },
      { x: 92,  h: 92,  op: .75, sw: 'Left',   trunk: { w: 13, h: 100 }, crown: { rx: 62, ry: 76, leaves: 250 }, minW: 820  },
      { x: 84,  h: 75,  op: .5,  sw: 'Center', trunk: { w: 10, h: 82 },  crown: { rx: 46, ry: 55, leaves: 170 }, minW: 1100 },
      { x: 76,  h: 60,  op: .35, sw: 'Right',  trunk: { w: 8,  h: 72 },  crown: { rx: 35, ry: 42, leaves: 120 }, minW: 1280 },
      { x: 108, h: 86,  op: .45, sw: 'Center', trunk: { w: 10, h: 86 },  crown: { rx: 50, ry: 60, leaves: 185 }, minW: 640  },

      // Extra depth trees
      { x: -12, h: 74,  op: .38, sw: 'Center', trunk: { w: 9,  h: 78 },  crown: { rx: 42, ry: 50, leaves: 150 }, minW: 640  },
      { x: 112, h: 76,  op: .38, sw: 'Left',   trunk: { w: 9,  h: 80 },  crown: { rx: 44, ry: 52, leaves: 155 }, minW: 640  },
      { x: 26,  h: 68,  op: .32, sw: 'Right',  trunk: { w: 8,  h: 72 },  crown: { rx: 36, ry: 44, leaves: 115 }, minW: 1280 },
      { x: 72,  h: 65,  op: .3,  sw: 'Left',   trunk: { w: 8,  h: 68 },  crown: { rx: 34, ry: 42, leaves: 110 }, minW: 1280 },

      // Background mid trees (behind content)
      { x: 30,  h: 55,  op: .25, sw: 'Left',   trunk: { w: 7,  h: 62 },  crown: { rx: 30, ry: 36, leaves: 90  }, minW: 1400 },
      { x: 42,  h: 50,  op: .22, sw: 'Right',  trunk: { w: 6,  h: 56 },  crown: { rx: 26, ry: 32, leaves: 75  }, minW: 1600 },
      { x: 55,  h: 52,  op: .23, sw: 'Center', trunk: { w: 6,  h: 58 },  crown: { rx: 28, ry: 34, leaves: 80  }, minW: 1600 },
      { x: 68,  h: 48,  op: .22, sw: 'Left',   trunk: { w: 6,  h: 54 },  crown: { rx: 24, ry: 30, leaves: 70  }, minW: 1400 },
      { x: 38,  h: 44,  op: .18, sw: 'Right',  trunk: { w: 5,  h: 48 },  crown: { rx: 22, ry: 26, leaves: 60  }, minW: 1800 },
      { x: 60,  h: 45,  op: .18, sw: 'Center', trunk: { w: 5,  h: 50 },  crown: { rx: 23, ry: 28, leaves: 65  }, minW: 1800 }
    ];

    // On mobile, push trees further to the edges and make them smaller
    if (isMobile) {
      trees.forEach(function (t) {
        if (t.x <= 50) {
          t.x = t.x - 12;           // push left trees further left
        } else {
          t.x = t.x + 12;           // push right trees further right
        }
        t.h = Math.round(t.h * 0.7); // shorter trees on mobile but still tall
        t.crown.rx = Math.round(t.crown.rx * 0.65);
        t.crown.ry = Math.round(t.crown.ry * 0.65);
        t.crown.leaves = Math.round(t.crown.leaves * 0.5);
        t.trunk.w = Math.round(t.trunk.w * 0.7);
        t.trunk.h = Math.round(t.trunk.h * 0.65);
      });
    }

    trees.forEach(function (t, ti) {
      if (vw < t.minW) return;

      var palette = greens[ti % greens.length];
      var svgW    = t.crown.rx * 2 + 40;
      var svgH    = t.crown.ry * 2 + t.trunk.h + 40;
      var cx      = svgW / 2;
      var crownCY = t.crown.ry + 15;
      var trunkTop = crownCY + t.crown.ry * 0.7;

      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'tree tree-' + t.sw.toLowerCase());
      svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);

      var posStyle = 'height:' + t.h + '%;opacity:' + t.op + ';';
      if (t.x <= 50) posStyle += 'left:' + t.x + '%;';
      else           posStyle += 'right:' + (100 - t.x) + '%;';
      svg.setAttribute('style', posStyle);

      // Trunk — short, with subtle taper via polygon
      var trunk = document.createElementNS(NS, 'polygon');
      var tw    = t.trunk.w;
      var tBot  = trunkTop + t.trunk.h;
      trunk.setAttribute('points',
        (cx - tw * 0.35) + ',' + trunkTop + ' ' +
        (cx + tw * 0.35) + ',' + trunkTop + ' ' +
        (cx + tw * 0.5)  + ',' + tBot     + ' ' +
        (cx - tw * 0.5)  + ',' + tBot
      );
      trunk.setAttribute('fill', '#1a2f20');
      trunk.setAttribute('class', 'tree-trunk');
      svg.appendChild(trunk);

      // Small branches
      var branchGroup = document.createElementNS(NS, 'g');
      for (var b = 0; b < 3; b++) {
        var branch = document.createElementNS(NS, 'line');
        var by  = trunkTop + t.trunk.h * 0.15 + b * t.trunk.h * 0.18;
        var dir = b % 2 === 0 ? 1 : -1;

        branch.setAttribute('x1', cx);
        branch.setAttribute('y1', by);
        branch.setAttribute('x2', cx + dir * (tw * 0.8 + Math.random() * tw * 0.6));
        branch.setAttribute('y2', by - 4 - Math.random() * 8);
        branch.setAttribute('stroke', '#1a2f20');
        branch.setAttribute('stroke-width', Math.max(1, tw * 0.12 - b * 0.3));
        branch.setAttribute('stroke-linecap', 'round');
        branchGroup.appendChild(branch);
      }
      svg.appendChild(branchGroup);

      // Crown — many individual leaves distributed in an ellipse
      var crownG    = document.createElementNS(NS, 'g');
      crownG.setAttribute('class', 'tree-crown');
      var numLeaves = t.crown.leaves;
      var rx        = t.crown.rx;
      var ry        = t.crown.ry;

      for (var i = 0; i < numLeaves; i++) {
        var angle = Math.random() * Math.PI * 2;
        var dist  = Math.pow(Math.random(), 0.7) * 0.98 + 0.02;
        var lx    = cx + Math.cos(angle) * rx * dist;
        var ly    = crownCY + Math.sin(angle) * ry * dist;

        // Leaves slightly lower in bottom half (gravity)
        if (ly > crownCY) ly += Math.random() * 4;

        var leafSize = 5 + Math.random() * 7;

        // Deeper leaves are darker
        var depthIdx = Math.floor((1 - dist) * palette.length * 0.7 + Math.random() * 2);
        if (depthIdx >= palette.length) depthIdx = palette.length - 1;
        if (depthIdx < 0) depthIdx = 0;
        var col = palette[depthIdx];

        var leaf    = document.createElementNS(NS, 'path');
        var pathIdx = Math.floor(Math.random() * leafPaths.length);
        var rot     = Math.random() * 360;

        leaf.setAttribute('d', leafPaths[pathIdx]);
        leaf.setAttribute('transform',
          'translate(' + lx.toFixed(1) + ',' + ly.toFixed(1) + ') ' +
          'rotate(' + rot.toFixed(0) + ') ' +
          'scale(' + leafSize.toFixed(1) + ')'
        );
        leaf.setAttribute('fill', col);
        leaf.setAttribute('opacity', (0.6 + Math.random() * 0.4).toFixed(2));
        crownG.appendChild(leaf);
      }

      svg.appendChild(crownG);
      container.appendChild(svg);
    });
  })();


  /* ══════════════════════════════════════════
     FALLING LEAVES
     ══════════════════════════════════════════ */
  (function () {
    var container   = document.getElementById('leaves');
    var leafColors  = ['#2A5A3F', '#3D7A5A', '#5A9E78', '#1B3A2D', '#A8D5BA'];

    for (var i = 0; i < 45; i++) {
      var el  = document.createElement('div');
      el.className = 'leaf';
      var s   = Math.random() * 10 + 8;
      var col = leafColors[Math.floor(Math.random() * leafColors.length)];

      el.innerHTML =
        '<svg width="' + s + '" height="' + s + '" viewBox="0 0 16 16">' +
          '<path d="M8,1 Q14,5 12,12 Q8,10 4,12 Q2,5 8,1Z" ' +
                'fill="' + col + '" opacity="' + (Math.random() * .4 + .3) + '"/>' +
        '</svg>';

      el.style.cssText =
        'left:' + Math.random() * 100 + '%;' +
        'animation-duration:' + (Math.random() * 10 + 10) + 's;' +
        'animation-delay:' + (Math.random() * 15) + 's;';

      container.appendChild(el);
    }
  })();


  /* ══════════════════════════════════════════
     LAVENDER PETALS
     ══════════════════════════════════════════ */
  (function () {
    var container   = document.getElementById('lavenderPetals');
    var petalColors = ['#B8ACE0', '#D4CCF0', '#9B8EC4', '#EDE8FA'];

    for (var i = 0; i < 45; i++) {
      var el  = document.createElement('div');
      el.className = 'lavender-petal';
      var s   = Math.random() * 8 + 6;
      var col = petalColors[Math.floor(Math.random() * petalColors.length)];

      el.innerHTML =
        '<svg width="' + s + '" height="' + (s * 1.5) + '" viewBox="0 0 10 15">' +
          '<ellipse cx="5" cy="7.5" rx="4" ry="7" ' +
                   'fill="' + col + '" opacity="' + (Math.random() * .5 + .3) + '"/>' +
        '</svg>';

      el.style.cssText =
        'left:' + Math.random() * 100 + '%;' +
        'animation-duration:' + (Math.random() * 14 + 12) + 's;' +
        'animation-delay:' + (Math.random() * 18) + 's;';

      container.appendChild(el);
    }
  })();


  /* ══════════════════════════════════════════
     FIREFLIES & TWINKLES
     ══════════════════════════════════════════ */
  (function () {
    var container = document.getElementById('fireflies');

    // Fireflies
    for (var i = 0; i < 85; i++) {
      var el = document.createElement('div');
      el.className = 'firefly';
      var s  = Math.random() * 5 + 2;

      el.style.cssText =
        'width:' + s + 'px;height:' + s + 'px;' +
        'left:' + Math.random() * 100 + '%;' +
        'top:' + (10 + Math.random() * 80) + '%;' +
        'animation-duration:' + (Math.random() * 6 + 3) + 's;' +
        'animation-delay:' + (Math.random() * 14) + 's;';

      container.appendChild(el);
    }

    // Twinkle stars
    for (var j = 0; j < 220; j++) {
      var tw = document.createElement('div');
      tw.className = 'twinkle';
      var ts = Math.random() * 3 + 1;

      tw.style.cssText =
        'width:' + ts + 'px;height:' + ts + 'px;' +
        'left:' + Math.random() * 100 + '%;' +
        'top:' + (10 + Math.random() * 80) + '%;' +
        'animation-duration:' + (Math.random() * 4 + 2) + 's;' +
        'animation-delay:' + (Math.random() * 10) + 's;';

      container.appendChild(tw);
    }
  })();


  /* ══════════════════════════════════════════
     FLOATING PARTICLES
     ══════════════════════════════════════════ */
  (function () {
    var container = document.getElementById('particles');
    var colors = [
      'rgba(155,142,196,.3)',
      'rgba(212,204,240,.2)',
      'rgba(168,213,186,.2)',
      'rgba(255,255,255,.1)'
    ];

    for (var i = 0; i < 25; i++) {
      var el = document.createElement('div');
      el.className = 'particle';
      var s  = Math.random() * 5 + 2;

      el.style.cssText =
        'width:' + s + 'px;height:' + s + 'px;' +
        'left:' + Math.random() * 100 + '%;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'animation-duration:' + (Math.random() * 12 + 8) + 's;' +
        'animation-delay:' + (Math.random() * 10) + 's;';

      container.appendChild(el);
    }
  })();


  /* ══════════════════════════════════════════
     SCROLL REVEAL (Intersection Observer)
     ══════════════════════════════════════════ */
  (function () {
    var els = document.querySelectorAll('.reveal');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { obs.observe(el); });
  })();


  /* ══════════════════════════════════════════
     TENT / TABLE GENERATION
     ══════════════════════════════════════════ */
  (function () {
    var container = document.getElementById('tentsContainer');
    var vw = Math.max(320, window.innerWidth || 1024);

    // minW = minimum viewport to render. Outer tents always show; inner pair needs 820+.
    var isMobileTent = vw < 768;
    var tents = [
      { x: isMobileTent ? 5 : 2,   w: isMobileTent ? 50 : 42, h: isMobileTent ? 100 : 90, op: isMobileTent ? .85 : .8, minW: 0   },
      { x: 20, w: 38, h: 80, op: .65, minW: 820 },
      { x: 50, w: 38, h: 80, op: .65, minW: 820 },
      { x: isMobileTent ? 50 : 60, w: isMobileTent ? 50 : 42, h: isMobileTent ? 100 : 90, op: isMobileTent ? .85 : .8, minW: 0   }
    ];

    tents.forEach(function (t) {
      if (vw < t.minW) return;

      var svgW = 120;
      var svgH = 100;
      var svg  = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'tent-group');
      svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
      svg.setAttribute('style',
        'left:' + t.x + '%;width:' + t.w + '%;height:' + t.h + '%;opacity:' + t.op + ';'
      );

      // ── Tent poles ──
      var poleL = document.createElementNS(NS, 'line');
      poleL.setAttribute('x1', '15');  poleL.setAttribute('y1', '20');
      poleL.setAttribute('x2', '20');  poleL.setAttribute('y2', '95');
      poleL.setAttribute('stroke', '#2a1a0e');
      poleL.setAttribute('stroke-width', '2');
      svg.appendChild(poleL);

      var poleR = document.createElementNS(NS, 'line');
      poleR.setAttribute('x1', '105'); poleR.setAttribute('y1', '20');
      poleR.setAttribute('x2', '100'); poleR.setAttribute('y2', '95');
      poleR.setAttribute('stroke', '#2a1a0e');
      poleR.setAttribute('stroke-width', '2');
      svg.appendChild(poleR);

      // ── Canopy ──
      var canopy = document.createElementNS(NS, 'path');
      canopy.setAttribute('d', 'M12,22 Q35,8 60,5 Q85,8 108,22 Q90,18 60,15 Q30,18 12,22Z');
      canopy.setAttribute('fill', 'rgba(245,240,230,.08)');
      canopy.setAttribute('stroke', 'rgba(245,240,230,.12)');
      canopy.setAttribute('stroke-width', '0.5');
      svg.appendChild(canopy);

      // Canopy drape sides
      var drapL = document.createElementNS(NS, 'path');
      drapL.setAttribute('d', 'M12,22 Q14,40 18,55');
      drapL.setAttribute('fill', 'none');
      drapL.setAttribute('stroke', 'rgba(245,240,230,.08)');
      drapL.setAttribute('stroke-width', '0.8');
      svg.appendChild(drapL);

      var drapR = document.createElementNS(NS, 'path');
      drapR.setAttribute('d', 'M108,22 Q106,40 102,55');
      drapR.setAttribute('fill', 'none');
      drapR.setAttribute('stroke', 'rgba(245,240,230,.08)');
      drapR.setAttribute('stroke-width', '0.8');
      svg.appendChild(drapR);

      // ── String lights ──
      var string1 = document.createElementNS(NS, 'path');
      string1.setAttribute('d', 'M18,24 Q40,30 60,28 Q80,30 102,24');
      string1.setAttribute('fill', 'none');
      string1.setAttribute('stroke', 'rgba(180,160,100,.15)');
      string1.setAttribute('stroke-width', '0.4');
      svg.appendChild(string1);

      var string2 = document.createElementNS(NS, 'path');
      string2.setAttribute('d', 'M22,28 Q42,35 60,33 Q78,35 98,28');
      string2.setAttribute('fill', 'none');
      string2.setAttribute('stroke', 'rgba(180,160,100,.12)');
      string2.setAttribute('stroke-width', '0.4');
      svg.appendChild(string2);

      // ── Bulbs along strings ──
      var bulbPositions = [
        { x: 25, y: 26 }, { x: 35, y: 28 }, { x: 45, y: 29 }, { x: 55, y: 28 },
        { x: 65, y: 29 }, { x: 75, y: 28 }, { x: 85, y: 26 }, { x: 95, y: 24 },
        { x: 30, y: 31 }, { x: 40, y: 33 }, { x: 50, y: 34 }, { x: 60, y: 33 },
        { x: 70, y: 34 }, { x: 80, y: 32 }, { x: 90, y: 29 }
      ];

      bulbPositions.forEach(function (b) {
        // Glow behind bulb
        var glow = document.createElementNS(NS, 'circle');
        glow.setAttribute('cx', b.x);
        glow.setAttribute('cy', b.y);
        glow.setAttribute('r', 3 + Math.random() * 2);
        glow.setAttribute('fill', 'rgba(255,200,80,.08)');
        svg.appendChild(glow);

        // Bulb
        var bulb = document.createElementNS(NS, 'circle');
        bulb.setAttribute('cx', b.x);
        bulb.setAttribute('cy', b.y);
        bulb.setAttribute('r', 1 + Math.random() * 0.5);
        bulb.setAttribute('fill', 'rgba(255,220,130,.7)');
        svg.appendChild(bulb);
      });

      // ── Table ──
      var tableTop = document.createElementNS(NS, 'ellipse');
      tableTop.setAttribute('cx', '60');  tableTop.setAttribute('cy', '82');
      tableTop.setAttribute('rx', '18');  tableTop.setAttribute('ry', '4');
      tableTop.setAttribute('fill', '#2a1a0e');
      tableTop.setAttribute('opacity', '0.6');
      svg.appendChild(tableTop);

      var leg = document.createElementNS(NS, 'line');
      leg.setAttribute('x1', '60'); leg.setAttribute('y1', '85');
      leg.setAttribute('x2', '60'); leg.setAttribute('y2', '95');
      leg.setAttribute('stroke', '#2a1a0e');
      leg.setAttribute('stroke-width', '2.5');
      leg.setAttribute('opacity', '0.5');
      svg.appendChild(leg);

      var base = document.createElementNS(NS, 'ellipse');
      base.setAttribute('cx', '60');  base.setAttribute('cy', '95');
      base.setAttribute('rx', '10');  base.setAttribute('ry', '2');
      base.setAttribute('fill', '#2a1a0e');
      base.setAttribute('opacity', '0.4');
      svg.appendChild(base);

      // ── Chairs ──
      var chairs = [
        { x: 38, y: 86 }, { x: 82, y: 86 },
        { x: 48, y: 90 }, { x: 72, y: 90 }
      ];

      chairs.forEach(function (ch) {
        var chair = document.createElementNS(NS, 'path');
        var dir   = ch.x < 60 ? 1 : -1;
        chair.setAttribute('d',
          'M' + ch.x + ',' + ch.y +
          ' q' + dir * 3 + ',-5 ' + dir * 1 + ',-8' +
          ' q' + dir * 2 + ',0 ' + dir * 3 + ',2' +
          ' q0,4 -' + dir * 4 + ',6Z'
        );
        chair.setAttribute('fill', '#1e1208');
        chair.setAttribute('opacity', '0.4');
        svg.appendChild(chair);
      });

      // ── Table decorations ──

      // Small flower bouquet (center of table)
      var flowerColors = ['#B8ACE0', '#D4CCF0', '#9B8EC4', '#c9a0dc'];
      var stemG = document.createElementNS(NS, 'g');

      // Vase
      var vase = document.createElementNS(NS, 'path');
      vase.setAttribute('d', 'M58.5,81 Q58,79 58.5,78 L61.5,78 Q62,79 61.5,81Z');
      vase.setAttribute('fill', 'rgba(180,160,130,.6)');
      stemG.appendChild(vase);

      // Flower stems & buds
      var fstems = [
        { x: 59.5, y: 78, bx: 58, by: 75 },
        { x: 60,   y: 78, bx: 60, by: 74 },
        { x: 60.5, y: 78, bx: 62, by: 75 }
      ];

      fstems.forEach(function (fs, fi) {
        var st = document.createElementNS(NS, 'path');
        st.setAttribute('d',
          'M' + fs.x + ',' + fs.y + ' Q' + fs.bx + ',' + (fs.by + 1) + ' ' + fs.bx + ',' + fs.by
        );
        st.setAttribute('fill', 'none');
        st.setAttribute('stroke', '#2a5030');
        st.setAttribute('stroke-width', '0.4');
        st.setAttribute('opacity', '0.7');
        stemG.appendChild(st);

        var fc = document.createElementNS(NS, 'circle');
        fc.setAttribute('cx', fs.bx);
        fc.setAttribute('cy', fs.by);
        fc.setAttribute('r', 1.2);
        fc.setAttribute('fill', flowerColors[fi % flowerColors.length]);
        fc.setAttribute('opacity', '0.8');
        stemG.appendChild(fc);
      });
      svg.appendChild(stemG);

      // Candle
      var candleStick = document.createElementNS(NS, 'rect');
      candleStick.setAttribute('x', '63');
      candleStick.setAttribute('y', '79.5');
      candleStick.setAttribute('width', '1.2');
      candleStick.setAttribute('height', '3');
      candleStick.setAttribute('rx', '0.3');
      candleStick.setAttribute('fill', '#f5eedc');
      candleStick.setAttribute('opacity', '0.8');
      svg.appendChild(candleStick);

      var flame = document.createElementNS(NS, 'path');
      flame.setAttribute('d', 'M63.6,79.5 Q63,78.5 63.6,77.5 Q64.2,78.5 63.6,79.5Z');
      flame.setAttribute('fill', 'rgba(255,200,80,.85)');
      svg.appendChild(flame);

      var flameGlow = document.createElementNS(NS, 'circle');
      flameGlow.setAttribute('cx', '63.6');
      flameGlow.setAttribute('cy', '78.5');
      flameGlow.setAttribute('r', '2.5');
      flameGlow.setAttribute('fill', 'rgba(255,200,80,.05)');
      svg.appendChild(flameGlow);

      // Wine glasses
      var glassPositions = [{ x: 50 }, { x: 70 }];

      glassPositions.forEach(function (gl) {
        var glass = document.createElementNS(NS, 'g');

        var bowl = document.createElementNS(NS, 'path');
        bowl.setAttribute('d',
          'M' + (gl.x - 2) + ',79 Q' + (gl.x - 2.5) + ',76.5 ' +
          gl.x + ',75.5 Q' + (gl.x + 2.5) + ',76.5 ' + (gl.x + 2) + ',79Z'
        );
        bowl.setAttribute('fill', 'rgba(255,255,255,.12)');
        bowl.setAttribute('stroke', 'rgba(255,255,255,.18)');
        bowl.setAttribute('stroke-width', '0.3');
        glass.appendChild(bowl);

        var wine = document.createElementNS(NS, 'path');
        wine.setAttribute('d',
          'M' + (gl.x - 1.5) + ',78.5 Q' + (gl.x - 2) + ',77 ' +
          gl.x + ',76.5 Q' + (gl.x + 2) + ',77 ' + (gl.x + 1.5) + ',78.5Z'
        );
        wine.setAttribute('fill', 'rgba(120,30,50,.35)');
        glass.appendChild(wine);

        var gstem = document.createElementNS(NS, 'line');
        gstem.setAttribute('x1', gl.x); gstem.setAttribute('y1', '79');
        gstem.setAttribute('x2', gl.x); gstem.setAttribute('y2', '81.5');
        gstem.setAttribute('stroke', 'rgba(255,255,255,.18)');
        gstem.setAttribute('stroke-width', '0.4');
        glass.appendChild(gstem);

        var gbase = document.createElementNS(NS, 'ellipse');
        gbase.setAttribute('cx', gl.x);   gbase.setAttribute('cy', '81.5');
        gbase.setAttribute('rx', '1.5');   gbase.setAttribute('ry', '0.4');
        gbase.setAttribute('fill', 'rgba(255,255,255,.12)');
        glass.appendChild(gbase);

        svg.appendChild(glass);
      });

      // Warm light pool under tent
      var warmth = document.createElementNS(NS, 'ellipse');
      warmth.setAttribute('cx', '60');  warmth.setAttribute('cy', '80');
      warmth.setAttribute('rx', '30');  warmth.setAttribute('ry', '18');
      warmth.setAttribute('fill', 'rgba(255,200,100,.03)');
      svg.appendChild(warmth);

      container.appendChild(svg);
    });
  })();


  /* ══════════════════════════════════════════
     HANGING VINES
     ══════════════════════════════════════════ */
  (function () {
    var container = document.getElementById('vinesContainer');

    var vinePositions = [
      { x: 2,  len: 220, op: .45 }, { x: 7,  len: 160, op: .35 },
      { x: 13, len: 280, op: .5  }, { x: 18, len: 130, op: .3  },
      { x: 22, len: 180, op: .25 }, { x: 78, len: 190, op: .25 },
      { x: 82, len: 140, op: .3  }, { x: 87, len: 260, op: .5  },
      { x: 93, len: 170, op: .35 }, { x: 98, len: 230, op: .45 },
      { x: 28, len: 80,  op: .15 }, { x: 72, len: 80,  op: .15 },
      { x: 35, len: 60,  op: .12 }, { x: 65, len: 60,  op: .12 },
      { x: 5,  len: 190, op: .4  }, { x: 95, len: 200, op: .4  },
      { x: 10, len: 140, op: .3  }, { x: 90, len: 150, op: .3  },
      { x: 25, len: 100, op: .18 }, { x: 75, len: 110, op: .18 },
      { x: 40, len: 70,  op: .1  }, { x: 60, len: 65,  op: .1  },
      { x: 15, len: 250, op: .45 }, { x: 85, len: 240, op: .45 }
    ];

    var vineGreens = ['#1a3525', '#1e3e2c', '#224832', '#183020', '#1c3828'];

    vinePositions.forEach(function (v, vi) {
      var el   = document.createElement('div');
      el.className = 'vine';

      var svgW = 30;
      var svgH = v.len;
      var svg  = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
      svg.setAttribute('width', svgW);
      svg.setAttribute('height', svgH);

      // Main vine stem — wavy line
      var cx       = svgW / 2;
      var d        = 'M' + cx + ',0';
      var segments = Math.floor(svgH / 25);

      for (var s = 1; s <= segments; s++) {
        var sy = s * 25;
        var sx = cx + Math.sin(s * 0.8 + vi) * 5;
        d += ' Q' + (sx + (s % 2 === 0 ? 4 : -4)) + ',' + (sy - 12) + ' ' + sx + ',' + sy;
      }

      var stem = document.createElementNS(NS, 'path');
      stem.setAttribute('d', d);
      stem.setAttribute('fill', 'none');
      stem.setAttribute('stroke', '#1a3020');
      stem.setAttribute('stroke-width', '1.5');
      stem.setAttribute('opacity', '0.6');
      svg.appendChild(stem);

      // Small leaves along the vine
      var leafCount = Math.floor(svgH / 20);

      for (var i = 0; i < leafCount; i++) {
        var ly    = 15 + i * (svgH - 20) / leafCount + Math.random() * 8;
        var lx    = cx + Math.sin(i * 0.8 + vi) * 5;
        var side  = i % 2 === 0 ? 1 : -1;
        var col   = vineGreens[Math.floor(Math.random() * vineGreens.length)];
        var lSize = 3 + Math.random() * 3;

        var leafEl = document.createElementNS(NS, 'path');
        leafEl.setAttribute('d',
          'M0,0 C' + side * lSize + ',-' + lSize + ' ' +
          side * (lSize + 2) + ',-1 ' + side * 2 + ',' + lSize * 0.5
        );
        leafEl.setAttribute('transform', 'translate(' + lx.toFixed(1) + ',' + ly.toFixed(1) + ')');
        leafEl.setAttribute('fill', col);
        leafEl.setAttribute('opacity', (0.4 + Math.random() * 0.4).toFixed(2));
        svg.appendChild(leafEl);
      }

      el.appendChild(svg);
      el.style.cssText =
        'left:' + v.x + '%;' +
        'opacity:' + v.op + ';' +
        'animation-duration:' + (5 + Math.random() * 6) + 's;' +
        'animation-delay:' + (Math.random() * 4) + 's;';

      container.appendChild(el);
    });
  })();


  /* ══════════════════════════════════════════
     FORM LOGIC
     ══════════════════════════════════════════ */
  var attending = '';
  var checks    = { hotel: false, transport: false, children: false };

  /* ══════════════════════════════════════════
     MORE DETAILS MODAL
     ══════════════════════════════════════════ */
  function openDetailsModal() {
    var o = document.getElementById('detailsModal');
    o.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { o.querySelector('.modal-close').focus(); }, 350);
  }

  function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('detailsModal').addEventListener('click', function (e) {
    if (e.target === this) closeDetailsModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDetailsModal();
  });

  // Expose functions globally for onclick handlers
  window.openDetailsModal  = openDetailsModal;
  window.closeDetailsModal = closeDetailsModal;
  window.openForm          = openForm;
  window.selectAttending = selectAttending;
  window.toggleCheck     = toggleCheck;
  window.handleSubmit    = handleSubmit;

  function openForm() {
    document.getElementById('rsvpPrompt').style.display = 'none';
    var fc = document.getElementById('rsvpFormContainer');
    fc.classList.add('active');
    setTimeout(function () {
      fc.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function selectAttending(el, value) {
    attending = value;

    var options = document.querySelectorAll('.radio-option');
    for (var i = 0; i < options.length; i++) {
      options[i].classList.remove('selected');
    }
    el.classList.add('selected');

    var fields = document.getElementById('attendingFields');
    if (value === 'С радост приемам') {
      fields.classList.add('active');
    } else {
      fields.classList.remove('active');
    }
    updateBtn();
  }

  function toggleCheck(type) {
    checks[type] = !checks[type];
    var box = document.getElementById(type + 'Box');

    if (checks[type]) box.classList.add('checked');
    else              box.classList.remove('checked');

    if (type === 'hotel') {
      var h = document.getElementById('hotelSub');
      if (checks.hotel) h.classList.add('active');
      else              h.classList.remove('active');
    }

    if (type === 'children') {
      var c = document.getElementById('childrenSub');
      if (checks.children) c.classList.add('active');
      else                 c.classList.remove('active');
    }
  }

  // Captcha — simple math question
  var captchaA = Math.floor(Math.random() * 9) + 1;
  var captchaB = Math.floor(Math.random() * 9) + 1;
  var captchaSum = captchaA + captchaB;
  document.getElementById('captchaLabel').textContent = 'Колко е ' + captchaA + ' + ' + captchaB + '? *';

  function updateBtn() {
    var name = document.getElementById('guestName').value.trim();
    var captchaOk = document.getElementById('captchaAnswer').value.trim() === String(captchaSum);
    document.getElementById('submitBtn').disabled = !(name && attending && captchaOk);
  }

  document.getElementById('guestName').addEventListener('input', updateBtn);
  document.getElementById('captchaAnswer').addEventListener('input', updateBtn);

  function handleSubmit(e) {
    if (e) e.preventDefault();

    var name = document.getElementById('guestName').value.trim();
    if (!name || !attending) return false;

    // Verify captcha
    if (document.getElementById('captchaAnswer').value.trim() !== String(captchaSum)) {
      alert('Грешен отговор на задачата. Моля, опитайте отново.');
      return false;
    }

    var email       = document.getElementById('guestEmail').value || 'Не е посочен';
    var isAttending = attending === 'С радост приемам';

    // Build form data for AJAX submission
    var emoji = isAttending ? '✅' : '❌';
    var ge = document.getElementById('guestEmail').value.trim();

    var data = {
      '_subject':  emoji + ' Сватба RSVP — ' + name + ' — ' + attending,
      '_captcha':  'false',
      '_template': 'table',
      '_replyto':  (ge && ge !== 'zhivko.katerina.wedding@gmail.com') ? ge : 'noreply@wedding.com',
      '👤 Име':                   name,
      '📧 Имейл':                email,
      '✉️ Отговор':               isAttending ? '✅ С радост приемам' : '❌ За съжаление не мога'
    };

    if (isAttending) {
      data['👥 Брой гости']            = document.getElementById('guestCount').value + ' гост(и)';
      data['🍽️ Хранителни изисквания'] = document.getElementById('dietary').value || 'Няма';
      data['🏨 Хотелска стая']         = checks.hotel     ? 'Да — 1 нощ (29 юни)' : 'Не';
      data['🚗 Транспорт']             = checks.transport ? 'Да' : 'Не';
      data['👶 Деца']                  = checks.children
        ? 'Да — ' + document.getElementById('childrenCountSelect').value + ' дете(а)'
        : 'Не';
    }

    var msg = document.getElementById('guestMessage').value;
    if (msg) {
      data['💌 Послание'] = msg;
    }

    // Disable button to prevent double submit
    document.getElementById('submitBtn').disabled = true;

    // Send via AJAX — works reliably in Viber/Messenger in-app browsers
    fetch('https://formsubmit.co/ajax/zhivko.katerina.wedding@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function (res) { return res.json(); })
    .then(function (result) {
      // Show success message
      document.getElementById('rsvpFormContainer').style.display = 'none';

      var s = document.getElementById('successMsg');
      s.classList.add('active');
      document.getElementById('thankName').textContent = 'Благодарим Ви, ' + name + '!';
      document.getElementById('thankMsg').textContent  = isAttending
        ? 'Нямаме търпение да празнуваме заедно с Вас!'
        : 'Ще ни липсвате. Благодарим, че ни уведомихте.';

      s.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(function (err) {
      document.getElementById('submitBtn').disabled = false;
      alert('Възникна грешка при изпращането. Моля, опитайте отново.');
    });

    return false;
  }

})();
