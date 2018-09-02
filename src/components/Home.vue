<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <div>
            <div class="headline">NomNominate a place to eat</div>
            <div class="start">
              <p>
                NomNom helps your group pick a place to eat without all the back and forth conversation.
                Swipe left and right on food choices until the team comes to an agreement!
              </p>
              <v-flex xs12>
                <v-text-field  v-model="searchLocation"  label="Enter a Zipcode" required></v-text-field>
                <v-subheader class="pl-0">Search Radius (miles)</v-subheader>
                <v-slider
                  v-model="rangeRadius"
                  thumb-label="always"
                  min="2"
                  max="25"
                ></v-slider>
              </v-flex>
              <v-btn color="primary" @click="handleCreateRoom()">Create a Room</v-btn>
            </div>
          </div>
        </v-card-title>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { makeRoom } from '../services/nomService';

export default {
  name: 'Home',
  data() {
    return {
      searchLocation: '',
      rangeRadius: 10
    }
  },
  methods: {
    handleCreateRoom() {
      makeRoom(this.searchLocation, this.rangeRadius).then((resp) => {
        this.$router.push(`/nom/${resp.data.roomId}`);
      });
    },
  },
};
</script>

<style scoped>

</style>
