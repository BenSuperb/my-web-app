import { supabase } from '/lib/supabaseClients'

type DataCenter = {
  id: string
  name: string
  temperature: number
  humidity: number
  water_leak: boolean
  updated_at: string
}

export default async function DashboardPage() {
  const { data, error } = await supabase
    .from('data_centers')
    .select('*')
    .order('name')

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-red-600 shadow-sm">
          <h2 className="text-lg font-semibold">Error loading data centers</h2>
          <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-blue-900">
          Factory Data Center Monitoring
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Real-time environmental status overview
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map(dc => (
          <DataCenterCard key={dc.id} dc={dc} />
        ))}
      </div>
    </div>
  )
}

function DataCenterCard({ dc }: { dc: DataCenter }) {
  const status = getStatus(dc)

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800">{dc.name}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>🌡 <span className="font-medium text-slate-800">{dc.temperature}°C</span> Temperature</p>
        <p>💧 <span className="font-medium text-slate-800">{dc.humidity}%</span> Humidity</p>
        <p>
          🚨 Water Leak:{' '}
          <span className={`font-medium ${dc.water_leak ? 'text-red-600' : 'text-emerald-600'}`}>
            {dc.water_leak ? 'Detected' : 'Normal'}
          </span>
        </p>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Last update: {new Date(dc.updated_at).toLocaleString()}
      </p>
    </div>
  )
}

function getStatus(dc: DataCenter) {
  if (dc.water_leak || dc.temperature > 30 || dc.humidity > 70) {
    return {
      label: 'CRITICAL',
      badge: 'bg-red-100 text-red-700'
    }
  }

  if (dc.temperature > 27 || dc.humidity < 40 || dc.humidity > 60) {
    return {
      label: 'WARNING',
      badge: 'bg-amber-100 text-amber-700'
    }
  }

  return {
    label: 'NORMAL',
    badge: 'bg-blue-100 text-blue-700'
  }
}
