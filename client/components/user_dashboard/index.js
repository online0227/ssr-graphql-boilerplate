import React, { Component } from 'react';
import { withRouter, NavLink } from "react-router-dom";
import Layout from "../core/Layout";
import withAuth from '../hoc/withAuth';
import * as Cookies from 'es-cookie';
import withSession from '../hoc/withSession';
import SideMenu from "./SideMenu";
import Menu from "../core/Menu"

const initialState = {

}

class Dashboard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    userInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{this.props.session.getCurrentUser.userName}</li>
                    <li className="list-group-item">{this.props.session.getCurrentUser.email}</li>
                </ul>
            </div>
        );
    };

    render() {
        return (
            <div>
                <Menu />
                <Layout
                    title="Dashboard"
                    description={`G'day, ${this.props.session.getCurrentUser.userName}!`}
                    className="container-fluid"
                >
                    <div className="row">
                        <div className="col-sm-3"><SideMenu /></div>
                        <div className="col-sm-9">{this.userInfo()}</div>
                    </div>
                </Layout>
            </div>
        );
    };
};export default withAuth(session => session && session.getCurrentUser)(Dashboard); // allow you to check auth when entering this page