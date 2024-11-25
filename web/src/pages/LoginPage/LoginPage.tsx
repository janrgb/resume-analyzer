// import { Link, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'
import {
  Form,
  TextField,
  Label,
  FieldError,
  Submit,
  SubmitHandler,
} from '@redwoodjs/forms'

const LOGIN_USER = gql`
  mutation UserLoginMutation ($input: LoginUser!) {
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
  email: String
  password: String
}

const LoginPage = () => {
  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.loginUser.token) {
        localStorage.setItem('token', data.loginUser.token)
        alert("Login successful!")
      } else {
        alert(data.loginUser.message)
      }
    },
    onError: (error) => {
      alert(`Unexpected Error: ${error.message}`)
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Send a loginUser mutation.
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
    <>
      <Metadata title="Login" description="Login page" />
      <h1>Login</h1>
      <br></br>
      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{required : true}}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />
        <Label name="password" errorClassName="error">
          Password
        </Label>
        <TextField
          name="password"
          validation={{required : true}}
          errorClassName="error"
        />
        <FieldError name="password" className="error" />

        <Submit>Login</Submit>
      </Form>
    </>
  )
}

export default LoginPage
