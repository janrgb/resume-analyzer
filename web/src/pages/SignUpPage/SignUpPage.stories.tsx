import type { Meta, StoryObj } from '@storybook/react'

import SignUpPage from './SignUpPage'

const meta: Meta<typeof SignUpPage> = {
  component: SignUpPage,
}

export default meta

type Story = StoryObj<typeof SignUpPage>

export const Primary: Story = {}
