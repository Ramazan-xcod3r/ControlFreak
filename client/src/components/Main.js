import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CorrectDatatable from './CorrectDatatable';
import IncorrectDatatable from './IncorrectDatatable';
import Upload from './Upload';

export default function Main() {
    return (
        <Router>
            <div className="main">
                <div className="main__container">
                <ul style={{listStyleType:"none"}} className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link  style={{textDecoration:"none"}} className="nav-link" to={"/Upload"}>
                      Upload
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link style={{textDecoration:"none"}} className="nav-link" to={"/CorrectDatatable"}>
                      CorrectDatatable
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" style={{textDecoration:"none"}} to={"/InCorrectDatatable"}>
                      IncorrectDatatable
                    </Link>
                  </li>
                </ul>
                </div>
            </div>
            <Routes>
                <Route exact path="/CorrectDatatable" element={<CorrectDatatable />} />
                <Route path="/IncorrectDatatable" element={<IncorrectDatatable />} />
                <Route path="/Upload" element={<Upload />} />
                <Route path="/" element={<Upload />} />
            </Routes>

        </Router>

    );
}