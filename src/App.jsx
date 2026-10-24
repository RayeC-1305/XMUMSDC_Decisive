import React from "react";
import TransitionWorkspace from "./components/TransitionWorkspace";
import HRPortal from "./components/hr/HRPortal";
import SurveyPage from "./components/hr/SurveyPage";
import "./hr.css";
import "./audience.css";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/hr") return <HRPortal />;
  const survey = path.match(/^\/survey\/([^/]+)$/);
  if (survey) return <SurveyPage token={survey[1]} />;
  if (path === "/survey") return <SurveyPage token="" />;
  return <>
    <nav aria-label="Audience" className="nexus-audience-nav">
      <span>NexusTalent</span>
      <a href="/" aria-current="page">Individual workspace</a>
      <a href="/hr">HR &amp; Employers <span aria-hidden="true">↗</span></a>
    </nav>
    <TransitionWorkspace />
  </>;
}
