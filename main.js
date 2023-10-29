const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor(x, y, raduis, color) {
    (this.x = x), (this.y = y);
    (this.raduis = raduis), (this.color = color);
  }

  drew() {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectiles {
  constructor(x, y, raduis, color, volecity) {
    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.color = color;
    this.volecity = volecity;
  }

  drew() {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.drew();
    this.x = this.x + this.volecity.x;
    this.y = this.y + this.volecity.y;
  }
}

class Enemy {
  constructor(x, y, raduis, color, volecity) {
    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.color = color;
    this.volecity = volecity;
  }

  drew() {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.drew();
    this.x = this.x + this.volecity.x;
    this.y = this.y + this.volecity.y;
  }
}

class Explode {
  constructor(x, y, raduis, color, volecity) {
    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.color = color;
    this.volecity = volecity;
    this.alpha = 1;
  }

  drew() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.drew();
    this.x = this.x + this.volecity.x;
    this.y = this.y + this.volecity.y;
    this.alpha -= 0.01;
  }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 25, "white");
const projectiles = [];
const enemies = [];
const explode = [];

function respwanEnemies() {
  setInterval(() => {
    const raduis = Math.random() * (30 - 10) + 10;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - raduis : canvas.width + raduis;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - raduis : canvas.height + raduis;
    }

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    enemies.push(
      new Enemy(x, y, raduis, `hsl(${Math.random() * 360}, 50%, 50%)`, {
        x: Math.cos(angle),
        y: Math.sin(angle),
      })
    );
  }, 1000);
}
let animation;

function animate() {
  animation = requestAnimationFrame(animate);
  c.fillStyle = "rgb(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.drew();
  explode.forEach((ex, index) => {
    if (ex.alpha <= 0) {
      explode.splice(index, 1);
    } else {
      ex.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (
      projectile.x + projectile.raduis < 0 ||
      projectile.x - projectile.raduis - canvas.width > 0 ||
      projectile.y + projectile.raduis < 0 ||
      projectile.y - projectile.raduis - canvas.height > 0
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, eIndex) => {
    enemy.update();
    projectiles.forEach((projectile, pIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );

      if (distance - projectile.raduis - enemy.raduis < 1) {
        for (let i = 0; i < enemy.raduis * 2; i++) {
          explode.push(
            new Explode(projectile.x, projectile.y, 3, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 4),
              y: (Math.random() - 0.5) * (Math.random() * 4),
            })
          );
        }
        if (enemy.raduis - 10 > 10) {
          gsap.to(enemy, {
            raduis: enemy.raduis - 10,
          });
          setTimeout(() => {
            projectiles.splice(pIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            projectiles.splice(pIndex, 1);
            enemies.splice(eIndex, 1);
          }, 0);
        }
      }
    });

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - player.raduis - enemy.raduis < 1) {
      cancelAnimationFrame(animation);
      location.reload();
    }
  });
}

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  projectiles.push(
    new Projectiles(canvas.width / 2, canvas.height / 2, 5, "white", {
      x: Math.cos(angle) * 6,
      y: Math.sin(angle) * 6,
    })
  );
});

animate();
respwanEnemies();
