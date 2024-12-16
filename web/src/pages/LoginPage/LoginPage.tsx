import { Metadata, useMutation } from '@redwoodjs/web'
import { Form, TextField, Label, FieldError, Submit, SubmitHandler, PasswordField } from '@redwoodjs/forms'
import { navigate } from '@redwoodjs/router'
import RootGuard from 'src/components/RootGuard/RootGuard'
import { useState } from 'react'
import Spinner from 'src/components/Spinner/Spinner'
import './LoginPage.css'

const LOGIN_USER = gql`
  mutation UserLoginMutation($input: LoginUser!) {
    loginUser(input: $input) {
      ... on Token {
        token
      }
      ... on Error {
        message
      }
    }
  }
`

interface FormValues {
  email: string
  password: string
}

const LoginPage = () => {
  const [loading, setLoading] = useState(null)
  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      setLoading(false)
      if (data.loginUser.token) {
        localStorage.setItem('token', data.loginUser.token)
        navigate('/resume-upload')
      } else {
        alert(data.loginUser.message)
      }
    },
    onError: (error) => {
      setLoading(false)
      alert(`Unexpected Error: ${error.message}`)
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Send login mutation
    setLoading(true)
    loginUser({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    })
  }

  return (
    <RootGuard>
      {loading ? (
        <Spinner />
      ) : (
        <div className="home">
          <Metadata title="Login" description="Login page" />
          <h1 className="title">Ace Your Application!</h1>
          <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
            <div className="input-wrapper">
              <Label className="login-label" name="email" errorClassName="error">
                Email
              </Label>
              <TextField
                name="email"
                validation={{ required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ }}
                errorClassName="error-field"
                className="field"
              />
              <FieldError name="email" className="error-text" />
            </div>

            <div className="input-wrapper">
              <Label className="login-label" name="password" errorClassName="error">
                Password
              </Label>
              <PasswordField
                name="password"
                validation={{ required: true }}
                errorClassName="error-field"
                className="field"
              />
              <FieldError name="password" className="error-text" />
            </div>

            <div className="separator"></div>
            <Submit data-testid='submit-login' className="button-login">Log In</Submit>
            <div className="separator"></div>
            <button
              type="button"
              className="button-login"
              onClick={() => navigate('/')}
              data-testid="new-user-button"
            >
            New User?
            </button>
          </Form>

        </div>
      )}
    </RootGuard>
  )
}

export default LoginPage
