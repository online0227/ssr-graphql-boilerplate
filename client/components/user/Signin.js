import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Layout from "../core/Layout";import * as Cookies from 'es-cookie';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from '../queries';
import Menu from "../core/Menu"

const initialState = {
    email: '',
    password: '',
    error: '',
    isSubmitting: false
}

class Signin extends Component {
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

    handleChange = stateName => event => {
        if (this._isMounted)
            this.setState({ [stateName]: event.target.value })
    };

    clearState() {
        this.setState({ ...initialState })
    }

    clickSubmit = (e, signinUser) => {        e.preventDefault();

        const { isSubmitting } = this.state;

        if (isSubmitting) return;

        if (!isSubmitting) {
            const imagePath = require(`../../../public/img/spinner.gif`)
            $('#submit').html(`<img src="${imagePath}"/>`);
            if (this._isMounted)
                this.setState({ isSubmitting: true });
        }

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        return sleep(300).then(() => {            signinUser().then(async ({ data }) => {
                Cookies.set('token', data.signinUser.token);
                await this.props.refetch();
                this.clearState();
                this.props.history.push('/');
            }).catch(error => {
                if (this._isMounted) {
                    this.setState({
                        error: error.graphQLErrors.map(x => x.message),
                        isSubmitting: false
                    });
                }
            })
                .then(_ => {
                    $('#submit').html('Submit');
                });        });

    };

    validateForm() {
        const { email, password } = this.state;
        const isInvalid = !email || !password;
        return isInvalid;
    }

    signInForm = () => {
        const { email, password } = this.state;
        return (
            <Mutation mutation={SIGNIN_USER} variables={{ email, password }}>

                {(signinUser, { loading }) => {                    return (
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
                                <label className="text-muted">Password</label>
                                <input
                                    onChange={this.handleChange("password")}
                                    type="password"
                                    className="form-control"
                                    value={password}
                                />
                            </div>
                            <button onClick={event => this.clickSubmit(event, signinUser)}                                id="submit"
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
    }

    showError = () => {
        return (
            <div
                style={{ display: this.state.error ? "" : "none" }}
                className="alert alert-danger"
            >
                {this.state.error}
            </div>
        )    }

    render() {
        return (
            <div>
                <Menu />
                <Layout
                    title="Signin"
                    description="Signin to ssr-graphql-boilerplate"
                    className="container col-md-8 offset-md-2"
                >
                    {this.showError()}
                    {this.signInForm()}
                </Layout>
            </div>
        );
    };
};

export default withRouter(Signin);
// export default withRouter(graphql(mutate)(Signin));