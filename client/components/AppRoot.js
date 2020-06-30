import React from "react"
import { Router } from "react-router-dom"
import Routes from "./Routes"
import { createMemoryHistory, createBrowserHistory } from 'history';
import openSocket from 'socket.io-client';
import toastr from 'toastr';
import { isServer } from "./utils";

export const history = isServer
  ? createMemoryHistory()
  : createBrowserHistory();

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    const socket = openSocket("/");
    socket.on('users', data => {
      if (data.action === 'login') {
        toastr.success("Welcome to the website, " + data.user.userName + ".", data.user.email + " has logged in!");
      } else if (data.action === 'signup') {
        toastr.success("Welcome to the website, " + data.user.userName + ".", data.user.email + " has just signed up!");
      }
    });
  }

  render() {
    return (
      <Router key={Math.random()} history={history}>
        <Routes />
      </Router>
    )
  }
}