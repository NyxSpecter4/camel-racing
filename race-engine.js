// ================================================
// CAMEL RACING ENGINE - SAFE & MODULAR
// ================================================

const RaceEngine = {
  canvas: null,
  ctx: null,
  camels: [],
  raceInProgress: false,
  winner: null,
  animationFrame: null,

  // Initialize the race engine
  init(canvasId) {
    try {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        throw new Error('Canvas not found');
      }

      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Could not get canvas context');
      }

      // Initialize camels with stats
      this.camels = [
        {
          id: 0,
          name: 'Desert Storm',
          x: 50,
          y: 80,
          speed: 0,
          baseSpeed: 2.5,
          stamina: 100,
          color: '#8B4513',
          jockey: '👳',
          stats: { wins: 0, races: 0 }
        },
        {
          id: 1,
          name: 'Sand Runner',
          x: 50,
          y: 200,
          speed: 0,
          baseSpeed: 2.3,
          stamina: 100,
          color: '#D2691E',
          jockey: '🧔',
          stats: { wins: 0, races: 0 }
        },
        {
          id: 2,
          name: 'Golden Wind',
          x: 50,
          y: 320,
          speed: 0,
          baseSpeed: 2.7,
          stamina: 100,
          color: '#DAA520',
          jockey: '👨',
          stats: { wins: 0, races: 0 }
        },
        {
          id: 3,
          name: 'Oasis King',
          x: 50,
          y: 440,
          speed: 0,
          baseSpeed: 2.4,
          stamina: 100,
          color: '#CD853F',
          jockey: '🧑',
          stats: { wins: 0, races: 0 }
        }
      ];

      this.drawTrack();
      return true;
    } catch (error) {
      console.error('Race engine initialization error:', error);
      return false;
    }
  },

  // Draw the race track
  drawTrack() {
    try {
      if (!this.ctx || !this.canvas) return;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw sky/desert background
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(0.6, '#F4A460');
      gradient.addColorStop(1, '#D2691E');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw lanes
      for (let i = 0; i < 5; i++) {
        this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, i * 120);
        this.ctx.lineTo(this.canvas.width, i * 120);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // Draw finish line
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(this.canvas.width - 80, 0, 80, this.canvas.height);

      // Checkered pattern for finish line
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 2; j++) {
          if ((i + j) % 2 === 0) {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(
              this.canvas.width - 80 + (j * 40),
              i * 60,
              40,
              60
            );
          }
        }
      }

    } catch (error) {
      console.error('Track drawing error:', error);
    }
  },

  // Draw a single camel
  drawCamel(camel) {
    try {
      if (!this.ctx) return;

      const ctx = this.ctx;

      // Camel body
      ctx.fillStyle = camel.color;
      ctx.fillRect(camel.x, camel.y, 60, 40);

      // Camel neck and head
      ctx.fillRect(camel.x + 50, camel.y - 20, 20, 30);
      ctx.fillRect(camel.x + 60, camel.y - 25, 15, 15);

      // Camel humps
      ctx.beginPath();
      ctx.arc(camel.x + 20, camel.y + 5, 15, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(camel.x + 40, camel.y + 5, 12, Math.PI, 0);
      ctx.fill();

      // Camel legs
      ctx.fillRect(camel.x + 10, camel.y + 40, 6, 20);
      ctx.fillRect(camel.x + 25, camel.y + 40, 6, 20);
      ctx.fillRect(camel.x + 40, camel.y + 40, 6, 20);
      ctx.fillRect(camel.x + 55, camel.y + 40, 6, 20);

      // Jockey
      ctx.font = '30px Arial';
      ctx.fillText(camel.jockey, camel.x + 25, camel.y + 20);

      // Camel name
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Courier New';
      ctx.fillText(camel.name, camel.x, camel.y - 35);

      // Speed indicator
      if (this.raceInProgress) {
        const speedBar = (camel.speed / 5) * 50;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fillRect(camel.x, camel.y + 65, speedBar, 5);
      }

    } catch (error) {
      console.error('Camel drawing error:', error);
    }
  },

  // Start the race
  startRace() {
    try {
      if (this.raceInProgress) {
        console.warn('Race already in progress');
        return false;
      }

      // Reset camels
      this.camels.forEach(camel => {
        camel.x = 50;
        camel.speed = camel.baseSpeed;
        camel.stamina = 100;
      });

      this.raceInProgress = true;
      this.winner = null;

      // Start animation
      this.animate();
      return true;

    } catch (error) {
      console.error('Race start error:', error);
      this.raceInProgress = false;
      return false;
    }
  },

  // Animation loop
  animate() {
    try {
      if (!this.raceInProgress) return;

      // Redraw track
      this.drawTrack();

      let raceFinished = false;

      // Update and draw each camel
      this.camels.forEach(camel => {
        // Random speed variation
        const speedVariation = (Math.random() - 0.5) * 0.5;
        camel.speed = camel.baseSpeed + speedVariation;

        // Stamina effect
        camel.stamina -= 0.1;
        if (camel.stamina < 50) {
          camel.speed *= 0.95; // Slow down when tired
        }

        // Move camel
        camel.x += camel.speed;

        // Draw camel
        this.drawCamel(camel);

        // Check for finish
        if (camel.x >= this.canvas.width - 150 && !this.winner) {
          this.winner = camel;
          raceFinished = true;
        }
      });

      if (raceFinished) {
        this.finishRace();
      } else {
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
      }

    } catch (error) {
      console.error('Animation error:', error);
      this.stopRace();
    }
  },

  // Finish the race
  finishRace() {
    try {
      this.raceInProgress = false;

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      if (this.winner) {
        // Update stats
        this.winner.stats.wins++;
        this.camels.forEach(c => c.stats.races++);

        // Display winner
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(150, 200, 500, 150);

        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 36px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏆 WINNER! 🏆', this.canvas.width / 2, 250);

        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 28px Courier New';
        this.ctx.fillText(this.winner.name, this.canvas.width / 2, 300);

        this.ctx.font = '20px Courier New';
        this.ctx.fillText(`Jockey: ${this.winner.jockey}`, this.canvas.width / 2, 330);

        console.log('Race finished:', this.winner.name, 'wins!');

        return this.winner;
      }

    } catch (error) {
      console.error('Race finish error:', error);
      this.raceInProgress = false;
    }
  },

  // Stop the race (emergency)
  stopRace() {
    try {
      this.raceInProgress = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    } catch (error) {
      console.error('Race stop error:', error);
    }
  },

  // Get camel info
  getCamels() {
    return this.camels.map(c => ({
      id: c.id,
      name: c.name,
      stats: c.stats,
      baseSpeed: c.baseSpeed,
      jockey: c.jockey
    }));
  }
};

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RaceEngine;
}
