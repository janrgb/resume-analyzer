import React from 'react'
import { Component } from 'react'
import './HomePage.css'
import { Link, routes } from '@redwoodjs/router'
import { navigate } from '@redwoodjs/router/dist/cjs/history'


interface HomePageState {
  email: string
  username: string
  password: string
  confirmPassword: string
}


class HomePage extends Component<{}, HomePageState> {
  constructor(props: {}) {
    super(props)


    this.state = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }


    // Bind event handler methods to this
    this.handleYesClick = this.handleYesClick.bind(this)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleSignUpClick = this.handleSignUpClick.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<HomePageState>, snapshot?: any): void {

  }

  handleYesClick() {
    navigate(routes.upload())

    location.reload();

    const extraField = document.getElementById('extraField')
    extraField.classList.toggle('hidden') // Toggle the 'hidden' class to show or hide the input
  }


  async handleLoginClick() {
    const { email, password } = this.state;


    if (!email || !password) {
        alert('Missing data');
        return;
    }


    const url = '*OUR GRAPHQL LOGIN POST ENDPOINT URL*';


    interface GraphQLResponse {
        data?: {
            token: string;
        };
        errors?: any; // Adjust based on the actual error structure.
    }


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        login(email: "${email}", password: "${password}") {
                            token
                        }
                    }
                `,
            }),
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }


        const responseData: GraphQLResponse = await response.json();


        if (responseData.data && responseData.data.token) {
            localStorage.setItem('token', responseData.data.token);
            alert(`Welcome ${email}!`); // Assuming username is not provided in login.
        } else {
            const errorMessage = responseData.errors?.[0]?.message || 'Invalid login credentials.';
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please check your internet connection and try again.');
    }
}




  async handleSignUpClick() {

    const { email, username, password, confirmPassword } = this.state;


    if (!email || !username || !password || !confirmPassword) {
        alert('Missing data');
        return;
    }


    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }


    const url = '*OUR GRAPHQL REGISTER POST ENDPOINT URL*';


    interface GraphQLResponse {
        data?: {
            message: string;
        };
        errors?: any; // Adjust based on expected error structure.
    }


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation {
                        register(email: "${email}", password: "${password}", username: "${username}") {
                            message
                        }
                    }
                `,
            }),
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }


        const responseData: GraphQLResponse = await response.json();


        if (responseData.data && responseData.data.message === 'User registered') {


          alert(`Welcome ${username}!`);
        } else {
            const errorMessage = responseData.errors?.[0]?.message || 'There has been an issue. Please try again later.';
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please check your internet connection and try again.');
    }
}




  // Generic field change handler
  handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target // Get name and value from the input
    this.setState({
      [name]: value, // Dynamically update the state based on the input's name
    } as Pick<HomePageState, keyof HomePageState>)
  }


  render(): React.ReactNode {
    return (
      <div className="home">
        <p className="title">Ace Your Application!</p>
        <p className="subtext">Login</p>
        <input
          type="text"
          id="email"
          name="email"
          className="field"
          placeholder="Email"
          onChange={this.handleFieldChange}
        />
        <input
          type="password"
          id="password"
          name="password"
          className="field"
          placeholder="Password"
          onChange={this.handleFieldChange}
        />
        <button
          type="button"
          className="button"
          onClick={this.handleLoginClick}
        >
          Login
        </button>
        <div className="separator"></div>
        <button type="button" className="button" onClick={this.handleYesClick}>
          New User?
        </button>


        <div id="extraField" className="hidden">
          <div className="signup">
            <p className="subtext">Sign Up</p>
            <input
              type="text"
              id="SignUpEmail"
              name="email"
              className="field"
              placeholder="Email"
              onChange={this.handleFieldChange}
            />
            <input
              type="text"
              id="username"
              name="username"
              className="field"
              placeholder="Username"
              onChange={this.handleFieldChange}
            />
            <input
              type="password"
              id="SignUpPassword"
              name="password"
              className="field"
              placeholder="Password"
              onChange={this.handleFieldChange}
            />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="field"
              placeholder="Confirm Password"
              onChange={this.handleFieldChange}
            />


            <button
              type="button"
              className="button"
              onClick={this.handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
        </div>


      </div>
    )
  }
}


export default HomePage