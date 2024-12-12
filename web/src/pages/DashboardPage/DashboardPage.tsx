import { Metadata, useQuery, useMutation } from '@redwoodjs/web'
import { Fragment, useEffect, useState } from 'react'
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute'
import './DashboardPage.css'
import Spinner from 'src/components/Spinner/Spinner'
import jsPDF from 'jspdf';
// Define a type for mockData to ensure type safety
type MockData = {
  fitScore: number
  matchedSkills: string[]
  feedback: { missing_keywords: string[], suggestions: string[] }
}

// Default mock data if localStorage values are missing
const defaultMockData: MockData = {
  fitScore: 0,
  matchedSkills: ['None'],
  feedback: {
    missing_keywords: ['None'],
    suggestions: ['None']
  },
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

// Call our algorithms for refining the chat-gpt outputs.
export const REFINE_CHATGPT = gql`
  mutation RefineInputMutation($input: ResumeStatistics!) {
    refineInput(input: $input) {
      refined_score
      refined_feedback
      refined_keywords
    }
  }
`

const DashboardPage = () => {
  // Retrieve resumeText and jobDescriptionText from localStorage.
  const resumeText = localStorage.getItem('resumeText') || ''
  const jobDescriptionText = localStorage.getItem('jobDescriptionText') || ''

  // State for mock data and spinner
  const [mockData, setMockData] = useState<MockData>(defaultMockData)
  const [loading, setLoading] = useState(false)

  // refineInput onComplete. Set mockData.
  const [refineInput] = useMutation(REFINE_CHATGPT, {
    onCompleted: (data) => {
      const { refined_score, refined_feedback, refined_keywords } = data.refineInput
      setMockData({
        fitScore: refined_score,
        matchedSkills: refined_keywords,
        feedback: refined_feedback
      })
      setLoading(false)
    },
    onError: (error) => {
      alert(`Unexpected error occurred: ${error.message}`)
      setLoading(false)
    }
  })

  // Only call the query if both resumeText and jobDescriptionText are available
  const { data, error } = useQuery(RETRIEVE_CHATGPT, {
    variables: {
      prompt: {
        resume_text: resumeText || '',
        job_description: jobDescriptionText || '',
      },
    },
    skip: !resumeText || !jobDescriptionText, // Skip the query if values are missing
    onCompleted: (data: any) => {
      const { fit_score = 0, feedback = ['No feedback'], keywords_matched = ['No keywords'] } = data.generateText || {}
      refineInput({
        variables: {
          input: {
            res_text: resumeText,
            job_text: jobDescriptionText,
            raw_score: fit_score,
            raw_feedback: feedback,
            raw_keywords: keywords_matched
          }
        }
      })
    },
    onError: (error: any) => {
      console.error('Query error: ', error)
      setLoading(false)
    },
  })

  useEffect(() => {
    if (resumeText && jobDescriptionText) {
      setLoading(true)
    }
  }, [resumeText, jobDescriptionText])

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
                {mockData.feedback.suggestions.map(
                  (suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  )
                )}
              </ul>
            </div>
            <button
            onClick={() => {
              console.log("Button clicked!"); 
              generatePDF(mockData.fitScore, mockData.matchedSkills, mockData.feedback);
            }}
            className="download-pdf-btn">
            Download PDF Report
            </button>
          </>
        )}
      </div>
    </PrivateRoute>
  )
}

function generatePDF(fitScore, matchedKeywords, feedback) {
  try {
    const doc = new jsPDF();

    doc.text("Resume Analysis Report", 10, 10);
    doc.text(`Fit Score: ${fitScore}%`, 10, 20);

    doc.text("Matched Keywords:", 10, 30);
    if (Array.isArray(matchedKeywords)) {
      matchedKeywords.forEach((keyword, index) => {
        doc.text(`- ${keyword}`, 10, 40 + index * 10);
      });
    }

    doc.text("Feedback:", 10, 60);
    if (Array.isArray(feedback)) {
      feedback.forEach((item, index) => {
        doc.text(`- ${item}`, 10, 70 + index * 10);
      });
    }

    doc.save("Resume_Analysis_Report.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error); 
  }
}
export default DashboardPage
