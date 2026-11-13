import { useState, useEffect } from 'react';
import { Menu, X, Calendar, MapPin, Users, Award, BookOpen, Mail, ChevronDown, Globe, CheckCircle } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => setShowModal(true);
  const handleYes = () => {
    window.open("https://forms.gle/qdWGK7idbRhGfCjF9", "_blank");
    setShowModal(false);
  };
  const handleNo = () => {
    window.open("mailto:icrcct2026@sairamce.edu.in", "_blank");
    setShowModal(false);
  };
  const handleClose = () => setShowModal(false);

  // Poster download: show both posters side by side in a popup for 10 seconds,
  // then download both automatically. The popup shows lightweight previews;
  // the downloads are the full-resolution originals.
  const POSTERS = [
    {
      title: 'ICRCCT 2026 Conference',
      url: '/images/poster/ICRCCT2026_Poster.png',
      preview: '/images/poster/ICRCCT2026_Poster_preview.jpg',
      filename: 'ICRCCT2026_Poster.png',
      alt: 'ICRCCT 2026 conference poster with important dates, author instructions, coordinators and venue',
    },
    {
      title: 'Pitchathon 2026',
      url: '/images/poster/Pitchathon2026_Poster.png',
      preview: '/images/poster/Pitchathon2026_Poster_preview.jpg',
      filename: 'Pitchathon2026_Poster.png',
      alt: 'Pitchathon poster: event on 9th December 2026, notes, faculty and student coordinators',
    },
  ];
  const POSTER_DELAY_SECONDS = 10;
  const [posterCountdown, setPosterCountdown] = useState<number | null>(null);

  const downloadPoster = () => {
    // Stagger the downloads slightly so browsers don't drop the second one.
    POSTERS.forEach((poster, i) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = poster.url;
        link.download = poster.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, i * 800);
    });
    setPosterCountdown(null);
  };

  const openPosterPopup = () => {
    setIsMenuOpen(false);
    setPosterCountdown(POSTER_DELAY_SECONDS);
  };

  useEffect(() => {
    if (posterCountdown === null) return;
    if (posterCountdown === 0) {
      downloadPoster();
      return;
    }
    const timer = setTimeout(() => setPosterCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [posterCountdown]);

  // Allow closing the poster popup with Escape
  useEffect(() => {
    if (posterCountdown === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPosterCountdown(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [posterCountdown]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about-paper', 'about-pitchathon', 'topics', 'dates'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about-paper', label: 'Paper Presentation' },
    { id: 'about-pitchathon', label: 'Pitchathon' },
    { id: 'topics', label: 'Topics' },
    { id: 'dates', label: 'Important Dates' },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
<nav
  className={`fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <Globe className={`w-8 h-8 ${scrolled ? 'text-blue-600' : 'text-white'}`} />
        <span
          className={`font-bold text-xl ${
            scrolled ? 'text-gray-900' : 'text-white'
          }`}
        >
          ICRCCT 2026
        </span>
      </div>

      {/* Desktop Download Button */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          type="button"
          onClick={openPosterPopup}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            scrolled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          Download Poster
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`transition-colors duration-200 ${
              scrolled
                ? activeSection === item.id
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
                : activeSection === item.id
                ? 'text-white font-semibold'
                : 'text-white/90 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`md:hidden ${scrolled ? 'text-gray-900' : 'text-white'}`}
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden pb-4 bg-white rounded-lg shadow-lg mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {item.label}
          </button>
        ))}

        {/* Mobile Download Button */}
        <button
          type="button"
          onClick={openPosterPopup}
          className="block w-full text-left px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
        >
          📥 Download Poster
        </button>
      </div>
    )}
  </div>
</nav>

      {/* Poster download popup */}
      {posterCountdown !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPosterCountdown(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="ICRCCT 2026 and Pitchathon 2026 posters"
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-y-auto p-3 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPosterCountdown(null)}
              aria-label="Close"
              className="absolute top-2 right-2 z-10 bg-white rounded-full shadow-lg p-1.5 text-gray-600 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Both posters, left and right; stacked on small screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {POSTERS.map((poster) => (
                <figure key={poster.url} className="m-0">
                  <img
                    src={poster.preview}
                    alt={poster.alt}
                    className="w-full h-auto object-contain rounded-lg border border-gray-200"
                  />
                  <figcaption className="text-center text-sm font-semibold text-gray-700 mt-2">
                    {poster.title}
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className="text-center text-sm text-gray-600 mt-3" aria-live="polite">
              Both posters will download automatically.
            </p>

            <div className="flex justify-center gap-4 mt-3">
              <button
                type="button"
                onClick={downloadPoster}
                className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Download both now
              </button>
              <button
                type="button"
                onClick={() => setPosterCountdown(null)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-teal-600 to-blue-800">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 300 + 50 + 'px',
                  height: Math.random() * 300 + 50 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                  animationDelay: Math.random() * 5 + 's',
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              International Conference on<br />
              <span className="text-teal-200">Recent Trends in Computing</span><br />
              <span className="text-teal-200">and Communication Technologies</span><br/>
              <span className="text-base sm:text-lg md:text-xl lg:text-1xl font-semibold">
                Department of Computer Science and Engineering
 In Association with IEEE Computer Society, SSCE, Bangalore
              </span>
            </h1>
            {/* <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <p className="text-2xl sm:text-3xl font-bold text-white">ICRCCT 2026</p>
            </div> */}
            <p className="text-xl sm:text-2xl text-white/95 mb-8 max-w-4xl mx-auto font-light">
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection('about-paper')}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Join Paper Presentation
              </button>
<a
  href="https://forms.gle/qdWGK7idbRhGfCjF9"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block text-center"
>
  Register Now
</a>
            </div>
          </div>


        </div>
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white" />
          </div>
      </section>

      {/* Conference Info Bar */}
      <section className="bg-white shadow-md sticky top-16 z-40">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Calendar className="w-4 h-4 text-blue-600" />
        <div>
          <p className="text-xs text-gray-600">Conference Date</p>
          <p className="text-sm font-semibold text-gray-900">Dec 8 & 9, 2026</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        <div>
          <p className="text-xs text-gray-600">Venue</p>
          <p className="text-sm font-semibold text-gray-900">Seminar Hall, Sri Sairam College of Engineering</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Users className="w-4 h-4 text-blue-600" />
        <div>
          <p className="text-xs text-gray-600">Expected Participants</p>
          <p className="text-sm font-semibold text-gray-900">500+ Global Attendees</p>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* =========================
     About Paper Presentation
========================= */}
<section
  id="about-paper"
  className="relative py-24 bg-gradient-to-br from-white via-blue-50 to-blue-100 overflow-hidden"
>
      <>
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-left space-y-6">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              Research Excellence
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Paper Presentation
              </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to the{" "}
              <strong>International Paper Presentation Conference</strong>, a
              premier platform advancing research and collaboration in
              computer science. Scholars, researchers, and industry experts
              from around the globe converge here to share innovation and
              insight.
              </p>

              <div className="space-y-4">
              {[
                "Present cutting-edge research to a global audience",
                "Network with leading researchers and industry experts",
                "Receive valuable feedback from peer reviewers",
              ].map((text, i) => (
                <div key={i} className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700">{text}</p>
                </div>
              ))}
              <div className="flex items-start space-x-3">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
                <a
                href="mailto:icrcct2026@sairamce.edu.in"
                className="text-blue-700 font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                >
                Mail your paper to: icrcct2026@sairamce.edu.in
                </a>
              </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Register for conference
              </button>


              </div>
            </div>
            


            {/* Right Cards */}
            <div className="animate-fade-in-right">

              <div className="bg-white/80 border border-blue-100 rounded-2xl shadow-md p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Paper Format &amp; Templates</h3>

                <p className="text-gray-700">
                  Please visit the journal websites and download the appropriate paper
                  template. Ensure that your paper follows the prescribed journal format
                  before submission.
                </p>
                <a href="/images/image.png" target="_blank" rel="noopener noreferrer" title="Open full size">
                  <img
                    src="/images/image.png"
                    alt="Author instructions: manuscript preparation, author details, article structure, references, ethics and policies"
                    className="w-full h-auto object-contain rounded-xl border border-gray-200 shadow"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md mx-auto relative">
              
              {/* Close "X" button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
              >
                &times;
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Did you mail the paper and receive the acceptance mail?
              </h3>
              <div className="flex justify-center space-x-6 mt-6">
                <button
                  onClick={handleYes}
                  className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={handleNo}
                  className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-all"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </>
</section>

{/* =========================
     About Pitchathon
========================= */}
<section
  id="about-pitchathon"
  className="relative py-24 bg-gradient-to-br from-white via-purple-50 to-purple-100 overflow-hidden"
>
  {/* Decorative background blobs */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
  <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

  <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left Content */}
      <div className="animate-fade-in-left space-y-6">
        <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
          Event on 9th December 2026
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          About{" "}
          <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Pitchathon
          </span>
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          A <strong>Pitchathon</strong> is a round in which teams present a project,
          idea, or startup concept in a compelling, persuasive way to judges, with
          the goal of making a strong impact.
        </p>

        <div className="space-y-4">
          {[
            "2 members per team",
            "Format: PPT, PDF, URL",
            "Offline presentation",
            "Fee: ₹300 per team",
          ].map((text, i) => (
            <div key={i} className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Cards */}
      <div className="animate-fade-in-right space-y-6">
        {/* Rules & Regulations */}
        <div className="bg-white/80 border border-purple-100 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Rules &amp; Regulations</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Each team must have exactly 2 members.</li>
            <li>Pitches can be submitted as a PPT, PDF, or URL.</li>
            <li>The presentation is offline; teams must present in person at the venue.</li>
            <li>Registration is confirmed only after the entry fee is paid.</li>
            <li>The judges&apos; decision is final.</li>
          </ol>
        </div>

        {/* Entry Fee */}
        <div className="bg-white/80 border border-purple-100 rounded-2xl shadow-md p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Entry Fee</h3>
            <p className="text-gray-600 text-sm">Per team (2 members)</p>
          </div>
          <p className="text-3xl font-extrabold text-purple-700">₹300</p>
        </div>

        {/* Prizes */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Prizes</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { place: "1st Prize", amount: "To be announced" },
              { place: "2nd Prize", amount: "To be announced" },
              { place: "3rd Prize", amount: "To be announced" },
            ].map((p) => (
              <div key={p.place} className="bg-white/15 rounded-xl p-3">
                <Award className="w-7 h-7 mx-auto mb-1" aria-hidden="true" />
                <p className="font-semibold">{p.place}</p>
                <p className="text-sm text-white/90">{p.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="timeline" className="bg-gradient-to-r from-blue-50 to-teal-50 py-20">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-16">Conference Process</h2>

    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Step 1 */}
      <div className="flex flex-col items-center mb-12 md:mb-0 md:w-1/4">
        <div className="bg-white border-4 border-blue-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-blue-600">
          1
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Send Paper</h3>
        <p className="text-gray-600 mt-2">
          Send your paper to the provided Mail ID by November 20, 2026.
        </p>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center mb-12 md:mb-0 md:w-1/4">
        <div className="bg-white border-4 border-green-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-green-600">
          2
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Get Acceptance Mail</h3>
        <p className="text-gray-600 mt-2">
          Receive a confirmation email once your paper is accepted.
        </p>
      </div>

      {/* Step 3 */}
      <div className="flex flex-col items-center mb-12 md:mb-0 md:w-1/4">
        <div className="bg-white border-4 border-yellow-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-yellow-600">
          3
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Register for Conference</h3>
        <p className="text-gray-600 mt-2">
          Complete your registration before the deadline.
        </p>
      </div>

      {/* Step 4 */}
      <div className="flex flex-col items-center md:w-1/4">
        <div className="bg-white border-4 border-purple-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-purple-600">
          4
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Attend the Event</h3>
        <p className="text-gray-600 mt-2">
          Join the conference, present your work, and network with peers.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Topics Section */}
      <section id="topics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Conference Tracks
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Topics & Research Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore cutting-edge research across multiple domains in computing and communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Artificial Intelligence', icon: '🤖', topics: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'AI Ethics'] },
              { title: 'Cloud Computing', icon: '☁️', topics: ['Cloud Architecture', 'Edge Computing', 'Serverless', 'Containerization'] },
              { title: 'Cybersecurity', icon: '🔒', topics: ['Network Security', 'Cryptography', 'Threat Detection', 'Privacy'] },
              { title: 'IoT & Embedded Systems', icon: '📡', topics: ['Smart Devices', 'Sensor Networks', 'Industry 4.0', 'Wearables'] },
              { title: 'Data Science', icon: '📊', topics: ['Big Data Analytics', 'Data Mining', 'Visualization', 'Predictive Analytics'] },
              { title: 'Blockchain', icon: '⛓️', topics: ['Distributed Ledger', 'Smart Contracts', 'Cryptocurrency', 'DeFi'] },
            ].map((track, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-4">{track.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{track.title}</h3>
                <ul className="space-y-2">
                  {track.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates Section for paper Presentation*/}
      <section id="dates" className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Mark Your Calendar
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Important Dates for Paper Presentation</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Stay updated with key deadlines and milestones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Paper Submission', date: 'November 20, 2026', icon: BookOpen },
              { title: 'Notification', date: 'November 25, 2026', icon: Mail },
              { title: 'Registration Deadline', date: 'November 27, 2026', icon: Calendar },
              { title: 'Conference Dates', date: 'December 8 & 9, 2026', icon: Award },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <item.icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-2xl font-bold text-teal-200">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Photo Gallery Section */}
<section id="photos" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Title */}
    <div className="text-center mb-16 animate-fade-in-up">
      <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
Sri Sairam college of Engineering      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
       Leadership Team
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      </p>
    </div>

    {/* Leader Section */}
    <div className="mb-20">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-10"></h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { src: './images/principal.jpg', name: 'Dr. B Shadaksharappa', role: 'Principal' },
          { src: '/images/coo.png', name: 'Dr. R Arun Kumar', role: 'Chief Operating Officer' },
          { src: '/images/hod.png', name: 'Dr. Smitha J A', role: 'Head of Department' },
        ].map((person, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 text-center"
          >
            <img
              src={person.src}
              alt={person.name}
              className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
              <p className="text-white font-bold text-xl">{person.name}</p>
              <p className="text-gray-200 text-sm mt-1">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Coordinators, grouped by event */}
    {[
      {
        event: 'Paper Presentation',
        groups: [
          {
            title: 'Faculty Coordinators',
            people: [
              { src: '/images/mahesh.png', name: 'Dr. Mahesh A', role: 'Professor / CSE' },
              { src: '/images/suguna.jpg', name: 'Prof. Suguna A', role: 'AP / CSE' },
            ],
          },
          {
            title: 'Student Coordinators',
            people: [
              { src: '/images/vijayraman.jpeg', name: 'Vijaya Raman', role: 'Final Year, CSE' },
              { src: '/images/prathish.jpeg', name: 'Pradish A', role: 'Third Year, CSE' },
            ],
          },
        ],
      },
      {
        event: 'Pitchathon',
        groups: [
          {
            title: 'Faculty Coordinators',
            people: [
              { src: '/images/valarmathi.png', name: 'Dr. Valarmathi C', role: 'Faculty Coordinator' },
              { src: '/images/yamuna.png', name: 'Dr. Yamuna V', role: 'Faculty Coordinator' },
            ],
          },
          {
            title: 'Student Coordinators',
            people: [
              { src: '/images/kishore.jpeg', name: 'Kishor K', role: 'Student Coordinator' },
              { src: '/images/kavya.jpeg', name: 'Kavya R A', role: 'Student Coordinator' },
            ],
          },
        ],
      },
    ].map((section) => (
      <div key={section.event} className="mb-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {section.event} Coordinators
        </h3>
        {section.groups.map((group) => (
          <div key={group.title} className="mb-14">
            <h4 className="text-xl font-semibold text-center text-gray-700 mb-8">{group.title}</h4>
            <div className="flex flex-wrap justify-center gap-8">
              {group.people.map((person) => (
                <div
                  key={person.name}
                  className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 text-center w-72"
                >
                  <img
                    src={person.src}
                    alt={person.name}
                    className="w-full h-72 object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                    <p className="text-white font-bold text-lg">{person.name}</p>
                    <p className="text-gray-200 text-sm mt-1">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ))}

{/* {*Photo Gallery Section */}
<section id="photos" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16 animate-fade-in-up">
      <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
        Memories from ICRCCT
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Glimpses of Innovation
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        A look back at the energy, creativity, and collaboration from past events.
      </p>
    </div> 

    {/* Image Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        '/images/gallery/image1.JPG',
        '/images/gallery/image2.JPG',
        '/images/gallery/image3.JPG',
        '/images/gallery/image4.JPG',
        '/images/gallery/image5.JPG',
        '/images/gallery/image6.JPG',
        '/images/gallery/image7.JPG',
        '/images/gallery/image8.JPG',
        '/images/gallery/image9.JPG',
      ].map((src, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
        >
          <img
            src={src}
            alt={`Gallery ${index + 1}`}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <p className="text-white font-semibold text-lg">ICRCCT Moments</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<section
  id="faq"
  className="py-20 bg-gradient-to-br from-teal-50 to-blue-50"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16 animate-fade-in-up">
      <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
        Have Questions?
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Get quick answers about paper submission, registration, and the
        conference.
      </p>
    </div>

    {/* FAQ Items */}
    <div className="max-w-4xl mx-auto space-y-6">
      {[
        {
          q: "What is ICRCCT 2026?",
          a: "It is the International Conference on Recent Trends in Computing and Communication Technologies, organized by the Department of CSE in association with IEEE Computer Society, SSCE, Bangalore.",
        },
        {
          q: "When and where will the conference be held?",
          a: "The event will take place on December 8 & 9, 2026, at the Seminar Hall, Sri Sairam College of Engineering, Anekal, Bengaluru.",
        },
        {
          q: "What are the key areas of paper submission?",
          a: "Communication & Networks, Data Science, Circuits & Systems, Industrial Automation, 5G Networks, Security & Privacy, Computer Vision, Machine Learning / Deep Learning, IoT and more.",
        },
        {
          q: "What are the important dates?",
          a: "Paper Submission: Nov 20, 2026 | Acceptance: Nov 25, 2026 | Registration Deadline: Nov 27, 2026.",
        },
        {
          q: "What are the registration fees?",
          a: "Internal Participants – ₹2000 per paper | External Participants – ₹2500 per paper.",
        },
        {
          q: "Who can I contact for queries?",
          a: "Student Coordinators: Vijaya Raman (Final Year) – +91 82486 99130, Pradish A (Third Year) – +91 99865 92571. Faculty Coordinators: Dr. Mahesh A, Prof. Suguna A. Pitchathon: Kishor K – +91 80723 41053, Kavya R A – +91 78922 80126 (Faculty: Dr. Valarmathi C, Dr. Yamuna V).",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.q}
          </h3>
          <p className="text-gray-600">{item.a}</p>
        </div>
      ))}
    </div>

    {/* WhatsApp Enquiry Link */}
    <div className="text-center mt-12">
      <a
        href="https://chat.whatsapp.com/I9BZPY6cp4VESAHVNKBQ8o"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
      >
Join the Whatsapp for further enquiries (Conference)    </a>
    </div>
    
  </div>
</section>


   </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-8 h-8 text-teal-400" />
                <span className="font-bold text-xl">ICRCCT 2026</span>
              </div>
              <p className="text-gray-400">
                International Conference on Recent Trends in Computing and Communication Technologies
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-400 hover:text-teal-400 transition-colors"
                    >
                      {item.label}
                    </button>
                    
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Organized By</h3>
              <p className="text-gray-400 mb-2">Department of Computer Science & Engineering</p>
              <p className="text-gray-400 mb-2">In association with IEEE Computer Society</p>
              <p className="text-gray-400"></p>
              <p className="text-gray-400">Sri Sairam College of Engineering, Anekal</p>
            <div>
              <h3 className="pt-5 font-bold text-lg mb-4"> Conference Coordinators</h3>
              
              
              <p className="text-gray-400 mb-2">Dr.Mahesh A, Professor/CSE</p>
              <p className="text-gray-400 mb-2">Prof.Suguna A, AP/CSE</p>
            </div>
<div>
              <h3 className="pt-5 font-bold text-lg mb-4"> Students Coordinators(Paper Presentation)</h3>
              <p className="text-gray-400 mb-2">Vijaya Raman - Final year - CSE - +91 82486 99130</p>
              <p className="text-gray-400 mb-2">Pradish A - 3rd year - CSE - +91 99865 92571</p>

            </div>
            <div>
              <h3 className="pt-5 font-bold text-lg mb-4">Pitchathon Coordinators</h3>
              <p className="text-gray-400 mb-2">Dr. Valarmathi C</p>
              <p className="text-gray-400 mb-2">Dr. Yamuna V</p>
              <p className="text-gray-400 mb-2">Kishor K - <a href="tel:+918072341053" className="hover:text-teal-400">+91 80723 41053</a></p>
              <p className="text-gray-400 mb-2">Kavya R A - <a href="tel:+917892280126" className="hover:text-teal-400">+91 78922 80126</a></p>
            </div>
            </div>
                        
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; ICRCCT 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
