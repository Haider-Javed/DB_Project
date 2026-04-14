import { useState, useMemo, useEffect } from 'react';
import {
  Aperture, Calendar, Award, Cpu, CheckCircle2,
  Building2, Monitor, Users, ChevronDown, Filter,
  ArrowLeft, Eye, Hash, DollarSign, Database,
  ArrowUpDown, Layers, X, ArrowUp, ArrowDown,
} from 'lucide-react';

// ─── Column definitions ───────────────────────────────────────────────────────
const ALL_COLS = [
  { key: 'competition_name',          label: 'Competition', w: '11%' },
  { key: 'host_university',           label: 'University',  w: '13%' },
  { key: 'typical_venue',             label: 'Venue',       w: '16%' },
  { key: 'recurring_month',           label: 'Month',       w: '10%' },
  { key: 'fee_label',                 label: 'Fee',         w: '14%' },
  { key: 'participation_certificate', label: 'Cert.',       w: '6%'  },
  { key: 'format',                    label: 'Format',      w: '11%' },
  { key: 'is_physical',               label: 'Mode',        w: '8%'  },
  { key: 'programming_languages',     label: 'Languages',   w: '11%' },
];

const LANG_CLR = {
  'C++':    ['#1e3a5f','#60b4ff'],
  'Java':   ['#3a1e1e','#ff7f7f'],
  'Python': ['#1e3a2a','#6dffb0'],
  'C':      ['#2a2a1e','#ffe06d'],
  'C#':     ['#2a1e3a','#c97fff'],
  'Kotlin': ['#3a1e33','#ff8fe8'],
};

const MONTHS = [
  'All','January','Jan / Feb','February','March','March / April',
  'April','April / May','May','June','July','August',
  'September','October','November','December','Dec / Jan',
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const s = {
  row:  { display:'flex', flexDirection:'row', alignItems:'center', flexWrap:'nowrap' },
  col:  { display:'flex', flexDirection:'column' },
  wrap: { display:'flex', flexWrap:'wrap', alignItems:'center' },
  rel:  { position:'relative' },
  abs:  { position:'absolute' },
};

// ─── Cell renderer ────────────────────────────────────────────────────────────
function CellValue({ colKey, row }) {
  const v = row[colKey];

  if (colKey === 'participation_certificate')
    return (
      <span style={{ color: v ? '#6dffb0' : '#ff6d6d', fontWeight: 700, fontSize: 13 }}>
        {v ? '✓ Yes' : '✗ No'}
      </span>
    );

  if (colKey === 'is_physical')
    return (
      <span style={{
        background:'rgba(99,200,255,.12)', border:'1px solid rgba(99,200,255,.3)',
        color:'#63c8ff', borderRadius:20, padding:'2px 9px', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
      }}>
        {v ? 'Physical' : 'Online'}
      </span>
    );

  if (colKey === 'recurring_month')
    return (
      <span style={{
        background:'rgba(99,140,255,.15)', border:'1px solid rgba(99,140,255,.3)',
        color:'#7eaaff', borderRadius:20, padding:'2px 9px', fontSize:11, fontWeight:600, whiteSpace:'nowrap',
      }}>
        {v}
      </span>
    );

  if (colKey === 'programming_languages')
    return (
      <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
        {(v || []).map(l => (
          <span key={l} style={{
            background: LANG_CLR[l]?.[0] ?? '#111',
            color:      LANG_CLR[l]?.[1] ?? '#ccc',
            borderRadius:5, padding:'1px 6px', fontSize:10, fontWeight:700, whiteSpace:'nowrap',
          }}>{l}</span>
        ))}
      </div>
    );

  if (colKey === 'typical_venue')
    return <span style={{ fontSize:12, color:'#8899bb', lineHeight:1.4 }}>{v}</span>;

  if (colKey === 'fee_label')
    return <span style={{ fontSize:12, color:'#a0b8e0' }}>{v}</span>;

  if (colKey === 'competition_name')
    return <span style={{ fontWeight:700, color:'#e8eeff', fontSize:14 }}>{v}</span>;

  return <span style={{ fontSize:13 }}>{v}</span>;
}

// ─── Control button ───────────────────────────────────────────────────────────
function CtrlBtn({ icon: Icon, label, badge, accent, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'6px 12px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap',
      fontWeight:600, fontSize:12, letterSpacing:'0.03em', transition:'all .15s',
      background: active ? 'rgba(99,140,255,.18)' : 'rgba(255,255,255,.05)',
      border: active
        ? '1px solid rgba(99,140,255,.5)'
        : accent
        ? '1px solid rgba(99,140,255,.35)'
        : '1px solid rgba(255,255,255,.12)',
      color: accent || active ? '#7eaaff' : '#c8d4ee',
    }}>
      {Icon && <Icon size={13} />}
      <span>{label}</span>
      {badge != null && (
        <span style={{
          background:'rgba(99,140,255,.25)', color:'#a0c0ff',
          borderRadius:20, padding:'1px 7px', fontSize:10, fontWeight:700,
        }}>
          {badge}
        </span>
      )}
      <ChevronDown size={11} />
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function NationalCompetitions({ onBack }) {
  const [competitions, setCompetitions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState(null);

  const [uniFilter,   setUniFilter]   = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [openDD,      setOpenDD]      = useState(null);
  const [visibleCols, setVisibleCols] = useState(ALL_COLS.map(c => c.key));
  const [limit,       setLimit]       = useState('All');
  const [customLimit, setCustomLimit] = useState('');
  const [orderByCol,  setOrderByCol]  = useState('None');
  const [orderDir,    setOrderDir]    = useState('ASC');
  const [groupByCol,  setGroupByCol]  = useState('None');

  // ── Fetch from backend ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/competitions');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCompetitions(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggle = (dd, e) => { e?.stopPropagation(); setOpenDD(p => p === dd ? null : dd); };

  const universities = ['All', ...new Set(competitions.map(c => c.host_university).filter(Boolean))];
  const activeCols   = ALL_COLS.filter(c => visibleCols.includes(c.key));

  // ── Data pipeline ───────────────────────────────────────────────────────────
  const result = useMemo(() => {
    let data = [...competitions];
    if (uniFilter !== 'All')   data = data.filter(r => r.host_university === uniFilter);
    if (monthFilter !== 'All') data = data.filter(r => r.recurring_month === monthFilter);

    if (groupByCol !== 'None') {
      const seen = new Set();
      data = data.filter(r => {
        const k = String(r[groupByCol]);
        if (seen.has(k)) return false;
        seen.add(k); return true;
      });
    }

    if (orderByCol !== 'None') {
      data = [...data].sort((a, b) => {
        const av = String(a[orderByCol] ?? '');
        const bv = String(b[orderByCol] ?? '');
        return orderDir === 'ASC' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    const n = limit === 'Custom'
      ? (parseInt(customLimit) || data.length)
      : limit === 'All' ? data.length : +limit;
    return data.slice(0, n);
  }, [competitions, uniFilter, monthFilter, orderByCol, orderDir, groupByCol, limit, customLimit]);

  // ── Active filter chips ─────────────────────────────────────────────────────
  const chips = [
    uniFilter !== 'All'   && { label: uniFilter.split(',')[0],     clear: () => setUniFilter('All')   },
    monthFilter !== 'All' && { label: monthFilter,                 clear: () => setMonthFilter('All') },
    orderByCol !== 'None' && { label: `↕ ${ALL_COLS.find(c=>c.key===orderByCol)?.label} ${orderDir}`, clear: () => setOrderByCol('None') },
    groupByCol !== 'None' && { label: `⊞ ${ALL_COLS.find(c=>c.key===groupByCol)?.label}`,             clear: () => setGroupByCol('None') },
  ].filter(Boolean);

  // ── Panel / menu styles ─────────────────────────────────────────────────────
  const panelStyle = {
    ...s.abs, top:'calc(100% + 6px)', left:0, zIndex:300,
    background:'#0b1220', border:'1px solid rgba(255,255,255,.1)',
    borderRadius:10, padding:'10px 14px', minWidth:200,
    boxShadow:'0 14px 50px rgba(0,0,0,.7)',
  };
  const panelTitle = { fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#4455aa', margin:'0 0 8px 0' };
  const menuItem   = (active) => ({
    padding:'8px 12px', fontSize:13,
    color: active ? '#7eaaff' : '#c8d4ee',
    fontWeight: active ? 700 : 400,
    cursor:'pointer', borderRadius:6,
    background: active ? 'rgba(99,140,255,.12)' : 'transparent',
    transition:'background .12s', listStyle:'none',
  });

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#7eaaff', fontFamily:'monospace', fontSize:16 }}>
      ⟳ Loading competitions from database...
    </div>
  );

  if (fetchError) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <span style={{ color:'#ff6b6b', fontSize:16 }}>❌ Failed to load: {fetchError}</span>
      <span style={{ color:'#8899bb', fontSize:13 }}>Make sure your backend is running on <code>http://localhost:5000</code></span>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="app-container dashboard-bg intl-bg" onClick={() => setOpenDD(null)}
      style={{ minHeight:'100vh' }}>
      <div className="star-field" /><div className="bg-glow" />

      {/* Header */}
      <header className="intl-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={14} style={{ marginRight:4 }} /> Back</button>
        <div className="logo center-logo">
          <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
        </div>
        <div className="header-placeholder" />
      </header>

      <main className="intl-main" onClick={e => e.stopPropagation()} style={{ maxWidth:1400 }}>
        <h1 className="intl-title">National Competitions</h1>

        {/* ══ TOOLBAR ══════════════════════════════════════════════════════ */}
        <div style={{
          ...s.row, gap:8, flexWrap:'wrap', marginBottom:14, padding:'10px 14px',
          background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12,
        }}>
          <div style={{ ...s.row, gap:6, color:'#8899bb', fontSize:12, fontWeight:600, marginRight:4 }}>
            <Filter size={13} /><span>Filters</span>
          </div>

          {/* University */}
          <div style={s.rel}>
            <CtrlBtn icon={Building2} label="University" onClick={e => toggle('uni', e)} active={uniFilter !== 'All'} />
            {openDD === 'uni' && (
              <ul style={{ ...panelStyle, padding:'6px 0' }} onClick={e => e.stopPropagation()}>
                {universities.map(u => (
                  <li key={u} style={menuItem(uniFilter === u)}
                    onClick={() => { setUniFilter(u); setOpenDD(null); }}>
                    {u === 'All' ? 'All Universities' : u}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Month */}
          <div style={s.rel}>
            <CtrlBtn icon={Calendar} label="Month" onClick={e => toggle('month', e)} active={monthFilter !== 'All'} />
            {openDD === 'month' && (
              <ul style={{ ...panelStyle, padding:'6px 0', maxHeight:220, overflowY:'auto' }} onClick={e => e.stopPropagation()}>
                {MONTHS.map(m => (
                  <li key={m} style={menuItem(monthFilter === m)}
                    onClick={() => { setMonthFilter(m); setOpenDD(null); }}>
                    {m === 'All' ? 'All Months' : m}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ width:1, height:24, background:'rgba(255,255,255,.08)', margin:'0 4px' }} />

          {/* Order By */}
          <div style={s.rel}>
            <CtrlBtn icon={ArrowUpDown} label="Order By" onClick={e => toggle('order', e)}
              active={orderByCol !== 'None'}
              badge={orderByCol !== 'None' ? `${ALL_COLS.find(c=>c.key===orderByCol)?.label} ${orderDir}` : undefined} />
            {openDD === 'order' && (
              <div style={panelStyle} onClick={e => e.stopPropagation()}>
                <p style={panelTitle}>Order By</p>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 8px' }}>
                  {['None', ...ALL_COLS.map(c=>c.key)].map(k => (
                    <li key={k} style={menuItem(orderByCol === k)}
                      onClick={() => { setOrderByCol(k); if (k==='None') setOpenDD(null); }}>
                      {k === 'None' ? '— None —' : ALL_COLS.find(c=>c.key===k)?.label}
                    </li>
                  ))}
                </ul>
                {orderByCol !== 'None' && (
                  <div style={{ ...s.row, gap:6 }}>
                    {['ASC','DESC'].map(d => (
                      <button key={d} onClick={() => setOrderDir(d)}
                        style={{
                          flex:1, padding:'5px 0', fontSize:11, fontWeight:700, cursor:'pointer', borderRadius:6,
                          background: orderDir===d ? 'rgba(99,140,255,.2)' : 'rgba(255,255,255,.04)',
                          border: orderDir===d ? '1px solid rgba(99,140,255,.45)' : '1px solid rgba(255,255,255,.1)',
                          color: orderDir===d ? '#7eaaff' : '#8899bb',
                        }}>
                        {d === 'ASC' ? '↑ ASC' : '↓ DESC'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Group By */}
          <div style={s.rel}>
            <CtrlBtn icon={Layers} label="Group By" onClick={e => toggle('group', e)}
              active={groupByCol !== 'None'}
              badge={groupByCol !== 'None' ? ALL_COLS.find(c=>c.key===groupByCol)?.label : undefined} />
            {openDD === 'group' && (
              <div style={panelStyle} onClick={e => e.stopPropagation()}>
                <p style={panelTitle}>Group By</p>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {['None', ...ALL_COLS.map(c=>c.key)].map(k => (
                    <li key={k} style={menuItem(groupByCol === k)}
                      onClick={() => { setGroupByCol(k); setOpenDD(null); }}>
                      {k === 'None' ? '— None —' : ALL_COLS.find(c=>c.key===k)?.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ width:1, height:24, background:'rgba(255,255,255,.08)', margin:'0 4px' }} />

          {/* Columns */}
          <div style={s.rel}>
            <CtrlBtn icon={Eye} label="Columns" accent onClick={e => toggle('show', e)}
              badge={`${visibleCols.length}/${ALL_COLS.length}`} />
            {openDD === 'show' && (
              <div style={{ ...panelStyle, right:0, left:'auto' }} onClick={e => e.stopPropagation()}>
                <p style={panelTitle}>Visible Columns</p>
                {ALL_COLS.map(col => (
                  <label key={col.key} style={{ ...s.row, gap:8, padding:'5px 0', cursor:'pointer', fontSize:13, color:'#c8d4ee' }}>
                    <input type="checkbox" checked={visibleCols.includes(col.key)}
                      style={{ accentColor:'#7eaaff', cursor:'pointer' }}
                      onChange={() => setVisibleCols(prev =>
                        prev.includes(col.key) ? prev.filter(k => k !== col.key) : [...prev, col.key]
                      )} />
                    {col.label}
                  </label>
                ))}
                <button onClick={() => setVisibleCols(ALL_COLS.map(c => c.key))}
                  style={{
                    display:'block', width:'100%', marginTop:10, padding:'5px 0',
                    background:'rgba(99,140,255,.12)', border:'1px solid rgba(99,140,255,.25)',
                    borderRadius:6, color:'#7eaaff', fontSize:11, fontWeight:700, cursor:'pointer',
                  }}>
                  Select All
                </button>
              </div>
            )}
          </div>

          {/* Limit */}
          <div style={s.rel}>
            <CtrlBtn icon={Hash} label="Limit" accent onClick={e => toggle('limit', e)}
              badge={limit === 'All' ? '∞' : limit === 'Custom' ? (customLimit || '?') : limit} />
            {openDD === 'limit' && (
              <div style={{ ...panelStyle, right:0, left:'auto', minWidth:160 }} onClick={e => e.stopPropagation()}>
                <p style={panelTitle}>Show Top N Results</p>
                {['5','10','All'].map(opt => (
                  <button key={opt} onClick={() => { setLimit(opt); setOpenDD(null); }}
                    style={{
                      display:'block', width:'100%', padding:'7px 10px', marginBottom:4, textAlign:'left',
                      fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:7, transition:'background .12s',
                      background: limit===opt ? 'rgba(99,140,255,.16)' : 'rgba(255,255,255,.04)',
                      border: limit===opt ? '1px solid rgba(99,140,255,.4)' : '1px solid rgba(255,255,255,.08)',
                      color: limit===opt ? '#7eaaff' : '#c8d4ee',
                    }}>
                    {opt === 'All' ? 'All results' : `Top ${opt}`}
                  </button>
                ))}
                <div style={{ marginTop:6, ...s.col, gap:4 }}>
                  <label style={{ fontSize:10, color:'#5566aa' }}>Custom number</label>
                  <input type="number" min="1" placeholder="Enter number…"
                    value={customLimit}
                    onChange={e => { setCustomLimit(e.target.value); setLimit('Custom'); }}
                    style={{
                      padding:'6px 9px', background:'rgba(255,255,255,.06)',
                      border:'1px solid rgba(255,255,255,.12)', borderRadius:7,
                      color:'#e8eeff', fontSize:12, outline:'none', width:'100%', boxSizing:'border-box',
                    }} />
                </div>
              </div>
            )}
          </div>

          <span style={{ marginLeft:'auto', fontSize:12, color:'#4455aa', whiteSpace:'nowrap' }}>
            {result.length} result{result.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Active chips */}
        {chips.length > 0 && (
          <div style={{ ...s.row, gap:6, flexWrap:'wrap', marginBottom:12 }}>
            {chips.map((chip, i) => (
              <span key={i} style={{
                display:'inline-flex', alignItems:'center', gap:5,
                background:'rgba(99,140,255,.13)', border:'1px solid rgba(99,140,255,.28)',
                color:'#99bbff', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600,
              }}>
                {chip.label}
                <X size={10} style={{ cursor:'pointer', opacity:.7 }} onClick={chip.clear} />
              </span>
            ))}
            <button onClick={() => {
              setUniFilter('All'); setMonthFilter('All');
              setOrderByCol('None'); setGroupByCol('None');
              setLimit('All'); setCustomLimit('');
            }} style={{ background:'transparent', border:'none', color:'#5566aa', fontSize:11, cursor:'pointer', padding:'2px 6px' }}>
              Clear all
            </button>
          </div>
        )}

        {/* ══ TABLE ════════════════════════════════════════════════════════ */}
        <div style={{ overflowX:'auto', width:'100%' }}>
          <div style={{ minWidth:900 }}>

            {/* Header row */}
            <div style={{
              display:'flex', flexDirection:'row', alignItems:'center',
              padding:'8px 16px', borderBottom:'1px solid rgba(255,255,255,.07)',
              fontSize:11, letterSpacing:'0.07em', color:'#8899bb', textTransform:'uppercase',
              background:'rgba(255,255,255,.02)', borderRadius:'8px 8px 0 0',
            }}>
              {activeCols.map(col => (
                <div key={col.key} style={{ flexBasis:col.w, flexShrink:0, flexGrow:0, display:'flex', alignItems:'center', gap:4, paddingRight:10 }}>
                  {col.label}
                  {orderByCol === col.key && (
                    <span style={{ color:'#7eaaff' }}>{orderDir === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {result.length === 0 ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'#4455aa', fontSize:14 }}>
                No competitions match the current filters.
              </div>
            ) : result.map((row, idx) => (
              <div key={row._id || idx}
                style={{
                  display:'flex', flexDirection:'row', alignItems:'center',
                  padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,.05)',
                  background: idx % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent',
                  transition:'background .15s', cursor:'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,140,255,.06)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent'}
              >
                {activeCols.map(col => (
                  <div key={col.key} style={{
                    flexBasis:col.w, flexShrink:0, flexGrow:0,
                    display:'flex', alignItems:'center', flexWrap:'wrap', gap:4,
                    paddingRight:10, overflow:'hidden', color:'#c8d4ee', lineHeight:1.4,
                  }}>
                    <CellValue colKey={col.key} row={row} />
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
}