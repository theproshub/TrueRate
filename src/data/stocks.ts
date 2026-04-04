export interface Stock {
  name: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
}

export const stocks: Stock[] = [
  {
    name: 'Ecobank Transnational',
    ticker: 'ETI',
    price: 18.45,
    change: 0.65,
    changePercent: 3.65,
    volume: '2.3M',
    marketCap: '$1.2B',
  },
  {
    name: 'BRVM Composite Index',
    ticker: 'BRVM-CI',
    price: 234.80,
    change: -1.20,
    changePercent: -0.51,
    volume: '890K',
    marketCap: '$12.8B',
  },
  {
    name: 'Ghana Stock Exchange CI',
    ticker: 'GSE-CI',
    price: 3456.12,
    change: 42.30,
    changePercent: 1.24,
    volume: '1.1M',
    marketCap: '$8.4B',
  },
  {
    name: 'Sonatel (Orange)',
    ticker: 'SNTS',
    price: 22750,
    change: 350,
    changePercent: 1.56,
    volume: '156K',
    marketCap: '$4.6B',
  },
  {
    name: 'Firestone Liberia',
    ticker: 'FSLR',
    price: 45.20,
    change: -0.80,
    changePercent: -1.74,
    volume: '320K',
    marketCap: '$890M',
  },
  {
    name: 'ArcelorMittal Liberia',
    ticker: 'AMTL',
    price: 12.85,
    change: 0.35,
    changePercent: 2.80,
    volume: '450K',
    marketCap: '$2.1B',
  },
  {
    name: 'Lonestar Cell MTN',
    ticker: 'LSCM',
    price: 8.60,
    change: -0.15,
    changePercent: -1.71,
    volume: '180K',
    marketCap: '$340M',
  },
  {
    name: 'Bank of Africa BRVM',
    ticker: 'BOAB',
    price: 5450,
    change: 75,
    changePercent: 1.39,
    volume: '98K',
    marketCap: '$1.8B',
  },
  {
    name: 'Liberia Petroleum Refining',
    ticker: 'LPRC',
    price: 3.25,
    change: 0.10,
    changePercent: 3.17,
    volume: '520K',
    marketCap: '$210M',
  },
  {
    name: 'BSIC Liberia',
    ticker: 'BSIC',
    price: 6.40,
    change: -0.05,
    changePercent: -0.78,
    volume: '75K',
    marketCap: '$180M',
  },
];
