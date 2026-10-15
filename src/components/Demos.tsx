import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';

type Task = { id: string; title: string; done: boolean };
const initialTasks: Task[] = [
  { id: 'a', title: 'definir la estructura del proyecto', done: true },
  { id: 'b', title: 'construir una interfaz accesible', done: false },
  { id: 'c', title: 'conectar los datos con la interfaz', done: false },
];

export function TaskDemo() {
  const inputId = useId();
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('elias-nexo-v1') || 'null');
      if (Array.isArray(saved) && saved.length <= 100 && saved.every(t => typeof t?.id === 'string' && typeof t?.title === 'string' && typeof t?.done === 'boolean')) return saved;
    } catch { /* La demo funciona también sin almacenamiento disponible. */ }
    return initialTasks;
  });
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [notice, setNotice] = useState('');
  useEffect(() => { try { localStorage.setItem('elias-nexo-v1', JSON.stringify(tasks)); } catch { setNotice('el almacenamiento no está disponible; los cambios duran esta sesión.'); } }, [tasks]);
  const completed = tasks.filter(t => t.done).length;
  const visible = tasks.filter(t => t.title.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')) && (filter === 'todas' || (filter === 'completadas' ? t.done : !t.done)));
  const add = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || tasks.length >= 100) return;
    setTasks([...tasks, { id: crypto.randomUUID(), title: title.trim(), done: false }]);
    setTitle(''); setFilter('todas'); setQuery(''); setNotice('tarea añadida.');
  };
  return <div className="demo-panel task-demo">
    <div className="demo-topline"><span className="mono-label">nexo / espacio de trabajo</span><span className="demo-status">demo local</span></div>
    <div className="task-summary"><h4>un poco de orden.</h4><span>{completed.toString().padStart(2, '0')}<small> / {tasks.length.toString().padStart(2, '0')} completadas</small></span></div>
    <div className="task-progress" role="progressbar" aria-label="tareas completadas" aria-valuemin={0} aria-valuemax={Math.max(tasks.length, 1)} aria-valuenow={completed}><span style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }} /></div>
    <form className="task-add" onSubmit={add}><label className="sr-only" htmlFor={inputId}>nueva tarea</label><input id={inputId} value={title} onChange={e => setTitle(e.target.value)} placeholder="¿qué sigue?" maxLength={90} required /><button type="submit" aria-label="añadir tarea" disabled={!title.trim() || tasks.length >= 100}>+</button></form>
    <div className="task-tools"><div className="mini-filters">{(['todas', 'pendientes', 'completadas'] as const).map(f => <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}>{f}</button>)}</div><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="buscar…" aria-label="buscar tareas" /></div>
    <ul className="task-list">{visible.map(task => <li key={task.id} className={task.done ? 'task-done' : ''}><label><input type="checkbox" checked={task.done} onChange={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))} /><span>{task.title}</span></label><button aria-label={`eliminar ${task.title}`} onClick={() => { setTasks(tasks.filter(t => t.id !== task.id)); setNotice('tarea eliminada.'); }}>×</button></li>)}</ul>
    {visible.length === 0 && <p className="empty-state">no hay tareas en esta vista.</p>}
    <p className="demo-footnote" role="status">{notice || 'interactúa: añade una tarea y marca tu siguiente avance.'}</p>
  </div>;
}

const sales = [
  { month: 'ene', web: 12400, direct: 7100, ordersWeb: 124, ordersDirect: 62 },
  { month: 'feb', web: 15800, direct: 8400, ordersWeb: 141, ordersDirect: 70 },
  { month: 'mar', web: 14100, direct: 7900, ordersWeb: 130, ordersDirect: 68 },
  { month: 'abr', web: 19200, direct: 9600, ordersWeb: 168, ordersDirect: 81 },
  { month: 'may', web: 22600, direct: 11400, ordersWeb: 191, ordersDirect: 93 },
  { month: 'jun', web: 26100, direct: 12800, ordersWeb: 213, ordersDirect: 104 },
];
const money = (value: number) => new Intl.NumberFormat('es', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export function DataDemo() {
  const [channel, setChannel] = useState('todos');
  const [metric, setMetric] = useState<'ingresos' | 'pedidos'>('ingresos');
  const [active, setActive] = useState(5);
  const data = useMemo(() => sales.map(row => ({
    month: row.month,
    revenue: channel === 'web' ? row.web : channel === 'directo' ? row.direct : row.web + row.direct,
    orders: channel === 'web' ? row.ordersWeb : channel === 'directo' ? row.ordersDirect : row.ordersWeb + row.ordersDirect,
  })), [channel]);
  const total = data.reduce((sum, row) => sum + row.revenue, 0);
  const orders = data.reduce((sum, row) => sum + row.orders, 0);
  const values = data.map(d => metric === 'ingresos' ? d.revenue : d.orders);
  const max = Math.max(...values) * 1.15;
  const growth = ((values[5] / values[0] - 1) * 100).toFixed(1);
  const download = () => {
    const csv = '\uFEFFmes,ingresos_usd,pedidos\r\n' + data.map(d => `${d.month},${d.revenue},${d.orders}`).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `pulso-${channel}-demo.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="demo-panel data-demo">
    <div className="demo-topline"><span className="mono-label">pulso / visión del negocio</span><span className="demo-status">datos sintéticos</span></div>
    <div className="data-controls"><h4>el panorama, claro.</h4><label><span className="sr-only">canal de ventas</span><select value={channel} onChange={e => setChannel(e.target.value)}><option value="todos">todos los canales</option><option value="web">canal web</option><option value="directo">venta directa</option></select></label></div>
    <div className="metrics" aria-live="polite"><div><span>ingresos</span><strong>{money(total)}</strong></div><div><span>pedidos</span><strong>{orders.toLocaleString('es')}</strong></div><div><span>ticket medio</span><strong>{money(total / orders)}</strong></div></div>
    <div className="chart-toolbar"><div className="mini-filters"><button aria-pressed={metric === 'ingresos'} onClick={() => setMetric('ingresos')}>ingresos</button><button aria-pressed={metric === 'pedidos'} onClick={() => setMetric('pedidos')}>pedidos</button></div><span>ene — jun · +{growth.replace('.', ',')}%</span></div>
    <div className="bar-chart" aria-label={`${metric} mensuales por canal ${channel}`}>
      <div className="chart-grid" aria-hidden="true"><i /><i /><i /><i /></div>
      {data.map((row, i) => <button key={row.month} className={`chart-column ${i === active ? 'active' : ''}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-label={`${row.month}: ${metric === 'ingresos' ? money(row.revenue) : `${row.orders} pedidos`}`} aria-pressed={i === active}><span className="bar-track"><span className="chart-bar" style={{ height: `${values[i] / max * 100}%` }} /></span><span className="month-label">{row.month}</span></button>)}
    </div>
    <div className="chart-caption"><span aria-live="polite">{data[active].month} <strong>{metric === 'ingresos' ? money(data[active].revenue) : `${data[active].orders} pedidos`}</strong></span><button onClick={download}>descargar datos ↓</button></div>
    <p className="demo-footnote">muestra ilustrativa · usd · explora cada mes con el cursor o el teclado.</p>
  </div>;
}
