import { useState, useEffect } from "react";
import { 
  getAdminEvaluationAnalytics, 
  getAdminTrends, 
  getRegionAnalytics, 
  getDelegationAnalytics,
  getRegions,
  getDelegations
} from "../api/admin";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  BarChart3, MapPin, Users, TrendingUp, Award, Globe, 
  Filter, CheckCircle, AlertCircle, BookOpen, GraduationCap, Activity,
  Search, ChevronRight
} from "lucide-react";

const GRADIENT_COLORS = ['#4f46e1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const SUBJECTS = [
  { value: "", label: "All Subjects" },
  { value: "MATH", label: "Mathematics" },
  { value: "PHYSICS", label: "Physics" },
  { value: "COMPUTER_SCIENCE", label: "Computer Science" },
  { value: "ENGLISH", label: "English" },
  { value: "FRENCH", label: "French" },
  { value: "ARABIC", label: "Arabic" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "BIOLOGY", label: "Biology" },
  { value: "PHILOSOPHY", label: "Philosophy" },
  { value: "HISTORY_GEOGRAPHY", label: "History & Geography" },
  { value: "ISLAMIC_STUDIES", label: "Islamic Studies" },
  { value: "ECONOMICS", label: "Economics" },
  { value: "ARTS", label: "Arts" },
  { value: "MUSIC", label: "Music" }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: 0, color: p.color, fontSize: '0.8rem', fontWeight: 600 }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatChip = ({ icon, label, value, color, bg }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', background: bg, borderRadius: '14px', border: `1px solid ${color}22` }}>
    <div style={{ color, background: `${color}20`, borderRadius: '10px', padding: '8px', display: 'flex' }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>{value}</p>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{label}</p>
    </div>
  </div>
);

const RankingCard = ({ title, subtitle, icon, iconColor, iconBg, data, nameKey, scoreKey, countKey, badgeIcon, badgeBg, badgeColor }) => (
  <section className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
      <div style={{ background: iconBg, borderRadius: '10px', padding: '8px', color: iconColor }}>{icon}</div>
      <div>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{title}</h2>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{subtitle}</p>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
      {(data || []).map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '80px', background: badgeBg, color: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
              {badgeIcon || i + 1}
            </div>
            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{item[nameKey]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item[countKey]} reports</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: iconColor }}>{item[scoreKey]}/20</span>
          </div>
        </div>
      ))}
      {(!data?.length) && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', opacity: 0.5 }}>
          <AlertCircle size={40} strokeWidth={1} />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>No evaluation data available</p>
        </div>
      )}
    </div>
  </section>
);

export default function AdminAnalytics() {
  const [evaluationData, setEvaluationData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [regions, setRegions] = useState([]);
  const [delegations, setDelegations] = useState([]);
  
  // Filter Options (Real DB Data)
  const [allRegions, setAllRegions] = useState([]);
  const [allDelegationsMaster, setAllDelegationsMaster] = useState([]);
  const [filteredDelegations, setFilteredDelegations] = useState([]);
  
  // Selected Filters
  const [subject, setSubject] = useState("");
  const [regionId, setRegionId] = useState("");
  const [delegationId, setDelegationId] = useState("");
  
  const [loading, setLoading] = useState(true);

  // Load Filter Options from Database
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [regRes, delRes] = await Promise.all([getRegions(), getDelegations()]);
        setAllRegions(regRes.data.data || []);
        setAllDelegationsMaster(delRes.data.data || []);
      } catch (error) {
        console.error("Error loading filter data from database", error);
      }
    };
    loadFilters();
  }, []);

  // Filter Delegations locally when Region changes
  useEffect(() => {
    setDelegationId("");
    if (!regionId) {
      setFilteredDelegations([]);
    } else {
      const filtered = allDelegationsMaster.filter(d => 
        String(d.region?.id) === String(regionId) || String(d.regionId) === String(regionId)
      );
      setFilteredDelegations(filtered);
    }
  }, [regionId, allDelegationsMaster]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [evalRes, trendRes, regRes, delRes] = await Promise.all([
        getAdminEvaluationAnalytics(subject, regionId, delegationId), 
        getAdminTrends(subject, regionId, delegationId),
        getRegionAnalytics(subject),
        getDelegationAnalytics(subject)
      ]);
      setEvaluationData(evalRes.data.data);
      setTrends(trendRes.data.data);
      setRegions(regRes.data.data || []);
      setDelegations(delRes.data.data || []);
    } catch (error) {
      console.error("Error loading analytics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [subject, regionId, delegationId]);

  if (loading && !evaluationData) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#4f46e1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#64748b', fontWeight: 600 }}>Analyzing platform results...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const trendData = trends ? Object.keys(trends.performanceEvolution).sort().map(month => ({
    month,
    score: trends.performanceEvolution[month],
    inspections: trends.inspectionsPerMonth[month] || 0
  })) : [];

  return (
    <div className="admin-page">
      {/* Top Board: Hero + Filters */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Modern Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e1 0%, #7c3aed 100%)',
          borderRadius: '24px', padding: '2.5rem',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 20px 50px rgba(79,70,229,0.25)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', left: '20%', bottom: '-30px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '16px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <BarChart3 size={32} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-1px' }}>Analytics Command Center</h1>
              <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '1rem', fontWeight: 500 }}>Multi-dimensional performance monitoring across Tunisia</p>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Active Filters</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>{subject || "All Subjects"}</span>
                {regionId && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Region ID: {regionId}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Filter Board */}
        <div style={{ 
          background: 'white', borderRadius: '20px', padding: '1.25rem 2rem', 
          display: 'flex', alignItems: 'center', gap: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
          marginTop: '-1rem', zIndex: 10, alignSelf: 'center', width: '90%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px', borderRight: '1px solid #e2e8f0' }}>
            <Filter size={18} color="#64748b" />
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>Global Filters</span>
          </div>

          {/* Subject Filter */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Pedagogical Subject</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', outline: 'none', appearance: 'none' }}
              >
                {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Region Filter */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Geographical Region</label>
            <select 
              value={regionId} 
              onChange={(e) => setRegionId(e.target.value)}
              style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', outline: 'none' }}
            >
              <option value="">All Regions</option>
              {allRegions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {/* Delegation Filter */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Local Delegation</label>
            <select 
              value={delegationId} 
              onChange={(e) => setDelegationId(e.target.value)}
              style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', outline: 'none' }}
              disabled={!regionId}
            >
              <option value="">All Delegations</option>
              {filteredDelegations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <button 
            onClick={() => { setSubject(""); setRegionId(""); setDelegationId(""); }}
            style={{ padding: '10px 16px', borderRadius: '12px', background: '#f1f5f9', border: 'none', color: '#475569', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
            onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Global Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatChip icon={<Globe size={22} />} label="Total Inspections" value={evaluationData?.totalInspections || 0} color="#4f46e1" bg="#f5f3ff" />
        <StatChip icon={<TrendingUp size={22} />} label="Platform Avg Score" value={evaluationData?.averageScore || 0} color="#0ea5e9" bg="#f0f9ff" />
        <StatChip icon={<GraduationCap size={22} />} label="Total Teachers" value={evaluationData?.numberOfTeachers || 0} color="#10b981" bg="#f0fdf4" />
        <StatChip icon={<Users size={22} />} label="Active Inspectors" value={evaluationData?.numberOfInspectors || 0} color="#f59e0b" bg="#fffbeb" />
      </div>

      {/* Ranking Row - Top Performers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <RankingCard 
          title="Top Teachers" 
          subtitle="Highest evaluation averages" 
          icon={<CheckCircle size={18} />} iconColor="#10b981" iconBg="#ecfdf5"
          data={evaluationData?.topPerformingTeachers} nameKey="teacherName" scoreKey="averageScore" countKey="reportCount"
          badgeBg="#dcfce7" badgeColor="#15803d"
        />
        <RankingCard 
          title="Top Regions" 
          subtitle="Top performing areas" 
          icon={<MapPin size={18} />} iconColor="#4f46e1" iconBg="#eef2ff"
          data={evaluationData?.topPerformingRegions} nameKey="name" scoreKey="averageScore" countKey="reportCount"
          badgeBg="#e0e7ff" badgeColor="#4338ca"
        />
        <RankingCard 
          title="Top Delegations" 
          subtitle="Top performing districts" 
          icon={<Award size={18} />} iconColor="#0ea5e9" iconBg="#f0f9ff"
          data={evaluationData?.topPerformingDelegations} nameKey="name" scoreKey="averageScore" countKey="reportCount"
          badgeBg="#e0f2fe" badgeColor="#0369a1"
        />
      </div>

      {/* Secondary Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Performance Evolution */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px', color: '#4f46e1', border: '1px solid #e2e8f0' }}><Activity size={22} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Performance Evolution</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Score trends & inspection volume over time</p>
            </div>
          </div>
          
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 20]} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#4f46e1" strokeWidth={4} fillOpacity={1} fill="url(#scoreGrad)" name="Avg Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Regional Volume */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px', color: '#10b981', border: '1px solid #e2e8f0' }}><MapPin size={22} /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Regional Volume</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Inspection distribution by region</p>
            </div>
          </div>
          <div style={{ height: 310 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regions} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="total" nameKey="region">
                  {regions.map((_, index) => <Cell key={index} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        .card { background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; transition: transform 0.2s, box-shadow 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
      `}} />
    </div>
  );
}
