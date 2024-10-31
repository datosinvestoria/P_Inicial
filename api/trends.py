from fastapi import FastAPI
from pytrends.request import TrendReq
from typing import List, Dict

app = FastAPI()

@app.get("/api/trending")
async def get_trending(query: str = 'elecciones') -> List[Dict[str, str]]:
    pytrends = TrendReq()
    pytrends.build_payload([query], geo='EC', timeframe='today 1-m')
    trending_data = pytrends.related_queries()[query]['top']

    results = [
        {'title': row['query'], 'value': row['value']}
        for _, row in trending_data.iterrows()
    ] if trending_data is not None else []

    return results
