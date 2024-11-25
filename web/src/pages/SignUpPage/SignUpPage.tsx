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

const REGISTER_USER = gql`
  mutation RegisterUserMutation ($input: RegisterUser!) {
    registerUser(input: $input) {
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

const SignUpPage = () => {
  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      const { code, message } = data.registerUser

      if (code === 201){
        // Success
        alert(message)
      } else {
        alert(`Error: ${message}`)
      }
    },
    onError: (error) => {
      alert(`Unexpected Error: ${error.message}`)
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.password !== data.confirmpass){
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
    <>
      <Metadata title="SignUp" description="SignUp page" />
      <h1>Sign Up</h1>
      <br></br>
      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
        <Label name="username" errorClassName="error">
          Username
        </Label>
        <TextField
          name="username"
          validation={{required : true}}
          errorClassName="error"
        />
        <FieldError name="username" className="error" />
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
        <Label name="confirmpass" errorClassName="error">
          Confirm Password
        </Label>
        <TextField
          name="confirmpass"
          validation={{required: true}}
          errorClassName="error"
        />
        <FieldError name="confirmpass" className="error" />

        <Submit>Sign Up</Submit>
      </Form>
    </>
  )
}

export default SignUpPage
