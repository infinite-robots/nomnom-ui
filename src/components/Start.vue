<template>
  <v-layout row class="page-content">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="top-card">
        <v-card-title primary-title>
          <div class="card-wrap">
            <div class="headline">Choose Your Nickname to Continue</div>
            <div class="start">
              <div class="nick-form">
                <v-text-field  v-model="nickname"  label="Nickname" required></v-text-field>
                <v-btn color="primary" @click="login()">Continue</v-btn>
              </div>
            </div>
          </div>
        </v-card-title>
      </v-card>

      <div class="start-intro text-xs-left">
        <h4>What is NomNominate?</h4>
        <p>
          NomNom helps your group pick a place to eat without all the back and forth conversation.
          Swipe left and right on food choices until the team comes to an agreement!
        </p>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { setNick } from '../services/auth';

export default {
  name: 'start',
  data() {
    return {
      nickname: '',
    };
  },
  methods: {
    login() {
      setNick(this.nickname);
      this.$store.commit('setNick', this.nickname);
      this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/');
    },
  },
};
</script>

<style scoped>
.start-intro {
  margin-top: 40px;
}
h4 {
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 4px;
}
</style>
