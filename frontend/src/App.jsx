import { useState } from 'react';
import { 
  Sparkles, 
  Aperture, 
  ArrowUpRight, 
  Loader2,
  Globe2,
  Flag,
  Users,
  UserCircle,
  Calendar,
  Clock,
  Timer,
  ChevronDown,
  Filter,
  Trophy,
  Code2,
  MonitorPlay,
  Terminal,
  Database
} from 'lucide-react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('signup');

  const handleSignUp = (e) => {
    e.preventDefault();
    setCurrentView('welcome');
  };

  const handleViewCompetitions = () => {
    setCurrentView('competitions');
  };

  const handleViewIntlCompetitions = () => {
    setCurrentView('intl-competitions');
  };

  if (currentView === 'welcome') {
    return (
      <div className="app-container dashboard-bg">
        <div className="bg-glow"></div>
        <div className="star-field"></div>
        
        <main className="welcome-main">
          <div className="logo-box">
            <Aperture className="logo-icon-large" color="#ffffff" />
          </div>

          <div className="status-pill">
            <div className="pulse-dot"></div>
            <span>REAL TIME TRACKING</span>
          </div>

          <h1 className="welcome-title">
            Welcome To <span className="italic">Contest Hub</span>
          </h1>
          
          <p className="welcome-subtitle">
            "The centralized dashboard for competitive programmers to track, filter, and master global coding challenges."
          </p>

          <button className="view-competitions-btn" onClick={handleViewCompetitions}>
            View Competitions <ArrowUpRight className="arrow-icon" />
          </button>

          <div className="social-links">
            <a href="#"><FaTwitter className="social-icon" /></a>
            <span className="separator"></span>
            <a href="#"><FaInstagram className="social-icon" /></a>
            <span className="separator"></span>
            <a href="#"><FaFacebook className="social-icon" /></a>
          </div>
        </main>

        <div className="reconnecting-footer">
          <Loader2 className="spinner-icon" />
          <p><strong>Reconnecting.</strong> Just a moment...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'competitions') {
    return (
      <div className="app-container dashboard-bg">
        <div className="star-field"></div>
        <div className="bg-glow"></div>

        <header className="competitions-header">
          <div className="logo">
            <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
            <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
          </div>
          
          <nav className="comps-nav">
            <a href="#" className="active">Home</a>
            <a href="#">Contests</a>
            <a href="#">Leaderboards</a>
            <a href="#">Problems</a>
            <a href="#" className="profile-link">Profile <UserCircle className="profile-icon" /></a>
          </nav>
        </header>

        <main className="comps-main">
          <div className="comps-hero">
            <h2 className="comps-subtitle">WELCOME TO</h2>
            <h1 className="comps-title">CONTEST HUB</h1>
            <p className="comps-desc">Where logic and programming meet competition.</p>
          </div>

          <div className="comps-grid">
            {/* Card 1 */}
            <div className="comp-card">
              <div className="comp-card-header">
                <Globe2 className="comp-card-icon" />
                <h3>INTERNATIONAL<br/>COMPETITION</h3>
              </div>
              <p>Participate in global coding contests and compete with top programmers worldwide.</p>
              <button className="comp-card-btn" onClick={handleViewIntlCompetitions}>JOIN CONTESTS</button>
            </div>

            {/* Card 2 */}
            <div className="comp-card">
              <div className="comp-card-header">
                <Flag className="comp-card-icon" />
                <h3>NATIONAL<br/>COMPETITION</h3>
              </div>
              <p>Challenge local talent and climb the national leaderboards in diverse algorithmic challenges.</p>
              <button className="comp-card-btn">JOIN CONTESTS</button>
            </div>

            {/* Card 3 */}
            <div className="comp-card">
              <div className="comp-card-header">
                <Users className="comp-card-icon" />
                <h3>MAKE YOUR<br/>OWN TEAM</h3>
              </div>
              <p>Form a coding squad with friends or colleagues for collaborative team contests.</p>
              <button className="comp-card-btn">CREATE TEAM</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  if (currentView === 'intl-competitions') {
    const dummyCompetitions = [
      {
        platform: "Meta",
        name: "Meta Hacker Cup 2026 - Round 2",
        start: "12 Oct, 10:00",
        duration: "3h 00m",
        countdown: "T-minus 05:20:10",
        status: "Upcoming",
        icon: <MonitorPlay className="plat-icon text-blue-400" />
      },
      {
        platform: "Google",
        name: "Google Code Jam - Finals",
        start: "15 Oct, 14:00",
        duration: "4h 00m",
        countdown: "T-minus 03:14:00",
        status: "Upcoming - Register Now",
        icon: <Terminal className="plat-icon text-green-400" />
      },
      {
        platform: "ICPC",
        name: "ICPC World Finals 2026",
        start: "20 Oct, 09:00",
        duration: "5h 00m",
        countdown: "T-minus 08:00:00",
        status: "Upcoming",
        icon: <Globe2 className="plat-icon text-indigo-400" />
      },
      {
        platform: "AtCoder",
        name: "AtCoder Grand Contest 080",
        start: "--",
        duration: "2h 30m",
        countdown: "--",
        status: "Ongoing",
        icon: <Trophy className="plat-icon text-purple-400" />
      },
      {
        platform: "Codeforces",
        name: "Codeforces Round #950 (Div. 1)",
        start: "05 Nov, 17:35",
        duration: "2h 00m",
        countdown: "T-minus 32:00:00",
        status: "Upcoming",
        icon: <Code2 className="plat-icon text-red-400" />
      },
      {
        platform: "Topcoder",
        name: "Topcoder SRM 888",
        start: "--",
        duration: "1h 30m",
        countdown: "--",
        status: "Finished",
        icon: <Database className="plat-icon text-orange-400" />
      },
      {
        platform: "LeetCode",
        name: "LeetCode Weekly Contest 410",
        start: "11 Oct, 08:00",
        duration: "1h 30m",
        countdown: "T-minus 01:10:05",
        status: "Starts Soon",
        icon: <Code2 className="plat-icon text-yellow-500" />
      }
    ];

    return (
      <div className="app-container dashboard-bg intl-bg">
        <div className="star-field"></div>
        <div className="bg-glow"></div>

        <header className="intl-header">
           <button className="back-btn" onClick={() => setCurrentView('competitions')}>
              &larr; Back
           </button>
          <div className="logo center-logo">
            <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
            <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
          </div>
          <div className="header-placeholder"></div>
        </header>

        <main className="intl-main">
          <h1 className="intl-title">International Competitions</h1>
          
          <div className="intl-filters">
            <div className="filter-group">
              <Filter className="filter-icon" />
              <span>Filters:</span>
            </div>
            <div className="filter-dropdowns">
              <div className="dropdown">
                <span>Platform</span>
                <ChevronDown className="dropdown-icon" />
              </div>
              <div className="dropdown">
                <span>Status</span>
                <ChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>

          <div className="comp-list">
            <div className="comp-list-header">
              <div className="col-platform">Platform</div>
              <div className="col-event">Contest Name</div>
              <div className="col-start">Start Time</div>
              <div className="col-duration">Duration</div>
              <div className="col-countdown">Countdown</div>
              <div className="col-action"></div>
            </div>
            
            {dummyCompetitions.map((comp, idx) => (
              <div className="comp-row" key={idx}>
                <div className="col-platform">
                  <div className="plat-icon-wrapper">
                    {comp.icon}
                  </div>
                  <span className="plat-name">{comp.platform}</span>
                </div>
                <div className="col-event">
                  <span className="comp-name">{comp.name}</span>
                  <span className={`comp-status status-${comp.status.toLowerCase().split(' ')[0]}`}>{comp.status}</span>
                </div>
                <div className="col-start">
                  {comp.start !== '--' ? <Calendar className="cell-icon" /> : null}
                  {comp.start}
                </div>
                <div className="col-duration">
                  <Clock className="cell-icon" />
                  {comp.duration}
                </div>
                <div className="col-countdown">
                  {comp.countdown !== '--' ? <Timer className="cell-icon" /> : null}
                  <span className="countdown-text">{comp.countdown}</span>
                </div>
                <div className="col-action">
                  <button className="join-btn">
                    {comp.status === 'Finished' ? 'View Details' : 'Join Contest'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="bg-glow"></div>

      <header>
        <div className="logo">
          <Aperture className="logo-icon" color="#e0e0e0" />
          <span>ContestHUB</span>
        </div>
        
        <div className="nav-links-container">
          <ul className="nav-links">
            <li><a href="#">Calender</a></li>
            <li><a href="#">Platforms</a></li>
            <li><a href="#">Rankings</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <button className="header-btn" type="button">
          <Sparkles className="sparkle" />
          Sign Up
        </button>
      </header>

      <main>
        <div className="signup-pill">
          <Sparkles className="signup-pill-icon" />
          <span>SIGN UP</span>
        </div>

        <h1 className="hero-title">
          Join us <span className="italic">Anytime</span>
        </h1>
        <p className="hero-subtitle">
          Sign up to embark on a new journey
        </p>

        <div className="form-container">
          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Email@example.com" 
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter Password" 
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirm Password" 
              />
            </div>

            <button type="submit" className="submit-btn">
              Sign Up
            </button>

            <a href="#" className="login-link">
              Already have an account?
            </a>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
