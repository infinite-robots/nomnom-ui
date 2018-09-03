<template>
  <v-layout row class="page-content">
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="top-card">
        <v-card-title primary-title>
          <div class="card-wrap">
            <div class="headline">Create a New Room</div>
            <div class="start">
              <p>
                Just set your location and search radius, then we'll create a room you can invite your friends to. NomNom will take care of the rest!
              </p>
              <v-flex xs12>
                <v-text-field  v-model="searchLocation"  label="Enter a Zipcode, City or Address" required></v-text-field>
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
  name: 'Create',
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