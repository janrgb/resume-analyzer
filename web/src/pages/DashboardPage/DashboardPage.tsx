// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { Fragment } from 'react';
import { useEffect, useState } from 'react'
import './DashboardPage.css'
import PrivateRoute from 'src/components/PrivateRoute'


/* const DashboardPage = () => {

const DashboardPage = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Dashboard page" />

      <h1>DashboardPage</h1>
      <p>
        Find me in <code>./web/src/pages/DashboardPage/DashboardPage.tsx</code>
      </p>
      #{
          #My default route is named `dashboard`, link to me with:
          #`<Link to={routes.dashboard()}>Dashboard</Link>`
      #}
    </>
  )
}
*/

const DashboardPage = () => {
  const mockData = {
    fitScore: 50,
    matchedSkills: ['JavaScript', 'HTML', 'CSS'],
    suggestions: ['Add TypeScript', 'Improve formatting', 'Needs to be more Sigma'],
  }

  return (
    <PrivateRoute>
      <div className="dashboard-container">
        {/* Pass fetchDataCallback to SpinnerAPI */}
        <h1 className="font-bold text-3xl">Resume Analysis Dashboard</h1>
          <div className="section">
            <h2>Resume Fit Score</h2>
            <div className="fit-score-bar">
            <div className="fit-score-fill" style={{ width: `${mockData.fitScore || 0}%` }}></div>
            </div>
            <p className="font-bold text-green-500">{mockData.fitScore}% Match</p>
          </div>

          <div className="section">
            <h2>Skills and Keywords Matched</h2>
            <ul>
              {mockData.matchedSkills.map((skill: any, index: number) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Improvement Suggestions</h2>
            <ul>
              {mockData.suggestions.map((suggestion: any, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
      </div>
    </PrivateRoute>
  );

};

export default DashboardPage
