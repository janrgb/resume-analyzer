import { Metadata, useQuery, useMutation } from '@redwoodjs/web'
import { Fragment, useEffect, useState } from 'react'
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute'
import './DashboardPage.css'
import Spinner from 'src/components/Spinner/Spinner'
import jsPDF from 'jspdf';
import { Meta } from 'react-router-dom'
// Define a type for mockData to ensure type safety
type MockData = {
  fitScore: number
  matchedSkills: string[]
  feedback: { missing_keywords: string[], suggestions: string[] }
}

// Default mock data if localStorage values are missing
const defaultMockData: MockData = {
  fitScore: 75,
  matchedSkills: ['C#', 'Java', 'Python'],
  feedback: {
    missing_keywords: ['None'],
    suggestions: ['Skills improvement: Get better', 'Experience improvement: get more exp', 'Skills improvement: get even better', 'Experience improvement: Get even better']
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

  const [suggestionFilter, setSuggestionFilter] = useState<String>('all')

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
      console.log("Fit score: ", fit_score)
      console.log("Feedback: ", feedback)
      console.log("Keywords: ", keywords_matched)
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
  });

  const setFilter = (e: String) => {
    setSuggestionFilter(e);
  }

  useEffect(() => {
    if (resumeText && jobDescriptionText) {
      setLoading(true)
    }
  }, [resumeText, jobDescriptionText])

  return (
    <PrivateRoute>
      <Metadata title="Resume Analysis" description="Resume analysis page"/>
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
              <div>
              Suggestion Types :
              <select onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="skills">Skills</option>
              <option value="experience">Experience</option>
            </select>
              </div>
              <h2>Improvement Suggestions</h2>
              <ul>
              {mockData.feedback.suggestions
              .filter((suggestion: string) => {
                if (suggestionFilter === 'skills') {
                  return suggestion.startsWith('Skill');
                }
                if (suggestionFilter === 'experience') {
                  return suggestion.startsWith('Experience');
                }
                return true; // If 'all', return all suggestions
              })
              .map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
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

    // Get the current date and time
    const now = new Date();
    const timestamp = now.toLocaleString();

    // Title and separator
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Resume Analysis Report", 105, 20, { align: "center" });

    // Add timestamp in the header (aligned to the far right)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(timestamp, 200, 20, { align: "right" });

    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Fit Score section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Fit Score:", 10, 35);
    doc.setFont("helvetica", "normal");
    doc.text(`${fitScore}%`, 35, 35);

    // Matched Skills section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Matched Skills", 10, 50);
    doc.setFont("helvetica", "normal");
    if (Array.isArray(matchedKeywords) && matchedKeywords.length > 0) {
      doc.setFontSize(12);
      matchedKeywords.forEach((skill, index) => {
        doc.text(`- ${skill}`, 20, 60 + index * 7);
      });
    } else {
      doc.setFontSize(12);
      doc.text("No skills matched.", 20, 55);
    }

    // Feedback section
    const feedbackStartY = 55 + (matchedKeywords.length || 1) * 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Feedback", 10, feedbackStartY);

    if (feedback && (feedback.missing_keywords || feedback.suggestions)) {
      doc.setFontSize(12);

      // Missing Keywords
      let y = feedbackStartY + 8;
      if (Array.isArray(feedback.missing_keywords) && feedback.missing_keywords.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.text("Missing Keywords:", 20, y);
        doc.setFont("helvetica", "normal");
        feedback.missing_keywords.forEach((keyword, index) => {
          doc.text(`- ${keyword}`, 30, y + (index + 1) * 7);
        });
        y += feedback.missing_keywords.length * 10 + 5;
      }

      // Suggestions
      if (Array.isArray(feedback.suggestions) && feedback.suggestions.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.text("Suggestions:", 20, y);
        y += 10;
        feedback.suggestions.forEach((suggestion) => {
          // Wrap long text
          const wrappedText = doc.splitTextToSize(suggestion, 160);
          wrappedText.forEach((line, lineIndex) => {
            const lineText = lineIndex === 0 ? `- ${line}` : `  ${line}`; // Add '-' only to the first line
            doc.text(lineText, 30, y);
            y += 6;
          });
        });
      }
    } else {
      doc.setFontSize(12);
      doc.text("No feedback available.", 20, feedbackStartY + 10);
    }

    // Save the PDF
    doc.save("Resume_Analysis_Report.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

export default DashboardPage
