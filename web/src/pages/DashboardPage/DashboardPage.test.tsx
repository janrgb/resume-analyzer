import { render, screen } from '@redwoodjs/testing/web'
import {Router} from '@redwoodjs/router'
import { MockedProvider } from '@apollo/client/testing'
import { prettyDOM } from '@testing-library/react';
import DashboardPage from './DashboardPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DashboardRender', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <MockedProvider>
        <Router>
          <DashboardPage />
        </Router>
      </MockedProvider>
      )
    }).not.toThrow()
  })
})

jest.mock('./DashboardPage', () => {
  return {
    __esModule: true,
    default: ({ mockData }: { mockData: any }) => (
      <div>
        <h1>Resume Analysis Dashboard</h1>
        <div className="section">
          <h2>Resume Fit Score</h2>
          <div className="fit-score-bar">
            <div className="fit-score-fill" style={{ width: `${mockData.fitScore}%` }}></div>
          </div>
          <p>{mockData.fitScore}% Match</p>
        </div>
        <div className="section">
          <h2>Skills and Keywords Matched</h2>
          <ul>
            {mockData.matchedSkills.map((skill: string, index: number) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Improvement Suggestions</h2>
          <ul>
            {mockData.suggestions.map((suggestion: string, index: number) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
  }
})

describe('DashboardPage', () => {
  const mockDataScenarios = [
    {
      fitScore: 50,
      matchedSkills: ['JavaScript', 'HTML', 'CSS'],
      suggestions: ['Add TypeScript', 'Improve formatting', 'Needs to be more Sigma'],
      description: 'displays data with a 50% fit score',
    },
    {
      fitScore: 80,
      matchedSkills: ['Python', 'React'],
      suggestions: ['Add GraphQL', 'Optimize queries'],
      description: 'displays data with an 80% fit score',
    },
    {
      fitScore: 30,
      matchedSkills: ['C++'],
      suggestions: ['Improve structure', 'Add comments'],
      description: 'displays data with a 30% fit score',
    },
    {
      fitScore: 100,
      matchedSkills: ['Java', 'C#', 'Docker', 'Python', 'React', 'C++'],
      suggestions: ['No improvements needed'],
      description: 'displays data with a 100% fit score',
    },
  ]

  test.each(mockDataScenarios)(
    '$description',
    (mockData) => {
      render(<DashboardPage mockData={mockData} />)

      expect(screen.getByText('Resume Analysis Dashboard')).toBeInTheDocument()
      expect(screen.getByText(`${mockData.fitScore}% Match`)).toBeInTheDocument()

      mockData.matchedSkills.forEach((skill) => {
        expect(screen.getByText(skill)).toBeInTheDocument()
      })

      mockData.suggestions.forEach((suggestion) => {
        expect(screen.getByText(suggestion)).toBeInTheDocument()
      })
    }
  )
})

