import React from "react"
import { Route, Link, Redirect } from "react-router-dom"
import universal from "react-universal-component"
import universalImport from 'babel-plugin-universal-import/universalImport.js'
import { Switch } from "react-router"
import Menu from "./core/Menu"
import withSession from './hoc/withSession';
import config from "../config"
const UniversalComponent = universal(props => universalImport({
  chunkName: props => props.page,
  path: props => path.join(__dirname, `./${props.page}`),
  resolve: props => require.resolveWeak(`./${props.page}`),
  load: props => Promise.all([
    import(`./${props.page}`).catch(err => { window.location.href = `${config.server_address}/NotFound` }),
    import(`../styles/${props.site}/theme.css`).catch(err => { window.location.href = `${config.server_address}/NotFound` }),

  ]).then(proms => {
    return proms[0]
  })
}), {
  onError: error => {
    console.log("error : ", error);
    window.location.href = `${config.server_address}/NotFound`;
  }, loadingTransition: false,
});

const Router = ({ refetch, session, staticContext }) => {
  let site = "www";
  if (typeof window != "undefined" && window.location.hostname != config.domain && window.location.hostname !== "localhost") {
    site = window.location.hostname.split(".")[0];
  } else if (staticContext) {
    site = staticContext.site;
  }

  return (
    <div>
      <Switch>
        <Route
          exact path="/"
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} session={session} page="core/Homepage" />
          }}
        />

        <Route
          path="/test/:slug"
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} page="core/ToBeDeleted_Test" />
          }}
        />

        <Route
          path="/signup"
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} session={session} refetch={refetch} page="user/Signup" />
          }}
        />

        <Route
          path="/signin"
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} session={session} refetch={refetch} page="user/Signin" />
          }}
        />

        <Route
          exact path="/dashboard"
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} session={session} page="user_dashboard" />
          }}
        />

        <Route
          exact path="/dashboard/edit-profile"
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} session={session} refetch={refetch} page="user_dashboard/EditProfile" />
          }}
        />

        <Route
          render={({ staticContext, match }) => {
            return <UniversalComponent site={site} match={match} session={session} page="NotFound" />
          }}
        />

      </Switch>
    </div>
  )
};

const AppRouter = withSession(Router);
export default AppRouter;