import { create } from "zustand";


function readCookie(name){
  const cookievalue = document.cookie.split(';').find(row => row.includes(`${name}=`));
  if (cookievalue) {
    return JSON.parse(decodeURIComponent(cookievalue.slice(cookievalue.indexOf('=') + 1))) || [] ;
  } else {
    return [];
  }
}


const useSearchStore = create((set) => ({
  searchWord: '',
  setSearchWord: (word) => set({searchWord: word}),
  results: [],
  setResults: (newResults) => set((state) => {
    const exist = state.results.map(result => result.value);
    const rere = newResults.reduce((acc, result) => {
      if (!exist.includes(result)) {
        acc.push({ value: result, timestamp: Date.now() });
      } else {
        const existIndex = acc.findIndex(r => r.value === result);
        if (existIndex !== -1) {
          acc[existIndex].timestamp = Date.now();
        }
      }
      return acc;
    }, [...state.results]);

    if (rere.length > 8) {
      rere.shift();
    }
    const sortResults = rere.sort((a, b) => a.timestamp - b.timestamp);

    document.cookie = `results=${encodeURIComponent(JSON.stringify(sortResults))}; path=/;`;
    return { results: sortResults };
  }),

  readCookie: (name) => set({ results: readCookie('results')}),

  deleteC: (value) => {
    const cookievalue = document.cookie.split(';').find(row => row.includes('results=')).trim()
    let results = [];

    if (cookievalue) {
      results = JSON.parse(decodeURIComponent(cookievalue.slice(cookievalue.indexOf('=') + 1))) || [];
      const updatedR = results.filter(result => result.value !== value);
      document.cookie = `results=${encodeURIComponent(JSON.stringify(updatedR))}; path=/;`
      set({ results: updatedR });
    }
  },



  // 최근 본 공연 관련 상태
  recentPerformances: [],
  setRecentPerformance: (performance) => set((state) => {
    const updatedPerformances = state.recentPerformances.filter(
      (p) => p.mt20id !== performance.mt20id // mt20id를 기준으로 중복 제거
    );
    
    updatedPerformances.push(performance);
    if (updatedPerformances.length > 8) {
      updatedPerformances.pop();
    }

    document.cookie = `recentPerformances=${encodeURIComponent(JSON.stringify(updatedPerformances))}; path=/;`;
    return { recentPerformances: updatedPerformances };
  }),

  readCookie2: (name) => set({ recentPerformances: readCookie('recentPerformances') }),

  deleteX: (mt20id) => {
    const cookievalue = document.cookie.split(';').find(row => row.includes('recentPerformances='));
    let performances = [];
    
    if (cookievalue) {
      performances = JSON.parse(decodeURIComponent(cookievalue.slice(cookievalue.indexOf('=') + 1))) || [];
      const updatedPer = performances.filter(performance => performance.mt20id !== mt20id);
      document.cookie = `recentPerformances=${encodeURIComponent(JSON.stringify(updatedPer))}; path=/;`;
      set({ recentPerformances: updatedPer });
    }
  }
}));




export default useSearchStore