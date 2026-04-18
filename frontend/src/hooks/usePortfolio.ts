import { useState, useEffect, useCallback } from 'react';
import type { Portfolio, Fund, Allocations } from '../types';
import { fetchPortfolios, fetchFunds, createPortfolio, savePortfolio, deleteAllPortfolios } from '../api';
import { calculatePortfolioYield, validateAllocations } from '../utils/calculations';

const USER_ID = 1;

export function usePortfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [allocations, setAllocations] = useState<Allocations>({ VOO: 1 });
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['VOO']);

  useEffect(() => {
    Promise.all([fetchFunds(), fetchPortfolios(USER_ID)]).then(([f, p]) => {
      setFunds(f);
      setPortfolios(p);
      const savedId = localStorage.getItem('selectedPortfolioId');
      if (savedId) {
        const target = p.find(x => x.id === +savedId);
        if (target) { loadPortfolio(target); return; }
      }
      if (p.length) loadPortfolio(p[0]);
    });
  }, []);

  const loadPortfolio = useCallback((p: Portfolio) => {
    const allocs = JSON.parse(p.allocations);
    setAllocations(allocs);
    setSelectedTickers(Object.keys(allocs));
    setSelectedPortfolio(p);
    localStorage.setItem('selectedPortfolioId', p.id.toString());
  }, []);

  const yield_ = calculatePortfolioYield(funds, allocations);
  const hasFunds = selectedTickers.length > 0;
  const isValid = hasFunds && validateAllocations(allocations);

  const create = async (name: string, allocs: Allocations) => {
    return createPortfolio(name, allocs, USER_ID);
  };

  const update = async (id: number, name: string, allocs: Allocations) => {
    return savePortfolio(id, name, allocs);
  };

  const removeAll = async () => {
    await deleteAllPortfolios(USER_ID);
    setAllocations({ VOO: 1 });
    setSelectedTickers(['VOO']);
    setSelectedPortfolio(null);
  };

  return {
    funds,
    portfolios,
    selectedPortfolio,
    allocations,
    selectedTickers,
    yield_,
    isValid,
    hasFunds,
    loadPortfolio,
    setAllocations,
    setSelectedTickers,
    create,
    update,
    removeAll,
  };
}