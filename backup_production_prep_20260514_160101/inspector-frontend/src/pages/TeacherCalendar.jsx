import React from "react";
import { Link } from "react-router-dom";
import InspectorActivitiesTimetable from "../components/InspectorActivitiesTimetable";

export default function TeacherCalendar() {
  return (
    <div className="teacher-calendar-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">My Pedagogical Schedule</h1>
          <p className="page-subtitle">Inspection visits, training sessions, and meetings your inspector has assigned to you.</p>
        </div>
        <Link to="/teacher" className="secondary-link-button">Dashboard</Link>
      </header>

      <InspectorActivitiesTimetable />

      <style dangerouslySetInnerHTML={{ __html: `
        .teacher-calendar-page { max-width: 1400px; margin: 0 auto; }
      `}} />
    </div>
  );
}

