<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p class="lead mt-2">{{ authStatus }}</p>
    <div class="d-flex my-4 justify-content-center">
      <button @click="signIn" class="btn btn-outline-primary mx-4">Sign In ></button>
      <button @click="sendRequest" class="btn btn-outline-success mx-4">Send Request ></button>
      <button @click="pushToQueue" class="btn btn-outline-success mx-4">push to Queue ></button>
      <button @click="signOut" class="btn btn-outline-danger mx-4">Sign Out ></button>
      <form enctype="multipart/form-data" method="POST" onsubmit="return false;">
        <input type="file" class="admin__input" id="myFile" name="myFile" />
        <button @click="createCollection" class="btn btn-outline-danger mx-4">Submit ></button>
      </form>
    </div>
    <p class="lead">{{ response }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const client = axios.create({
  baseURL: 'http://localhost:3000',
  json: true
})

export default {
  name: 'HelloWorld',
  data: function() {
    return {
      response: 'No data yet...',
      authStatus: 'No Auth Status'
    }
  },
  props: {
    msg: String
  },
  methods: {
    sendRequest() {
      if (getAuth().currentUser) {
        console.log(getAuth().currentUser)
        getAuth().currentUser.getIdToken(true)
        .then((idToken) => {
          client({
            method: 'get',
            url: '/',
            headers: {
              'AuthToken': idToken
            }
          }).then((res) => {
            this.response = res.data.message
          }).catch((error) => {
            this.response = error
          })
        }).catch(() => {
          this.response = "Error getting auth token"
        });
      } else {
        client({
          method: 'get',
          url: '/'
        }).then((res) => {
          this.response = res.data.message
        }).catch((error) => {
          this.response = error
        })
      }
    },
    pushToQueue() {
      if (getAuth().currentUser) {
        console.log(getAuth().currentUser)
        getAuth().currentUser.getIdToken(true)
        .then((idToken) => {
          client({
            method: 'get',
            url: '/sendToQueue',
            headers: {
              'AuthToken': idToken
            }
          }).then((res) => {
            this.response = res.data.message
          }).catch((error) => {
            this.response = error
          })
        }).catch(() => {
          this.response = "Error getting auth token"
        });
      } else {
        client({
          method: 'get',
          url: '/'
        }).then((res) => {
          this.response = res.data.message
        }).catch((error) => {
          this.response = error
        })
      }
    },

    signIn() {
      signInWithEmailAndPassword(getAuth(), "admin@gmail.com", "test123")
      .then(() => {
        this.authStatus = 'Authorized'
      }).catch((err) => {
        this.authStatus = err
      })
    },
    signOut() {
      signOut(getAuth()).then(() => {
        this.authStatus = 'Unauthorized'
      }).catch((err) => {
        this.authStatus = err
      })
    },
    createCollection() {
      var form = document.querySelector('form');
      var data = new FormData(form);
      if (getAuth().currentUser) {
        console.log(getAuth().currentUser)
        getAuth().currentUser.getIdToken(true)
        .then((idToken) => {
          client({
            method: 'post',
            url: '/collection',
            headers: {
              'AuthToken': idToken
            },
            data: data
          }).then((res) => {
            this.response = res.data.message
          }).catch((error) => {
            this.response = error
          })
        }).catch(() => {
          this.response = "Error getting auth token"
        });
      } else {
        client({
          method: 'post',
          url: '/collection',
          data: data
        }).then((res) => {
          this.response = res.data.message
        }).catch((error) => {
          this.response = error
        })
      }
    },
  }
}
</script>