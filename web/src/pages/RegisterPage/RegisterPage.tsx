import React from 'react'
import { Component } from 'react'
import './RegisterPage.css'
import { Link, routes } from '@redwoodjs/router'
import { navigate } from '@redwoodjs/router/dist/cjs/history'


interface RegisterPageState {
  email: string
  username: string
  password: string
  confirmPassword: string
}


class HomePage extends Component<{}, RegisterPageState> {
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
    this.handleSignUpClick = this.handleSignUpClick.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
  }


  handleYesClick() {
    navigate(routes.upload())

    location.reload();

  }

  async handleSignUpClick() {

    navigate(routes.register())
    location.reload();

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
    } as Pick<RegisterPageState, keyof RegisterPageState>)
  }


  render(): React.ReactNode {
    return (
      <div className="home">

        <div id="extraField">
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
            <div className='separator'></div>
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