<template>
    <div class="about-wrapper">
      <div class="overlay">
        <h1>Povijest kluba</h1>
        <p>
          3,2,1 Box osnovan je s ciljem promocije boksa kao sporta discipline,
          snage i zajedništva. Tijekom godina postali smo prepoznatljiv centar
          izvrsnosti, gdje naši članovi treniraju s vrhunskim trenerima i
          sudjeluju na domaćim i međunarodnim natjecanjima.
        </p>
        <p>
          Naša misija je pružiti svakom članu priliku za osobni i sportski rast,
          bilo da je riječ o rekreativnom boksu ili profesionalnoj karijeri. Uz
          snažan tim, strast i predanost, nastavljamo graditi zajednicu temeljenu
          na poštovanju, radu i sportskom duhu.
        </p>
        <p>
          Pridruži se našem putovanju i treniraj kao prvak!
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AboutView",
  };
  </script>
  
  <style scoped>
  .about-wrapper {
    background: url('@/assets/pozadina.jpg') no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
  .overlay {
    background-color: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 20px;
    color: white;
    max-width: 800px;
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  </style>
  
