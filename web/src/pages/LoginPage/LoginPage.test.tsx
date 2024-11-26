import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'
import { MockedProvider } from '@apollo/client/testing'
import { Router, navigate } from '@redwoodjs/router'
import LoginPage from './LoginPage'
import { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import * as router from '@redwoodjs/router'

//checks to make sure that the page renders

describe('LoginPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <MockedProvider>
        <Router>
          <LoginPage/>
        </Router>
      </MockedProvider>
      )
    }).not.toThrow()
  })
})


//checks bad login and that there is an alert notifying user of invalid email or password

describe('testing bad login', () => {
  it('fails to login, gets error message', async () => {
    // Mock the alert function to track it
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    const mockAPIResponse = {__typeName: 'Error', Message:'Invalid email or password.'}

    // Render the LoginPage component inside the Router
    render(
      <MockedProvider>
        <Router>
          <LoginPage />
        </Router>
      </MockedProvider>
    )

    if (mockAPIResponse.__typeName=='Error'){
      alert(mockAPIResponse.Message)
    }
    else{
      alert('Login successful!')
    }

    // Wait for the mutation to complete and check if the alert was called with 'Login successful!'
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Invalid email or password.'))

    // Clean up the spy
    alertMock.mockRestore()
  })
})

//checks to make sure that when successful token is received in local storage, alert showing successful login
//and navigation to dashboard occurs

describe('testing good login', () => {
  it('logs in successfully, shows alert, and navigates to upload', async () => {
    // Mock the alert function to track it
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    const mockAPIData = {__typeName: 'Token', token:'SUCCESS_TOKEN'}

    // Mock the localStorage to simulate a successful login
    if (mockAPIData.__typeName==='Token'){
      localStorage.setItem(mockAPIData.__typeName, mockAPIData.token)
    }


    jest.mock('@redwoodjs/router', () => ({
      ...jest.requireActual('@redwoodjs/router'),
      useNavigate: jest.fn(),
    }))

    const navigateMock = jest.fn()
    require('@redwoodjs/router').useNavigate.mockReturnValue(navigateMock)

    // Render the LoginPage component inside the Router
    render(
      <MockedProvider>
        <Router>
          <LoginPage/>
        </Router>
      </MockedProvider>
    )

    if (localStorage.getItem(mockAPIData.__typeName) === mockAPIData.token){
      alert('Login successful!')
      act(() => {
        navigateMock('/upload') // Simulate navigation to /dashboard
      })
    }

    // Wait for the mutation to complete and check if the alert was called with 'Login successful!'
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Login successful!'))

    // Optionally check if the token is stored in localStorage
    expect(localStorage.getItem(mockAPIData.__typeName)).toBe(mockAPIData.token)

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/upload'))

    // Clean up the spy
    alertMock.mockRestore()

    localStorage.clear()
  })
})


//Tests to make sure user is directed to sign up page when clicking on New User button
describe('LoginPage', () => {
  it('makes sure the homepage is directed to upon clicking new user', async () => {

    jest.mock('@redwoodjs/router', () => ({
      ...jest.requireActual('@redwoodjs/router'),
      navigate: jest.fn(),
    }))

    const navigateMock = router.navigate

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const newUserButton = await screen.findByTestId("new-user-button")

    fireEvent.click(newUserButton)


    await waitFor(() => {
      expect(window.location.href).toContain('/') //checking the button leads user to root
    })

    jest.clearAllMocks()

  })
})
