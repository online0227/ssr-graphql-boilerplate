import React from "react";
import { withRouter } from 'react-router-dom';
import withSession from '../hoc/withSession';
import axios from 'axios';

const checkAuth = (props) => {
    if (props.session.getCurrentUser === null) {
        alert("You must login in order to contact the admin.");
    }
}

const sendEmail = async (props, e) => {
    const form_name = document.getElementById("form_name").value;
    const form_email = document.getElementById("form_email").value;
    const form_message = document.getElementById("form_message").value;

    e.preventDefault();
    if (props.session.getCurrentUser === null) {
        alert("You must login in order to contact the admin");
    } else {
        const confirmed = confirm("Are you sure to contact admin?")
        if (confirmed) {
            const site = props.site;

            try {
                await axios({
                    method: "POST",
                    url: "/send-email",
                    data: {
                        name: form_name,
                        email: form_email,
                        messageHtml: form_message
                    }
                }).then(response => {
                    alert(response.data.message);
                });
            } catch (error) {
                alert("Message couldn't be sent. Reason : " + error);
            }
        }
    }

};

const Footer = (props) => (
    <div id="contact" className="offset">
        <footer>
            <div className="row">

                <div className="col-md-5">
                    <img src="/public/img/logo.png" alt="" />
                    <p>Please email to the admin if you need any helps for any reasons regarding the website. You can email manually, or use the form here.</p>
                    <strong>Contact Info</strong>
                    <p>admin@website.com</p>
                    <a href="#"><i className="fab fa-facebook-square"></i></a>
                    <a href="#"><i className="fab fa-twitter-square"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-reddit-square"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>

                <div className="col-md-7">
                    <h3>Contact</h3>

                    <form id="contact-form" method="post" action="#" onSubmit={(e) => sendEmail(props, e)} >

                        <div className="messages"></div>
                        <div className="controls">

                            <div className="form-group">
                                <input id="form_name" onMouseDown={() => checkAuth(props)} type="text" name="name" className="form-control" placeholder="Enter your name." required="required" />
                            </div>

                            <div className="form-group">
                                <input id="form_email" onMouseDown={() => checkAuth(props)} type="email" name="email" className="form-control" placeholder="Enter your email." required="required" />
                            </div>

                            <div className="form-group">
                                <textarea id="form_message" onMouseDown={() => checkAuth(props)} name="message" className="form-control" placeholder="Add your message." rows="4" required="required"></textarea>
                            </div>

                            <input type="submit" className="btn btn-outline-light btn-sm" value="Send message" />
                        </div>
                    </form>
                </div>
                <hr className="socket" />
                &copy; ssr-graphql-boilerplate.
        </div>
        </footer>
    </div>
);

export default withRouter(withSession(Footer));
