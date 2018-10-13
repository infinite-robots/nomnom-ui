<template>
  <section class="nom-room">
  <v-expansion-panel>
    <v-expansion-panel-content>
      <div slot="header">Room ID: <span class="sb">{{ roomId }}</span> <span class="divider">|</span> Host: <span class="sb">{{ admin }}</span></div>
      <v-card>
        <v-card-text>This will eventually show more info about the current room.</v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
  <v-layout row>
    <v-flex xs12 sm8 md6 offset-sm2 offset-md3 class="page-content">
      <v-card v-if="!start && !winner" class="top-card">
        <v-card-title primary-title>
          <div class="room-wrap">
            <div class="headline">Waiting to start...</div>
            <div class="room">
              <p class="subheading share-text">Share this link with your friends to have them join:</p>
              <p>
                <input type="text" ref="nomlink" :value="'http://nomnom.site/nom/' +  roomId " readonly @focus="$event.target.select()" />
                <a href="#" class="nou" @click.prevent="clipboard()">copy</a>
              </p>
              <p>
                {{ users.length }} users in room: {{ users.join(', ') }}
              </p>
              <div v-if="!start">
                <p v-if="user !== admin">Waiting for {{ admin }} to start...</p>
                <p v-else><v-btn color="primary" @click="handleNomStart">Start</v-btn></p>
              </div>
            </div>
          </div>
        </v-card-title>
      </v-card>

      <div v-if="start && !winner" class="noms">
        <span v-touch="{left: voteYum, right: voteNah}">
          <div class="instructions top-card" v-if="nomnoms.length > 0">
            <h1>Wanna eat here?</h1>
            <p>Hit Yum or Nah on each restaurant to let us know if you want to eat here. When your group reaches an agreement, we'll let you know!</p>
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
                <p class="category-chips">
                  <v-chip color="secondary" v-for="cat in nomnoms[0].categories" :key="cat.title">{{ cat.title}}</v-chip>
                </p>
                <p class="rating"><span class="sb">Yelp Rating:</span> <v-rating v-model="nomnoms[0].rating" half-increments readonly background-color="#cccccc"></v-rating></p>
                <p class="price"><span class="sb">Price Range:</span> {{convertPrice(nomnoms[0].price)}}</p>
                <p class="distance"><span class="sb">Distance:</span> {{convertDistance(nomnoms[0].distance)}}</p>
              </div>
            </v-card-title>

            <v-card-actions class="full-width-buttons">
              <v-btn @click="voteNah">Nah</v-btn>
              <v-btn @click="voteYum" color="primary">Yum!</v-btn>
            </v-card-actions>
          </v-card>
        </span>
      </div>
      <div v-if="outOfNoms && !winner">
        <p>No more options left... maybe try being a little less picky next time</p>
      </div>
      <div v-if="winner" class="winner top-card">
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
              <p>
                <a :href="'https://www.google.com/maps/place/' + encodeURI(winningNom.location.display_address.join(', '))" target="_blank" rel="noopener">
                  Open in Google Maps
                </a>
              </p>
            </div>
          </v-card-title>
        </v-card>
      </div>

    <v-dialog v-model="dialog" width="500">

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Are you sure?
        </v-card-title>

        <v-card-text>
          <strong>You are the only user in this room.</strong> NomNom is ideally meant for groups of 2 or more. Do you want to start anyway?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="startNomming">Start Anyway</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :bottom="true">
      Copied to Clipboard
    </v-snackbar>

    </v-flex>
  </v-layout>
  </section>
</template>

<script>
import SocketIO from 'socket.io-client';
import { getNick } from '../services/auth';
import { getNomsForUser, startGame, nomVote } from '../services/nomService';


export default {
  name: 'Room',
  data() {
    return {
      dialog: false,
      snackbar: false,
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
    handleNomStart() {
      if (this.users.length <= 1) {
        this.dialog = true;
      } else {
        this.startNomming();
      }
    },
    startNomming() {
      this.dialog = false;
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
    convertPrice(yelpPrice) {
      return yelpPrice === '$' ? 'Low'
        : yelpPrice === '$$' ? 'Medium'
          : yelpPrice === '$$$' ? 'High'
            : yelpPrice === '$$$$' ? 'Ultra High'
              : 'unknown';
    },
    convertDistance(dist) {
      return `${(dist / 1609).toFixed(1)} miles`;
    },
    clipboard() {
      this.$refs.nomlink.select();
      document.execCommand('copy');
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.share-text {
  margin-bottom: 2px !important;
}
input[type="text"] {
  cursor: text;
  font-family: "SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace !important;
  padding: 3px 8px;
  border-radius: 3px;
  border: 1px solid #d1d5da;
  box-shadow: inset 0 1px 2px rgba(27,31,35,0.075);
  width: 240px;
  background: #f8f8f8;
}
.nou {
  text-decoration: none;
}
</style>
