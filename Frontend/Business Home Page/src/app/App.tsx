import { useState, useEffect } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Users, Video, BarChart3, Globe, Shield, TrendingUp, Building2, Award, ArrowRight, CheckCircle, Star, TrendingDown, Minus, UserPlus, MessageSquare, Heart, Share2, Briefcase, Target, Lightbulb, TrendingUpIcon } from 'lucide-react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentFounderImage, setCurrentFounderImage] = useState(0);
  const [currentCompanyImage, setCurrentCompanyImage] = useState(0);
  const featuredPlayers = [
    {
      name: "Marcus Silva",
      position: "Forward",
      age: 23,
      country: "Brazil",
      goals: 28,
      assists: 12,
      league: "Serie A",
      club: "AC Milan",
      image: "https://images.unsplash.com/photo-1777529565014-2b0b39d0d250?w=400",
      bio: "Dynamic forward with exceptional pace and clinical finishing. Proven track record in top-flight European football.",
      scoutReview: "Marcus has world-class potential. His movement off the ball is exceptional and he thrives under pressure.",
      scoutName: "Giovanni Rossi",
      scoutTitle: "Chief Scout, Serie A",
      coachQuote: "One of the most dedicated professionals I've worked with. His work rate sets the standard.",
      rating: 4.8,
      marketValue: "€45M",
      previousValue: "€38M",
      valueTrend: "up",
      valueChange: "+€7M",
      dataSource: "Scoutify Analytics",
      lastUpdated: "May 1, 2026",
      hasAgent: false,
      lookingForAgent: true
    },
    {
      name: "Liam O'Connor",
      position: "Midfielder",
      age: 25,
      country: "Ireland",
      goals: 8,
      assists: 15,
      league: "Premier League",
      club: "Leicester City",
      image: "https://images.unsplash.com/photo-1766525155813-e6375a0be54d?w=400",
      bio: "Creative midfielder with excellent vision and passing range. Controls tempo and creates opportunities.",
      scoutReview: "Liam's tactical intelligence is outstanding. He reads the game like a veteran and rarely loses possession.",
      scoutName: "Michael Thompson",
      scoutTitle: "Head Scout, Premier League Clubs",
      coachQuote: "A natural leader on the pitch. His ability to dictate play from midfield is remarkable.",
      rating: 4.6,
      marketValue: "€28M",
      previousValue: "€25M",
      valueTrend: "up",
      valueChange: "+€3M",
      dataSource: "Scoutify Analytics",
      lastUpdated: "May 2, 2026",
      hasAgent: true,
      agentName: "Sarah Mitchell",
      agentCompany: "Elite Sports Management"
    },
    {
      name: "Javier Morales",
      position: "Defender",
      age: 27,
      country: "Spain",
      goals: 3,
      assists: 4,
      league: "La Liga",
      club: "Real Betis",
      image: "https://images.unsplash.com/photo-1641280173256-0ac1b2f4cd78?w=400",
      bio: "Solid central defender with excellent positioning and strong aerial ability. Reliable in high-pressure situations.",
      scoutReview: "Javier is a commanding presence at the back. His reading of the game prevents danger before it develops.",
      scoutName: "Carlos Fernández",
      scoutTitle: "Technical Director, La Liga",
      coachQuote: "Rock-solid defender who never panics. His composure under pressure is exactly what top clubs need.",
      rating: 4.5,
      marketValue: "€22M",
      previousValue: "€22M",
      valueTrend: "stable",
      valueChange: "±€0M",
      dataSource: "Scoutify Analytics",
      lastUpdated: "May 3, 2026",
      hasAgent: true,
      agentName: "Roberto García",
      agentCompany: "ProAgent Internacional"
    },
    {
      name: "Amadou Diallo",
      position: "Goalkeeper",
      age: 29,
      country: "Senegal",
      cleanSheets: 18,
      saves: 156,
      league: "Ligue 1",
      club: "Lyon",
      image: "https://images.unsplash.com/flagged/photo-1550413231-202a9d53a331?w=400",
      bio: "Experienced shot-stopper with incredible reflexes and command of the penalty area. Vocal leader from the back.",
      scoutReview: "Amadou's shot-stopping ability is world-class. His distribution and command of his area make him complete.",
      scoutName: "Pierre Dubois",
      scoutTitle: "Goalkeeper Coach, French Federation",
      coachQuote: "A true professional who inspires confidence in the entire defense. His presence is invaluable.",
      rating: 4.9,
      marketValue: "€35M",
      previousValue: "€32M",
      valueTrend: "up",
      valueChange: "+€3M",
      dataSource: "Scoutify Analytics",
      lastUpdated: "May 1, 2026",
      hasAgent: false,
      lookingForAgent: true
    },
  ];

  const topClubs = [
    { name: "Manchester United", league: "Premier League", country: "England", scouts: 12, lookingFor: "Striker, CB", verified: "official", tier: "Elite" },
    { name: "FC Barcelona", league: "La Liga", country: "Spain", scouts: 15, lookingFor: "Winger, CDM", verified: "official", tier: "Elite" },
    { name: "Bayern Munich", league: "Bundesliga", country: "Germany", scouts: 10, lookingFor: "RB, CAM", verified: "official", tier: "Elite" },
    { name: "Paris Saint-Germain", league: "Ligue 1", country: "France", scouts: 14, lookingFor: "CM, LB", verified: "official", tier: "Elite" },
    { name: "Juventus", league: "Serie A", country: "Italy", scouts: 11, lookingFor: "ST, RW", verified: "official", tier: "Elite" },
    { name: "Ajax Amsterdam", league: "Eredivisie", country: "Netherlands", scouts: 8, lookingFor: "CB, GK", verified: "verified", tier: "Professional" },
    { name: "Sevilla FC", league: "La Liga", country: "Spain", scouts: 7, lookingFor: "LW, DM", verified: "verified", tier: "Professional" },
    { name: "Sporting CP", league: "Primeira Liga", country: "Portugal", scouts: 6, lookingFor: "ST, RB", verified: "verified", tier: "Professional" },
    { name: "FC Porto", league: "Primeira Liga", country: "Portugal", scouts: 9, lookingFor: "CM, CB", verified: "official", tier: "Elite" },
  ];

  const recentActivity = [
    { player: "Diego Martinez", from: "Sevilla", to: "Atletico Madrid", type: "Transfer", time: "2 hours ago", value: "€18M", marketValue: "€20M" },
    { player: "James Wilson", from: "Free Agent", to: "West Ham", type: "Signing", time: "5 hours ago", value: "Free", marketValue: "€12M" },
    { player: "Paolo Rossi", from: "Napoli", to: "AS Roma", type: "Offer Sent", time: "1 day ago", value: "€25M", marketValue: "€23M" },
    { player: "Viktor Petrov", from: "Spartak Moscow", to: "Borussia Dortmund", type: "Transfer", time: "1 day ago", value: "€15M", marketValue: "€16M" },
  ];

  const leagueStats = [
    { league: "Premier League", players: 1247, clubs: 45, agents: 189 },
    { league: "La Liga", players: 1089, clubs: 38, agents: 156 },
    { league: "Serie A", players: 982, clubs: 35, agents: 142 },
    { league: "Bundesliga", players: 876, clubs: 32, agents: 128 },
    { league: "Ligue 1", players: 765, clubs: 28, agents: 115 },
  ];

  const companyImages = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200"
  ];

  const founderImages = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
  ];

  // Auto-rotate company images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompanyImage((prev) => (prev + 1) % companyImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate founder images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFounderImage((prev) => (prev + 1) % founderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const founders = [
    {
      name: "Alexander Chen",
      role: "Co-Founder & CEO",
      bio: "Former professional footballer and sports agent with 15+ years in the industry. Alex played for youth academies in Germany and England before transitioning to player representation. His vision was to democratize access to opportunities for all players, not just those with elite connections.",
      achievements: "Negotiated €200M+ in player transfers • Built networks across 50+ clubs worldwide",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
    },
    {
      name: "Maria Rodriguez",
      role: "Co-Founder & CTO",
      bio: "Data scientist and former football analytics consultant for Premier League clubs. Maria pioneered AI-driven player valuation models that power Scoutify's market analytics. She holds a PhD in Sports Analytics from MIT.",
      achievements: "20+ published papers on sports analytics • Built valuation models for 3 top-tier clubs",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    },
    {
      name: "James Patterson",
      role: "Co-Founder & Chief Scout",
      bio: "Veteran talent scout with 25 years at clubs including Manchester United and Barcelona. James discovered and developed dozens of world-class players. He joined Scoutify to make professional scouting accessible to clubs of all sizes.",
      achievements: "Scouted 15+ international players • Built academy programs for 3 elite clubs",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    }
  ];

  const userReviews = [
    {
      name: "Marcus Silva",
      role: "Professional Forward",
      club: "AC Milan",
      rating: 5,
      review: "Scoutify completely transformed my career. I was playing in lower divisions with no agent representation. Within 3 weeks of joining, I connected with Sarah Mitchell who became my agent, and 2 months later I signed with AC Milan. The platform's market valuation feature helped me understand my true worth.",
      image: "https://images.unsplash.com/photo-1777529565014-2b0b39d0d250?w=200",
      verified: true,
      transfer: "€45M to AC Milan"
    },
    {
      name: "Sarah Mitchell",
      role: "Licensed Sports Agent",
      company: "Elite Sports Management",
      rating: 5,
      review: "As an agent, Scoutify has become my primary tool for discovering talent. The verified player profiles, real-time stats, and market data save me hundreds of hours. I've signed 12 players through the platform and closed 3 major transfers this season alone.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
      verified: true,
      transfer: "12 Players Managed"
    },
    {
      name: "Giovanni Rossi",
      role: "Chief Scout",
      club: "Juventus FC",
      rating: 5,
      review: "The quality of data on Scoutify is exceptional. We discovered our current star striker through the platform's analytics. The ability to filter by performance metrics, watch videos, and see verified scout reviews all in one place is revolutionary for our scouting department.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      verified: true,
      transfer: "5 Signings via Scoutify"
    },
    {
      name: "Liam O'Connor",
      role: "Midfielder",
      club: "Leicester City",
      rating: 5,
      review: "Coming from Ireland, breaking into top leagues seemed impossible. Scoutify gave me visibility I never had. My market value increased €3M in 6 months as my stats were tracked and shared with scouts worldwide. The platform levels the playing field.",
      image: "https://images.unsplash.com/photo-1766525155813-e6375a0be54d?w=200",
      verified: true,
      transfer: "€28M Market Value"
    },
    {
      name: "Michael Thompson",
      role: "Head of Recruitment",
      club: "Manchester United",
      rating: 5,
      review: "Scoutify's network is unmatched. We've signed 5 players discovered through the platform this season. The direct communication with agents, verified profiles, and data-driven insights make it an essential tool for modern football recruitment.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      verified: true,
      transfer: "5 Successful Signings"
    },
    {
      name: "Roberto García",
      role: "Licensed Agent",
      company: "ProAgent Internacional",
      rating: 5,
      review: "The transparency in market valuations builds incredible trust with my players. They can see real-time data backing up the numbers I present. Plus, the verified club network means I'm always connecting with legitimate opportunities.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
      verified: true,
      transfer: "8 Players Represented"
    }
  ];

  const scoutPosts = [
    {
      author: "Michael Thompson",
      role: "Chief Scout",
      club: "Manchester United",
      verified: true,
      time: "3 hours ago",
      content: "Looking for a dynamic winger with pace and technical ability. Age 21-25. Experience in top 5 European leagues preferred. Send profiles to our scouting team.",
      requirements: ["Winger", "21-25 years", "Top 5 Leagues"],
      likes: 42,
      comments: 8
    },
    {
      author: "Carlos Fernández",
      role: "Technical Director",
      club: "FC Barcelona",
      verified: true,
      time: "5 hours ago",
      content: "Impressed by the midfielders in this year's Serie A. Several players showing La Masia-style qualities. Will be attending matches in Milan next week.",
      likes: 156,
      comments: 23
    },
    {
      author: "Sarah Mitchell",
      role: "Head of Recruitment",
      club: "Bayern Munich",
      verified: true,
      time: "1 day ago",
      content: "Our club is hosting an open scouting day on May 15th. Agents with U23 players in Bundesliga 2 or 3. Liga, please register via our portal. Limited spots available.",
      requirements: ["U23", "Bundesliga 2/3. Liga"],
      likes: 89,
      comments: 34
    },
    {
      author: "Giovanni Rossi",
      role: "Talent Scout",
      club: "Juventus",
      verified: true,
      time: "2 days ago",
      content: "Just watched an incredible performance from a 23-year-old striker in Serie B. 2 goals, 1 assist. This is the kind of raw talent we need to nurture. Stats don't tell the whole story.",
      likes: 203,
      comments: 45
    },
  ];

  return (
    <>
      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}
      {showSignUp && <SignUpPage onClose={() => setShowSignUp(false)} />}

      <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Scoutify</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#players" className="text-gray-600 hover:text-gray-900">Players</a>
              <a href="#clubs" className="text-gray-600 hover:text-gray-900">Clubs</a>
              <a href="#agents" className="text-gray-600 hover:text-gray-900">Agents</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#reviews" className="text-gray-600 hover:text-gray-900">Reviews</a>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/flagged/photo-1550413231-202a9d53a331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Football stadium"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect Players, Agents & Teams Worldwide
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect players with agents, showcase talent to top clubs across Premier League, La Liga, Serie A, Bundesliga, and access real-time market valuations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                I'm a Player
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
              >
                I'm an Agent
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
              >
                I'm a Club/Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">5,247</div>
              <div className="text-gray-600 mt-2">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">850</div>
              <div className="text-gray-600 mt-2">Verified Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">320</div>
              <div className="text-gray-600 mt-2">Professional Clubs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">€2.8B</div>
              <div className="text-gray-600 mt-2">Total Market Value</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">120+</div>
              <div className="text-gray-600 mt-2">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Players Section */}
      <section id="players" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Players</h2>
              <p className="text-xl text-gray-600">Top talent from major leagues seeking new opportunities</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredPlayers.map((player, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-64 md:h-auto bg-gray-200 flex-shrink-0">
                    <ImageWithFallback
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {player.league}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-lg flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-sm">{player.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{player.name}</h3>
                        <p className="text-sm text-gray-600">{player.position} • {player.age} years • {player.country}</p>
                        <p className="text-xs text-gray-500 mt-1">{player.club}</p>
                      </div>
                    </div>

                    {/* Market Value Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4 mt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Estimated Market Value</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">{player.marketValue}</span>
                            {player.valueTrend === "up" && (
                              <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-semibold">{player.valueChange}</span>
                              </div>
                            )}
                            {player.valueTrend === "down" && (
                              <div className="flex items-center gap-1 text-red-600">
                                <TrendingDown className="w-4 h-4" />
                                <span className="text-sm font-semibold">{player.valueChange}</span>
                              </div>
                            )}
                            {player.valueTrend === "stable" && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Minus className="w-4 h-4" />
                                <span className="text-sm font-semibold">Stable</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Previous: {player.previousValue} • Updated {player.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Data Source:</span> {player.dataSource} - Based on performance metrics, league position, age, and market trends
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{player.bio}</p>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-4">
                      <p className="text-sm text-gray-700 italic mb-2">"{player.scoutReview}"</p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">{player.scoutName}</span> - {player.scoutTitle}
                      </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-600 p-3 mb-4">
                      <p className="text-sm text-gray-700 italic">"{player.coachQuote}"</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold">Head Coach Review</span>
                      </p>
                    </div>

                    <div className="flex gap-4 mb-4">
                      {player.position === "Goalkeeper" ? (
                        <>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                            <div className="font-bold text-xl text-gray-900">{player.cleanSheets}</div>
                            <div className="text-gray-500 text-xs">Clean Sheets</div>
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                            <div className="font-bold text-xl text-gray-900">{player.saves}</div>
                            <div className="text-gray-500 text-xs">Saves</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                            <div className="font-bold text-xl text-gray-900">{player.goals}</div>
                            <div className="text-gray-500 text-xs">Goals</div>
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                            <div className="font-bold text-xl text-gray-900">{player.assists}</div>
                            <div className="text-gray-500 text-xs">Assists</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Agent Connection Status */}
                    {player.hasAgent ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-600">Represented By</span>
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{player.agentName}</p>
                        <p className="text-xs text-gray-600">{player.agentCompany}</p>
                      </div>
                    ) : player.lookingForAgent ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">Seeking Agent</span>
                          </div>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
                            Connect
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Trends Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Market Insights</h2>
            <p className="text-xl text-gray-600">Real-time player valuations powered by Scoutify Analytics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Rising Stars</h3>
                  <p className="text-sm text-gray-600">Top value increases</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Marcus Silva</p>
                    <p className="text-xs text-gray-600">Forward, 23</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+€7M</p>
                    <p className="text-xs text-gray-600">€45M</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Amadou Diallo</p>
                    <p className="text-xs text-gray-600">Goalkeeper, 29</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+€3M</p>
                    <p className="text-xs text-gray-600">€35M</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Liam O'Connor</p>
                    <p className="text-xs text-gray-600">Midfielder, 25</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+€3M</p>
                    <p className="text-xs text-gray-600">€28M</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Most Valued</h3>
                  <p className="text-sm text-gray-600">By position</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Forwards</p>
                    <p className="text-xs text-gray-600">Avg Market Value</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">€42M</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Goalkeepers</p>
                    <p className="text-xs text-gray-600">Avg Market Value</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">€31M</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Midfielders</p>
                    <p className="text-xs text-gray-600">Avg Market Value</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">€26M</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">League Leaders</h3>
                  <p className="text-sm text-gray-600">By total value</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Premier League</p>
                    <p className="text-xs text-gray-600">1,247 players</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">€892M</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">La Liga</p>
                    <p className="text-xs text-gray-600">1,089 players</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">€745M</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Serie A</p>
                    <p className="text-xs text-gray-600">982 players</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">€612M</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <p>
                <span className="font-semibold">Market valuations updated daily</span> using AI-powered analytics that analyze performance stats, transfer history, age curves, league competitiveness, and real-time market demand from {" "}
                <span className="font-semibold text-blue-600">320+ verified clubs</span> and {" "}
                <span className="font-semibold text-blue-600">850+ professional agents</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Clubs Section */}
      <section id="clubs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Active Clubs</h2>
              <p className="text-xl text-gray-600">Top teams actively scouting for talent</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All Clubs <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Verification Legend */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Official Club</p>
                <p className="text-xs text-gray-600">Verified by federation & league</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Verified Club</p>
                <p className="text-xs text-gray-600">Identity verified by Scoutify</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Elite Tier</p>
                <p className="text-xs text-gray-600">Top-flight professional clubs</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topClubs.map((club, idx) => (
              <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition relative">
                {/* Verification Badge */}
                <div className="absolute -top-3 -right-3">
                  {club.verified === "official" ? (
                    <div className="bg-blue-600 rounded-full p-2 shadow-lg" title="Official Club - Verified by Federation">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="bg-green-600 rounded-full p-2 shadow-lg" title="Verified Club">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-600">{club.league}</p>
                    </div>
                  </div>
                </div>

                {/* Club Tier Badge */}
                <div className="flex items-center gap-2 mb-3">
                  {club.tier === "Elite" && (
                    <>
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                        Elite Tier
                      </span>
                    </>
                  )}
                  {club.tier === "Professional" && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      Professional Tier
                    </span>
                  )}
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-auto">Active</span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-semibold text-gray-900">{club.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Scouts:</span>
                    <span className="font-semibold text-gray-900">{club.scouts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verification:</span>
                    <span className="font-semibold text-gray-900">
                      {club.verified === "official" ? "Official" : "Verified"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 mb-4">
                  <p className="text-gray-600 mb-2 text-sm font-semibold">Currently Looking For:</p>
                  <div className="flex gap-2 flex-wrap">
                    {club.lookingFor.split(', ').map((position, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {position}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Contact Club
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* League Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Coverage Across Major Leagues</h2>
            <p className="text-xl text-gray-600">Our platform spans the world's top football competitions</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {leagueStats.map((league, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">{league.league}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="font-bold text-2xl text-blue-600">{league.players}</div>
                    <div className="text-gray-600">Players</div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-600">{league.clubs} Clubs</span>
                    <span className="text-gray-600">{league.agents} Agents</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Section */}
      <section id="activity" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-xl text-gray-600">Live transfers, signings, and offers happening now</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{activity.player}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-600">{activity.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-blue-600">{activity.to}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          {activity.type}
                        </span>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Transfer Fee</p>
                      <p className="text-lg font-bold text-gray-900">{activity.value}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Market Value</p>
                      <p className="text-sm font-semibold text-blue-600">{activity.marketValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto">
              View All Activity <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Scout & Team Posts Section */}
      <section id="posts" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Scout & Team Updates</h2>
              <p className="text-xl text-gray-600">Latest posts from verified clubs and scouts</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All Posts <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scoutPosts.map((post, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{post.author}</h3>
                      {post.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{post.role}</p>
                    <p className="text-xs text-gray-500">{post.club}</p>
                  </div>
                  <span className="text-xs text-gray-500">{post.time}</span>
                </div>

                <p className="text-gray-700 mb-4">{post.content}</p>

                {post.requirements && (
                  <div className="mb-4 flex gap-2 flex-wrap">
                    {post.requirements.map((req, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {req}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Want to post opportunities?</h3>
            <p className="text-gray-600 mb-4">Verified clubs and scouts can share requirements, updates, and scouting reports</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
              Become a Verified Scout
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools for players, agents, and teams to showcase talent and make meaningful connections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Highlights</h3>
              <p className="text-gray-600">
                Upload and share professional match footage, training videos, and skill demonstrations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Stats</h3>
              <p className="text-gray-600">
                Track and display comprehensive statistics, achievements, and career milestones from big leagues.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Scouting Hub</h3>
              <p className="text-gray-600">
                Clubs can create profiles, post requirements, and connect directly with players and agents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">
                Connect with clubs, scouts, and agents from Premier League, La Liga, Serie A, and 120+ countries.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Player-Agent Connections</h3>
              <p className="text-gray-600">
                Players can connect with verified agents, and agents can manage multiple players and send offers to clubs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Profiles</h3>
              <p className="text-gray-600">
                All agents, players, and clubs are verified to ensure secure and legitimate connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Scoutify</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionizing football recruitment through technology, data, and global connections
            </p>
          </div>

          {/* Company Story with Dynamic Images */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              {companyImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentCompanyImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt="Scoutify team"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {companyImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentCompanyImage ? 'bg-white w-8' : 'bg-white bg-opacity-50'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2023 by former players, agents, and scouts, Scoutify was born from a simple observation:
                talented players worldwide lack access to opportunities, while clubs struggle to discover hidden gems
                outside their traditional networks.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We built Scoutify to democratize football recruitment, providing AI-powered market valuations,
                verified connections, and transparent data to level the playing field for everyone—from aspiring
                players in remote regions to elite clubs seeking the next superstar.
              </p>

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Our Vision</h4>
                  <p className="text-sm text-gray-600">Global football meritocracy</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Innovation</h4>
                  <p className="text-sm text-gray-600">AI-driven insights</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Trust</h4>
                  <p className="text-sm text-gray-600">Verified network</p>
                </div>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Founders</h3>

            <div className="grid md:grid-cols-3 gap-8">
              {founders.map((founder, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition">
                  <div className="relative h-80 bg-gray-200">
                    <ImageWithFallback
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="text-2xl font-bold mb-1">{founder.name}</h4>
                      <p className="text-blue-200">{founder.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{founder.bio}</p>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-blue-600 mb-2">Key Achievements:</p>
                      <p className="text-sm text-gray-600">{founder.achievements}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Values */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Accessibility</h4>
                <p className="text-sm text-gray-600">Making professional football opportunities available to talent everywhere</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Transparency</h4>
                <p className="text-sm text-gray-600">Providing verified data and fair market valuations for all stakeholders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Data-Driven</h4>
                <p className="text-sm text-gray-600">Leveraging AI and analytics to discover and value talent objectively</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Community</h4>
                <p className="text-sm text-gray-600">Building a global network that supports player development and success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Testimonials Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from players, agents, and scouts who've transformed their careers through Scoutify
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userReviews.map((review, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-200">
                    <ImageWithFallback
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{review.role}</p>
                    <p className="text-xs text-gray-500">{review.club || review.company}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>

                {/* Achievement Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">{review.transfer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold text-center mb-12">Platform Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <p className="text-blue-100">User Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">1,234</div>
                <p className="text-blue-100">Successful Transfers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">€2.8B</div>
                <p className="text-blue-100">Total Transfer Value</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">120+</div>
                <p className="text-blue-100">Countries Reached</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Connection CTA */}
      <section id="agents" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                For Agents: Build Your Roster
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Connect with talented players seeking representation. Manage your roster, track market values, and negotiate with clubs worldwide.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Discover Players Seeking Representation</h3>
                    <p className="text-gray-600 text-sm">Browse profiles of players actively looking for agents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Market Valuations</h3>
                    <p className="text-gray-600 text-sm">Track your players' market values with daily updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Direct Club Connections</h3>
                    <p className="text-gray-600 text-sm">Communicate directly with 320+ verified professional clubs</p>
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold">
                Register as Agent
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Players Seeking Agents</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Marcus Silva</p>
                      <p className="text-sm text-gray-600">Forward, 23 • Serie A</p>
                      <p className="text-xs text-blue-600 font-medium">€45M Market Value</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    Connect
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Amadou Diallo</p>
                      <p className="text-sm text-gray-600">Goalkeeper, 29 • Ligue 1</p>
                      <p className="text-xs text-blue-600 font-medium">€35M Market Value</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    Connect
                  </button>
                </div>
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">247 players</span> currently seeking representation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Take Your Career Global?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of players, agents, and clubs using Scoutify to connect, track market values, and discover opportunities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Join as Player
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition border-2 border-white"
            >
              Join as Agent
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition border-2 border-white"
            >
              Join as Club/Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">Scoutify</span>
              </div>
              <p className="text-sm">
                Connecting players with agents and clubs. Real-time market values across all major leagues.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">For Players</a></li>
                <li><a href="#" className="hover:text-white">For Agents</a></li>
                <li><a href="#" className="hover:text-white">For Clubs</a></li>
                <li><a href="#" className="hover:text-white">For Teams</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#reviews" className="hover:text-white">Reviews</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Scoutify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
