import React, { Component } from 'react';
import { withRouter, NavLink } from "react-router-dom";
import { Query } from 'react-apollo';
import { GET_USER_PROFILE } from '../queries';

import Layout from "../core/Layout";
import withAuth from '../hoc/withAuth';
import * as Cookies from 'es-cookie';
import withSession from '../hoc/withSession';
import SideMenu from "./SideMenu";
import EditProfileMutations from './editProfile_mutations';
import Menu from "../core/Menu";

const initialState = {
    email: '',
    password: '',
    error: '',
    isSubmitting: false
}

class EditProfile extends Component {
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
                <Query query={GET_USER_PROFILE}>

                    {({ data, loading, error }) => {

                        if (loading) return <div>Loading</div>
                        if (error) return <div>error</div>

                        return (
                            <EditProfileMutations profile={data.getUserProfile} refetch={this.props.refetch} session={this.props.session} />
                        )
                    }}

                </Query>
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
};export default withAuth(session => session && session.getCurrentUser)(withRouter(EditProfile));