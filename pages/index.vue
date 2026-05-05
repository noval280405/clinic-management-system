<template>
  <div class="hero">
    <!-- BACKGROUND -->
    <div class="gradient"></div>
    <div class="grid"></div>

    <!-- GLOW -->
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>

    <!-- CONTENT -->
    <div class="content">
      <h1 class="title">Klinik<span>Management</span></h1>

      <p class="subtitle">Sistem manajemen klinik modern, cepat, dan efisien</p>

      <v-btn size="large" class="btn-login" :to="'/login'">
        Masuk ke Sistem
      </v-btn>
    </div>
  </div>
</template>


<style scoped>
.hero {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #0b1e3c;
}

/* =========================
   GRADIENT BACKGROUND
========================= */
.gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 20%, #1976d2 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, #0d47a1 0%, transparent 40%);
  z-index: 0;
}

/* =========================
   GRID (EFEK PREMIUM)
========================= */
.grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
}

/* =========================
   GLOW ANIMATION
========================= */
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  animation: float 10s ease-in-out infinite;
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: #42a5f5;
  top: -120px;
  left: -120px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: #64b5f6;
  bottom: -150px;
  right: -150px;
  animation-delay: 3s;
}

@keyframes float {
  0% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(40px) scale(1.05);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
}

/* =========================
   CONTENT
========================= */
.content {
  text-align: center;
  color: white;
  z-index: 2;
  animation: fadeUp 1s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: 1px;
}

.title span {
  color: #90caf9;
}

.subtitle {
  font-size: 15px;
  opacity: 0.85;
  margin-top: 10px;
  margin-bottom: 35px;
}

/* =========================
   BUTTON
========================= */
.btn-login {
  background: linear-gradient(135deg, #ffffff, #e3f2fd);
  color: #0d47a1;
  font-weight: 600;
  border-radius: 999px;
  padding: 12px 36px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-login:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 30px rgba(33, 150, 243, 0.4);
}
</style>
