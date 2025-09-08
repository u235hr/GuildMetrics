export interface RankingData {
  rank: number;
  name: string;
  coins: number;
}

export async function getRankingData(month: 'june' | 'july'): Promise<RankingData[]> {
  try {
    const response = await fetch(`/data/${month}-ranking.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${month} ranking data`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${month} ranking data:`, error);
    return [];
  }
}

export function getTotalCoins(data: RankingData[]): number {
  return data.reduce((sum, item) => sum + item.coins, 0);
}

export function getTotalCount(data: RankingData[]): number {
  return data.length;
}