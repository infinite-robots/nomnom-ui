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
                <v-text-field  v-model="searchLocation"  append-icon="gps_fixed" :success=gotLocation @click:append="getLocation()" label="Enter a Zipcode, City or Address" required></v-text-field>
                <v-subheader class="pl-0">Search Radius (miles)</v-subheader>
                <v-slider
                  v-model="rangeRadius"
                  thumb-label="always"
                  min="2"
                  max="25"
                ></v-slider>
              </v-flex>
              <v-btn color="primary" :disabled="searchLocation.length <= 1" @click="handleCreateRoom()">Create a Room</v-btn>
            </div>
          </div>
        </v-card-title>
      </v-card>
      <v-snackbar v-model="snackbar" color="red" :bottom="true">
        {{errorMessage}}
      </v-snackbar>
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
      rangeRadius: 10,
      gpsPosition: false,
      gotLocation: false,
      errorMessage: false,
      snackbar: false,
    };
  },
  methods: {
    handleCreateRoom() {
      makeRoom(this.searchLocation, this.rangeRadius, this.gpsPosition).then((resp) => {
        this.$router.push(`/nom/${resp.data.roomId}`);
      });
    },
    geoLocationSuccess(position) {
      console.log(position);
      const { coords: { latitude, longitude } } = position;
      this.searchLocation = 'Your GPS position';
      this.gpsPosition = { latitude, longitude };
      this.gotLocation = true;
    },
    geoLocationError(error) {
      console.log(error);
      this.errorMessage = error.message;
      this.snackbar = true;
    },
    getLocation() {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError, { enableHighAccuracy: true, timeout: 5000 });
      }
    },
  },
};
</script>
