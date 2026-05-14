import React, { useState, useEffect } from "react";
import { getSystemHealth, getMetricDetails } from "../api/admin";
import { Activity, Shield, HardDrive, Cpu, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SystemHealthCard() {
  const { t } = useTranslation();
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    uptime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const healthRes = await getSystemHealth();
      setHealth(healthRes.data);

      const cpuRes = await getMetricDetails("system.cpu.usage");
      const memRes = await getMetricDetails("jvm.memory.used");
      const uptimeRes = await getMetricDetails("process.uptime");

      setMetrics({
        cpu: (cpuRes.data.measurements[0].value * 100).toFixed(1),
        memory: (memRes.data.measurements[0].value / (1024 * 1024)).toFixed(0),
        uptime: (uptimeRes.data.measurements[0].value / 3600).toFixed(1)
      });
    } catch (error) {
      console.error("Error fetching system health:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  const isUp = health?.status === "UP";

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    marginBottom: '2rem'
  };

  const metricBoxStyle = {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid #f1f5f9',
    flex: 1
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: isUp ? '#dcfce7' : '#fee2e2', 
            color: isUp ? '#15803d' : '#ef4444', 
            padding: '10px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>System Health Monitor</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Real-time backend telemetry</p>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 14px', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: 800,
          background: isUp ? '#dcfce7' : '#fee2e2',
          color: isUp ? '#15803d' : '#b91c1c'
        }}>
          {isUp ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {isUp ? "OPERATIONAL" : "ISSUES DETECTED"}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* CPU */}
        <div style={metricBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '0.75rem' }}>
            <Cpu size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>CPU Usage</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{metrics.cpu}%</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>LOAD</span>
          </div>
          <div style={{ marginTop: '1rem', width: '100%', background: '#e2e8f0', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(metrics.cpu * 2, 100)}%`, background: '#4f46e1', height: '100%', borderRadius: '10px', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* MEMORY */}
        <div style={metricBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '0.75rem' }}>
            <HardDrive size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>JVM Memory</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{metrics.memory}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>MB USED</span>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={12} color="#6366f1" />
            <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE FEED</span>
          </div>
        </div>

        {/* UPTIME */}
        <div style={metricBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '0.75rem' }}>
            <Zap size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>System Uptime</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{metrics.uptime}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>HOURS</span>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
