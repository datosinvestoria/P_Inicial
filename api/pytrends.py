from pytrends.request import TrendReq
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/trending', methods=['GET'])
def get_trending():
    query = request.args.get('query', 'elecciones')
    pytrends = TrendReq()
    pytrends.build_payload([query], geo='EC', timeframe='today 1-m')
    trending_data = pytrends.related_queries()[query]['top']

    results = [
        {'title': row['query'], 'value': row['value']}
        for _, row in trending_data.iterrows()
    ] if trending_data is not None else []

    return jsonify(results)

if __name__ == "__main__":
    app.run()
