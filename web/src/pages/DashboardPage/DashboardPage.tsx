import { Metadata, useQuery } from '@redwoodjs/web'
import { Fragment, useState } from 'react'
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute'
import './DashboardPage.css'
import Spinner from 'src/components/Spinner/Spinner'

// Define a type for mockData to ensure type safety
type MockData = {
  fitScore: number
  matchedSkills: string[]
  suggestions: string[]
}

// Default mock data if localStorage values are missing
const defaultMockData: MockData = {
  fitScore: 50,
  matchedSkills: ['JavaScript', 'HTML', 'CSS'],
  suggestions: ['Add TypeScript', 'Improve formatting', 'Needs to Lock In'],
}

// Call openAI API and get the fit score, feedback, and matched keywords.
export const RETRIEVE_CHATGPT = gql`
  query GenerateTextQuery($prompt: ResumeDefinition!) {
    generateText(prompt: $prompt) {
      fit_score
      feedback
      keywords_matched
    }
  }
`

const DashboardPage = () => {
  // Retrieve resumeText and jobDescriptionText from localStorage.
  const resumeText = localStorage.getItem('resumeText')
  const jobDescriptionText = localStorage.getItem('jobDescriptionText')

  // State for mock data
  const [mockData, setMockData] = useState<MockData>(defaultMockData)

  // Only call the query if both resumeText and jobDescriptionText are available
  const { data, loading, error } = useQuery(RETRIEVE_CHATGPT, {
    variables: {
      prompt: {
        resume_text: resumeText || '',
        job_description: jobDescriptionText || '',
      },
    },
    skip: !resumeText || !jobDescriptionText, // Skip the query if values are missing
    onCompleted: (data: any) => {
      console.log('Query complete!: ', data)
      let { fit_score, feedback, keywords_matched } = data.generateText

      if (!fit_score) {
        fit_score = 0
      }

      if (!feedback) {
        feedback = ['No feedback']
      }

      if (!keywords_matched) {
        keywords_matched = ['No keywords']
      }

      setMockData({
        fitScore: fit_score,
        matchedSkills: keywords_matched,
        suggestions: feedback,
      })
    },
    onError: (error: any) => {
      console.error('Query error: ', error)
    },
  })

  return (
    <PrivateRoute>
      <div className="dashboard-container">
        <h1 className="font-bold text-3xl">Resume Analysis Dashboard</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <p>Error loading analysis. Please try again.</p>
        ) : (
          <>
            <div className="section">
              <h2>Resume Fit Score</h2>
              <div className="fit-score-bar">
                <div
                  className="fit-score-fill"
                  style={{ width: `${mockData.fitScore || 0}%` }}
                ></div>
              </div>
              <p className="font-bold text-green-500" data-testid="fit-score">
                {mockData.fitScore}% Match
              </p>
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
                {mockData.suggestions.map(
                  (suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  )
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </PrivateRoute>
  )
}

export default DashboardPage
