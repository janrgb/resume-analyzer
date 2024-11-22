// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { Fragment } from 'react';
import { useEffect, useState } from 'react'
import SpinnerAPI from 'src/lib/spinnerAPI';
import './DashboardPage.css'


/* const DashboardPage = () => {
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
  const [data, setData] = useState(null); // Data from SpinnerAPI
  const [loadingFinished, setLoadingFinished] = useState(false); // Track if loading is finished

  // Callback function to handle data after it's fetched
  const handleDataFetched = (fetchedData: any) => {
    setData(fetchedData);
    setLoadingFinished(true); // Set loading as finished after data is fetched
  };

  return (
    <div className="dashboard-container">
      {/* Pass fetchDataCallback to SpinnerAPI */}
      <SpinnerAPI onDataFetched={handleDataFetched} />

      {/* Only show dashboard content after loading has finished */}
      {loadingFinished && (
        <>
        <h1 className="font-bold text-3xl">Resume Analysis Dashboard</h1>
          <div className="section">
            <h2>Resume Fit Score</h2>
            <div className="fit-score-bar">
            <div className="fit-score-fill" style={{ width: `${data?.fitScore || 0}%` }}></div> 
            </div>
            <p className="font-bold text-green-500">{data?.fitScore}% Match</p>
          </div>

          <div className="section">
            <h2>Skills and Keywords Matched</h2>
            <ul>
              {data?.matchedSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Improvement Suggestions</h2>
            <ul>
              {data?.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );

};

export default DashboardPage
