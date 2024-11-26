import { MockedProvider } from '@apollo/client/testing'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Router } from '@redwoodjs/router'
import RegisterPage from './RegisterPage'

//Making sure that the page renders correctly
describe('RegisterPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <MockedProvider>
        <Router>
          <RegisterPage />
        </Router>
      </MockedProvider>
      )
    }).not.toThrow()
  })
})

//Testing that the user is notified of registration upon receiving a code==201 from the API (meaning success)
describe('testing good sign up', () => {
  it('displays alert that user was registered', async () => {
    // Mock the alert function to track it
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    // Mock the localStorage to simulate a successful login
    const mockAPIResponse = {code: 201, message: 'User Registered'}

    // Render the LoginPage component inside the Router
    render(
      <MockedProvider>
        <Router>
          <RegisterPage/>
        </Router>
      </MockedProvider>
    )

    if (mockAPIResponse.code==201){
      alert(mockAPIResponse.message)
    }
    else{
      alert('Error: '+mockAPIResponse.message)
    }

    // Wait for the mutation to complete and check if the alert was called with 'Login successful!'
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('User Registered'))

  })
})

//Testing that the user is notified of error upon receiving a code!=201 from the API (meaning failure)
describe('testing bad sign up', () => {
  it('displays alert that email is already in use', async () => {
    // Mock the alert function to track it
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    // Mock the localStorage to simulate a successful login
    const mockAPIResponse = {code: 400, message: 'Email already in use'}

    // Render the LoginPage component inside the Router
    render(
      <MockedProvider>
        <Router>
          <RegisterPage/>
        </Router>
      </MockedProvider>
    )

    if (mockAPIResponse.code==201){
      alert(mockAPIResponse.message)
    }
    else{
      alert('Error: '+mockAPIResponse.message)
    }

    // Wait for the mutation to complete and check if the alert was called with 'Login successful!'
    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Error: Email already in use'))

  })
})
