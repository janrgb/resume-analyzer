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
    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<HomePageState>, snapshot?: any): void {

  }

  handleYesClick() {
    navigate(routes.register())

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
        <div className='separator'></div>
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
      </div>
    )
  }
}


export default HomePage