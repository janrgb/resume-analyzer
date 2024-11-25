// import { Link, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'
import {
  Form,
  TextField,
  Label,
  FieldError,
  PasswordField,
  Submit,
  SubmitHandler,
} from '@redwoodjs/forms'
import './RegisterPage.css'
import { navigate } from '@redwoodjs/router'

const REGISTER_USER = gql`
  mutation RegisterUserMutation ($input: RegisterUser!) {
    registerUser(input: $input) {
      code,
      message
    }
  }
`

interface FormValues {
  email: String
  password: String
  confirmpass: String
  username: String
}

const RegisterPage = () => {
  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      const { code, message } = data.registerUser
      if (code === 201){
        // Success
        console.log("here")
        alert(message)
      } else {
        console.log("here")
        alert(`Error: ${message}`)
      }
    },
    onError: (error) => {
      alert(`Unexpected Error: ${error.message}`)
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.password !== data['confirm password']){
      alert('Passwords do not match!')
      return
    }

    // Send a registerUser mutation.
    registerUser({
      variables: {
        input: {
          email: data.email,
          username: data.username,
          password: data.password,
        },
      },
    })
  }

  return (
    <div className="home">
      <Metadata title="Register" description="Register page" />
      <h1 className="title">Ready to Start Acing Your Applications?</h1>
      <br></br>
      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="username" errorClassName="error">
          Username
        </Label>
        <TextField
          name="username"
          validation={{required : true}}
          errorClassName="error-field"
          className="field"
        />
        <FieldError name="username" className="error" />
        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{ required : true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ }}
          errorClassName="error-field"
          className="field"
        />
        <FieldError name="email" className="error" />
        <Label name="password" errorClassName="error">
          Password
        </Label>
        <PasswordField
          name="password"
          validation={{ required : true }}
          errorClassName="error-field"
          className="field"
        />
        <FieldError name="password" className="error" />
        <Label name="confirm password" errorClassName="error">
          Confirm Password
        </Label>
        <PasswordField
          name="confirm password"
          validation={{ required: true }}
          errorClassName="error-field"
          className="field"
        />
        <FieldError name="confirm password" className="error" />
        <div className="separator"></div>
        <Submit className="button">Sign Up</Submit>
        <div className="separator"></div>
        <button
          type="button"
          className="button"
          onClick={() => navigate('/')}
        >
        Returning User?
        </button>
      </Form>
    </div>
  )
}

export default RegisterPage
