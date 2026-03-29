import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data: у реальному проєкті ці дані завантажувались би з бекенду (агрегація БД)
const data = [
  { name: '01 Вер', participants: 4 },
  { name: '02 Вер', participants: 13 },
  { name: '03 Вер', participants: 8 },
  { name: '04 Вер', participants: 25 },
  { name: '05 Вер', participants: 18 },
  { name: '06 Вер', participants: 32 },
  { name: '07 Вер', participants: 45 },
];

function Analytics() {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Аналітика реєстрацій</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Цей графік показує динаміку реєстрацій учасників на заходи по днях (Middle рівень).
      </p>

      <div className="card" style={{ height: '400px', padding: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--primary)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-light)' }} 
            />
            <Legend />
            <Line type="monotone" dataKey="participants" name="Учасники" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
