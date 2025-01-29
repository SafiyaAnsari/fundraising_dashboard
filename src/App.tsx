import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Moon, Sun, TrendingUp, Building2, MapPin, Calendar, ArrowUpRight, ArrowDownRight, Activity, Users, Briefcase } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Currency formatter
const formatCurrency = (value: number, currency: string) => {
  const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return formatter.format(value);
};

// Exchange rates
const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.5,
  INR: 83.12,
};

// Initial sectors data
const sectors = {
  Healthcare: { color: '#EF4444', deals: 0, amount: 0 },
  EdTech: { color: '#10B981', deals: 0, amount: 0 },
  Fintech: { color: '#6366F1', deals: 0, amount: 0 },
  'AI/ML': { color: '#F59E0B', deals: 0, amount: 0 },
  Cleantech: { color: '#8B5CF6', deals: 0, amount: 0 },
  Blockchain: { color: '#EC4899', deals: 0, amount: 0 },
  SaaS: { color: '#14B8A6', deals: 0, amount: 0 },
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [totalFunding, setTotalFunding] = useState(197.7);
  const [fundingData, setFundingData] = useState<any[]>([]);
  const [latestRounds, setLatestRounds] = useState<any[]>([]);
  const [sectorData, setSectorData] = useState(sectors);
  const [activeInvestors, setActiveInvestors] = useState(42);
  const [avgDealSize, setAvgDealSize] = useState(15.3);
  const [monthlyGrowth, setMonthlyGrowth] = useState(12.5);

  // Initialize historical data
  useEffect(() => {
    const initialData = [];
    const now = new Date();
    for (let i = 10; i > 0; i--) {
      const time = new Date(now.getTime() - i * 5000);
      initialData.push({
        time: time.toLocaleTimeString(),
        amount: 180 + Math.random() * 30,
      });
    }
    setFundingData(initialData);

    // Initialize sector data
    const initialSectors = { ...sectors };
    Object.keys(initialSectors).forEach(sector => {
      initialSectors[sector].deals = Math.floor(Math.random() * 5) + 1;
      initialSectors[sector].amount = Math.floor(Math.random() * 50) + 10;
    });
    setSectorData(initialSectors);
  }, []);

  // Generate random funding data
  useEffect(() => {
    const interval = setInterval(() => {
      const newAmount = totalFunding + (Math.random() - 0.5) * 10;
      setTotalFunding(Math.max(0, newAmount));
      
      const now = new Date();
      const newDataPoint = {
        time: now.toLocaleTimeString(),
        amount: newAmount,
      };
      
      setFundingData(prev => [...prev.slice(-10), newDataPoint]);
      
      // Update other metrics
      setActiveInvestors(prev => Math.max(30, prev + Math.floor((Math.random() - 0.5) * 5)));
      setAvgDealSize(prev => Math.max(5, prev + (Math.random() - 0.5) * 2));
      setMonthlyGrowth(prev => Math.max(0, prev + (Math.random() - 0.5) * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [totalFunding]);

  // Update latest rounds and sector data
  useEffect(() => {
    const companies = [
      'NextSystems', 'QuantumTech', 'AIVentures', 'BlockchainLabs',
      'CloudScale', 'DataMinds', 'EcoTech', 'FinnovateAI'
    ];
    const locations = ['London', 'Berlin', 'Singapore', 'New York', 'Tokyo', 'Mumbai', 'Bangalore'];
    const rounds = ['Seed', 'Series A', 'Series B', 'Series C'];

    const interval = setInterval(() => {
      const sector = Object.keys(sectors)[Math.floor(Math.random() * Object.keys(sectors).length)];
      const amount = Math.floor(Math.random() * 50) + 5;

      const newRound = {
        company: companies[Math.floor(Math.random() * companies.length)],
        amount,
        sector,
        location: locations[Math.floor(Math.random() * locations.length)],
        round: rounds[Math.floor(Math.random() * rounds.length)],
        time: new Date().toLocaleTimeString(),
      };

      setLatestRounds(prev => [newRound, ...prev.slice(0, 4)]);

      setSectorData(prev => ({
        ...prev,
        [sector]: {
          ...prev[sector],
          deals: prev[sector].deals + 1,
          amount: prev[sector].amount + amount,
        },
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: fundingData.map(d => d.time),
    datasets: [
      {
        label: 'Funding Amount',
        data: fundingData.map(d => d.amount * exchangeRates[selectedCurrency as keyof typeof exchangeRates]),
        borderColor: darkMode ? '#60A5FA' : '#2563EB',
        tension: 0.4,
        pointRadius: 4,
        fill: true,
        backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Funding Trend',
        color: darkMode ? '#E5E7EB' : '#1F2937',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: darkMode ? '#E5E7EB' : '#1F2937',
        },
        grid: {
          color: darkMode ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: darkMode ? '#E5E7EB' : '#1F2937',
        },
      },
      y: {
        title: {
          display: true,
          text: `Amount (${selectedCurrency})`,
          color: darkMode ? '#E5E7EB' : '#1F2937',
        },
        grid: {
          color: darkMode ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: darkMode ? '#E5E7EB' : '#1F2937',
          callback: (value: number) => formatCurrency(value, selectedCurrency),
        },
      },
    },
  };

  // Calculate total amount for percentages
  const totalAmount = Object.values(sectorData).reduce((sum, sector) => sum + sector.amount, 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Startup Funding Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className={`rounded-md px-3 py-1 ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              {Object.keys(exchangeRates).map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Funding</p>
                <p className="text-2xl font-bold text-blue-500">
                  {formatCurrency(
                    totalFunding * exchangeRates[selectedCurrency as keyof typeof exchangeRates],
                    selectedCurrency
                  )}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Investors</p>
                <p className="text-2xl font-bold text-green-500">{activeInvestors}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Deal Size</p>
                <p className="text-2xl font-bold text-purple-500">
                  {formatCurrency(
                    avgDealSize * exchangeRates[selectedCurrency as keyof typeof exchangeRates],
                    selectedCurrency
                  )}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Growth</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-orange-500">{monthlyGrowth.toFixed(1)}%</p>
                  {monthlyGrowth >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500 ml-2" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-500 ml-2" />
                  )}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Funding Rounds */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Latest Funding Rounds</h2>
            <div className="space-y-4">
              {latestRounds.map((round, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold">{round.company}</div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>{round.sector}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{round.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{round.time}</span>
                    </div>
                    <div className="font-semibold text-blue-500">
                      {formatCurrency(
                        round.amount * exchangeRates[selectedCurrency as keyof typeof exchangeRates],
                        selectedCurrency
                      )}
                      <span className="text-sm font-normal ml-2">{round.round}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funding Trend Chart */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Sector Distribution */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Sector Distribution</h2>
            <div className="space-y-4">
              {Object.entries(sectorData)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([sector, data]) => {
                  const percentage = (data.amount / totalAmount) * 100;
                  return (
                    <div key={sector} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{sector}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">{data.deals} deals</span>
                          <span className="font-semibold">
                            {formatCurrency(
                              data.amount * exchangeRates[selectedCurrency as keyof typeof exchangeRates],
                              selectedCurrency
                            )}
                          </span>
                          <span className="w-16 text-right">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: data.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;