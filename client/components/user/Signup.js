import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Layout from "../core/Layout";
import { Mutation } from 'react-apollo';
import { SIGNUP_USER } from '../queries';
import * as Cookies from 'es-cookie';
import "../../styles/Singup.css"
import Menu from "../core/Menu"
const initialState = {
    email: '',
    userName: '',
    password: '',
    passwordConfirm: '',
    error: '',
    isSubmitting: false
}


class Signup extends Component {
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

    clearState() {
        if (this._isMounted)
            this.setState({ ...initialState })
    }

    handleChange = stateName => event => {
        if (this._isMounted)
            this.setState({ [stateName]: event.target.value })
    };

    clickSubmit = (e, signupUser) => {
        e.preventDefault();

        const { isSubmitting } = this.state;

        if (isSubmitting) return;

        if (!isSubmitting) {
            const imagePath = require(`../../../public/img/spinner.gif`)
            $('#submit').html(`<img src="${imagePath}"/>`);
            if (this._isMounted)
                this.setState({ isSubmitting: true });
        }

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(300).then(() => {
            signupUser().then(async ({ data }) => {
                Cookies.set('token', data.signupUser.token);
                await this.props.refetch();
                this.clearState();
                this.props.history.push('/dashboard');
            }).catch((err) => {
                if (this._isMounted)
                    this.setState({
                        error: 'Either your email or username is already taken. Please adjust and try again.',
                        isSubmitting: false
                    })
            }).then(_ => {
                $('#submit').html('Submit');
            });        });
    }

    validateForm() {
        const { email, userName, password, passwordConfirm } = this.state;
        const isInvalid = !email || !userName || !password || password !== passwordConfirm || password.length <= 7;
        return isInvalid;
    }

    signUpForm = () => {
        const { email, userName, password, passwordConfirm } = this.state;
        return (
            <Mutation mutation={SIGNUP_USER} variables={{ email, userName, password }}>

                {(signupUser, { loading }) => {

                    return (
                        <form>
                            <div className="form-group">
                                <label className="text-muted">Email</label>
                                <input
                                    onChange={this.handleChange("email")}
                                    type="email"
                                    className="form-control"
                                    value={email}
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-muted">User Name</label>
                                <input
                                    onChange={this.handleChange("userName")}
                                    type="text"
                                    className="form-control"
                                    value={userName}
                                />
                            </div>

                            <div className="form-group">
                                <label className="text-muted">Password</label>
                                <input
                                    onChange={this.handleChange("password")}
                                    type="password"
                                    className="form-control"
                                    value={password}
                                />
                                <div className="helperText">
                                    Password must be a minium of 8 characters in length.
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="text-muted">Password Confirm</label>
                                <input
                                    onChange={this.handleChange("passwordConfirm")}
                                    type="password"
                                    className="form-control"
                                    value={passwordConfirm}
                                />
                            </div>

                            <button onClick={event => this.clickSubmit(event, signupUser)}
                                disabled={loading || this.validateForm()}
                                id="submit"
                                type="submit"
                                value="Submit"
                                name="submit"
                                className="btn btn-primary">
                                Submit
                    </button>
                        </form>
                    );
                }}

            </Mutation>
        );
    };

    showError = () => {
        return (
            <div
                style={{ display: this.state.error ? "" : "none" }}
                className="alert alert-danger"
            >
                {this.state.error}
            </div>        )
    }

    showSuccess = () => (
        <div
            className="alert alert-info"
            style={{ display: this.state.success ? "" : "none" }}
        >
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    render() {
        return (
            <div>
                <Menu />
                <Layout
                    title="Signup"
                    description="Signup to ssr-graphql-boilerplate"
                    className="container col-md-8 offset-md-2"
                >
                    {this.showSuccess()}
                    {this.showError()}
                    {this.signUpForm()}
                </Layout>
            </div>
        );
    };
};

export default withRouter(Signup);