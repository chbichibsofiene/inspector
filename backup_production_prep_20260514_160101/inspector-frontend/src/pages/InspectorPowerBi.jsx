import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPowerBiDataset } from "../api/analytics";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid,
  BarChart, Bar, ComposedChart, Line
} from 'recharts';
import { 
  Activity, FileText, CheckCircle, Clock, Users, BarChart2, Star, TrendingUp 
} from 'lucide-react';
import { useTranslation } from "react-i18next";

// Static constants outside component to avoid re-initialization
const ACTIVITY_TYPE_LIST = [
  'INVITATION_REUNION', 'VISITE_PEDAGOGIQUE', 'INSPECTION', 'FORMATION', 
  'LECON_TEMOIN', 'REUNION_TRAVAIL', 'SEMINAIRE', 'COMMISSION', 'TRAINING'
];

const ANALYTICS_COLORS = [
  '#4f46e5', '#ec4899', '#0ea5e9', '#f59e0b', '#10b981', 
  '#6366f1', '#f43f5e', '#8b5cf6', '#14b8a6', '#f97316'
];

export default function InspectorPowerBi() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("Monthly");
  const [selectedTypes, setSelectedTypes] = useState(['INSPECTION', 'FORMATION', 'VISITE_PEDAGOGIQUE']);

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const response = await getPowerBiDataset();
        if (response.data?.data) {
          console.log("Analytics Keys received:", Object.keys(response.data.data));
          console.log("Regional Data Check:", {
            activities: response.data.data.activitiesByEtablissement,
            teachers: response.data.data.teachersByEtablissement
          });
        }
        const data = response.data?.data || null;
        setAnalytics(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-shell-inner" style={{ textAlign: "center", padding: "5rem" }}>
          <div className="page-title">Loading Analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="app-shell-inner">
          <div className="auth-error">{error}</div>
          <Link className="secondary-link-button" to="/inspector">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const getTimeRangeData = () => {
    let sourceData = {};
    if (timeRange === "Weekly") sourceData = analytics.activitiesOverTimeWeekly;
    else if (timeRange === "Yearly") sourceData = analytics.activitiesOverTimeYearly;
    else sourceData = analytics.activitiesOverTimeMonthly;
    
    return sourceData 
      ? Object.keys(sourceData).sort().map(key => {
          const item = { period: key };
          ACTIVITY_TYPE_LIST.forEach(type => {
            item[type] = sourceData[key][type] || 0;
          });
          return item;
        })
      : [];
  };

  const overTimeData = getTimeRangeData();
  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const typeData = analytics.activitiesByType
    ? Object.keys(analytics.activitiesByType).map(key => ({
        name: key,
        value: analytics.activitiesByType[key]
      }))
    : [];

  const statusData = analytics.reportsByStatus
    ? Object.keys(analytics.reportsByStatus).map(key => ({
        name: key,
        value: analytics.reportsByStatus[key]
      }))
    : [];

  const etabActivityData = analytics.activitiesByEtablissement
    ? Object.keys(analytics.activitiesByEtablissement).map(key => ({
        name: key,
        value: analytics.activitiesByEtablissement[key]
      }))
    : [];

  const etabTeacherData = analytics.teachersByEtablissement
    ? Object.keys(analytics.teachersByEtablissement).map(key => ({
        name: key,
        value: analytics.teachersByEtablissement[key]
      }))
    : [];

  const impactData = analytics.averageScoresOverTime
    ? Object.keys(analytics.averageScoresOverTime).map(month => {
        // Get training count for this month from activitiesOverTimeYearly
        const monthActivities = analytics.activitiesOverTimeYearly?.[month] || {};
        return {
          month,
          avgScore: analytics.averageScoresOverTime[month],
          trainings: monthActivities['FORMATION'] || 0
        };
      })
    : [];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
      {/* Decorative Background Blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(79, 70, 229, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
      <div style={{ position: 'fixed', bottom: '10%', left: '-5%', width: '350px', height: '350px', background: 'rgba(236, 72, 153, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>

      <header className="page-header" style={{ marginBottom: '3rem' }}>
        <div>
          <div className="page-title" style={{ fontSize: '2.8rem' }}>{t("analyticsDashboard")}</div>
          <div className="page-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
            {t("analyticsDesc")}
          </div>
        </div>
        <div className="nav-actions">
          <Link className="secondary-link-button" to="/inspector" style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.4)' }}>
            {t("backToDashboard")}
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        <div className="card highlight-card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, fontSize: '0.7rem' }}>Global Reach</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-dark)', lineHeight: 1.1, marginTop: '0.5rem' }}>{analytics.totalActivities}</div>
              <div className="card-title" style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>{t("totalActivities")}</div>
            </div>
            <div style={{ background: 'var(--primary-soft)', padding: '1rem', borderRadius: '16px' }}>
              <Activity size={32} color="var(--primary)" />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <span className="pill" style={{ fontSize: '0.7rem' }}>{analytics.inspections} Inspections</span>
            <span className="pill" style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.5)' }}>{analytics.trainings} Trainings</span>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #64748b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, fontSize: '0.7rem' }}>Documentation</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1, marginTop: '0.5rem' }}>{analytics.totalReports}</div>
              <div className="card-title" style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>{t("totalReports")}</div>
            </div>
            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '16px' }}>
              <FileText size={32} color="#64748b" />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <span className="badge" style={{ padding: '0.4rem 0.8rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '12px' }}><CheckCircle size={14} style={{marginRight: '4px'}}/> {analytics.finalReports} Final</span>
            <span className="badge" style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '12px' }}><Clock size={14} style={{marginRight: '4px'}}/> {analytics.draftReports} Draft</span>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid #ec4899' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, fontSize: '0.7rem' }}>Quality Index</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#be185d', lineHeight: 1.1, marginTop: '0.5rem' }}>{analytics.averageScore}<span style={{fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500}}>/20</span></div>
              <div className="card-title" style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>{t("averageScore")}</div>
            </div>
            <div style={{ background: '#fce7f3', padding: '1rem', borderRadius: '16px' }}>
              <Star size={32} color="#ec4899" />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="tag premium" style={{ padding: '0.4rem 1rem' }}>High Quality Baseline</div>
          </div>
        </div>

      </div>

      <div className="dashboard-grid">
        
        {/* Main Chart Area */}
        <section className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div>
              <div className="card-title">{t("activityTrends")}</div>
              <div className="card-subtitle">{t("activityTrendsDesc")}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto', borderRadius: '8px' }}
              >
                <option value="Weekly">Weekly (7 Days)</option>
                <option value="Monthly">Monthly (30 Days)</option>
                <option value="Yearly">Yearly (Historical)</option>
              </select>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '1.5rem' }}>
            {/* Sidebar List for Selection */}
            <div style={{ borderRight: '1px solid var(--border-subtle)', paddingRight: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Filter Activities
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ACTIVITY_TYPE_LIST.map((type, idx) => {
                  const isActive = selectedTypes.includes(type);
                  const color = ANALYTICS_COLORS[idx % ANALYTICS_COLORS.length];
                  const count = analytics.activitiesByType?.[type] || 0;
                  
                  return (
                    <div 
                      key={type}
                      onClick={() => toggleType(type)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem', 
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: isActive ? `${color}10` : 'transparent',
                        border: `1px solid ${isActive ? color : 'transparent'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '3px', 
                          backgroundColor: color,
                          opacity: isActive ? 1 : 0.3
                        }}></div>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'var(--text-main)' : 'var(--text-muted)'
                        }}>
                          {type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Area */}
            <div style={{ flex: 1, minHeight: '450px', position: 'relative' }}>
              {overTimeData.length === 0 ? (
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="muted">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height={450}>
                  <AreaChart data={overTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {ACTIVITY_TYPE_LIST.map((type, idx) => (
                        <linearGradient key={`grad-${type}`} id={`color-${type}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ANALYTICS_COLORS[idx % ANALYTICS_COLORS.length]} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={ANALYTICS_COLORS[idx % ANALYTICS_COLORS.length]} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="period" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 500}} 
                      minTickGap={timeRange === 'Weekly' ? 0 : 30}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} 
                      allowDecimals={false}
                      minTickGap={1}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                      }}
                      cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    {ACTIVITY_TYPE_LIST.filter(type => selectedTypes.includes(type)).map((type, idx) => (
                      <Area 
                        key={type}
                        type="monotone" 
                        dataKey={type} 
                        stroke={ANALYTICS_COLORS[ACTIVITY_TYPE_LIST.indexOf(type) % ANALYTICS_COLORS.length]} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill={`url(#color-${type})`} 
                        animationDuration={2500}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* Donut Charts Area */}
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Distribution</div>
              <div className="card-subtitle">Activities and Reports breakdown</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '280px', marginTop: '1rem' }}>
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="tag" style={{marginBottom: '1rem'}}>Activities</span>
              <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                {typeData.length === 0 ? (
                  <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'}} className="muted">No activity data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[index % ANALYTICS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="tag" style={{marginBottom: '1rem'}}>Reports</span>
              <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                {statusData.length === 0 ? (
                  <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'}} className="muted">No report data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[(index + 2) % ANALYTICS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Geographical Distribution Area */}
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Regional Breakdown</div>
              <div className="card-subtitle">Etablissement-based distribution</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '280px', marginTop: '1rem' }}>
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="tag premium" style={{marginBottom: '1rem'}}>Activity Sites</span>
              <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                {etabActivityData.length === 0 ? (
                  <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'}} className="muted">No data found</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={etabActivityData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {etabActivityData.map((entry, index) => <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[(index + 4) % ANALYTICS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="tag premium" style={{marginBottom: '1rem'}}>Staff Density</span>
              <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                {etabTeacherData.length === 0 ? (
                  <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'}} className="muted">No data found</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={etabTeacherData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {etabTeacherData.map((entry, index) => <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[(index + 6) % ANALYTICS_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Teacher Performance Bar Chart Area */}
        <section className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div>
              <div className="card-title">{t("teacherScoreComparison")}</div>
              <div className="card-subtitle">{t("teacherScoreComparisonDesc")}</div>
            </div>
            <BarChart2 size={20} color="var(--primary)" />
          </div>
          <div style={{ width: '100%', height: 300, marginTop: '1.5rem', position: 'relative' }}>
            {(!analytics.teacherPerformance || analytics.teacherPerformance.length === 0) ? (
              <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="muted">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart data={analytics.teacherPerformance.filter(t => t.reportCount > 0).slice(0, 8)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="teacherName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 500}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500}} 
                    domain={[0, 20]}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(79, 70, 229, 0.05)'}}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)'
                    }}
                  />
                  <Bar 
                    dataKey="averageScore" 
                    fill="var(--primary)" 
                    radius={[8, 8, 0, 0]} 
                    barSize={40}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Impact Analysis Section */}
        <section className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div>
              <div className="card-title">{t("pedagogicalImpactAnalysis")}</div>
              <div className="card-subtitle">{t("pedagogicalImpactAnalysisDesc")}</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '2px', background: 'var(--primary-soft)' }}></div>
                <span className="muted">Trainings</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 12, height: 3, background: '#ec4899', borderRadius: '10px' }}></div>
                <span className="muted">Avg Score</span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 350, marginTop: '1.5rem', position: 'relative' }}>
            {impactData.length === 0 ? (
              <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="muted">No impact data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={impactData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} label={{ value: 'Trainings', angle: -90, position: 'insideLeft', offset: 10, fill: 'var(--text-muted)', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} label={{ value: 'Avg Score', angle: 90, position: 'insideRight', offset: 10, fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                  />
                  <Bar yAxisId="left" dataKey="trainings" fill="var(--primary-soft)" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Teachers Table Area */}
        <section className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div>
              <div className="card-title">{t("assignedTeachersPerformance")}</div>
              <div className="card-subtitle">{t("assignedTeachersPerformanceDesc")}</div>
            </div>
            <span className="pill"><Users size={16} /> {analytics.teacherPerformance?.length || 0} Assigned</span>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            {(!analytics.teacherPerformance || analytics.teacherPerformance.length === 0) ? (
              <p className="muted">No assigned teachers found.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Evaluations Conducted</th>
                    <th>Average Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.teacherPerformance.map((teacher) => (
                    <tr key={teacher.teacherId}>
                      <td style={{ fontWeight: 600 }}>{teacher.teacherName}</td>
                      <td>
                        <span className="badge">{teacher.reportCount} Reports</span>
                      </td>
                      <td>
                        {teacher.reportCount > 0 ? (
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <strong>{teacher.averageScore}</strong><span className="muted">/20</span>
                            <div style={{ height: '6px', width: '60px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${(teacher.averageScore/20)*100}%`, background: teacher.averageScore > 15 ? '#10b981' : teacher.averageScore > 10 ? '#f59e0b' : '#ef4444' }}></div>
                            </div>
                          </div>
                        ) : (
                          <span className="muted">-</span>
                        )}
                      </td>
                      <td>
                        {teacher.reportCount === 0 ? (
                          <span className="badge badge-pill">Pending Inspection</span>
                        ) : (
                          <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534'}}>Evaluated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
