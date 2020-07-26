import Ship from "./ship.js";
import Laser from './laser.js';
import Asteroid from './asteroids.js';
import Paralax from './paralax.js';

export default function sketch(p) {
  let ship;
  let lasers = [];
  let asteroids = [];
  let paralax = [];
  let life = 3;
  let points = 0;
  let invenc = false;
  localStorage.setItem('points', JSON.stringify(0));
  localStorage.setItem('lifes', JSON.stringify(3));

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
    ship = new Ship(p);
    setInterval(() => {
      if (life > 0){
        if(asteroids.length < 30){
          asteroids.push(new Asteroid(p));
        }
      }
      else {
        window.location.href = "/";
      }}, 800)
      paralax[0] = new Paralax(p, 0.3);
      paralax[1] = new Paralax(p, 0.6);
      paralax[2] = new Paralax(p, 0.9);

  }

  p.draw = () => {
    p.background(0,0,0);

    for(let cenario of paralax){
        cenario.update(p);
        cenario.render(p);
      };

    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].render();
      asteroids[i].update();
      asteroids[i].offscreen();

      if (ship.hits(asteroids[i]) && invenc === false ) {
        life--;
        localStorage.setItem('lifes', JSON.stringify(life));
        invenc = true;
        setTimeout(()=>{invenc = false}, 1000)
      }
    }

    ship.render();



    for (let i = lasers.length - 1; i >= 0; i--) {
      lasers[i].render();
      lasers[i].update();
      if (lasers[i].offscreen()) {
        lasers.splice(i, 1)
      }
      else {
        for (let j = asteroids.length - 1; j >= 0; j--) {
          if (lasers[i].hits(asteroids[j])) {
            points += 100;
            localStorage.setItem('points', JSON.stringify(points));
            if (asteroids[j].r > 25) {
              let newAsteroids = asteroids[j].breakup();
              asteroids = asteroids.concat(newAsteroids);
            }
            asteroids.splice(j, 1);
            lasers.splice(i, 1);
            break;
          }
        }
      }
    }
    p.keyPressed = () => {
      if (p.key === 's' || p.key === 'S') {
        lasers.push(new Laser(p))
      }
    }
  }
}
