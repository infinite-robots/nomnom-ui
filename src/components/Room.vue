<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card v-if="!start && !winner">
        <v-card-title primary-title>
          <div class="room-wrap">
            <div class="headline">Waiting to start...</div>
            <div class="room">
              <p class="subheading">Share this link to your friends to have them join: <a href="#">http://nomnom.site/nom/{{ roomId }}</a></p>
              <h3>created by {{ admin }}</h3>
              <p>
                {{ users.length }} users in room: {{ users.join(', ') }}
              </p>
              <div v-if="!start">
                <p v-if="user !== admin">Waiting for {{ admin }} to start...</p>
                <p v-else><v-btn color="primary" @click="startNomming">Start</v-btn></p>
              </div>
            </div>
          </div>
        </v-card-title>
      </v-card>

      <div v-if="start && !winner" class="noms">
        <div class="instructions" v-if="nomnoms.length > 0">
          <h1>Would you eat here?</h1>
          <p>Keep swiping left and right. When your group reaches and agreement, we'll let you know!</p>
        </div>
        <v-card class="nom" v-if="nomnoms.length > 0">
          <v-img
            :src="nomnoms[0].image_url"
            height="200px"
          >
          </v-img>

          <v-card-title primary-title>
            <div class="nom">
              <div class="headline">{{ nomnoms[0].name }}</div>
              <p class="grey--text">
                <v-chip color="secondary" v-for="cat in nomnoms[0].categories" :key="cat.title">{{ cat.title}}</v-chip>
              </p>
              <p class="rating">Yelp Rating: <v-rating v-model="nomnoms[0].rating" half-increments readonly background-color="#cccccc"></v-rating></p>
              <p class="price">Price Range: {{nomnoms[0].price}}</p>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn @click="voteNah">Nah</v-btn>
            <v-btn @click="voteYum" color="primary">Yum!</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-if="outOfNoms && !winner">
        <p>No more options left... maybe try being a little less picky next time</p>
      </div>
      <div v-if="winner" class="winner">
        <h1>WINNER!</h1>
        <p>Here's your NomNom:</p>
        <v-card class="nom">
          <v-img
            :src="winningNom.image_url"
            height="200px"
          >
          </v-img>

          <v-card-title primary-title>
            <div class="nom">
              <div class="headline">{{ winningNom.name }}</div>
              <p class="grey--text">
                <v-chip color="secondary" v-for="cat in winningNom.categories" :key="cat.title">{{ cat.title}}</v-chip>
              </p>
              <p>
                {{ winningNom.location.display_address.join(', ') }}
              </p>
              <p><a :href="'https://www.google.com/maps/place/' + encodeURI(winningNom.location.display_address.join(', '))" target="_blank" rel="noopener">Open in google maps</a></p>
            </div>
          </v-card-title>
        </v-card>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
import SocketIO from 'socket.io-client';
import { getNick } from '../services/auth';
import { getNomsForUser, startGame, nomVote } from '../services/nomService';


export default {
  name: 'Room',
  data() {
    return {
      start: false,
      winner: false,
      winningNom: null,
      outOfNoms: false,
      admin: '',
      roomId: null,
      socket: null,
      user: null,
      users: [],
      nomnoms: [],
    };
  },
  mounted() {
    this.roomId = this.$route.params.id;
    this.user = getNick();
    this.establishSocket();
  },
  methods: {
    establishSocket() {
      const socket = SocketIO(`http://142.93.118.93:8088/rooms/${this.roomId}/meta`, { origins: 'http://nomnom.site' });
      this.socket = socket;
      socket.on('connect', () => {
        socket.emit('join', this.user);
      });
      socket.on('users', (users) => {
        console.log('users', users);
        this.users = users;
      });
      socket.on('admin', (admin) => {
        this.admin = admin;
      });
      socket.on('start', () => {
        this.start = true;
        this.getNoms();
      });
      socket.on('winner', (winner) => {
        this.winner = true;
        this.winningNom = winner;
      });
    },
    startNomming() {
      startGame(this.roomId).then(() => {});
    },
    getNoms() {
      getNomsForUser(this.roomId).then((resp) => {
        if (resp.data.length > 0) {
          this.nomnoms = this.nomnoms.concat(resp.data);
        } else {
          this.outOfNoms = true;
        }
      });
    },
    voteNah() {
      this.voteNom(this.nomnoms[0].id, false);
    },
    voteYum() {
      this.voteNom(this.nomnoms[0].id, true);
    },
    voteNom(id, yum) {
      nomVote(this.roomId, id, yum).then(() => {
        this.nomnoms.splice(0, 1);
        if (this.nomnoms.length < 1) {
          this.getNoms();
        }
      });
    },
  },
};
</script>

<style>
.room-wrap, .nom {
  width: 100%;
}
.v-card__actions {
  justify-content: space-between;
}
</style>
