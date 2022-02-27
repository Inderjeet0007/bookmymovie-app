import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.svg';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';

const tabStyle = {
    content: {
        top: '50%',
        bottom: 'auto',
        left: '50%',
        right: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const HeaderTabs = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

HeaderTabs.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {

    constructor() {
        super();
        this.state = {
            tabsModalOpen: false,
            value: 0,
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            registerPassword: "",
            contact: "",
            firstnameReq: "renderWarning",
            lastnameReq: "renderWarning",
            usernameReq: "renderWarning",
            emailReq: "renderWarning",
            passwordReq: "renderWarning",
            registerPasswordReq: "renderWarning",
            contactReq: "renderWarning",
            registrationSuccess: false,
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    openModalHandler = () => {
        this.setState({
            tabsModalOpen: true,
            value: 0,
            username: "",
            password: "",
            firstname: "",
            lastname: "",
            email: "",
            registerPassword: "",
            usernameReq: "renderWarning",
            passwordReq: "renderWarning",
            firstnameReq: "renderWarning",
            lastnameReq: "renderWarning",
            emailReq: "renderWarning",
            registerPasswordReq: "renderWarning",
            contactReq: "renderWarning",
            contact: ""
        });
    }

    closeModalHandler = () => {
        this.setState({ tabsModalOpen: false });
    }

    switchTabHandler = (event, value) => {
        this.setState({ value });
    }

    loginHandler = () => {
        this.state.username === "" ? this.setState({ usernameReq: "noWarning" }) : this.setState({ usernameReq: "renderWarning" });
        this.state.password === "" ? this.setState({ passwordReq: "noWarning" }) : this.setState({ passwordReq: "renderWarning" });

        let loginData = null;
        let loginRequest = new XMLHttpRequest();
        let that = this;
        loginRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(JSON.parse(this.responseText).id){
                    sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                    sessionStorage.setItem("access-token", loginRequest.getResponseHeader("access-token"));
                    that.setState({
                        loggedIn: true
                    });
                    that.closeModalHandler();
                }
            }
        });

        loginRequest.open("POST", this.props.endpointBase + "auth/login");
        loginRequest.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.password));
        loginRequest.setRequestHeader("Content-Type", "application/json");
        loginRequest.setRequestHeader("Cache-Control", "no-cache");
        loginRequest.send(loginData);
        
    }

    setUsernameHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    setpasswordHandler = (e) => {
        this.setState({ password: e.target.value });
    }

    registerHandler = () => {
        this.state.firstname === "" ? this.setState({ firstnameReq: "noWarning" }) : this.setState({ firstnameReq: "renderWarning" });
        this.state.lastname === "" ? this.setState({ lastnameReq: "noWarning" }) : this.setState({ lastnameReq: "renderWarning" });
        this.state.email === "" ? this.setState({ emailReq: "noWarning" }) : this.setState({ emailReq: "renderWarning" });
        this.state.registerPassword === "" ? this.setState({ registerPasswordReq: "noWarning" }) : this.setState({ registerPasswordReq: "renderWarning" });
        this.state.contact === "" ? this.setState({ contactReq: "noWarning" }) : this.setState({ contactReq: "renderWarning" });
        
        let signupData = JSON.stringify({
            "email_address": this.state.email,
            "first_name": this.state.firstname,
            "last_name": this.state.lastname,
            "mobile_number": this.state.contact,
            "password": this.state.registerPassword
        });
        let signupRequest = new XMLHttpRequest();
        let that = this;
        signupRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(JSON.parse(this.responseText).id){
                    that.setState({
                        registrationSuccess: true
                    });
                }
                
            }
        });

        signupRequest.open("POST", this.props.endpointBase + "signup");
        signupRequest.setRequestHeader("Content-Type", "application/json");
        signupRequest.setRequestHeader("Cache-Control", "no-cache");
        signupRequest.send(signupData);
    }

    setFirstnameHandler = (e) => {
        this.setState({ firstname: e.target.value });
    }

    setLastnameHandler = (e) => {
        this.setState({ lastname: e.target.value });
    }

    setEmailHandler = (e) => {
        this.setState({ email: e.target.value });
    }

    setRegPasswordHandler = (e) => {
        this.setState({ registerPassword: e.target.value });
    }

    setContactHandler = (e) => {
        this.setState({ contact: e.target.value });
    }

    logoutHandler = (e) => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");

        this.setState({
            loggedIn: false
        });
    }

    render() {
        return (
            <div>
                <header className="header">
                    <img src={logo} className="logo" alt="BookMyMovie Logo" />
                    {!this.state.loggedIn ?
                        <div className="login-btn">
                            <Button variant="contained" color="default" onClick={this.openModalHandler}>Login</Button>
                        </div>
                        :
                        <div className="login-btn">
                            <Button variant="contained" color="default" onClick={this.logoutHandler}>Logout</Button>
                        </div>
                    }
                    {this.props.showBookShowButton === "true" && !this.state.loggedIn
                        ? <div className="bookshow-btn">
                            <Button variant="contained" color="primary" onClick={this.openModalHandler}>Book Show</Button>
                        </div>
                        : ""
                    }

                    {this.props.showBookShowButton === "true" && this.state.loggedIn
                        ? <div className="bookshow-btn">
                            <Link to={"/bookshow/" + this.props.id}>
                                <Button variant="contained" color="primary">Book Show</Button>
                            </Link>
                        </div>
                        : ""
                    }

                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.tabsModalOpen}
                    contentLabel="Login Modal"
                    onRequestClose={this.closeModalHandler}
                    style={tabStyle}
                >
                    <Tabs className="tabs" value={this.state.value} onChange={this.switchTabHandler}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {this.state.value === 0 &&
                        <HeaderTabs>
                            <FormControl required>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.setUsernameHandler} />
                                <FormHelperText className={this.state.usernameReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password} onChange={this.setpasswordHandler} />
                                <FormHelperText className={this.state.passwordReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {this.state.loggedIn === true &&
                                <FormControl>
                                    <span className="successText">
                                        Login Successful!
                                    </span>
                                </FormControl>
                            }
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginHandler}>LOGIN</Button>
                        </HeaderTabs>
                    }

                    {this.state.value === 1 &&
                        <HeaderTabs>
                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.setFirstnameHandler} required/>
                                <FormHelperText className={this.state.firstnameReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.setLastnameHandler} required/>
                                <FormHelperText className={this.state.lastnameReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="text" email={this.state.email} onChange={this.setEmailHandler} required/>
                                <FormHelperText className={this.state.emailReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                <Input id="registerPassword" type="password" registerpassword={this.state.registerPassword} onChange={this.setRegPasswordHandler} required/>
                                <FormHelperText className={this.state.registerPasswordReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                <Input id="contact" type="text" contact={this.state.contact} onChange={this.setContactHandler} required/>
                                <FormHelperText className={this.state.contactReq}>
                                    <span className="required-color">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {this.state.registrationSuccess === true &&
                                <FormControl>
                                    <span className="successText">
                                        Registration Successful. Proceed to Login :)
                                      </span>
                                </FormControl>
                            }
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.registerHandler}>REGISTER</Button>
                        </HeaderTabs>
                    }
                </Modal>
            </div>
        )
    }
}

export default Header;