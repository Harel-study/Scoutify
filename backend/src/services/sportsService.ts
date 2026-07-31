const SPORTS_API_BASE_URL =
  'https://www.thesportsdb.com/api/v1/json/123';

interface SportsApiResponse<T> {
  events?: T[] | null;
  table?: T[] | null;
  teams?: T[] | null;
}

const requestSportsApi = async <T>(
  endpoint: string
): Promise<SportsApiResponse<T>> => {
  const response = await fetch(
    `${SPORTS_API_BASE_URL}/${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `Sports API request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<SportsApiResponse<T>>;
};

export const getPreviousTeamEvents = async (
  teamId: string
): Promise<unknown[]> => {
  const data = await requestSportsApi<unknown>(
    `eventslast.php?id=${encodeURIComponent(teamId)}`
  );

  return data.events ?? [];
};

export const getNextTeamEvents = async (
  teamId: string
): Promise<unknown[]> => {
  const data = await requestSportsApi<unknown>(
    `eventsnext.php?id=${encodeURIComponent(teamId)}`
  );

  return data.events ?? [];
};

export const getLeagueTable = async (
  leagueId: string,
  season?: string
): Promise<unknown[]> => {
  const query = new URLSearchParams({
    l: leagueId,
  });

  if (season) {
    query.set('s', season);
  }

  const data = await requestSportsApi<unknown>(
    `lookuptable.php?${query.toString()}`
  );

  return data.table ?? [];
};