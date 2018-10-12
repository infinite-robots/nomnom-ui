<template>
  <v-layout row class="page-content help">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="top-card">
        <v-card-title primary-title>
          <div class="card-wrap">
            <h1 class="headline">How does NomNominate work?</h1>
            <p class="subheading">NomNom helps your group pick a restaurant to eat at.</p>
            <ol>
                <li>Create a room by setting your location and search radius. <br /><span class="caption">You can enter a zipcode, street address, or city name. The more accurate your address, the better the distance results will be.</span></li>
                <li>Once your room is set up, invite your friends to join the room.</li>
                <li>When all your friends have joined the room, hit the 'START' button!</li>
                <li>You will then be presented with restaurant options one at a time. Let NomNom know if you want to eat there by hitting 'NAH' or 'YUM!'</li>
                <li>Keep swiping and once everyone in your group has said 'YUM!' to the same restaurant, NomNom will let you know!</li>
                <li>Head to the chosen NomNom spot and enjoy a great meal!</li>
            </ol>
          </div>
        </v-card-title>
      </v-card>
      <v-card class="top-card">
        <v-card-title primary-title>
          <div class="card-wrap">
            <h1 class="headline">Other Questions</h1>
            <h3>Can I change my nickname?</h3>
            <p>Yes, <router-link to="/start">click here</router-link> to change your nickname.</p>
            <h3>Where is the data coming from?</h3>
            <p>We use the Yelp API.</p>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Help',
};
</script>

<style scoped>
.help span.caption {
    color: #aaa;
}
.help ol li {
    margin-bottom: 16px;
}
h3 {
    font-weight: 500;
    margin-bottom: 2px;
}
</style>
