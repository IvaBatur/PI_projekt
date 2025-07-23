<template>
  <div class="about-container">
    <div class="content">
      <h1>Povijest našeg kluba</h1>
      <section>
        <h2>Početak</h2>
        <p>
          Naš klub osnovan je davne 1954. godine s ciljem promocije boksa kao sporta discipline, snage i zajedništva.
          Od tada, generacije boraca prolazile su kroz naše ringove, ostavljajući neizbrisiv trag u domaćim i međunarodnim natjecanjima.
        </p>
        <img src="@/assets/povijest1.png" alt="Početci kluba" />
      </section>

      <section>
        <h2>Zlatne 70-te</h2>
        <p>
          Tijekom 70-ih godina naš klub osvojio je prva velika prvenstva i stekao reputaciju jednog od najuspješnijih boksačkih centara u regiji.
          Boksale su legende čije se ime i danas spominje sa strašću i ponosom.
        </p>
        <img src="@/assets/povijest2.png" alt="Zlatne 70-te" />
      </section>

      <section>
        <h2>Modernizacija i budućnost</h2>
        <p>
          Danas naš klub kombinira tradiciju i moderne metode treniranja, stvarajući pobjednike i na sportskim borilištima i u životu.
          Srčanost, poštovanje i zajedništvo naš su moto – i vrata su otvorena svima!
        </p>
        <img src="@/assets/povijest3.png" alt="Moderni trening" />
      </section>

      <p class="closing">
        Pridruži se našem putovanju – i postani dio naše priče!
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  background: url('@/assets/pozadina.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1rem;
  color: #fff;
}

.content {
  background: rgba(0, 0, 0, 0.75);
  padding: 2rem;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #e74c3c;
}

.content h2 {
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
  color: #f1c40f;
}

.content p {
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.content img {
  width: 300px;
  height: 200px;
  object-fit: cover;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
}

.closing {
  margin-top: 2rem;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2ecc71;
}
</style>
