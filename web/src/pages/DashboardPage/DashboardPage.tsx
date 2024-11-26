// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { Fragment } from 'react';
import { useEffect, useState } from 'react'
import './DashboardPage.css'
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute'

// Define a type for mockData to ensure type safety
type MockData = {
  fitScore: number
  matchedSkills: string[]
  suggestions: string[]
}

// Default mock data
const defaultMockData: MockData = {
  fitScore: 50,
  matchedSkills: ['JavaScript', 'HTML', 'CSS'],
  suggestions: ['Add TypeScript', 'Improve formatting', 'Needs to Lock In'],
}

const DashboardPage = ({ mockData = defaultMockData }: { mockData?: MockData }) => {
    const hasData = mockData && Object.keys(mockData).length > 0;
    return (
      <PrivateRoute>
        <div className="dashboard-container">
          <h1 className="font-bold text-3xl">Resume Analysis Dashboard</h1>
          {hasData ? (
            <>
              <div className="section">
                <h2>Resume Fit Score</h2>
                <div className="fit-score-bar">
                  <div className="fit-score-fill" style={{ width: `${mockData.fitScore || 0}%` }}></div>
                </div>
                <p className="font-bold text-green-500" data-testid="fit-score">{mockData.fitScore}% Match</p>
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
            </>
          ) : (
            <div className="section">
              <p>No data available. Please upload a resume to analyze.</p>
            </div>
          )}
        </div>
      </PrivateRoute>
    );
};
export default DashboardPage;
