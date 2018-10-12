<template>
  <section class="home">
    <div class="hero">
      <v-container>
        <v-layout row>
          <v-flex xs12 sm8 md6 >
            <h1>NomNominate helps your group pick a place to eat.</h1>
            <p>Just set your location, invite your friends to the app, and start swiping restaurants!</p>
            <router-link to="/create"><v-btn color="primary">Create a Room</v-btn></router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div class="news">
      <v-container>
        <v-layout row>
          <v-flex xs12 text-xs-left>
            <h1>Latest News</h1>
            <hr />
            <h3>NomNom alpha version released!</h3>
            <p class="caption">September 3rd, 2018</p>
            <p>We are happy to announce the release of our alpha version (0.0.1). Please let us know how the app is working for you!</p>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style>
.left-card {
  text-align: left;
}
.home .v-btn {
  margin-left: 0;
}
.hero {
  padding: 40px;
  background: #363636;
  color: #fff;
  text-align: left;
}
.hero h1 {
  font-size: 28px;
  margin-bottom: 24px;
}
#nomnom .page-content {
  padding: 0 20px;
}
</style>
