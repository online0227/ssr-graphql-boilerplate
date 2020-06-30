import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { isServer } from "../utils";
import Footer from "./Footer";
import { Link, animateScroll as scroll, scroller } from "react-scroll";
import ScrollAnimation from 'react-animate-on-scroll';
import Rodal from 'rodal';
import Iframe from 'react-iframe';
import Menu from "./Menu"

import 'rodal/lib/rodal.css';
import "../../styles/Homepage.css"
import "../../styles/modal.css"
class Homepage extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            currentScroll: 0,
            isDataFetched: false,
            visible: false
        };
        this.getMarkdown = this.getMarkdown.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        document.addEventListener('scroll', this.trackScrolling.bind(this));
        this.getMarkdown();
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        this._isMounted = false;
    }

    async getMarkdown() {
        if (this._isMounted) {
            this.setState({ isDataFetched: true });
        }
    };

    trackScrolling = () => {
        if (this._isMounted)
            this.setState({ currentScroll: window.scrollY });
    };

    show() {
        if (this._isMounted)
            this.setState({ visible: true });
    }

    hide() {
        if (this._isMounted)
            this.setState({ visible: false });
    }

    test = () => {
        return null;
    }

    render() {
        if (!isServer && !this.state.isDataFetched) {
            return null;
        }
        let MarkdownData;
        try {
            MarkdownData = require(`../../../data/${this.props.site}/Homepage.md`);        } catch (err) {            return null;
        }
        
        return (
            <div>
                <Menu />
                <Rodal visible={this.state.visible} onClose={this.hide.bind(this)}
                    customStyles={{ width: "80%", height: "80%" }}
                    animation={"rotate"}
                >
                    <div className="modal-title">Website Console</div>
                    <div className="modal-container">
                        {this.state.visible && (
                            <Iframe
                                url={"/test/welcome"}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                            />                        )}

                    </div>
                </Rodal>
                <div id="home">
                    <div className="landing">
                        <div className="home-wrap">
                            <div className="home-inner" style={{
                                backgroundImage: "url(" + MarkdownData.backgroundImage + ")"
                            }}>
                            </div>
                        </div>
                    </div>

                    <div className="caption text-center">
                        <ScrollAnimation animateIn="bounceInUp" duration={1.0} animateOnce={true}>
                            <h1>{MarkdownData.title}</h1>
                        </ScrollAnimation>

                        <ScrollAnimation animateIn="bounceInUp" duration={1.2} animateOnce={true}>
                            <h4>{MarkdownData.subTitle}</h4>
                            <h3>All-In-One</h3>
                        </ScrollAnimation>

                        <ScrollAnimation animateIn="bounceInUp" duration={1.2} animateOnce={true}>
                            <Link
                                to="features"
                                smooth={true}
                            >
                                <div className="btn btn-outline-light btn-lg" style={{ cursor: "pointer" }}>Get Started</div>
                            </Link>
                        </ScrollAnimation>

                    </div>
                    <Link
                        activeClass="active"
                        to="features"
                        spy={true}
                        smooth={true}
                        offset={7}
                        duration={500}
                    >

                        <ScrollAnimation animateIn="bounce" initiallyVisible={true} offset={0} style={{ opacity: (1 - this.state.currentScroll / 500) }}>
                            <div className="down-arrow">
                                <div className="arrow d-md-block">
                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                </div>
                            </div>
                        </ScrollAnimation>

                    </Link>
                </div>

                <div id="features" className="offset">

                    <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                        <div className="narrow text-center">
                            <div className="col-12">
                                <h1>ssr-graphql-boilerplate React App</h1>
                                <p
                                    className="lead"
                                    dangerouslySetInnerHTML={{ __html: MarkdownData.__content }}
                                />
                                <Link
                                    to="contact"
                                    smooth={true}
                                >
                                    <div className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>Contact The Admin</div>
                                </Link>
                                <Link
                                    to="tests"
                                    smooth={true}
                                >
                                    <div className="btn btn-turquoise btn-sm" style={{ cursor: "pointer" }}>Test The App</div>
                                </Link>
                            </div>
                        </div>
                    </ScrollAnimation>

                    <div className="jumbotron">
                        <div className="narrow">

                            <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                <h3 className="heading">Features</h3>
                                <div className="heading-underline"></div>
                            </ScrollAnimation>

                            <div className="row">

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInLeft" duration={1.0}>
                                        <div className="feature">

                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-mobile-alt fa-inverse" data-fa-transform="shrink-6 right-.25"></i>
                                            </span>
                                            <h3>Server Side Rendering</h3>
                                            <p>Server-side rendering makes the website SEO friendly for search engines such as Google, Bing, etc.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-desktop fa-inverse" data-fa-transform="shrink-8 left-1."></i>
                                            </span>
                                            <h3>Code Splitting</h3>
                                            <p>Code-splitting minimizes network traffic by loading only necessary files for the specific page
                                                the user requests.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInRight" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-play fa-inverse" data-fa-transform="shrink-.5 right-1.3"></i>
                                            </span>
                                            <h3>GraphQL</h3>
                                            <p>It minimizes the number of http calls by requesting exact data a user needs,
                                            which eventually results in faster performance than REST.
                                            </p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInLeft" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-angle-double-down fa-inverse" data-fa-transform="shrink-5.5 down-.3"></i>
                                            </span>
                                            <h3>Socket.IO</h3>
                                            <p>Socket.IO makes the website the real-time applicaton so that it interactively
                                            communicates with all the users connected to the website at the same time.
                                            </p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fas fa-sliders-h fa-inverse" data-fa-transform="shrink-8.5 right-.2"></i>
                                            </span>
                                            <h3>Multi Domain & Markdown</h3>
                                            <p>It supports multiple domains that have similar patterns with the markdowns corresponding to each page
                                                of subdomains.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                                <div className="col-sm-6 col-md-4">
                                    <ScrollAnimation animateIn="fadeInRight" duration={1.0}>
                                        <div className="feature">
                                            <span className="fa-layers fa-4x">
                                                <i className="fa fa-circle"></i>
                                                <i className="fab fa-wpforms fa-inverse" data-fa-transform="grow-6 right-.5"></i>
                                            </span>
                                            <h3>Hot Reload</h3>
                                            <p>Any changes made during the development time will apply immediately as soon as any modifications are saved.</p>
                                        </div>
                                    </ScrollAnimation>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="tests">
                    <div className="row dark">
                        <div className="col-12">
                            <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                <h3 className="heading">Test</h3>
                                <div className="heading-underline"></div>
                            </ScrollAnimation>
                        </div>

                        <div className="col-md-12">
                            <ScrollAnimation animateIn="fadeInUp" duration={1.0}>
                                <div className="feature">
                                    <span className="fa-layers fa-3x">
                                        <i className="fas fa-wrench"></i>
                                    </span>
                                </div>
                                <p className="lead">Click the button below to check if the boilerplate works well as intended.</p>
                                <div
                                    className="btn btn-outline-light btn-lg"
                                    style={{ cursor: "pointer" }}
                                    onClick={this.show.bind(this)}
                                >
                                    Test It Out</div>
                            </ScrollAnimation>
                        </div>

                    </div>

                    <div className="fixed-wrap">
                        <div id="fixed">
                        </div>
                    </div>

                </div>
                <Footer site={this.props.site} />
            </div>
        );
    };
};

export default withRouter(Homepage);
// export default withRouter(graphql(query)(Homepage));