import React, { Fragment, Component } from "react";
import { withRouter, Link, NavLink } from "react-router-dom";
import { isServer } from "../utils";
import { Link as AniLink, animateScroll as scroll, scroller } from "react-scroll";
import { ApolloConsumer } from 'react-apollo';
import withSession from '../hoc/withSession';
import * as Cookies from 'es-cookie';
class Menu extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            currentScroll: 0,
            isDataFetched: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        document.addEventListener('scroll', this.trackScrolling.bind(this));
        if (this._isMounted) {
            this.setState({ isDataFetched: true });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        this._isMounted = false;
    }

    trackScrolling = () => {
        if (this._isMounted)
            this.setState({ currentScroll: window.scrollY });
    };

    handleSignout = (client) => {
        Cookies.remove('token');
        client.resetStore();
        this.props.history.push('/signin');
    }

    menuLogin = () => {
        if (this.props.session.getCurrentUser === null) {
            return (
                <Fragment>
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            activeStyle={{
                                color: "#1ebba3"
                            }}
                            to="/signin"
                            onClick={(e) => { if (this.kek.classList.contains("show")) { this.inputElement.click() } }}
                        >
                            Sign In
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            activeStyle={{
                                color: "#1ebba3"
                            }}
                            to="/signup"
                            onClick={(e) => { if (this.kek.classList.contains("show")) { this.inputElement.click() } }}
                        >
                            Sign Up
                        </NavLink>
                    </li>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            activeStyle={{
                                color: "#1ebba3"
                            }}
                            to="/dashboard"
                            onClick={(e) => { if (this.kek.classList.contains("show")) { this.inputElement.click() } }}
                        >
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <ApolloConsumer>
                            {client => {
                                return (
                                    <NavLink
                                        className="nav-link"
                                        activeStyle={{
                                            color: "#fff"
                                        }}
                                        to="#"
                                        onClick={() => this.handleSignout(client)}
                                    >
                                        Sign Out
                                    </NavLink>
                                );
                            }}
                        </ApolloConsumer>
                    </li>
                </Fragment>
            );
        }
    };

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }

        return (
            <nav className={`navbar navbar-expand-lg fixed-top ${this.state.currentScroll > 250 ? 'solid' : ''}`}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/"><img src="/public/img/logo.png" alt="" /></a>
                    <button ref={input => this.inputElement = input} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive">
                        <span className="custom-toggler-icon"><i className="fas fa-bars"></i></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive" ref={input => this.kek = input}>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeStyle={{
                                        color: "#1ebba3"
                                    }}
                                    exact to="/"
                                    onClick={(e) => { if (this.kek.classList.contains("show")) { this.inputElement.click() } }}
                                >
                                    Home
                                        </NavLink>
                            </li>
                            {this.menuLogin()}
                        </ul>
                    </div>
                </div>
                {this.state.currentScroll > 500 ?
                    (
                        <AniLink
                            className="top-scroll"
                            style={{ display: "inline" }}
                            to="root"
                            smooth={true}
                            duration={500}
                        >
                            <i className="fas fa-angle-up"></i>
                        </AniLink>
                    )
                    :
                    (
                        <AniLink
                            className="top-scroll"
                            style={{ display: "none" }}
                            to="root"
                            smooth={true}
                            duration={500}
                        >
                            <i className="fas fa-angle-up"></i>
                        </AniLink>
                    )
                }
            </nav>
        );
    }

}; export default withRouter(withSession(Menu));