(function () {
  var canvas = document.getElementById('atom-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var nodes = [];
  var NUM = 14;
  var MAX_DIST = 200;
  var PRIMARY = { r: 251, g: 175, b: 52 };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function Node() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = 0.2 + Math.random() * 0.8;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = 2 + this.z * 3.5;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpeed = 0.008 + Math.random() * 0.012;
  }

  Node.prototype.update = function () {
    var speed = 0.25 + this.z * 0.6;
    this.x += this.vx * speed;
    this.y += this.vy * speed;
    this.phase += this.phaseSpeed;
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
    if (this.y < -20) this.y = canvas.height + 20;
    if (this.y > canvas.height + 20) this.y = -20;
  };

  function rgba(a) {
    return 'rgba(' + PRIMARY.r + ',' + PRIMARY.g + ',' + PRIMARY.b + ',' + a + ')';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          var lineAlpha = (1 - dist / MAX_DIST) * 0.25 * ((nodes[i].z + nodes[j].z) / 2);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = rgba(lineAlpha);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var pulse = n.r + Math.sin(n.phase) * 1.8;
      var alpha = 0.35 + n.z * 0.55;

      var glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulse * 4);
      glow.addColorStop(0, rgba(alpha * 0.5));
      glow.addColorStop(1, rgba(0));
      ctx.beginPath();
      ctx.arc(n.x, n.y, pulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.9) + ')';
      ctx.fill();
    }
  }

  function tick() {
    for (var i = 0; i < nodes.length; i++) nodes[i].update();
    draw();
    requestAnimationFrame(tick);
  }

  function init() {
    resize();
    nodes = [];
    for (var i = 0; i < NUM; i++) nodes.push(new Node());
    tick();
  }

  window.addEventListener('resize', function () {
    resize();
  });

  window.addEventListener('load', init);
})();
